"use client";

import { RotateCcw, ChevronRight, Lightbulb } from "lucide-react";
import { PitchComparisonChart } from "./pitch-comparison-chart";
import type { PronunciationScore } from "@/lib/audio/pronunciation-scorer";
import type { PitchFrame } from "@/lib/audio/pitch-extractor";

interface SentenceComparisonResultProps {
  sentenceIndex: number;
  totalSentences: number;
  score: PronunciationScore;
  nativePitch: PitchFrame[];
  userPitch: PitchFrame[];
  onRetry: () => void;
  onNext: () => void;
}

const SCORE_BARS: { key: keyof Pick<PronunciationScore, "pitchScore" | "timingScore" | "energyScore">; label: string; color: string }[] = [
  { key: "pitchScore", label: "억양", color: "bg-primary-500" },
  { key: "timingScore", label: "타이밍", color: "bg-blue-500" },
  { key: "energyScore", label: "강세", color: "bg-amber-500" },
];

function scoreColor(score: number): string {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-amber-600";
  return "text-red-500";
}

export function SentenceComparisonResult({
  sentenceIndex,
  totalSentences,
  score,
  nativePitch,
  userPitch,
  onRetry,
  onNext,
}: SentenceComparisonResultProps) {
  const isLastSentence = sentenceIndex >= totalSentences - 1;

  return (
    <div className="space-y-3">
      {/* 헤더: 문장 번호 + 종합 점수 */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-foreground-secondary">
          문장 {sentenceIndex + 1} 비교 결과
        </span>
        <span className={`text-2xl font-bold tabular-nums ${scoreColor(score.overallScore)}`}>
          {score.overallScore}
          <span className="text-sm font-normal text-foreground-muted">/100</span>
        </span>
      </div>

      {/* 피치 비교 차트 */}
      <div className="rounded-lg border border-border bg-surface p-2">
        <PitchComparisonChart nativePitch={nativePitch} userPitch={userPitch} />
      </div>

      {/* 영역별 점수 바 */}
      <div className="grid grid-cols-3 gap-2">
        {SCORE_BARS.map(({ key, label, color }) => {
          const value = score[key];
          return (
            <div key={key} className="rounded-lg border border-border bg-surface p-2.5 text-center">
              <p className="text-[10px] text-foreground-muted">{label}</p>
              <p className={`text-lg font-bold tabular-nums ${scoreColor(value)}`}>{value}</p>
              <div className="mt-1 h-1 overflow-hidden rounded-full bg-surface-secondary">
                <div
                  className={`h-1 rounded-full ${color} transition-all`}
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* 피드백 */}
      {score.feedback && (
        <div className="flex items-start gap-2 rounded-lg border border-primary-200 bg-primary-50/30 px-3 py-2.5">
          <Lightbulb size={14} className="mt-0.5 shrink-0 text-primary-500" />
          <p className="text-xs leading-relaxed text-foreground-secondary">{score.feedback}</p>
        </div>
      )}

      {/* 액션 버튼 */}
      <div className="flex items-center gap-2">
        <button
          onClick={onRetry}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2.5 text-sm font-medium text-foreground-secondary transition-colors hover:bg-surface-secondary"
        >
          <RotateCcw size={14} />
          다시 시도
        </button>
        <button
          onClick={onNext}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary-500 px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-600"
        >
          {isLastSentence ? "완료" : "다음 문장"}
          {!isLastSentence && <ChevronRight size={14} />}
        </button>
      </div>
    </div>
  );
}
