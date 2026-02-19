import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer-dark">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between md:items-start">
          {/* 브랜드 */}
          <div className="flex flex-col gap-2">
            <span className="text-lg font-extrabold text-primary-300">
              오픽톡닥
            </span>
            <p className="text-sm">
              말하기 실력이 아니라, 전략입니다
            </p>
          </div>

          {/* 링크 */}
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <Link href="/strategy">전략 가이드</Link>
            <Link href="/pricing">요금제</Link>
            <Link href="/terms">이용약관</Link>
            <Link href="/privacy">개인정보처리방침</Link>
            <Link href="/refund">환불 규정</Link>
          </div>
        </div>

        {/* 사업자 정보 */}
        <div className="mt-8 border-t border-white/10 pt-6 text-xs leading-relaxed text-[#6B7A8D]">
          <div className="flex flex-col gap-0.5 sm:gap-0">
            <p>상호: 스투스 OPIc</p>
            <p>대표자: 전다영</p>
            <p>사업자등록번호: 757-18-02318</p>
            <p>소재지: 경상북도 구미시 해마루공원로 80, 104동 1903호</p>
            <p>업태: 정보통신업 / 응용 소프트웨어 개발 및 공급업</p>
            <p>
              대표전화: 010-4715-8846 | 이메일:{" "}
              <a href="mailto:opictalkdoc@gmail.com">
                opictalkdoc@gmail.com
              </a>
            </p>
            <p>통신판매업 신고번호: 준비 중</p>
          </div>
          <p className="mt-4 text-[#4A5568]">
            &copy; {new Date().getFullYear()} 오픽톡닥. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
