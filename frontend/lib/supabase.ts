import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// 서버 측 signout API 호출 → 세션 무효화 + 전체 Supabase 쿠키 삭제 (PKCE 포함)
export async function serverSignOut() {
  await fetch('/api/auth/signout', { method: 'POST' })
  window.location.href = '/'
}
