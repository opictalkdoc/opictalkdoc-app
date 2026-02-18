import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { LogoutButton } from "@/components/auth/logout-button";

export async function Navbar() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-xl text-primary-500">
            OPIcTalkDoc
          </span>
        </Link>

        {/* 네비 링크 (데스크톱) */}
        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/#features"
            className="text-sm text-foreground-secondary transition-colors hover:text-foreground"
          >
            학습 기능
          </Link>
          <Link
            href="/pricing"
            className="text-sm text-foreground-secondary transition-colors hover:text-foreground"
          >
            요금제
          </Link>
        </div>

        {/* 인증 버튼 */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="inline-flex h-8 items-center justify-center rounded-[var(--radius-md)] px-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-secondary"
              >
                대시보드
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex h-8 items-center justify-center rounded-[var(--radius-md)] px-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-secondary"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className="inline-flex h-8 items-center justify-center rounded-[var(--radius-md)] bg-primary-500 px-3 text-sm font-medium text-white transition-colors hover:bg-primary-600"
              >
                무료 시작
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
