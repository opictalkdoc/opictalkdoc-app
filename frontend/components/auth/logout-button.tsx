"use client";

import { useState } from "react";
import { serverSignOut } from "@/lib/supabase";

export function LogoutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  return (
    <button
      onClick={() => {
        setIsLoggingOut(true);
        serverSignOut();
      }}
      disabled={isLoggingOut}
      className="inline-flex h-8 items-center justify-center rounded-[var(--radius-md)] px-3 text-sm font-medium text-foreground-secondary transition-colors hover:bg-surface-secondary disabled:opacity-50"
    >
      {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
    </button>
  );
}
