"use client";

import { useTransition } from "react";
import { logout } from "@/lib/actions/auth";

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logout();
    });
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="inline-flex h-8 items-center justify-center rounded-[var(--radius-md)] px-3 text-sm font-medium text-foreground-secondary transition-colors hover:bg-surface-secondary disabled:opacity-50"
    >
      {isPending ? "로그아웃 중..." : "로그아웃"}
    </button>
  );
}
