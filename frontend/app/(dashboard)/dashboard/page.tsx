import Link from "next/link";
import {
  Stethoscope,
  Heart,
  Zap,
  ClipboardList,
  Headphones,
  ArrowRight,
  TrendingUp,
  Target,
  BookOpen,
  Calendar,
} from "lucide-react";

export const metadata = {
  title: "대시보드 | 오픽톡닥",
};

/* ── 데이터 ── */

const stats = [
  {
    label: "현재 플랜",
    value: "체험",
    sub: "무료",
    icon: Target,
    color: "bg-primary-50 text-primary-500",
  },
  {
    label: "남은 모의고사",
    value: "1회",
    sub: "샘플",
    icon: ClipboardList,
    color: "bg-secondary-50 text-secondary-600",
  },
  {
    label: "스크립트 생성",
    value: "무제한",
    sub: "체험판",
    icon: BookOpen,
    color: "bg-accent-50 text-accent-500",
  },
  {
    label: "연속 학습",
    value: "0일",
    sub: "시작해 보세요!",
    icon: Calendar,
    color: "bg-primary-50 text-primary-500",
  },
];

const quickActions = [
  {
    icon: ClipboardList,
    iconBg: "bg-secondary-50 text-secondary-600",
    title: "모의고사",
    desc: "실전처럼 연습하고 AI가 진단해 줘요",
    href: "#",
    soon: true,
  },
  {
    icon: Stethoscope,
    iconBg: "bg-primary-50 text-primary-500",
    title: "톡닥이 — AI 진단",
    desc: "발음·억양·문법을 정밀 분석해요",
    href: "#",
    soon: true,
  },
  {
    icon: Zap,
    iconBg: "bg-secondary-50 text-secondary-600",
    title: "뚝딱이 — 스크립트",
    desc: "키워드만 넣으면 답변을 뚝딱 만들어요",
    href: "#",
    soon: true,
  },
  {
    icon: Headphones,
    iconBg: "bg-accent-50 text-accent-500",
    title: "쉐도잉 훈련",
    desc: "원어민 발화를 따라하며 체화해요",
    href: "#",
    soon: true,
  },
];

const learningSteps = [
  {
    step: 1,
    title: "레벨 테스트",
    desc: "현재 스피킹 실력을 AI가 진단합니다",
    done: false,
  },
  {
    step: 2,
    title: "맞춤 스크립트 생성",
    desc: "내 경험을 기반으로 영어 답변을 만듭니다",
    done: false,
  },
  {
    step: 3,
    title: "체화 훈련",
    desc: "쉐도잉과 반복 연습으로 입에 붙입니다",
    done: false,
  },
  {
    step: 4,
    title: "실전 모의고사",
    desc: "실제 시험과 동일한 환경에서 연습합니다",
    done: false,
  },
];

/* ── 페이지 ── */

export default function DashboardPage() {
  return (
    <div className="space-y-8 pb-8 pt-2 lg:pt-0">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          학습 대시보드
        </h1>
        <p className="mt-1 text-foreground-secondary">
          오픽톡닥과 함께 OPIc 목표 등급을 달성해 보세요.
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-[var(--radius-xl)] border border-border bg-surface p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-foreground-secondary">{s.label}</p>
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-[var(--radius-lg)] ${s.color}`}
              >
                <s.icon size={18} />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-foreground">{s.value}</p>
            <p className="mt-0.5 text-xs text-foreground-muted">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* 퀵 액션 */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">학습 시작하기</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {quickActions.map((a) => (
            <div
              key={a.title}
              className="group relative flex items-start gap-4 rounded-[var(--radius-xl)] border border-border bg-surface p-5 transition-all hover:border-border-hover hover:shadow-[var(--shadow-card)]"
            >
              <div
                className={`icon-container flex-shrink-0 ${a.iconBg}`}
              >
                <a.icon size={22} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{a.title}</h3>
                  {a.soon && (
                    <span className="rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-medium text-primary-600">
                      준비 중
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-foreground-secondary">
                  {a.desc}
                </p>
              </div>
              <ArrowRight
                size={16}
                className="mt-1 flex-shrink-0 text-foreground-muted transition-transform group-hover:translate-x-1 group-hover:text-primary-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 학습 로드맵 + 3T 시스템 */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* 학습 로드맵 */}
        <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-6 lg:col-span-3">
          <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
            <TrendingUp size={20} className="text-primary-500" />
            학습 로드맵
          </h2>
          <p className="mt-1 text-sm text-foreground-secondary">
            4단계를 거쳐 OPIc 목표 등급을 달성합니다
          </p>
          <div className="mt-5 space-y-4">
            {learningSteps.map((ls, i) => (
              <div key={ls.step} className="flex items-start gap-4">
                {/* 스텝 번호 + 연결선 */}
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                      ls.done
                        ? "bg-primary-500 text-white"
                        : "border-2 border-border bg-surface-secondary text-foreground-muted"
                    }`}
                  >
                    {ls.step}
                  </div>
                  {i < learningSteps.length - 1 && (
                    <div className="mt-1 h-8 w-px bg-border" />
                  )}
                </div>
                {/* 내용 */}
                <div className="pb-2">
                  <p className="font-semibold text-foreground">{ls.title}</p>
                  <p className="text-sm text-foreground-secondary">{ls.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3T 시스템 */}
        <div className="space-y-4 lg:col-span-2">
          <h2 className="text-lg font-bold text-foreground">3T 시스템</h2>
          {[
            {
              icon: Stethoscope,
              name: "톡닥이",
              role: "AI 주치의",
              desc: "실력을 정확히 진단해 줄게",
              color: "border-l-primary-400 bg-primary-50/50",
              iconColor: "text-primary-500",
            },
            {
              icon: Heart,
              name: "토닥이",
              role: "페이스메이커",
              desc: "틀려도 괜찮아, 다시 해보자",
              color: "border-l-accent-400 bg-accent-50/50",
              iconColor: "text-accent-500",
            },
            {
              icon: Zap,
              name: "뚝딱이",
              role: "만능 도구",
              desc: "고민할 시간에 답을 줄게",
              color: "border-l-secondary-400 bg-secondary-50/50",
              iconColor: "text-secondary-600",
            },
          ].map((t) => (
            <div
              key={t.name}
              className={`rounded-[var(--radius-xl)] border border-border border-l-4 ${t.color} p-4`}
            >
              <div className="flex items-center gap-3">
                <t.icon size={20} className={t.iconColor} />
                <div>
                  <p className="font-semibold text-foreground">
                    {t.name}{" "}
                    <span className="text-sm font-normal text-foreground-secondary">
                      — {t.role}
                    </span>
                  </p>
                  <p className="text-sm text-foreground-secondary">
                    &ldquo;{t.desc}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* 요금제 업그레이드 CTA */}
          <div className="rounded-[var(--radius-xl)] border border-primary-200 bg-gradient-to-br from-primary-50 to-primary-100/50 p-5">
            <p className="text-sm font-semibold text-primary-700">
              더 많은 학습이 필요하신가요?
            </p>
            <p className="mt-1 text-xs text-primary-600/80">
              베이직 플랜으로 업그레이드하면 실전 모의고사 3회 + 스크립트 30회를
              이용할 수 있어요.
            </p>
            <Link
              href="/pricing"
              className="mt-3 inline-flex items-center gap-1 rounded-full bg-primary-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-600"
            >
              요금제 보기
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
