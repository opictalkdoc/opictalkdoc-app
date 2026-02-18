import Link from "next/link";
import {
  Stethoscope,
  Heart,
  Zap,
  Check,
  ArrowRight,
  Plus,
  FileText,
} from "lucide-react";

/* ── 데이터 ── */

const trustStats = [
  { value: "10,000+", label: "학습자" },
  { value: "4.8/5.0", label: "평균 만족도" },
  { value: "92%", label: "목표 등급 달성률" },
];

/* 3T 시스템 기반 Features */
const features = [
  {
    icon: Stethoscope,
    iconBg: "bg-primary-50 text-primary-500",
    badge: "Talk-Doc",
    title: "네 실력을 정확히 진단해 줄게",
    desc: "AI 레벨 테스트, 발음·억양 분석, 문법 교정까지. 똑똑한 AI 주치의가 당신의 스피킹을 정밀 진단합니다.",
    imageBg: "bg-primary-50",
    imageAlt: "AI 스피킹 진단",
  },
  {
    icon: Heart,
    iconBg: "bg-accent-50 text-accent-500",
    badge: "Todak",
    title: "틀려도 괜찮아, 다시 해보자",
    desc: "칭찬 피드백과 멘탈 케어 메시지로 지친 수험생을 토닥여줍니다. 공부인데 부담 없는, 따뜻한 학습 경험.",
    imageBg: "bg-accent-50",
    imageAlt: "따뜻한 학습 경험",
    reverse: true,
  },
  {
    icon: Zap,
    iconBg: "bg-secondary-50 text-secondary-600",
    badge: "Ttuk-Tak",
    title: "고민할 시간에 답을 줄게",
    desc: "키워드만 넣으면 스크립트가 뚝딱. 내 경험을 영어로 변환하고, 예상 질문까지 적중시켜 드립니다.",
    imageBg: "bg-secondary-50",
    imageAlt: "AI 스크립트 생성",
  },
];

const steps = [
  {
    num: "1",
    title: "간편 가입",
    desc: "30초면 끝. 구글 계정으로\n바로 시작하세요.",
  },
  {
    num: "2",
    title: "AI가 진단",
    desc: "톡닥이가 현재 실력을 진단하고\n맞춤 처방전을 만들어 줍니다.",
  },
  {
    num: "3",
    title: "뚝딱 학습",
    desc: "스크립트 생성, 모의고사, 쉐도잉.\n오픽이 더 이상 아프지 않아요.",
  },
];

const plans = [
  {
    name: "무료",
    price: "₩0",
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
    price: "₩9,900",
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
    price: "₩19,900",
    period: "/월",
    description: "목표 등급 달성을 위한 최고의 선택",
    features: [
      "베이직 전체 기능 포함",
      "AI 1:1 맞춤 코칭",
      "취약점 집중 훈련",
      "실전 모의고사 (강화판)",
      "학습 데이터 분석 대시보드",
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
    q: "무료 체험은 어떻게 이용하나요?",
    a: "회원가입만 하면 무료 플랜이 자동 적용됩니다. 모의고사 월 1회, AI 훈련소 일 3회 등 핵심 기능을 바로 이용할 수 있습니다. 유료 플랜은 7일 무료 체험을 제공합니다.",
  },
  {
    q: "AI가 실제로 OPIc 점수 향상에 도움이 되나요?",
    a: "최신 AI 음성 분석 기술을 활용하여 발음, 문법, 유창성 등을 분석합니다. 학습자의 92%가 목표 등급을 달성했습니다.",
  },
  {
    q: "언제든지 해지할 수 있나요?",
    a: "네, 유료 플랜은 언제든지 해지할 수 있으며 다음 결제일부터 적용됩니다. 결제일로부터 7일 이내에는 전액 환불도 가능합니다.",
  },
  {
    q: "모바일에서도 이용할 수 있나요?",
    a: "네, 반응형 웹으로 제작되어 모바일 브라우저에서도 원활하게 이용할 수 있습니다. 전용 앱은 추후 출시 예정입니다.",
  },
];

/* ── 섹션 라벨 컴포넌트 ── */
function SectionPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-primary-100 bg-primary-50 px-4 py-1.5 text-[13px] font-semibold text-primary-600">
      {children}
    </span>
  );
}

