import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// 상품 정의 (크레딧 차감 계산용)
const PRODUCTS: Record<
  string,
  { mockExam: number; script: number; months: number; plan: string }
> = {
  basic_plan: { mockExam: 3, script: 30, months: 1, plan: "basic" },
  premium_plan: { mockExam: 10, script: 100, months: 2, plan: "premium" },
  mock_exam_credit: { mockExam: 1, script: 0, months: 0, plan: "free" },
  script_credit: { mockExam: 0, script: 10, months: 0, plan: "free" },
};

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// 포트원 웹훅 — 결제 상태 변경 시 자동 호출
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    // 취소 이벤트만 처리 (나머지는 무시하고 200 리턴)
    if (
      type !== "Transaction.Cancelled" &&
      type !== "Transaction.PartialCancelled"
    ) {
      return NextResponse.json({ success: true });
    }

    const paymentId = data?.paymentId;
    if (!paymentId) {
      return NextResponse.json(
        { error: "paymentId가 없습니다." },
        { status: 400 }
      );
    }

    // 포트원 API로 실제 결제 상태 확인 (웹훅 payload를 신뢰하지 않고 직접 검증)
    const portoneRes = await fetch(
      `https://api.portone.io/payments/${encodeURIComponent(paymentId)}`,
      {
        headers: {
          Authorization: `PortOne ${process.env.PORTONE_API_SECRET}`,
        },
      }
    );

    if (!portoneRes.ok) {
      console.error("웹훅: 포트원 API 조회 실패", portoneRes.status);
      return NextResponse.json(
        { error: "결제 조회 실패" },
        { status: 502 }
      );
    }

    const payment = await portoneRes.json();

    // CANCELLED 상태가 아니면 무시
    if (payment.status !== "CANCELLED") {
      return NextResponse.json({ success: true, message: "상태 불일치 — 무시" });
    }

    const supabase = getServiceClient();

    // orders에서 해당 결제 조회
    const { data: order } = await supabase
      .from("orders")
      .select("*")
      .eq("payment_id", paymentId)
      .single();

    if (!order) {
      console.error("웹훅: 주문을 찾을 수 없음", paymentId);
      return NextResponse.json({ success: true, message: "주문 없음" });
    }

    // 이미 취소된 주문이면 중복 처리 방지
    if (order.status === "cancelled" || order.status === "refunded") {
      return NextResponse.json({ success: true, message: "이미 취소됨" });
    }

    // 주문 상태 업데이트
    await supabase
      .from("orders")
      .update({
        status: "cancelled",
        updated_at: new Date().toISOString(),
      })
      .eq("payment_id", paymentId);

    // 크레딧 차감
    const product = PRODUCTS[order.product_id];
    if (!product) {
      console.error("웹훅: 알 수 없는 상품", order.product_id);
      return NextResponse.json({ success: true });
    }

    const { data: credits } = await supabase
      .from("user_credits")
      .select("*")
      .eq("user_id", order.user_id)
      .single();

    if (credits) {
      const updates: Record<string, unknown> = {
        mock_exam_credits: Math.max(0, credits.mock_exam_credits - product.mockExam),
        script_credits: Math.max(0, credits.script_credits - product.script),
        updated_at: new Date().toISOString(),
      };

      // 플랜 상품이었으면 free로 되돌림
      if (product.months > 0) {
        updates.current_plan = "free";
        updates.plan_expires_at = null;
      }

      await supabase
        .from("user_credits")
        .update(updates)
        .eq("user_id", order.user_id);
    }

    console.log("웹훅: 결제 취소 처리 완료", paymentId);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("웹훅 처리 오류:", err);
    return NextResponse.json(
      { error: "웹훅 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
