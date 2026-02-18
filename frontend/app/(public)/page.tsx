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
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
      </svg>
    ),
    iconBg: "bg-primary-50 text-primary-500",
  },
  {
    title: "AI 훈련소",
    desc: "AI가 실시간으로 발음, 문법, 표현을 분석하고 맞춤 피드백을 제공합니다.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    ),
    iconBg: "bg-blue-50 text-blue-500",
  },
  {
    title: "쉐도잉",
    desc: "원어민 발화를 따라하며 발음과 억양을 자연스럽게 개선하세요.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
      </svg>
    ),
    iconBg: "bg-amber-50 text-amber-500",
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
      "베이직 전체 기능",
      "AI 1:1 맞춤 코칭",
      "취약점 집중 훈련",
      "실전 모의고사 (강화판)",
      "우선 고객 지원",
      "학습 데이터 분석",
    ],
    cta: "프리미엄 시작하기",
    href: "/signup",
    highlight: false,
  },
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

function CheckIcon() {
  return (
    <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <>
      {/* 1. Hero */}
      <section className="hero-gradient">
        <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-24 text-center sm:px-6 sm:py-32">
          <Badge variant="default" className="mb-6">
            AI 기반 OPIc 학습 플랫폼
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-[3.5rem] md:leading-[1.1]">
            OPIc 목표 등급,
            <br />
            <span className="text-primary-500">AI와 함께 달성하세요</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground-secondary">
            모의고사, AI 훈련소, 쉐도잉까지. 체계적인 학습 시스템으로
            원하는 등급을 효과적으로 준비하세요.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex h-12 items-center justify-center rounded-[var(--radius-xl)] bg-primary-500 px-7 text-base font-semibold text-white shadow-[var(--shadow-primary)] transition-all hover:bg-primary-600 hover:shadow-lg"
            >
              무료로 시작하기
            </Link>
            <Link
              href="/pricing"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-[var(--radius-xl)] border border-border bg-surface px-7 text-base font-semibold text-foreground-secondary transition-colors hover:bg-surface-secondary"
            >
              요금제 보기
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium text-foreground-muted">
            <span>&#10003; 무료 체험 가능</span>
            <span>&#10003; 신용카드 불필요</span>
            <span>&#10003; 언제든 해지 가능</span>
          </div>
        </div>
      </section>

      {/* 2. Features */}
      <section id="features" className="bg-surface py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <span className="section-label">FEATURES</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              핵심 학습 기능
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-foreground-secondary">
              AI 기술로 실전처럼 준비하고, 약점을 정확히 파악하세요
            </p>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="card-modern p-8">
                <div className={`icon-container ${f.iconBg}`}>
                  {f.icon}
                </div>
                <h3 className="mt-5 text-xl font-bold">{f.title}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-foreground-secondary">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. How it works */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <span className="section-label">HOW IT WORKS</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              이렇게 시작하세요
            </h2>
            <p className="mt-4 text-foreground-secondary">
              3단계로 간편하게 학습을 시작할 수 있습니다
            </p>
          </div>
          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {steps.map((s) => (
              <div
                key={s.step}
                className="card-modern flex flex-col items-center p-8 text-center"
              >
                <div className="step-number">{s.step}</div>
                <h3 className="mt-5 text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-foreground-secondary">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. OPIc 등급 */}
      <section className="bg-surface py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <span className="section-label">OPIC LEVELS</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              OPIc 등급 체계
            </h2>
            <p className="mt-4 text-foreground-secondary">
              목표 등급을 설정하고 맞춤 학습을 시작하세요
            </p>
          </div>
          <div className="mt-14 flex flex-wrap items-center justify-center gap-4">
            {opicGrades.map((g) => (
              <div
                key={g.label}
                className="card-modern flex flex-col items-center gap-2 px-5 py-4"
              >
                <Badge variant={g.variant} className="px-3 py-1 text-sm">
                  {g.label}
                </Badge>
                <span className="text-xs text-foreground-muted">
                  {g.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Pricing */}
      <section id="pricing" className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <span className="section-label">PRICING</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              합리적인 요금제
            </h2>
            <p className="mt-4 text-foreground-secondary">
              7일 무료 체험 후 결제가 시작됩니다. 언제든 해지 가능.
            </p>
          </div>
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-[var(--radius-2xl)] p-8 ${
                  plan.highlight
                    ? "pricing-highlight"
                    : "card-modern"
                }`}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-[var(--radius-full)] bg-primary-500 px-3.5 py-1 text-xs font-semibold text-white">
                    인기
                  </span>
                )}
                <span className="text-sm font-semibold text-foreground-secondary">
                  {plan.name}
                </span>
                <div className="mt-3 flex items-baseline gap-1">
                  {plan.price === "0" ? (
                    <span className="text-4xl font-extrabold tracking-tight">
                      &#8361;0
                    </span>
                  ) : (
                    <>
                      <span className="text-4xl font-extrabold tracking-tight">
                        &#8361;{plan.price}
                      </span>
                      <span className="text-sm text-foreground-muted">
                        {plan.period}
                      </span>
                    </>
                  )}
                </div>
                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[0.9375rem] text-foreground-secondary">
                      <CheckIcon />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`mt-8 inline-flex h-11 items-center justify-center rounded-[var(--radius-xl)] text-sm font-semibold transition-all ${
                    plan.highlight
                      ? "bg-primary-500 text-white shadow-[var(--shadow-primary)] hover:bg-primary-600"
                      : "border border-border bg-surface text-foreground hover:bg-surface-secondary"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/pricing"
              className="text-sm font-medium text-primary-500 hover:underline"
            >
              전체 기능 비교 보기 &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section className="bg-surface py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-center">
            <span className="section-label">FAQ</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              자주 묻는 질문
            </h2>
          </div>
          <div className="mt-12 space-y-3">
            {faqs.map((faq) => (
              <details key={faq.q} className="faq-item">
                <summary>{faq.q}</summary>
                <div className="faq-answer">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Final CTA */}
      <section className="cta-gradient py-24 sm:py-28">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            지금 바로 OPIc 학습을 시작하세요
          </h2>
          <p className="mt-4 text-lg text-foreground-secondary">
            AI와 함께하는 체계적인 학습으로 목표 등급을 달성할 수 있습니다.
          </p>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="inline-flex h-12 items-center justify-center rounded-[var(--radius-xl)] bg-primary-500 px-8 text-base font-semibold text-white shadow-[var(--shadow-primary)] transition-all hover:bg-primary-600 hover:shadow-lg"
            >
              무료로 시작하기
            </Link>
            <Link
              href="/pricing"
              className="inline-flex h-12 items-center justify-center rounded-[var(--radius-xl)] border border-border bg-surface px-8 text-base font-semibold text-foreground-secondary transition-colors hover:bg-surface-secondary"
            >
              요금제 살펴보기
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
