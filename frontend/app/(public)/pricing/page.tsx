import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "요금제 | 오픽톡닥",
  description: "오픽톡닥 요금제 안내 - 체험, 베이직, 프리미엄",
};

const plans = [
  {
    name: "체험",
    price: "0",
    period: "",
    description: "OPIc이 어떤 시험인지 경험해 보세요",
    sub: "",
    features: [
      "샘플 모의고사 1회 (고정문제)",
      "AI 진단 · 튜터링 무료",
      "체화 · 쉐도잉 훈련 무제한",
    ],
    cta: "무료로 시작하기",
    href: "/signup",
    highlight: false,
    comingSoon: false,
  },
  {
    name: "베이직",
    price: "19,900",
    period: " / 3회권",
    description: "본격적인 실전 감각을 키우세요",
    sub: "1개월 이용",
    features: [
      "실전 모의고사 3회",
      "스크립트 패키지 생성 30회",
      "AI 진단 · 튜터링 무료",
      "체화 · 쉐도잉 훈련 무제한",
      "성적 진단 리포트",
    ],
    cta: "준비 중",
    href: "#",
    highlight: true,
    comingSoon: true,
  },
  {
    name: "프리미엄",
    price: "49,900",
    period: " / 10회권",
    description: "목표 등급 달성을 위한 완벽 준비",
    sub: "2개월 이용",
    features: [
      "실전 모의고사 10회",
      "스크립트 패키지 생성 100회",
      "AI 진단 · 튜터링 무료",
      "체화 · 쉐도잉 훈련 무제한",
      "성장 데이터 리포트",
    ],
    cta: "준비 중",
    href: "#",
    highlight: false,
    comingSoon: true,
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      {/* 헤더 */}
      <div className="text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">
          나에게 맞는 플랜을 선택하세요
        </h1>
        <p className="mt-3 text-foreground-secondary">
          무료 플랜으로 바로 시작하세요. 유료 플랜은 준비 중입니다.
        </p>
      </div>

      {/* 요금제 카드 */}
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col rounded-[var(--radius-xl)] border p-6 transition-shadow hover:shadow-lg ${
              plan.highlight
                ? "border-primary-500 shadow-md"
                : "border-border bg-surface"
            }`}
          >
            {plan.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-[var(--radius-full)] bg-primary-500 px-3 py-0.5 text-xs font-semibold text-white">
                인기
              </span>
            )}

            <h2 className="text-xl font-bold">{plan.name}</h2>
            <p className="mt-1 text-sm text-foreground-secondary">
              {plan.description}
            </p>
            {plan.sub && (
              <span className="mt-2 inline-flex rounded-full bg-surface-secondary px-2.5 py-0.5 text-xs font-medium text-foreground-secondary">
                {plan.sub}
              </span>
            )}

            <div className="mt-5 flex items-baseline gap-1">
              {plan.price === "0" ? (
                <span className="text-4xl font-bold">무료</span>
              ) : (
                <>
                  <span className="text-sm text-foreground-secondary">&#8361;</span>
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-sm text-foreground-secondary">
                    {plan.period}
                  </span>
                </>
              )}
            </div>

            {/* 기능 목록 */}
            <ul className="mt-6 flex-1 space-y-2.5">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-sm text-foreground-secondary"
                >
                  <svg
                    className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            {/* CTA */}
            {plan.comingSoon ? (
              <span className="mt-6 inline-flex h-11 cursor-not-allowed items-center justify-center rounded-[var(--radius-lg)] border border-border text-sm font-medium text-foreground-muted">
                준비 중
              </span>
            ) : (
              <Link
                href={plan.href}
                className={`mt-6 inline-flex h-11 items-center justify-center rounded-[var(--radius-lg)] text-sm font-medium transition-colors ${
                  plan.highlight
                    ? "bg-primary-500 text-white hover:bg-primary-600"
                    : "border border-border bg-surface text-foreground hover:bg-surface-secondary"
                }`}
              >
                {plan.cta}
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* 기능 비교표 */}
      <div className="mt-20">
        <h2 className="text-center text-2xl font-bold">기능 비교</h2>
        <div className="mt-8 overflow-x-auto rounded-[var(--radius-xl)] border border-border">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="bg-surface-secondary">
              <tr>
                <th className="px-3 py-3 font-semibold text-foreground sm:px-4">
                  기능
                </th>
                <th className="px-2 py-3 text-center font-semibold text-foreground sm:px-4">
                  체험
                </th>
                <th className="px-2 py-3 text-center font-semibold text-primary-600 sm:px-4">
                  베이직
                </th>
                <th className="px-2 py-3 text-center font-semibold text-foreground sm:px-4">
                  프리미엄
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["실전 모의고사", "샘플 1회", "3회", "10회"],
                ["스크립트 패키지 생성", "—", "30회", "100회"],
                ["AI 진단 · 튜터링", "무료", "무료", "무료"],
                ["체화 훈련", "무제한", "무제한", "무제한"],
                ["쉐도잉 훈련", "무제한", "무제한", "무제한"],
                ["성적 진단 리포트", "—", "O", "O"],
                ["성장 데이터 리포트", "—", "—", "O"],
                ["이용 기간", "무제한", "1개월", "2개월"],
              ].map(([feature, free, basic, premium]) => (
                <tr key={feature}>
                  <td className="px-3 py-3 text-foreground sm:px-4">{feature}</td>
                  <td className="px-2 py-3 text-center text-foreground-secondary sm:px-4">
                    {free}
                  </td>
                  <td className="px-2 py-3 text-center text-foreground-secondary sm:px-4">
                    {basic}
                  </td>
                  <td className="px-2 py-3 text-center text-foreground-secondary sm:px-4">
                    {premium}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 개별 횟수권 스토어 안내 */}
      <div className="mt-20">
        <h2 className="text-center text-2xl font-bold">
          횟수가 부족하다면?
        </h2>
        <p className="mt-3 text-center text-foreground-secondary">
          패키지 외에 필요한 만큼만 개별 구매할 수 있습니다.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-6 text-center">
            <p className="text-lg font-bold">모의고사 횟수권</p>
            <p className="mt-1 text-sm text-foreground-secondary">
              실전 모의고사 1회 단위로 구매
            </p>
            <p className="mt-4 text-3xl font-bold">
              ₩7,900<span className="text-sm font-normal text-foreground-secondary"> / 1회</span>
            </p>
            <span className="mt-4 inline-flex h-10 cursor-not-allowed items-center justify-center rounded-[var(--radius-lg)] border border-border px-6 text-sm font-medium text-foreground-muted">
              준비 중
            </span>
          </div>
          <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-6 text-center">
            <p className="text-lg font-bold">스크립트 패키지 횟수권</p>
            <p className="mt-1 text-sm text-foreground-secondary">
              스크립트 패키지 생성 10회 단위로 구매
            </p>
            <p className="mt-4 text-3xl font-bold">
              ₩3,900<span className="text-sm font-normal text-foreground-secondary"> / 10회</span>
            </p>
            <span className="mt-4 inline-flex h-10 cursor-not-allowed items-center justify-center rounded-[var(--radius-lg)] border border-border px-6 text-sm font-medium text-foreground-muted">
              준비 중
            </span>
          </div>
        </div>
      </div>

      {/* 전략 가이드 CTA */}
      <div className="mt-16 rounded-[var(--radius-xl)] border border-primary-200 bg-gradient-to-br from-primary-50 to-primary-100/50 p-8 text-center">
        <p className="text-lg font-bold text-foreground">
          왜 이 요금제가 효과적인지 궁금하신가요?
        </p>
        <p className="mt-2 text-sm text-foreground-secondary">
          230건 실제 시험 데이터로 증명된 OPIc 전략을 확인해 보세요.
        </p>
        <Link
          href="/strategy"
          className="mt-4 inline-flex h-10 items-center justify-center gap-1 rounded-[var(--radius-lg)] bg-primary-500 px-6 text-sm font-medium text-white transition-colors hover:bg-primary-600"
        >
          전략 가이드 보기 →
        </Link>
      </div>

      {/* 하단 안내 */}
      <div className="mt-12 text-center text-sm text-foreground-muted">
        <p>
          유료 플랜 및 스토어는 준비 중입니다.{" "}
          <Link href="/refund" className="text-primary-500 hover:underline">
            환불 규정
          </Link>
          을 확인해 주세요.
        </p>
      </div>
    </div>
  );
}
