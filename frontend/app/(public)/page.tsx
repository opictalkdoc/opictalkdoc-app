import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const opicGrades = [
  { label: "AL", variant: "al" as const, desc: "Advanced Low" },
  { label: "IH", variant: "ih" as const, desc: "Intermediate High" },
  { label: "IM1", variant: "im1" as const, desc: "Intermediate Mid 1" },
  { label: "IM2", variant: "im2" as const, desc: "Intermediate Mid 2" },
  { label: "IM3", variant: "im3" as const, desc: "Intermediate Mid 3" },
  { label: "IL", variant: "il" as const, desc: "Intermediate Low" },
  { label: "NH", variant: "nh" as const, desc: "Novice High" },
  { label: "NM", variant: "nm" as const, desc: "Novice Mid" },
];

const features = [
  {
    title: "모의고사",
    desc: "실제 OPIc 시험과 동일한 환경에서 연습하고, AI가 즉시 등급을 예측해 드립니다.",
    icon: "📝",
  },
  {
    title: "AI 훈련소",
    desc: "AI가 실시간으로 발음, 문법, 표현을 분석하고 맞춤 피드백을 제공합니다.",
    icon: "🤖",
  },
  {
    title: "쉐도잉",
    desc: "원어민 발화를 따라하며 발음과 억양을 자연스럽게 개선하세요.",
    icon: "🎧",
  },
];

const steps = [
  {
    step: "01",
    title: "회원가입",
    desc: "이메일 또는 소셜 로그인으로 30초 만에 시작하세요.",
  },
  {
    step: "02",
    title: "레벨 테스트",
    desc: "AI가 현재 실력을 분석하고 목표 등급에 맞는 학습 계획을 세워줍니다.",
  },
  {
    step: "03",
    title: "AI 학습 시작",
    desc: "모의고사, 훈련소, 쉐도잉으로 매일 꾸준히 실력을 키우세요.",
  },
];

const plans = [
  { name: "무료", price: "0", period: "", desc: "체험용" },
  { name: "베이직", price: "9,900", period: "/월", desc: "본격 준비", highlight: true },
  { name: "프리미엄", price: "19,900", period: "/월", desc: "목표 달성" },
];

