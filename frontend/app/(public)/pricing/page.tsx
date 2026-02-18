import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "요금제 | OPIcTalkDoc",
  description: "OPIcTalkDoc 요금제 안내 - 무료, 베이직, 프리미엄",
};

const plans = [
  {
    name: "무료",
    price: "0",
    period: "",
    description: "OPIc 학습을 체험해 보세요",
    features: [
      "모의고사 월 1회",
      "AI 훈련소 일 3회",
      "쉐도잉 기본 콘텐츠",
      "학습 리포트 요약",
    ],
    cta: "무료로 시작하기",
    href: "/signup",
    highlight: false,
  },
  {
    name: "베이직",
    price: "9,900",
    period: "/월",
    description: "본격적인 OPIc 준비를 시작하세요",
    features: [
      "모의고사 무제한",
      "AI 훈련소 무제한",
      "쉐도잉 전체 콘텐츠",
      "상세 학습 리포트",
      "등급별 맞춤 학습",
    ],
    cta: "베이직 시작하기",
    href: "/signup",
    highlight: true,
  },
  {
    name: "프리미엄",
    price: "19,900",
    period: "/월",
    description: "목표 등급 달성을 위한 최고의 선택",
    features: [
      "베이직 전체 기능 포함",
      "AI 1:1 맞춤 코칭",
      "취약점 집중 훈련",
      "실전 모의고사 (강화판)",
      "우선 고객 지원",
      "학습 데이터 분석 대시보드",
    ],
    cta: "프리미엄 시작하기",
    href: "/signup",
    highlight: false,
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
          7일 무료 체험 후 결제가 시작됩니다. 언제든 해지 가능합니다.
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
          </div>
        ))}
      </div>

      {/* 기능 비교표 */}
      <div className="mt-20">
        <h2 className="text-center text-2xl font-bold">기능 비교</h2>
        <div className="mt-8 overflow-x-auto rounded-[var(--radius-xl)] border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-secondary">
              <tr>
                <th className="px-4 py-3 font-semibold text-foreground">
                  기능
                </th>
                <th className="px-4 py-3 text-center font-semibold text-foreground">
                  무료
                </th>
                <th className="px-4 py-3 text-center font-semibold text-primary-600">
                  베이직
                </th>
                <th className="px-4 py-3 text-center font-semibold text-foreground">
                  프리미엄
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["모의고사", "월 1회", "무제한", "무제한"],
                ["AI 훈련소", "일 3회", "무제한", "무제한"],
                ["쉐도잉", "기본", "전체", "전체"],
                ["학습 리포트", "요약", "상세", "상세"],
                ["등급별 맞춤 학습", "—", "O", "O"],
                ["AI 1:1 맞춤 코칭", "—", "—", "O"],
                ["취약점 집중 훈련", "—", "—", "O"],
                ["실전 모의고사 (강화판)", "—", "—", "O"],
                ["학습 데이터 분석", "—", "—", "O"],
                ["우선 고객 지원", "—", "—", "O"],
              ].map(([feature, free, basic, premium]) => (
                <tr key={feature}>
                  <td className="px-4 py-3 text-foreground">{feature}</td>
                  <td className="px-4 py-3 text-center text-foreground-secondary">
                    {free}
                  </td>
                  <td className="px-4 py-3 text-center text-foreground-secondary">
                    {basic}
                  </td>
                  <td className="px-4 py-3 text-center text-foreground-secondary">
                    {premium}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 하단 안내 */}
      <div className="mt-12 text-center text-sm text-foreground-muted">
        <p>
          모든 유료 플랜은 7일 무료 체험이 포함됩니다.{" "}
          <Link href="/refund" className="text-primary-500 hover:underline">
            환불 규정
          </Link>
          을 확인해 주세요.
        </p>
      </div>
    </div>
  );
}
