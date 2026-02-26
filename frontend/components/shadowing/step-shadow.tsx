"use client";

import { useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ArrowUpCircle,
} from "lucide-react";
import { ShadowingPlayer } from "./shadowing-player";
import { useShadowingStore, type TextHintLevel } from "@/lib/stores/shadowing";

const ROUND_LABELS: Record<number, string> = {
  1: "라운드 1: 전체 텍스트 보며 따라 읽기",
  2: "라운드 2: 첫 단어만 보고 따라 읽기",
  3: "라운드 3: 텍스트 없이 따라 읽기",
};

// 텍스트 힌트 레벨에 따라 문장 표시
function renderHintedText(text: string, hintLevel: TextHintLevel): string {
  switch (hintLevel) {
    case "full":
      return text;
    case "first-word": {
      const words = text.split(" ");
      if (words.length <= 1) return text;
      return words[0] + " " + words.slice(1).map(() => "___").join(" ");
    }
    case "hidden":
      return "• • • • •";
  }
}

export function StepShadow() {
  const {
    sentences,
    shadowIndex,
    shadowRound,
    shadowHintLevel,
    shadowCompleted,
    setShadowIndex,
    markShadowCompleted,
    nextShadowRound,
  } = useShadowingStore();

  const currentSentence = sentences[shadowIndex];
  const isCompleted = shadowCompleted.includes(shadowIndex);
  const allCompleted = sentences.length > 0 && shadowCompleted.length >= sentences.length;
  const progress =
    sentences.length > 0
      ? Math.round((shadowCompleted.length / sentences.length) * 100)
      : 0;

  const handleSentenceEnd = useCallback(() => {
    markShadowCompleted(shadowIndex);
  }, [shadowIndex, markShadowCompleted]);

  const goPrev = useCallback(() => {
    if (shadowIndex > 0) setShadowIndex(shadowIndex - 1);
  }, [shadowIndex, setShadowIndex]);

  const goNext = useCallback(() => {
    if (shadowIndex < sentences.length - 1) setShadowIndex(shadowIndex + 1);
  }, [shadowIndex, sentences.length, setShadowIndex]);

  if (!currentSentence) return null;

  return (
    <div className="space-y-4">
      {/* 라운드 정보 + 진행도 */}
      <div className="text-center">
        <p className="text-sm font-medium text-primary-600">
          {ROUND_LABELS[shadowRound] || `라운드 ${shadowRound}`}
        </p>
      </div>

      <div className="flex items-center justify-between text-xs text-foreground-muted">
        <span>
          문장 {shadowIndex + 1} / {sentences.length}
        </span>
        <span>{progress}% 완료</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-surface-secondary">
        <div
          className="h-1.5 rounded-full bg-primary-500 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 안내 */}
      <p className="text-center text-sm text-foreground-secondary">
        음성을 듣고 <span className="font-medium text-primary-600">바로 따라</span> 읽어보세요
      </p>

      {/* 현재 문장 (힌트 레벨 적용) */}
      <div
        className={`rounded-[var(--radius-xl)] border p-5 text-center ${
          isCompleted
            ? "border-green-200 bg-green-50/50"
            : "border-border bg-surface"
        }`}
      >
        <p className="text-lg font-medium leading-relaxed text-foreground">
          {renderHintedText(currentSentence.english, shadowHintLevel)}
        </p>
        {shadowHintLevel !== "hidden" && (
          <p className="mt-2 text-sm text-foreground-muted">
            {currentSentence.korean}
          </p>
        )}

        {isCompleted && (
          <div className="mt-2 flex items-center justify-center gap-1 text-xs text-green-600">
            <CheckCircle2 size={12} />
            완료
          </div>
        )}
      </div>

      {/* 문장 탐색 */}
      <div className="flex items-center justify-between">
        <button
          onClick={goPrev}
          disabled={shadowIndex === 0}
          className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-foreground-secondary transition-colors hover:bg-surface-secondary disabled:opacity-30"
        >
          <ChevronLeft size={16} />
          이전
        </button>

        {/* 전체 완료 → 다음 라운드 */}
        {allCompleted && shadowRound < 3 && (
          <button
            onClick={nextShadowRound}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary-500 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary-600"
          >
            <ArrowUpCircle size={14} />
            라운드 {shadowRound + 1}로
          </button>
        )}

        {allCompleted && shadowRound >= 3 && (
          <p className="text-sm font-medium text-green-600">
            모든 라운드 완료!
          </p>
        )}

        <button
          onClick={goNext}
          disabled={shadowIndex >= sentences.length - 1}
          className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-foreground-secondary transition-colors hover:bg-surface-secondary disabled:opacity-30"
        >
          다음
          <ChevronRight size={16} />
        </button>
      </div>

      {/* 문장별 플레이어 */}
      <ShadowingPlayer
        sentenceMode
        sentenceIndex={shadowIndex}
        onSentenceEnd={handleSentenceEnd}
      />
    </div>
  );
}
