import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          {/* 브랜드 */}
          <div className="flex flex-col gap-2">
            <span className="font-display text-lg text-primary-500">
              OPIcTalkDoc
            </span>
            <p className="text-sm text-foreground-muted">
              AI와 함께하는 OPIc 말하기 학습
            </p>
          </div>

          {/* 링크 */}
          <div className="flex gap-8 text-sm">
            <Link
              href="/terms"
              className="text-foreground-secondary transition-colors hover:text-foreground"
            >
              이용약관
            </Link>
            <Link
              href="/privacy"
              className="text-foreground-secondary transition-colors hover:text-foreground"
            >
              개인정보처리방침
            </Link>
            <Link
              href="/contact"
              className="text-foreground-secondary transition-colors hover:text-foreground"
            >
              문의하기
            </Link>
          </div>
        </div>

        {/* 사업자 정보 + 저작권 */}
        <div className="mt-8 border-t border-border pt-6 text-xs text-foreground-muted">
          <p>&copy; {new Date().getFullYear()} OPIcTalkDoc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
