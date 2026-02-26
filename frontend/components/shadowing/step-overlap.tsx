"use client";

import { useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import { ShadowingPlayer } from "./shadowing-player";
import { useShadowingStore } from "@/lib/stores/shadowing";

export function StepOverlap() {
  const {
    sentences,
    overlapIndex,
    overlapCompleted,
    overlapRepeatCount,
    setOverlapIndex,
    markOverlapCompleted,
    incrementOverlapRepeat,
  } = useShadowingStore();

  const currentSentence = sentences[overlapIndex];
  const isCompleted = overlapCompleted.includes(overlapIndex);
  const progress =
    sentences.length > 0
      ? Math.round((overlapCompleted.length / sentences.length) * 100)
      : 0;

  const handleSentenceEnd = useCallback(() => {
    incrementOverlapRepeat();
    // 2회 반복 후 자동 완료 표시
    if (overlapRepeatCount >= 1) {
      markOverlapCompleted(overlapIndex);
    }
  }, [overlapRepeatCount, overlapIndex, incrementOverlapRepeat, markOverlapCompleted]);

  const goPrev = useCallback(() => {
    if (overlapIndex > 0) setOverlapIndex(overlapIndex - 1);
  }, [overlapIndex, setOverlapIndex]);

  const goNext = useCallback(() => {
    if (overlapIndex < sentences.length - 1) setOverlapIndex(overlapIndex + 1);
  }, [overlapIndex, sentences.length, setOverlapIndex]);

  if (!currentSentence) return null;

  return (
    <div className="space-y-4">
      {/* 진행도 */}
      <div className="flex items-center justify-between text-xs text-foreground-muted">
        <span>
          문장 {overlapIndex + 1} / {sentences.length}
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
        음성을 듣고 <span className="font-medium text-primary-600">텍스트를 보며 함께</span> 읽어보세요
      </p>

      {/* 현재 문장 */}
      <div
        className={`rounded-[var(--radius-xl)] border p-5 text-center ${
          isCompleted
            ? "border-green-200 bg-green-50/50"
            : "border-primary-200 bg-primary-50/30"
        }`}
      >
        <p className="text-lg font-medium leading-relaxed text-foreground">
          {currentSentence.english}
        </p>
        <p className="mt-2 text-sm text-foreground-secondary">
          {currentSentence.korean}
        </p>

        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-foreground-muted">
          <RotateCcw size={12} />
          반복 {overlapRepeatCount}회
          {isCompleted && (
            <span className="ml-2 flex items-center gap-0.5 text-green-600">
              <CheckCircle2 size={12} />
              완료
            </span>
          )}
        </div>
      </div>

      {/* 문장 탐색 */}
      <div className="flex items-center justify-between">
        <button
          onClick={goPrev}
          disabled={overlapIndex === 0}
          className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-foreground-secondary transition-colors hover:bg-surface-secondary disabled:opacity-30"
        >
          <ChevronLeft size={16} />
          이전
        </button>

        {!isCompleted && (
          <button
            onClick={() => markOverlapCompleted(overlapIndex)}
            className="inline-flex items-center gap-1 rounded-lg bg-green-100 px-3 py-1.5 text-xs font-medium text-green-700 transition-colors hover:bg-green-200"
          >
            <CheckCircle2 size={14} />
            완료 표시
          </button>
        )}

        <button
          onClick={goNext}
          disabled={overlapIndex >= sentences.length - 1}
          className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-foreground-secondary transition-colors hover:bg-surface-secondary disabled:opacity-30"
        >
          다음
          <ChevronRight size={16} />
        </button>
      </div>

      {/* 문장별 플레이어 */}
      <ShadowingPlayer
        sentenceMode
        sentenceIndex={overlapIndex}
        onSentenceEnd={handleSentenceEnd}
        showSpeedControl
      />

      {/* 문장 미니맵 */}
      <div className="flex flex-wrap justify-center gap-1.5">
        {sentences.map((_, i) => (
          <button
            key={i}
            onClick={() => setOverlapIndex(i)}
            className={`flex h-6 w-6 items-center justify-center rounded text-xs font-medium transition-colors ${
              i === overlapIndex
                ? "bg-primary-500 text-white"
                : overlapCompleted.includes(i)
                  ? "bg-green-100 text-green-700"
                  : "bg-surface-secondary text-foreground-muted hover:bg-surface-secondary/80"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
