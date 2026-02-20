import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

// OAuth 콜백 처리 (Google, Kakao 등)
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  // OAuth 프로바이더 에러 처리
  const error_description = searchParams.get("error_description");
  if (error_description) {
    console.error("OAuth 프로바이더 에러:", error_description);
    return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
  }

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }

    console.error("세션 교환 에러:", error.message);
  }

  // 에러 시 로그인 페이지로 리다이렉트
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
