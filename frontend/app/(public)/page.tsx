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

export default function HomePage() {
  return (
    <>
      {/* 히어로 섹션 */}
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
          <div className="mt-8 flex gap-3">
            <Link
              href="/signup"
              className="inline-flex h-12 items-center justify-center rounded-[var(--radius-lg)] bg-primary-500 px-6 text-base font-medium text-white transition-colors hover:bg-primary-600"
            >
              무료로 시작하기
            </Link>
            <Link
              href="/#features"
              className="inline-flex h-12 items-center justify-center rounded-[var(--radius-lg)] border border-border px-6 text-base font-medium text-foreground transition-colors hover:bg-surface-secondary"
            >
              학습 기능 보기
            </Link>
          </div>
        </div>
      </section>

      {/* OPIc 등급 섹션 */}
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
                <Badge variant={grade.variant} className="text-sm px-3 py-1">
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

      {/* 기능 미리보기 섹션 */}
      <section id="features" className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold">학습 기능</h2>
          <p className="mt-2 text-center text-foreground-secondary">
            효과적인 OPIc 준비를 위한 핵심 기능
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "모의고사",
                desc: "실제 시험과 동일한 환경에서 연습하세요",
                icon: "📝",
              },
              {
                title: "AI 훈련소",
                desc: "AI가 실시간으로 피드백을 제공합니다",
                icon: "🤖",
              },
              {
                title: "쉐도잉",
                desc: "원어민 발화를 따라하며 발음을 개선하세요",
                icon: "🎧",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-[var(--radius-xl)] border border-border bg-surface p-6 transition-shadow hover:shadow-md"
              >
                <div className="text-3xl">{feature.icon}</div>
                <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-foreground-secondary">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
