import { ImmersiveHeader } from "@/components/layout/immersive-header";
import { Play, Pause, SkipBack, SkipForward, Mic } from "lucide-react";

export const metadata = {
  title: "쉐도잉 훈련 | 오픽톡닥",
};

export default function ShadowingPage() {
  return (
    <>
      <ImmersiveHeader title="쉐도잉 훈련" backHref="/scripts" />

      <main className="flex flex-1 flex-col">
        {/* 콘텐츠 영역 */}
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-8 sm:px-6">
          {/* 스크립트 텍스트 영역 */}
          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="w-full rounded-[var(--radius-xl)] border border-border bg-surface p-6 sm:p-8">
              <p className="text-center text-lg font-semibold text-foreground">
                쉐도잉할 스크립트를 선택해 주세요
              </p>
              <p className="mt-2 text-center text-sm text-foreground-secondary">
                내 스크립트 목록에서 훈련할 스크립트를 선택하면
                <br />
                원어민 음성을 듣고 따라 읽을 수 있습니다.
              </p>
            </div>
          </div>

          {/* 오디오 컨트롤 */}
          <div className="mt-8 rounded-[var(--radius-xl)] border border-border bg-surface p-5">
            {/* 프로그레스 바 */}
            <div className="mb-4">
              <div className="h-1.5 rounded-full bg-surface-secondary">
                <div className="h-1.5 w-0 rounded-full bg-primary-500" />
              </div>
              <div className="mt-1.5 flex justify-between text-xs text-foreground-muted">
                <span>0:00</span>
                <span>0:00</span>
              </div>
            </div>

            {/* 재생 컨트롤 */}
            <div className="flex items-center justify-center gap-6">
              <button
                disabled
                className="text-foreground-muted opacity-50"
              >
                <SkipBack size={20} />
              </button>
              <button
                disabled
                className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-500 text-white opacity-50"
              >
                <Play size={22} className="ml-0.5" />
              </button>
              <button
                disabled
                className="text-foreground-muted opacity-50"
              >
                <SkipForward size={20} />
              </button>
            </div>

            {/* 따라 읽기 버튼 */}
            <div className="mt-4 flex justify-center">
              <button
                disabled
                className="inline-flex items-center gap-2 rounded-[var(--radius-lg)] border border-border bg-surface-secondary px-4 py-2 text-sm font-medium text-foreground-muted opacity-50"
              >
                <Mic size={14} />
                따라 읽기
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
