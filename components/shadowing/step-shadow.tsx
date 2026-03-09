"use client";

import { useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Eye,
  EyeOff,
  EyeClosed,
} from "lucide-react";
import { ShadowingPlayer } from "./shadowing-player";
import { useShadowingStore, type TextHintLevel } from "@/lib/stores/shadowing";

const HINT_OPTIONS: { level: TextHintLevel; label: string; icon: React.ElementType }[] = [
  { level: "full", label: "전체 보기", icon: Eye },
  { level: "first-word", label: "첫단어만", icon: EyeOff },
  { level: "hidden", label: "숨김", icon: EyeClosed },
];

const HINT_GUIDES: Record<TextHintLevel, string> = {
  full: "텍스트를 보며 음성과 함께 읽어보세요",
  "first-word": "첫 단어만 보고 나머지를 떠올려 보세요",
  hidden: "음성만 듣고 따라 읽어보세요",
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
    shadowHintLevel,
    shadowCompleted,
    setShadowIndex,
    setShadowHintLevel,
    markShadowCompleted,
  } = useShadowingStore();

  const currentSentence = shadowIndex >= 0 && shadowIndex < sentences.length
    ? sentences[shadowIndex]
    : null;
  const isCompleted = shadowCompleted.includes(shadowIndex);
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
      {/* 텍스트 힌트 토글 */}
      <div className="flex items-center justify-center">
        <div className="inline-flex items-center rounded-full bg-surface-secondary p-0.5">
          {HINT_OPTIONS.map(({ level, label, icon: Icon }) => (
            <button
              key={level}
              onClick={() => setShadowHintLevel(level)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                shadowHintLevel === level
                  ? "bg-primary-500 text-white shadow-sm"
                  : "text-foreground-muted hover:text-foreground-secondary"
              }`}
            >
              <Icon size={13} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 진행도 */}
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
        {HINT_GUIDES[shadowHintLevel]}
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
          {currentSentence ? renderHintedText(currentSentence.english, shadowHintLevel) : "—"}
        </p>
        {shadowHintLevel === "full" && currentSentence && (
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
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={goPrev}
          disabled={shadowIndex === 0}
          className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-foreground-secondary transition-colors hover:bg-surface-secondary disabled:opacity-30"
        >
          <ChevronLeft size={16} />
          이전
        </button>

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
