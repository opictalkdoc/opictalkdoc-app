import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// 상품 가격 맵 (서버 전용, 위변조 방지)
const PRODUCTS: Record<
  string,
  {
    name: string;
    price: number;
    mockExam: number;
    script: number;
    months: number;
    plan: "basic" | "premium" | "free";
  }
> = {
  basic_plan: {
    name: "베이직 플랜 (3회권)",
    price: 19900,
    mockExam: 3,
    script: 30,
    months: 1,
    plan: "basic",
  },
  premium_plan: {
    name: "프리미엄 플랜 (10회권)",
    price: 49900,
    mockExam: 10,
    script: 100,
    months: 2,
    plan: "premium",
  },
  mock_exam_credit: {
    name: "모의고사 횟수권 (1회)",
    price: 7900,
    mockExam: 1,
    script: 0,
    months: 0,
    plan: "free",
  },
  script_credit: {
    name: "스크립트 패키지 횟수권 (10회)",
    price: 3900,
    mockExam: 0,
    script: 10,
    months: 0,
    plan: "free",
  },
};

// Supabase service role 클라이언트 (RLS 바이패스)
function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentId, productId } = body;

    if (!paymentId || !productId) {
      return NextResponse.json(
        { error: "paymentId와 productId가 필요합니다." },
        { status: 400 }
      );
    }

    // 상품 존재 확인
    const product = PRODUCTS[productId];
    if (!product) {
      return NextResponse.json(
        { error: "유효하지 않은 상품입니다." },
        { status: 400 }
      );
    }

    // 포트원 API로 결제 검증
    const portoneRes = await fetch(
      `https://api.portone.io/payments/${encodeURIComponent(paymentId)}`,
      {
        headers: {
          Authorization: `PortOne ${process.env.PORTONE_API_SECRET}`,
        },
      }
    );

    if (!portoneRes.ok) {
      const errText = await portoneRes.text();
      console.error("포트원 API 오류:", portoneRes.status, errText);
      return NextResponse.json(
        { error: "결제 정보를 확인할 수 없습니다." },
        { status: 502 }
      );
    }

    const payment = await portoneRes.json();

    // 결제 상태 확인
    if (payment.status !== "PAID") {
      return NextResponse.json(
        { error: `결제가 완료되지 않았습니다. (상태: ${payment.status})` },
        { status: 400 }
      );
    }

    // 금액 위변조 검증
    if (payment.amount.total !== product.price) {
      console.error(
        "금액 불일치:",
        payment.amount.total,
        "vs",
        product.price
      );
      return NextResponse.json(
        { error: "결제 금액이 일치하지 않습니다." },
        { status: 400 }
      );
    }

    // customData에서 userId 추출
    const userId = payment.customData
      ? JSON.parse(payment.customData).userId
      : null;

    if (!userId) {
      return NextResponse.json(
        { error: "사용자 정보를 확인할 수 없습니다." },
        { status: 400 }
      );
    }

    const supabase = getServiceClient();

    // orders 기록
    const { error: orderError } = await supabase.from("orders").insert({
      user_id: userId,
      product_id: productId,
      order_name: product.name,
      amount: product.price,
      status: "paid",
      payment_id: paymentId,
      pg_provider: payment.channel?.pgProvider ?? null,
      pg_tx_id: payment.pgTxId ?? null,
      pay_method: payment.method?.type ?? null,
      paid_at: payment.paidAt ?? new Date().toISOString(),
      receipt_url: payment.receiptUrl ?? null,
    });

    if (orderError) {
      console.error("주문 기록 오류:", orderError);
      return NextResponse.json(
        { error: "주문 기록에 실패했습니다." },
        { status: 500 }
      );
    }

    // user_credits 갱신
    // 기존 크레딧 조회
    const { data: existingCredits } = await supabase
      .from("user_credits")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (existingCredits) {
      // 기존 사용자 — 크레딧 추가
      const updates: Record<string, unknown> = {
        mock_exam_credits:
          existingCredits.mock_exam_credits + product.mockExam,
        script_credits: existingCredits.script_credits + product.script,
        updated_at: new Date().toISOString(),
      };

      // 플랜 상품인 경우 플랜 + 만료일 갱신
      if (product.months > 0) {
        updates.current_plan = product.plan;
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + product.months);
        updates.plan_expires_at = expiresAt.toISOString();
      }

      const { error: updateError } = await supabase
        .from("user_credits")
        .update(updates)
        .eq("user_id", userId);

      if (updateError) {
        console.error("크레딧 갱신 오류:", updateError);
        return NextResponse.json(
          { error: "크레딧 갱신에 실패했습니다." },
          { status: 500 }
        );
      }
    } else {
      // 신규 사용자 (트리거가 안 돌았을 경우 안전망)
      const { error: insertError } = await supabase
        .from("user_credits")
        .insert({
          user_id: userId,
          current_plan: product.months > 0 ? product.plan : "free",
          mock_exam_credits: 1 + product.mockExam,
          script_credits: product.script,
          plan_expires_at:
            product.months > 0
              ? new Date(
                  Date.now() + product.months * 30 * 24 * 60 * 60 * 1000
                ).toISOString()
              : null,
        });

      if (insertError) {
        console.error("크레딧 생성 오류:", insertError);
        return NextResponse.json(
          { error: "크레딧 생성에 실패했습니다." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "결제가 완료되었습니다.",
      orderId: paymentId,
    });
  } catch (err) {
    console.error("결제 검증 에러:", err);
    return NextResponse.json(
      { error: "결제 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