/* ── 페이지 ── */
export default function HomePage() {
  return (
    <>
      {/* ━━━ Hero ━━━ */}
      <section className="hero-gradient">
        <div className="mx-auto flex max-w-6xl flex-col items-center px-4 pt-20 text-center sm:px-6 sm:pt-28">
          {/* 뱃지 */}
          <span className="inline-flex items-center gap-2 rounded-full border border-white bg-white/50 px-4 py-1.5 text-[13px] font-medium text-[#1f1e30] backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-primary-500" />
            오픽 스피킹 클리닉
          </span>

          {/* 헤드라인 — 마스터플랜 메인 슬로건 */}
          <h1 className="mt-8 font-serif text-4xl font-semibold italic leading-[1.2] tracking-tight text-[#1f1e30] sm:text-5xl md:text-[3.5rem]">
            막막한 스크립트는 뚝딱,
            <br />
            긴장된 마음은 톡닥.
          </h1>

          {/* 서브카피 — 브랜드 철학 기반 */}
          <p className="mt-6 max-w-[540px] text-[17px] leading-[1.7] text-[#52525B]">
            영어를 몰라서가 아니라, 무슨 말을 해야 할지 몰라서 아팠죠?
            <br className="hidden sm:block" />
            말하기가 아플 땐, 처방전 톡닥.
          </p>

          {/* CTA 버튼 */}
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#1f1e30] px-7 text-[15px] font-semibold text-white transition-colors hover:bg-[#2d2c3e]"
            >
              무료로 시작하기
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex h-12 items-center justify-center rounded-full border border-[#E4E4E7] bg-white px-7 text-[15px] font-medium text-[#1f1e30] transition-colors hover:bg-gray-50"
            >
              요금제 보기
            </Link>
          </div>

          {/* 브라우저 목업 */}
          <div className="mt-16 w-full max-w-[960px] pb-20">
            <div className="browser-mockup">
              <div className="browser-mockup-bar">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FF605C]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD44]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#00CA4E]" />
                <div className="ml-4 flex h-7 items-center justify-center rounded-lg border border-[#E4E4E7] bg-white px-4">
                  <span className="text-xs text-[#A1A1AA]">
                    opictalkdoc.com
                  </span>
                </div>
              </div>
              {/* 스크린 영역 — 추후 실제 스크린샷으로 교체 */}
              <div className="flex h-[320px] items-center justify-center bg-primary-50 sm:h-[400px] md:h-[520px]">
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100">
                    <Stethoscope className="h-8 w-8 text-primary-500" />
                  </div>
                  <p className="mt-4 text-sm font-medium text-primary-600">
                    말하기가 아플 땐? 오픽 톡닥.
                  </p>
                  <p className="mt-1 text-xs text-primary-400">
                    제품 스크린샷이 여기에 들어갑니다
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ Trust Bar ━━━ */}
      <section className="border-y border-[#F4F4F5] bg-[#FCFBF8]">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-12 px-4 py-12 sm:gap-16">
          {trustStats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-serif text-[28px] font-bold italic text-[#1f1e30]">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-[#A1A1AA]">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ━━━ Features ━━━ */}
      <section id="features" className="bg-[#FCFBF8] py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* 섹션 헤더 — 3T 시스템 */}
          <div className="flex flex-col items-center text-center">
            <SectionPill>The 3T System</SectionPill>
            <h2 className="mt-5 font-serif text-3xl font-semibold italic leading-[1.25] tracking-tight text-[#1f1e30] sm:text-[40px]">
              진단하고, 위로하고,
              <br />해결합니다
            </h2>
            <p className="mt-4 max-w-[520px] text-base leading-relaxed text-[#71717A]">
              공부는 쉬워야 하고, 결과는 빨라야 하며, 과정은 따뜻해야 합니다.
            </p>
          </div>

          {/* 피처 행 */}
          <div className="mt-16 flex flex-col gap-20 sm:gap-24">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className={`flex flex-col items-center gap-10 lg:gap-16 ${
                    f.reverse
                      ? "lg:flex-row-reverse"
                      : "lg:flex-row"
                  }`}
                >
                  {/* 텍스트 */}
                  <div className="flex-1 text-center lg:text-left">
                    <div className="flex items-center gap-3 max-lg:justify-center">
                      <div
                        className={`inline-flex h-12 w-12 items-center justify-center rounded-[14px] ${f.iconBg}`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="rounded-full bg-[#F4F4F5] px-3 py-1 text-xs font-semibold text-[#52525B]">
                        {f.badge}
                      </span>
                    </div>
                    <h3 className="mt-5 font-serif text-[28px] font-semibold italic tracking-tight text-[#1f1e30]">
                      {f.title}
                    </h3>
                    <p className="mt-4 max-w-[400px] text-[15px] leading-[1.7] text-[#71717A] lg:max-w-none">
                      {f.desc}
                    </p>
                  </div>

                  {/* 비주얼 */}
                  <div
                    className={`flex h-[280px] w-full max-w-[540px] items-center justify-center rounded-2xl sm:h-[360px] ${f.imageBg}`}
                    style={{
                      boxShadow:
                        "0 8px 32px -4px rgba(13, 148, 136, 0.07)",
                    }}
                  >
                    <div className="text-center">
                      <Icon className="mx-auto h-10 w-10 text-[#A1A1AA]" />
                      <p className="mt-3 text-sm text-[#A1A1AA]">
                        {f.imageAlt}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ━━━ How it Works ━━━ */}
      <section className="border-y border-[#F4F4F5] bg-[#FAFAFA] py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center text-center">
            <SectionPill>이용 방법</SectionPill>
            <h2 className="mt-5 font-serif text-3xl font-semibold italic tracking-tight text-[#1f1e30] sm:text-[40px]">
              3단계로 시작하세요
            </h2>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {steps.map((s) => (
              <div
                key={s.num}
                className="flex flex-col items-center rounded-[20px] border border-[#F4F4F5] bg-white p-8 text-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-b from-primary-500 to-primary-600 text-lg font-bold text-white shadow-[0_4px_12px_rgba(13,148,136,0.3)]">
                  {s.num}
                </div>
                <h3 className="mt-5 text-lg font-bold text-[#1f1e30]">
                  {s.title}
                </h3>
                <p className="mt-2 whitespace-pre-line text-sm leading-[1.7] text-[#71717A]">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ Pricing ━━━ */}
      <section id="pricing" className="bg-[#FCFBF8] py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center text-center">
            <SectionPill>요금제</SectionPill>
            <h2 className="mt-5 font-serif text-3xl font-semibold italic tracking-tight text-[#1f1e30] sm:text-[40px]">
              나에게 맞는 플랜을 선택하세요
            </h2>
            <p className="mt-4 text-base text-[#71717A]">
              7일 무료 체험 후 결제가 시작됩니다. 언제든 해지 가능합니다.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-[20px] p-8 ${
                  plan.highlight
                    ? "bg-[#1f1e30] text-white shadow-[0_16px_48px_-8px_rgba(0,0,0,0.12)]"
                    : "border border-[#F4F4F5] bg-white"
                }`}
              >
                {/* 인기 뱃지 */}
                {plan.highlight && (
                  <span className="mb-4 inline-flex w-fit rounded-full bg-primary-500 px-3 py-1 text-xs font-semibold text-white">
                    인기
                  </span>
                )}

                {/* 플랜명 & 가격 */}
                <span
                  className={`text-base font-semibold ${
                    plan.highlight ? "text-[#A1A1AA]" : "text-[#71717A]"
                  }`}
                >
                  {plan.name}
                </span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span
                    className={`font-serif text-[40px] font-bold italic ${
                      plan.highlight ? "text-white" : "text-[#1f1e30]"
                    }`}
                  >
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span
                      className={`text-sm ${
                        plan.highlight ? "text-[#71717A]" : "text-[#A1A1AA]"
                      }`}
                    >
                      {plan.period}
                    </span>
                  )}
                </div>
                <p
                  className={`mt-1 text-sm ${
                    plan.highlight ? "text-[#71717A]" : "text-[#A1A1AA]"
                  }`}
                >
                  {plan.description}
                </p>

                {/* 구분선 */}
                <div
                  className={`my-6 h-px ${
                    plan.highlight ? "bg-[#3f3e50]" : "bg-[#F4F4F5]"
                  }`}
                />

                {/* 기능 목록 */}
                <ul className="flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5">
                      <Check
                        className={`h-4 w-4 flex-shrink-0 ${
                          plan.highlight
                            ? "text-primary-300"
                            : "text-primary-500"
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          plan.highlight ? "text-[#D4D4D8]" : "text-[#52525B]"
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA 버튼 */}
                <Link
                  href={plan.href}
                  className={`mt-8 flex h-12 items-center justify-center rounded-full text-[15px] font-semibold transition-colors ${
                    plan.highlight
                      ? "bg-primary-500 text-white shadow-[0_4px_16px_rgba(13,148,136,0.25)] hover:bg-primary-600"
                      : "border border-[#E4E4E7] text-[#1f1e30] hover:bg-gray-50"
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

      {/* ━━━ FAQ ━━━ */}
      <section className="border-y border-[#F4F4F5] bg-[#FCFBF8] py-20 sm:py-28">
        <div className="mx-auto max-w-[720px] px-4 sm:px-6">
          <div className="flex flex-col items-center text-center">
            <SectionPill>자주 묻는 질문</SectionPill>
            <h2 className="mt-5 font-serif text-3xl font-semibold italic tracking-tight text-[#1f1e30] sm:text-[40px]">
              궁금한 점이 있으신가요?
            </h2>
          </div>

          <div className="mt-12">
            {faqs.map((faq) => (
              <details key={faq.q} className="group border-b border-[#F4F4F5]">
                <summary className="flex cursor-pointer items-center justify-between py-5 text-base font-semibold text-[#1f1e30] [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <Plus className="h-5 w-5 flex-shrink-0 text-[#A1A1AA] transition-transform group-open:rotate-45" />
                </summary>
                <div className="pb-5 text-[15px] leading-[1.7] text-[#71717A]">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ Final CTA ━━━ */}
      <section
        className="py-24 sm:py-32"
        style={{
          background:
            "linear-gradient(180deg, #FCFBF8 0%, #E0F7F3 30%, #C4EDE6 60%, #E0F7F3 100%)",
        }}
      >
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h2 className="font-serif text-3xl font-semibold italic tracking-tight text-[#1f1e30] sm:text-[44px] sm:leading-[1.2]">
            당신의 오픽,
            <br />
            뚝딱 완성해 드릴게요.
          </h2>
          <p className="mt-5 text-[17px] leading-relaxed text-[#52525B]">
            공부는 쉬워야 하고, 결과는 빨라야 하며, 과정은 따뜻해야 합니다.
          </p>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-[#1f1e30] px-8 text-base font-semibold text-white shadow-[0_4px_16px_rgba(31,30,48,0.12)] transition-colors hover:bg-[#2d2c3e]"
            >
              무료로 시작하기
              <ArrowRight className="h-[18px] w-[18px]" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex h-[52px] items-center justify-center rounded-full border border-[#E4E4E7] bg-white px-8 text-base font-medium text-[#1f1e30] transition-colors hover:bg-gray-50"
            >
              요금제 보기
            </Link>
          </div>
          <p className="mt-6 text-[13px] text-[#A1A1AA]">
            카드 등록 없이 무료로 시작 · 언제든 해지 가능
          </p>
        </div>
      </section>
    </>
  );
}
