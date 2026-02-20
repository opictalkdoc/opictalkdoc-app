import { ImmersiveHeader } from "@/components/layout/immersive-header";
import { Dumbbell, ArrowRight } from "lucide-react";

export const metadata = {
  title: "AI 튜터링 | 오픽톡닥",
};

const levels = [
  {
    level: "기초",
    desc: "기본 문장 구조와 핵심 표현을 훈련합니다",
    color: "bg-primary-50 text-primary-600 border-primary-200",
  },
  {
    level: "중급",
    desc: "다양한 상황별 답변 패턴을 훈련합니다",
    color: "bg-secondary-50 text-secondary-700 border-secondary-200",
  },
  {
    level: "고급",
    desc: "자연스러운 전환과 디테일 표현을 훈련합니다",
    color: "bg-accent-50 text-accent-600 border-accent-200",
  },
];

export default function TutoringTrainingPage() {
  return (
    <>
      <ImmersiveHeader title="AI 튜터링" backHref="/tutoring" />

      <main className="flex flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-8 sm:px-6">
          {/* 레벨 선택 */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-foreground">
              훈련 레벨 선택
            </h2>
            <p className="mt-1 text-sm text-foreground-secondary">
              AI 진단 결과에 맞는 레벨부터 시작하세요
            </p>
          </div>

          <div className="space-y-4">
            {levels.map((lv) => (
              <button
                key={lv.level}
                disabled
                className={`flex w-full items-center gap-4 rounded-[var(--radius-xl)] border p-5 text-left opacity-60 ${lv.color}`}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-white/80">
                  <Dumbbell size={22} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{lv.level}</p>
                  <p className="mt-0.5 text-sm opacity-80">{lv.desc}</p>
                </div>
                <ArrowRight size={16} className="shrink-0 opacity-50" />
              </button>
            ))}
          </div>

          {/* 안내 */}
          <div className="mt-8 rounded-[var(--radius-xl)] border border-border bg-surface p-5 text-center">
            <p className="text-sm text-foreground-secondary">
              진단과 처방이 완료되면 훈련 레벨이 활성화됩니다.
            </p>
            <p className="mt-1 text-xs text-foreground-muted">
              먼저 모의고사를 응시하고 AI 진단을 받아 주세요.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
