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
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
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
              href="/refund"
              className="text-foreground-secondary transition-colors hover:text-foreground"
            >
              환불 규정
            </Link>
            <Link
              href="/pricing"
              className="text-foreground-secondary transition-colors hover:text-foreground"
            >
              요금제
            </Link>
          </div>
        </div>

        {/* 사업자 정보 */}
        <div className="mt-8 border-t border-border pt-6 text-xs leading-relaxed text-foreground-muted">
          <p>
            상호: 스투스 OPIc &nbsp;|&nbsp; 대표자: 전다영 &nbsp;|&nbsp;
            사업자등록번호: 757-18-02318
          </p>
          <p className="mt-1">
            소재지: 경상북도 구미시 해마루공원로 80, 104동 1903호
          </p>
          <p className="mt-1">
            업태: 정보통신업 / 응용 소프트웨어 개발 및 공급업
          </p>
          <p className="mt-1">
            통신판매업 신고번호: 준비 중 &nbsp;|&nbsp;
            이메일:{" "}
            <a
              href="mailto:opictalkdoc@gmail.com"
              className="text-foreground-secondary hover:text-foreground"
            >
              opictalkdoc@gmail.com
            </a>
          </p>
          <p className="mt-3">
            &copy; {new Date().getFullYear()} OPIcTalkDoc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
