"use client";

import { useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useShadowingStore } from "@/lib/stores/shadowing";
import { ShadowingStepNav } from "./shadowing-step-nav";
import { TrialBanner } from "@/components/trial/trial-banner";
import { TrialComplete } from "@/components/trial/trial-complete";

const StepLoadingFallback = () => <div className="animate-pulse h-64 rounded-xl bg-surface-secondary" />;
const StepListen = dynamic(() => import("./step-listen").then(m => ({ default: m.StepListen })), { loading: StepLoadingFallback });
const StepShadow = dynamic(() => import("./step-shadow").then(m => ({ default: m.StepShadow })), { loading: StepLoadingFallback });
const StepRecite = dynamic(() => import("./step-recite").then(m => ({ default: m.StepRecite })), { loading: StepLoadingFallback });
const StepSpeak = dynamic(() => import("./step-speak").then(m => ({ default: m.StepSpeak })), { loading: StepLoadingFallback });
import type { ShadowingData } from "@/lib/actions/scripts";
import type { ShadowingStep } from "@/lib/types/scripts";
import { SHADOWING_STEP_DESCRIPTIONS } from "@/lib/types/scripts";

interface ShadowingContentProps {
  data: ShadowingData;
  isTrialMode?: boolean;
}

// 진행 상태에 따른 동적 가이드 메시지
function useStepGuideMessage(isTrialMode: boolean): string {
  const {
    currentStep,
    sentences,
    listenedSentences,
    shadowPlayCounts,
    speakResult,
  } = useShadowingStore();

  return useMemo(() => {
    if (currentStep === "speak" && isTrialMode) {
      return "체험판에서는 발화 평가를 제공하지 않습니다.";
    }

    const total = sentences.length;

    if (currentStep === "listen") {
      const heard = listenedSentences.length;
      if (heard === 0) return SHADOWING_STEP_DESCRIPTIONS.listen;
      if (heard >= total * 0.8) return "모든 문장을 들었습니다 — 따라 읽기로 넘어가 보세요";
      return `잘 듣고 계세요! ${heard}/${total} 문장 청취 완료`;
    }

    if (currentStep === "shadow") {
      const mastered = Object.values(shadowPlayCounts).filter((c) => c >= 3).length;
      if (mastered === 0) return SHADOWING_STEP_DESCRIPTIONS.shadow;
      if (mastered >= total) return "모든 문장 연습 완료! 다음 단계로 넘어가 보세요";
      return `${mastered}/${total} 문장 연습 중 — 3번 이상 반복해보세요`;
    }

    if (currentStep === "recite") return SHADOWING_STEP_DESCRIPTIONS.recite;

    if (currentStep === "speak") {
      if (speakResult) return "평가가 완료되었습니다. 결과를 확인해보세요!";
      return SHADOWING_STEP_DESCRIPTIONS.speak;
    }

    return SHADOWING_STEP_DESCRIPTIONS[currentStep];
  }, [currentStep, sentences.length, listenedSentences.length, shadowPlayCounts, speakResult, isTrialMode]);
}

export function ShadowingContent({ data, isTrialMode = false }: ShadowingContentProps) {
  const { currentStep, setStep, init, packageId } = useShadowingStore();

  // persist 수동 rehydration: 렌더 중 Zustand setState 방지
  useEffect(() => {
    useShadowingStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (packageId !== data.packageId) {
      init({
        packageId: data.packageId,
        scriptId: data.scriptId,
        sentences: data.sentences,
        audioUrl: data.wavUrl,
        questionText: data.questionText,
        questionKorean: data.questionKorean,
        questionAudioUrl: data.questionAudioUrl,
        keyExpressions: data.keyExpressions,
        structureSummary: data.structureSummary,
        keySentences: data.keySentences,
      });
    }
  }, [data, packageId, init]);

  const stepDescription = useStepGuideMessage(isTrialMode);

  const renderStepContent = () => {
    switch (currentStep) {
      case "listen":  return <StepListen />;
      case "shadow":  return <StepShadow />;
      case "recite":  return <StepRecite />;
      case "speak":   return isTrialMode ? <TrialComplete type="script" /> : <StepSpeak />;
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* 고정 탭 네비게이션 */}
      <div className="shrink-0 border-b border-border bg-surface/80 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl">
          <ShadowingStepNav currentStep={currentStep} onStepChange={setStep} />
        </div>
      </div>

      {/* 스크롤 콘텐츠 영역 */}
      <div className="relative min-h-0 flex-1">
        <div className="absolute inset-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="mx-auto w-full max-w-5xl px-4 pb-8 pt-5 sm:px-6">
            {/* 체험판 배너 */}
            {isTrialMode && (
              <div className="mb-4">
                <TrialBanner />
              </div>
            )}

            {/* 단계 설명 — 동적 */}
            <p className="mb-5 text-center text-xs text-foreground-muted">
              {stepDescription}
            </p>

            {/* 단계 콘텐츠 — 전환 애니메이션 */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
