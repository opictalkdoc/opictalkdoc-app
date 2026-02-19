"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Settings, LogOut } from "lucide-react";
import { logout } from "@/lib/actions/auth";

type NavItem = { label: string; href: string; soon?: boolean };

export function MobileNav({
  isLoggedIn,
  items,
  userName,
}: {
  isLoggedIn: boolean;
  items: NavItem[];
  userName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] text-foreground-secondary transition-colors hover:bg-surface-secondary"
        aria-label="메뉴"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <>
          {/* 오버레이 */}
          <div
            className="fixed inset-0 z-40 bg-black/20"
            onClick={() => setOpen(false)}
          />

          {/* 드롭다운 메뉴 */}
          <div className="absolute left-0 right-0 top-16 z-50 border-b border-border bg-surface px-4 py-3 shadow-lg">
            <div className="space-y-1">
              {items.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between rounded-[var(--radius-lg)] px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-primary-50 text-primary-600"
                        : "text-foreground-secondary hover:bg-surface-secondary hover:text-foreground"
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.soon && (
                      <span className="rounded-full bg-surface-secondary px-1.5 py-0.5 text-[10px] text-foreground-muted">
                        준비 중
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* 로그인 시: 마이페이지 + 로그아웃 */}
            {isLoggedIn && (
              <div className="mt-3 space-y-1 border-t border-border pt-3">
                <Link
                  href="/mypage"
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-2 rounded-[var(--radius-lg)] px-3 py-2.5 text-sm font-medium transition-colors ${
                    pathname === "/mypage"
                      ? "bg-primary-50 text-primary-600"
                      : "text-foreground-secondary hover:bg-surface-secondary hover:text-foreground"
                  }`}
                >
                  <Settings size={16} />
                  마이페이지
                  {userName && (
                    <span className="ml-auto text-xs text-foreground-muted">
                      {userName}
                    </span>
                  )}
                </Link>
                <button
                  onClick={() => {
                    setOpen(false);
                    startTransition(async () => {
                      await logout();
                    });
                  }}
                  disabled={isPending}
                  className="flex w-full items-center gap-2 rounded-[var(--radius-lg)] px-3 py-2.5 text-sm font-medium text-foreground-secondary transition-colors hover:bg-surface-secondary hover:text-foreground disabled:opacity-50"
                >
                  <LogOut size={16} />
                  {isPending ? "로그아웃 중..." : "로그아웃"}
                </button>
              </div>
            )}

            {/* 비로그인 시 CTA */}
            {!isLoggedIn && (
              <div className="mt-3 flex gap-2 border-t border-border pt-3">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-[var(--radius-md)] border border-border py-2 text-center text-sm font-medium text-foreground transition-colors hover:bg-surface-secondary"
                >
                  로그인
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-[var(--radius-md)] bg-primary-500 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-primary-600"
                >
                  무료 시작
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