const faqs = [
  {
    q: "OPIcTalkDoc은 어떤 서비스인가요?",
    a: "AI 기반 OPIc 영어 말하기 학습 플랫폼입니다. 모의고사, AI 훈련소, 쉐도잉 등 체계적인 학습 시스템으로 원하는 등급을 효과적으로 준비할 수 있습니다.",
  },
  {
    q: "무료로도 이용할 수 있나요?",
    a: "네, 무료 플랜으로 모의고사 월 1회, AI 훈련소 일 3회 등 핵심 기능을 체험할 수 있습니다. 유료 플랜은 7일 무료 체험을 제공합니다.",
  },
  {
    q: "AI 피드백은 얼마나 정확한가요?",
    a: "최신 AI 음성 분석 기술을 활용하여 발음, 문법, 유창성 등을 분석합니다. 실제 OPIc 시험 등급과 높은 상관관계를 보이지만, AI 예측 등급은 참고용입니다.",
  },
  {
    q: "결제 후 환불이 가능한가요?",
    a: "결제일로부터 7일 이내에 환불을 요청할 수 있습니다. 자세한 내용은 환불 규정 페이지를 참고해 주세요.",
  },
  {
    q: "모바일에서도 이용할 수 있나요?",
    a: "네, 반응형 웹으로 제작되어 모바일 브라우저에서도 원활하게 이용할 수 있습니다. 전용 앱은 추후 출시 예정입니다.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* 1. Hero 섹션 */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="flex flex-col items-center text-center">
          <Badge variant="default" className="mb-4">
            AI 기반 학습
          </Badge>
          <h1 className="font-display text-4xl tracking-tight sm:text-5xl md:text-6xl">
            <span className="text-primary-500">OPIc</span> 목표 등급,
            <br />
            AI와 함께 달성하세요
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-foreground-secondary">
            모의고사, AI 훈련소, 쉐도잉까지. 체계적인 학습 시스템으로
            원하는 OPIc 등급을 효과적으로 준비하세요.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex h-12 items-center justify-center rounded-[var(--radius-lg)] bg-primary-500 px-6 text-base font-medium text-white transition-colors hover:bg-primary-600"
            >
              무료로 시작하기
            </Link>
            <Link
              href="/pricing"
              className="inline-flex h-12 items-center justify-center rounded-[var(--radius-lg)] border border-border px-6 text-base font-medium text-foreground transition-colors hover:bg-surface-secondary"
            >
              요금제 보기
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Features 섹션 */}
      <section id="features" className="border-t border-border bg-surface py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold">핵심 학습 기능</h2>
          <p className="mt-2 text-center text-foreground-secondary">
            효과적인 OPIc 준비를 위한 3가지 핵심 기능
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-[var(--radius-xl)] border border-border bg-background p-6 transition-shadow hover:shadow-md"
              >
                <div className="text-3xl">{feature.icon}</div>
                <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground-secondary">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. How it works 섹션 */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold">이렇게 시작하세요</h2>
          <p className="mt-2 text-center text-foreground-secondary">
            3단계로 간편하게 학습을 시작할 수 있습니다
          </p>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {steps.map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[var(--radius-full)] bg-primary-100 text-lg font-bold text-primary-700">
                  {item.step}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground-secondary">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. OPIc 등급 섹션 */}
      <section className="border-t border-border bg-surface py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold">OPIc 등급 체계</h2>
          <p className="mt-2 text-center text-foreground-secondary">
            목표 등급을 설정하고 맞춤 학습을 시작하세요
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {opicGrades.map((grade) => (
              <div
                key={grade.label}
                className="flex flex-col items-center gap-1.5 rounded-[var(--radius-lg)] border border-border bg-background p-4 transition-shadow hover:shadow-md"
              >
                <Badge variant={grade.variant} className="px-3 py-1 text-sm">
                  {grade.label}
                </Badge>
                <span className="text-xs text-foreground-muted">
                  {grade.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Pricing 요약 섹션 */}
      <section id="pricing" className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold">합리적인 요금제</h2>
          <p className="mt-2 text-center text-foreground-secondary">
            나에게 맞는 플랜을 선택하세요
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`flex flex-col items-center rounded-[var(--radius-xl)] border p-6 text-center transition-shadow hover:shadow-md ${
                  plan.highlight
                    ? "border-primary-500 shadow-sm"
                    : "border-border"
                }`}
              >
                <span className="text-sm font-medium text-foreground-secondary">
                  {plan.name}
                </span>
                <div className="mt-2 flex items-baseline gap-0.5">
                  {plan.price === "0" ? (
                    <span className="text-3xl font-bold">무료</span>
                  ) : (
                    <>
                      <span className="text-sm text-foreground-secondary">&#8361;</span>
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="text-sm text-foreground-secondary">
                        {plan.period}
                      </span>
                    </>
                  )}
                </div>
                <span className="mt-1 text-xs text-foreground-muted">
                  {plan.desc}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/pricing"
              className="text-sm font-medium text-primary-500 hover:underline"
            >
              전체 기능 비교 보기 &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* 6. FAQ 섹션 */}
      <section className="border-t border-border bg-surface py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold">자주 묻는 질문</h2>
          <p className="mt-2 text-center text-foreground-secondary">
            궁금한 점을 확인해 보세요
          </p>
          <div className="mt-10 space-y-3">
            {faqs.map((faq) => (
              <details key={faq.q} className="faq-item">
                <summary>{faq.q}</summary>
                <div className="faq-answer">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Final CTA 섹션 */}
      <section className="py-20">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold sm:text-3xl">
            지금 바로 OPIc 학습을 시작하세요
          </h2>
          <p className="mt-3 text-foreground-secondary">
            AI와 함께하는 체계적인 학습으로 목표 등급을 달성할 수 있습니다.
            무료로 시작해 보세요.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="inline-flex h-12 items-center justify-center rounded-[var(--radius-lg)] bg-primary-500 px-8 text-base font-medium text-white transition-colors hover:bg-primary-600"
            >
              무료로 시작하기
            </Link>
            <Link
              href="/pricing"
              className="inline-flex h-12 items-center justify-center rounded-[var(--radius-lg)] border border-border px-8 text-base font-medium text-foreground transition-colors hover:bg-surface-secondary"
            >
              요금제 살펴보기
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
