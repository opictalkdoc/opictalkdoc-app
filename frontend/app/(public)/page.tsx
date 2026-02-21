import Link from "next/link";
import {
  Search,
  PenTool,
  Mic,
  MessageCircle,
  Sparkles,
  Check,
  ArrowRight,
  Plus,
  Mail,
} from "lucide-react";

/* ── 데이터 ── */

/* 서비스 소개 — 무대 메타포 */
const services = [
  {
    num: "01",
    icon: Search,
    iconBg: "bg-primary-50 text-primary-500",
    title: "조명을 켜는 데이터",
    desc: "어떤 질문이 나올지 몰라 남의 대본을 뒤적이지 마세요. 오픽톡닥의 데이터가 내일 시험에 나올 진짜 질문들만 선별해, 당신이 서야 할 무대에 정확히 조명을 비춰줍니다.",
  },
  {
    num: "02",
    icon: PenTool,
    iconBg: "bg-secondary-50 text-secondary-600",
    title: "내 일상이 명대사가 되는 스크립트",
    desc: '거창한 경험은 필요 없습니다. "퇴근 후 마시는 맥주 한 캔" 같은 당신의 평범한 일상을 가져오세요. AI가 그 진심 어린 경험을 가장 자연스럽고 돋보이는 영어 대사로 다듬어 드립니다.',
  },
  {
    num: "03",
    icon: Mic,
    iconBg: "bg-accent-50 text-accent-500",
    title: "주인공의 완벽한 리허설",
    desc: "내 진짜 이야기이기에 입에 맴돌지 않고 가슴에서 나옵니다. 내 삶이 담긴 대본으로 실전과 똑같은 무대에서 리허설하며, 긴장감을 완벽한 자신감으로 바꿉니다.",
    badge: "모의고사",
  },
  {
    num: "04",
    icon: MessageCircle,
    iconBg: "bg-purple-50 text-purple-500",
    title: "디테일을 살리는 튜터링",
    desc: "주인공의 목소리가 더 선명하게 전달될 수 있도록, 전문가가 발음과 억양의 미세한 빈틈을 잡아줍니다. 당신의 진심이 채점관에게 더 깊이 닿도록 돕는 섬세한 디렉팅입니다.",
  },
  {
    num: "05",
    icon: Sparkles,
    iconBg: "bg-amber-50 text-amber-500",
    title: "큐 사인, 그리고 나다운 15분",
    desc: "이제 시험장에서는 억지 연기를 멈추고, 그냥 당신의 진짜 모습을 보여주세요. 가장 나다울 때, 당신의 점수는 가장 빛납니다.",
  },
];

