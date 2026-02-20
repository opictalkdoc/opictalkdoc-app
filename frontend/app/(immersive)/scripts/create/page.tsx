import { ImmersiveHeader } from "@/components/layout/immersive-header";
import { Check } from "lucide-react";

export const metadata = {
  title: "스크립트 생성 | 오픽톡닥",
};

const steps = [
  { label: "주제 선택", active: true },
  { label: "경험 입력", active: false },
  { label: "스크립트 생성", active: false },
];

export default function ScriptCreatePage() {
  return (
    <>
      <ImmersiveHeader title="스크립트 생성" backHref="/scripts" />

      <main className="flex flex-1 flex-col">
        {/* 단계 표시 */}
        <div className="border-b border-border bg-surface px-4 py-4 sm:px-6">
          <div className="mx-auto flex max-w-3xl items-center justify-center gap-2 sm:gap-4">
            {steps.map((step, i) => (
              <div key={step.label} className="flex items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                      step.active
                        ? "bg-primary-500 text-white"
                        : "border border-border bg-surface-secondary text-foreground-muted"
                    }`}
                  >
                    {step.active ? <Check size={14} /> : i + 1}
                  </div>
                  <span
                    className={`text-sm ${
                      step.active
                        ? "font-medium text-foreground"
                        : "text-foreground-muted"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className="h-px w-6 bg-border sm:w-12" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 콘텐츠 영역 */}
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-8 sm:px-6">
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-8 sm:p-12">
              <p className="text-lg font-semibold text-foreground">
                주제를 선택해 주세요
              </p>
              <p className="mt-2 text-sm text-foreground-secondary">
                준비할 주제를 선택하면 AI가 맞춤 스크립트를 생성합니다.
                <br />
                빈출 주제부터 준비하는 것을 추천드립니다.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
