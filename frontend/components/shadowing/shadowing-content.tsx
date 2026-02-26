"use client";

import { useEffect, useCallback } from "react";
import { useShadowingStore } from "@/lib/stores/shadowing";
import { ShadowingStepNav } from "./shadowing-step-nav";
import { StepListen } from "./step-listen";
import { StepOverlap } from "./step-overlap";
import { StepShadow } from "./step-shadow";
import { StepRecite } from "./step-recite";
import { StepSpeak } from "./step-speak";
import type { ShadowingData } from "@/lib/actions/scripts";
import type { ShadowingStep } from "@/lib/types/scripts";
import { SHADOWING_STEP_DESCRIPTIONS } from "@/lib/types/scripts";

interface ShadowingContentProps {
  data: ShadowingData;
}

const STEP_COMPONENTS: Record<ShadowingStep, React.ComponentType> = {
  listen: StepListen,
  overlap: StepOverlap,
  shadow: StepShadow,
  recite: StepRecite,
  speak: StepSpeak,
};

const STEPS: ShadowingStep[] = ["listen", "overlap", "shadow", "recite", "speak"];

export function ShadowingContent({ data }: ShadowingContentProps) {
  const { currentStep, setStep, init, packageId } = useShadowingStore();

  // 데이터 초기화 (패키지가 다르면 리셋)
  useEffect(() => {
    if (packageId !== data.packageId) {
      init({
        packageId: data.packageId,
        scriptId: data.scriptId,
        sentences: data.sentences,
        audioUrl: data.wavUrl,
        questionText: data.questionText,
        questionKorean: data.questionKorean,
        keyExpressions: data.keyExpressions,
      });
    }
  }, [data, packageId, init]);

  // 키보드 단축키
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // 입력 필드에서는 무시
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // 1~5: Step 전환
      const num = parseInt(e.key);
      if (num >= 1 && num <= 5) {
        e.preventDefault();
        setStep(STEPS[num - 1]);
        return;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setStep]);

  const CurrentStepComponent = STEP_COMPONENTS[currentStep];

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6">
      {/* Step 네비게이션 */}
      <ShadowingStepNav currentStep={currentStep} onStepChange={setStep} />

      {/* Step 설명 */}
      <p className="mt-3 text-center text-xs text-foreground-muted">
        {SHADOWING_STEP_DESCRIPTIONS[currentStep]}
      </p>

      {/* Step 콘텐츠 */}
      <div className="mt-5">
        <CurrentStepComponent />
      </div>

      {/* 키보드 단축키 힌트 */}
      <div className="mt-6 flex justify-center">
        <p className="text-xs text-foreground-muted/60">
          키보드 1~5로 단계 전환 가능
        </p>
      </div>
    </div>
  );
}