const plans = [
  {
    name: "체험",
    price: "₩0",
    description: "OPIc이 어떤 시험인지 경험해 보세요",
    features: [
      "샘플 모의고사 1회 (고정문제)",
      "AI 진단 · 튜터링 무료",
      "체화 · 쉐도잉 훈련 무제한",
    ],
    cta: "무료로 시작하기",
    href: "/signup",
    highlight: false,
  },
  {
    name: "베이직",
    price: "₩19,900",
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
    price: "₩49,900",
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

const faqs = [
  {
    q: "오픽톡닥은 어떤 서비스인가요?",
    a: "AI 기반 OPIc 영어 말하기 학습 플랫폼입니다. 수험생 후기 데이터로 출제 범위를 좁혀주고, 당신의 진짜 일상을 자연스러운 영어 스크립트로 만들어 드립니다. 모의고사, 튜터링, 쉐도잉까지 한곳에서 준비할 수 있습니다.",
  },
  {
    q: "무료 체험은 어떻게 이용하나요?",
    a: "회원가입만 하면 무료 플랜이 자동 적용됩니다. 샘플 모의고사 1회, AI 튜터링 무료, 쉐도잉 훈련 무제한으로 핵심 기능을 바로 경험할 수 있습니다.",
  },
  {
    q: "정말 내 평범한 일상으로 스크립트를 만들 수 있나요?",
    a: "네, 그게 핵심입니다. OPIc은 화려한 경험이 아니라 '자연스러운 나의 이야기'를 평가합니다. 퇴근 후 맥주 한 캔, 주말 넷플릭스 같은 소소한 일상이 가장 좋은 재료예요.",
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
      {/* ━━━ Hero — 메인 선언문 ━━━ */}
      <section className="hero-gradient">
        <div className="mx-auto flex max-w-4xl flex-col items-center px-4 pb-24 pt-20 text-center sm:px-6 sm:pb-32 sm:pt-28">
          {/* 태그라인 뱃지 */}
          <span className="inline-flex items-center gap-2 rounded-full border border-white bg-white/50 px-4 py-1.5 text-[13px] font-medium text-[#1f1e30] backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-primary-500" />
            말하다, 나답게.
          </span>

          {/* 메인 헤드라인 */}
          <h1 className="mt-10 text-3xl font-bold leading-[1.35] tracking-tight text-[#1f1e30] sm:text-4xl md:text-5xl md:leading-[1.3]">
            화려한 필터는 끄세요.
            <br />
            <span className="text-primary-600">
              당신이 평범하게 보내는 일상들이
            </span>
            <br />
            가장 완벽한 대본입니다.
          </h1>

          {/* 서브 카피 — 브라우저 목업 */}
          <div className="mt-10 w-full max-w-[920px]">
            <div className="overflow-hidden rounded-2xl border border-[#E4E4E7] bg-[#F8F8F8] shadow-[0_16px_48px_rgba(0,0,0,0.08)]">
              {/* macOS Safari 타이틀 바 */}
              <div className="flex items-center gap-3 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
                <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
                <span className="h-3 w-3 rounded-full bg-[#28C840]" />
                <div className="ml-1 rounded-md border border-[#E4E4E7] bg-white px-4 py-1">
                  <span className="text-xs text-[#A1A1AA]">OPIcTalkDoc.com</span>
                </div>
              </div>
              {/* 윈도우 본문 */}
              <div className="space-y-5 bg-white px-8 py-10 text-[16px] leading-[1.9] text-[#52525B] sm:px-12 sm:py-12 sm:text-[17px]">
                <p>
                  OPIc은 ★스타가 아닙니다.
                  <br className="hidden sm:block" />
                  새벽 요가로 하루를 열고, 저녁엔 루프탑에서 와인을 기울인다는
                  <br className="hidden sm:block" />
                  남의 멋진 삶을 흉내 내지 마세요.
                </p>
                <p>
                  당신의 평범한 하루,
                  <br className="hidden sm:block" />
                  소파에 누워 좋아하는 예능을 보며 낄낄대던 그 소박한 이야기.
                  <br className="hidden sm:block" />
                  그 진짜 내 이야기를 할 때, 당신은 가장 나다워지고 가장 돋보입니다.
                </p>
                <p className="font-medium text-[#1f1e30]">
                  남의 삶을 흉내내지 마세요.
                  <br />
                  내 삶의 대본에서는, 이미 내가 주인공이니까요.
                </p>
              </div>
            </div>
          </div>

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
        </div>
      </section>

      {/* ━━━ 서비스 소개 — 무대 메타포 ━━━ */}
      <section id="features" className="bg-[#FCFBF8] py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          {/* 섹션 헤더 */}
          <div className="flex flex-col items-center text-center">
            <SectionPill>당신의 무대를 돕는 방법</SectionPill>
            <h2 className="mt-5 font-serif text-3xl font-semibold italic leading-[1.25] tracking-tight text-[#1f1e30] sm:text-[40px]">
              오픽톡닥이
              <br />
              당신의 무대를 준비합니다
            </h2>
          </div>

          {/* 서비스 카드 리스트 */}
          <div className="mt-16 space-y-6">
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.num}
                  className="flex gap-5 rounded-2xl border border-[#F4F4F5] bg-white p-6 sm:gap-6 sm:p-8"
                >
                  {/* 넘버 + 아이콘 */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-sm font-bold text-[#A1A1AA]">
                      {s.num}
                    </span>
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.iconBg}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  {/* 텍스트 */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-[#1f1e30]">
                        {s.title}
                      </h3>
                      {s.badge && (
                        <span className="rounded-full bg-[#F4F4F5] px-2.5 py-0.5 text-xs font-medium text-[#71717A]">
                          {s.badge}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-[15px] leading-[1.7] text-[#71717A]">
                      {s.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ━━━ 전략 넛지 — "대충 아는 사람" ━━━ */}
      <section className="border-y border-[#F4F4F5] bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          {/* 섹션 헤더 */}
          <div className="mb-14 flex flex-col items-center text-center">
            <SectionPill>전략 점검</SectionPill>
            <h2 className="mt-5 font-serif text-3xl font-semibold italic tracking-tight text-[#1f1e30] sm:text-[40px]">
              OPIc, 정말 알고
              <br />
              준비하고 계세요?
            </h2>
          </div>

          {/* 질문 카드들 */}
          <div className="space-y-4">
            {[
              {
                quote: "\u201c서베이가 중요하다더라\u201d",
                nudge: "\u2192 얼마나?",
              },
              {
                quote: "\u201c5-5가 좋다더라\u201d",
                nudge: "\u2192 왜?",
              },
              {
                quote: "\u201c스크립트 외우면 안 된대\u201d",
                nudge: "\u2192 대안이 뭔데?",
              },
            ].map((item) => (
              <div
                key={item.quote}
                className="flex items-baseline justify-between rounded-2xl border border-[#F4F4F5] bg-[#FAFAFA] px-6 py-5 sm:px-8"
              >
                <span className="text-[15px] text-[#71717A] sm:text-base">
                  {item.quote}
                </span>
                <span className="ml-4 shrink-0 text-[15px] font-semibold text-[#1f1e30] sm:text-base">
                  {item.nudge}
                </span>
              </div>
            ))}
          </div>

          {/* 핵심 메시지 */}
          <div className="mt-14 text-center">
            <p className="text-base text-[#71717A]">대충 아는 사람의</p>
            <p className="mt-2 font-serif text-6xl font-bold italic text-[#1f1e30] sm:text-7xl">
              68%
            </p>
            <p className="mt-2 text-base text-[#71717A]">
              가 IM2 이하입니다
            </p>
            <Link
              href="/strategy"
              className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-[#1f1e30] px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[#2d2c3e]"
            >
              정확히 알아보기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ━━━ 운영자의 편지 ━━━ */}
      <section className="border-y border-[#F4F4F5] bg-[#FAFAFA] py-20 sm:py-28">
        <div className="mx-auto max-w-[680px] px-4 sm:px-6">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50">
              <Mail className="h-5 w-5 text-primary-500" />
            </div>
            <p className="mt-4 text-sm font-semibold text-primary-600">
              운영자의 편지
            </p>
          </div>

          <div className="mt-10 rounded-2xl border border-[#E8E8EB] bg-white p-6 shadow-sm sm:p-10">
            <p className="text-[15px] font-semibold text-[#1f1e30]">
              To. 오늘도 남의 대본을 외우고 있을 당신에게
            </p>

            <div className="mt-6 space-y-4 text-[15px] leading-[1.8] text-[#52525B]">
              <p>안녕하세요, 오픽톡닥 운영자입니다.</p>

              <p>
                에브리타임과 취업 카페를 보면 다들 비슷한 고민을 하더라고요.
                <br />
                <span className="text-[#71717A]">
                  &ldquo;저 자전거 안 타는데, 취미를 자전거로 선택하는 게 점수 잘
                  나오겠죠?&rdquo;
                </span>
                <br />
                <span className="text-[#71717A]">
                  &ldquo;음악 감상은 너무 뻔한데, 스크립트 외우기 쉬운 다른 거
                  없을까요?&rdquo;
                </span>
              </p>

              <p>
                그 글들을 보면서 참 안타까웠어요.
                <br />
                우리는 왜 영어 시험 앞에서 자꾸 남의 삶을 연기하려고 할까요?
              </p>

              <p>
                누구나 자신만의 드라마를 살고 있습니다. 굳이 별스타그램에 올라올
                법한 완벽하고 화려한 스토리가 아니어도 괜찮아요. 주말 내내 소파에
                누워 넷플릭스를 정주행한 이야기, 집 앞 편의점에서 맥주 한 캔 사서
                마시는 소소한 일상… 그게 &lsquo;진짜 내 모습&rsquo;이라면, 그
                어떤 화려한 스크립트보다 훨씬 더 강력한 무기가 됩니다.
                왜냐고요?{" "}
                <span className="font-medium text-[#1f1e30]">
                  바로 &lsquo;나&rsquo;니까요. 내 진심이니까요.
                </span>
              </p>

              <p>
                <span className="font-medium text-[#1f1e30]">
                  오픽톡닥은 그래서 만들어졌습니다.
                </span>
                <br />
                여러분이 더 이상 남의 흉내를 내지 않도록, 철저한 기출 데이터로
                출제 범위라는 &lsquo;무대&rsquo;만 딱 좁혀드릴게요.
              </p>

              <p>
                여러분은 그저 그 무대 위에서, 평범하지만 빛나는 당신의 일상을
                편안하게 들려주세요. 그 일상이 가장 자연스러운 영어가 될 수
                있도록, 그리고 실전 모의고사에서 자신감 있게 뱉어낼 수 있도록
                저희가 옆에서 돕겠습니다.
              </p>

              <p className="font-medium text-[#1f1e30]">
                내 삶의 주인공은 나 자신입니다.
                <br />
                억지 연기 대신, 가장 나다운 목소리를 들려주세요.
                <br />
                당신의 이야기를 기다릴게요!
              </p>
            </div>

            <div className="mt-8 border-t border-[#F4F4F5] pt-6">
              <p className="text-sm text-[#A1A1AA]">
                당신의 평범한 하루를 응원하며,
              </p>
              <p className="mt-1 text-sm font-semibold text-[#1f1e30]">
                오픽톡닥 운영자 올림
              </p>
            </div>
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
              무료 플랜으로 바로 시작하세요. 유료 플랜은 준비 중입니다.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-[20px] p-8 ${plan.highlight
                    ? "bg-[#1f1e30] text-white shadow-[0_16px_48px_-8px_rgba(0,0,0,0.12)]"
                    : "border border-[#F4F4F5] bg-white"
                  }`}
              >
                {plan.highlight && (
                  <span className="mb-4 inline-flex w-fit rounded-full bg-primary-500 px-3 py-1 text-xs font-semibold text-white">
                    인기
                  </span>
                )}

                <span
                  className={`text-base font-semibold ${plan.highlight ? "text-[#A1A1AA]" : "text-[#71717A]"
                    }`}
                >
                  {plan.name}
                </span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span
                    className={`font-serif text-[40px] font-bold italic ${plan.highlight ? "text-white" : "text-[#1f1e30]"
                      }`}
                  >
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span
                      className={`text-sm ${plan.highlight ? "text-[#71717A]" : "text-[#A1A1AA]"
                        }`}
                    >
                      {plan.period}
                    </span>
                  )}
                </div>
                <p
                  className={`mt-1 text-sm ${plan.highlight ? "text-[#71717A]" : "text-[#A1A1AA]"
                    }`}
                >
                  {plan.description}
                </p>
                {plan.sub && (
                  <span
                    className={`mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${plan.highlight
                        ? "bg-[#3f3e50] text-[#A1A1AA]"
                        : "bg-[#F4F4F5] text-[#71717A]"
                      }`}
                  >
                    {plan.sub}
                  </span>
                )}

                <div
                  className={`my-6 h-px ${plan.highlight ? "bg-[#3f3e50]" : "bg-[#F4F4F5]"
                    }`}
                />

                <ul className="flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5">
                      <Check
                        className={`h-4 w-4 flex-shrink-0 ${plan.highlight
                            ? "text-primary-300"
                            : "text-primary-500"
                          }`}
                      />
                      <span
                        className={`text-sm ${plan.highlight ? "text-[#D4D4D8]" : "text-[#52525B]"
                          }`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {plan.comingSoon ? (
                  <span className="mt-8 flex h-12 cursor-not-allowed items-center justify-center rounded-full border border-[#E4E4E7] text-[15px] font-semibold text-[#A1A1AA]">
                    준비 중
                  </span>
                ) : (
                  <Link
                    href={plan.href}
                    className={`mt-8 flex h-12 items-center justify-center rounded-full text-[15px] font-semibold transition-colors ${plan.highlight
                        ? "bg-primary-500 text-white shadow-[0_4px_16px_rgba(13,148,136,0.25)] hover:bg-primary-600"
                        : "border border-[#E4E4E7] text-[#1f1e30] hover:bg-gray-50"
                      }`}
                  >
                    {plan.cta}
                  </Link>
                )}
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
            당신의 이야기가,
            <br />
            가장 완벽한 대본입니다.
          </h2>
          <p className="mt-5 text-[17px] leading-relaxed text-[#52525B]">
            남의 삶을 흉내내지 마세요.
            <br />
            내 삶의 무대에서, 가장 나답게 말하세요.
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
            카드 등록 없이 무료로 시작할 수 있습니다
          </p>
        </div>
      </section>
    </>
  );
}
