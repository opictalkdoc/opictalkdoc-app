import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { LogoutButton } from "@/components/auth/logout-button";
import { MobileNav } from "./mobile-nav";

/* ── 네비게이션 항목 ── */

type NavItem = { label: string; href: string; soon?: boolean };

const publicNav: NavItem[] = [
  { label: "학습 기능", href: "/#features" },
  { label: "요금제", href: "/pricing" },
];

const appNav: NavItem[] = [
  { label: "대시보드", href: "/dashboard" },
  { label: "모의고사", href: "#", soon: true },
  { label: "AI 훈련소", href: "#", soon: true },
  { label: "스크립트", href: "#", soon: true },
  { label: "쉐도잉", href: "#", soon: true },
];

export async function Navbar() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoggedIn = !!user;
  const navItems = isLoggedIn ? appNav : publicNav;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* 로고 */}
        <Link
          href="/"
          className="flex items-center gap-2"
        >
          <span className="font-display text-xl text-primary-500">
            오픽톡닥
          </span>
        </Link>

        {/* 데스크톱 네비게이션 */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="relative rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium text-foreground-secondary transition-colors hover:bg-surface-secondary hover:text-foreground"
            >
              {item.label}
              {item.soon && (
                <span className="absolute -right-1 -top-1 rounded-full bg-primary-100 px-1 text-[8px] font-semibold text-primary-600">
                  곧
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* 우측: 인증 버튼 + 모바일 메뉴 */}
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <LogoutButton />
          ) : (
            <div className="hidden items-center gap-2 md:flex">
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
            </div>
          )}

          {/* 모바일 햄버거 */}
          <MobileNav isLoggedIn={isLoggedIn} items={navItems} />
        </div>
      </nav>
    </header>
  );
}
