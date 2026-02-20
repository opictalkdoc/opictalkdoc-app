import { ImmersiveHeader } from "@/components/layout/immersive-header";
import { Mic, Clock, ChevronRight } from "lucide-react";

export const metadata = {
  title: "모의고사 | 오픽톡닥",
};

export default function MockExamSessionPage() {
  return (
    <>
      <ImmersiveHeader title="모의고사" backHref="/mock-exam" />

      <main className="flex flex-1 flex-col">
        {/* 진행 바 */}
        <div className="border-b border-border bg-surface px-4 py-3 sm:px-6">
          <div className="mx-auto flex max-w-3xl items-center justify-between text-sm">
            <span className="text-foreground-secondary">
              문항 <span className="font-bold text-foreground">1</span> / 15
            </span>
            <div className="flex items-center gap-1.5 text-foreground-muted">
              <Clock size={14} />
              <span>00:00</span>
            </div>
          </div>
          <div className="mx-auto mt-2 max-w-3xl">
            <div className="h-1.5 rounded-full bg-surface-secondary">
              <div className="h-1.5 w-[6.67%] rounded-full bg-primary-500 transition-all" />
            </div>
          </div>
        </div>

        {/* 문제 영역 */}
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-8 sm:px-6">
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-8 sm:p-12">
              <p className="text-lg font-semibold text-foreground">
                모의고사 준비 화면
              </p>
              <p className="mt-2 text-sm text-foreground-secondary">
                서베이 선택 후 시험이 시작됩니다.
                <br />
                마이크 권한을 허용해 주세요.
              </p>
            </div>
          </div>

          {/* 녹음 버튼 영역 */}
          <div className="flex flex-col items-center gap-4 pb-6 pt-8">
            <button
              disabled
              className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-500 text-white opacity-50 shadow-[var(--shadow-primary)]"
            >
              <Mic size={28} />
            </button>
            <p className="text-xs text-foreground-muted">
              시험 시작 후 녹음 버튼을 눌러 답변하세요
            </p>
            <button
              disabled
              className="inline-flex items-center gap-1 rounded-[var(--radius-lg)] bg-surface-secondary px-4 py-2 text-sm font-medium text-foreground-muted"
            >
              다음 문항
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
