import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

// OAuth + 이메일 인증 콜백 처리
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type"); // signup, recovery, email_change 등
  const next = searchParams.get("next") ?? "/dashboard";

  // OAuth 프로바이더 에러 처리
  const error_description = searchParams.get("error_description");
  if (error_description) {
    console.error("OAuth 프로바이더 에러:", error_description);
    return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
  }

  const supabase = await createServerSupabaseClient();

  // 이메일 인증 (token_hash 방식 — 회원가입 확인, 비밀번호 재설정 등)
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as "signup" | "recovery" | "email",
    });

    if (!error) {
      // 비밀번호 재설정이면 재설정 페이지로
      if (type === "recovery") {
        return NextResponse.redirect(`${origin}/reset-password`);
      }
      // 회원가입 확인이면 대시보드로
      return NextResponse.redirect(`${origin}${next}`);
    }

    console.error("이메일 인증 에러:", error.message);
    return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
  }

  // OAuth 콜백 (code 방식)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }

    console.error("세션 교환 에러:", error.message);
  }

  // 에러 시 로그인 페이지로 리다이렉트
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
