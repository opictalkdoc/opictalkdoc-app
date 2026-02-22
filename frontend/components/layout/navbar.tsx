"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { UserMenu } from "./user-menu";
import { MobileNav } from "./mobile-nav";

/* ── 네비게이션 항목 ── */

type NavItem = { label: string; href: string; soon?: boolean };

const publicNav: NavItem[] = [
  { label: "학습 기능", href: "/#features" },
  { label: "전략 가이드", href: "/strategy" },
  { label: "요금제", href: "/pricing" },
];

const appNav: NavItem[] = [
  { label: "대시보드", href: "/dashboard" },
  { label: "시험후기", href: "/reviews" },
  { label: "스크립트", href: "/scripts" },
  { label: "모의고사", href: "/mock-exam" },
  { label: "튜터링", href: "/tutoring" },
  { label: "Store", href: "/store" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [userName, setUserName] = useState("");

  const handleLogoClick = useCallback((e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pathname]);

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("/#") && pathname === "/") {
      e.preventDefault();
      const id = href.replace("/#", "");
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  }, [pathname]);

  useEffect(() => {
    const supabase = createClient();

    // 초기 세션 확인 (로컬 쿠키에서 읽기 — 네트워크 호출 없음)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      setUserName(session?.user?.user_metadata?.display_name || session?.user?.user_metadata?.full_name || session?.user?.user_metadata?.name || "");
    });

    // 인증 상태 변경 구독 (로그인/로그아웃 시 즉시 반영)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsLoggedIn(!!session);
        setUserName(session?.user?.user_metadata?.display_name || session?.user?.user_metadata?.full_name || session?.user?.user_metadata?.name || "");
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // 초기 상태 확인 전: 최소한의 레이아웃 유지 (깜빡임 방지)
  const navItems = isLoggedIn ? appNav : publicNav;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* 로고 */}
        <Link
          href="/"
          onClick={handleLogoClick}
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
              onClick={(e) => handleNavClick(e, item.href)}
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
          {isLoggedIn === null ? (
            // 세션 확인 전: 빈 공간 (깜빡임 최소화)
            <div className="h-8 w-8" />
          ) : isLoggedIn ? (
            <UserMenu name={userName} />
          ) : (
            <div className="flex items-center gap-2">
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
          {isLoggedIn !== null && (
            <MobileNav isLoggedIn={isLoggedIn} items={navItems} userName={userName} />
          )}
        </div>
      </nav>
    </header>
  );
}
