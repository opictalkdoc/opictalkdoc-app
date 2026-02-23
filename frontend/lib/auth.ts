import { cache } from "react";
import { createServerSupabaseClient } from "./supabase-server";

// ── getUser(): Supabase 서버 검증 (34-43ms) ──
// 최신 데이터가 필요한 곳에 사용: 마이페이지 프로필, Server Actions
// React cache()로 동일 요청 내 1회만 호출
export const getUser = cache(async () => {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

// ── getAuthClaims(): 로컬 JWT 검증 (JWKS 캐시 후 0ms) ──
// 표시용 컴포넌트에 사용: 대시보드 통계, 배너, 사이드 패널
// Asymmetric JWT (ES256) → WebCrypto로 로컬 서명 검증, 서버 왕복 없음
// Supabase 공식 API (supabase-js 2.49.4+, 정식 2.51.0+)
export const getAuthClaims = cache(async () => {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data) return null;
  return data.claims;
});
