"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ReactNode } from "react";

interface ImmersiveHeaderProps {
  title: string;
  backHref: string;
  rightContent?: ReactNode;
}

export function ImmersiveHeader({
  title,
  backHref,
  rightContent,
}: ImmersiveHeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex h-14 items-center border-b border-border bg-surface/95 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* 왼쪽: 뒤로가기 */}
        <Link
          href={backHref}
          className="flex items-center gap-1.5 text-sm font-medium text-foreground-secondary transition-colors hover:text-foreground"
        >
          <ArrowLeft size={18} />
          <span className="hidden sm:inline">돌아가기</span>
        </Link>

        {/* 중앙: 제목 */}
        <h1 className="absolute left-1/2 -translate-x-1/2 text-sm font-semibold text-foreground">
          {title}
        </h1>

        {/* 오른쪽: 슬롯 */}
        <div className="flex items-center">{rightContent}</div>
      </div>
    </header>
  );
}
