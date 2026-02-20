import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Service Role 클라이언트 (RLS 바이패스, auth.admin 사용)
function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// 쿠키 기반 인증 클라이언트 (본인 확인용)
async function getAuthClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Route Handler에서는 무시
          }
        },
      },
    }
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId || typeof userId !== "string") {
      return NextResponse.json(
        { error: "유효하지 않은 요청입니다." },
        { status: 400 }
      );
    }

    // 쿠키 세션에서 현재 로그인된 사용자 확인
    const authClient = await getAuthClient();
    const {
      data: { user },
    } = await authClient.auth.getUser();

    if (!user || user.id !== userId) {
      return NextResponse.json(
        { error: "본인 계정만 탈퇴할 수 있습니다." },
        { status: 403 }
      );
    }

    // Service Role로 사용자 삭제 (CASCADE로 orders, user_credits 자동 삭제)
    const serviceClient = getServiceClient();
    const { error } = await serviceClient.auth.admin.deleteUser(userId);

    if (error) {
      console.error("회원 탈퇴 오류:", error);
      return NextResponse.json(
        { error: "회원 탈퇴 처리 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    // 서버 세션 정리 (쿠키에서 Supabase 토큰 제거)
    await authClient.auth.signOut();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("회원 탈퇴 에러:", err);
    return NextResponse.json(
      { error: "회원 탈퇴 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
