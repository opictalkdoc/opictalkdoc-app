"use client";

import { RotateCcw, ChevronRight } from "lucide-react";
import { PitchComparisonChart } from "./pitch-comparison-chart";
import { AudioPlaybackRow } from "./audio-playback-row";
import type { PronunciationScore } from "@/lib/audio/pronunciation-scorer";
import type { PitchFrame } from "@/lib/audio/pitch-extractor";

interface SentenceComparisonResultProps {
  sentenceIndex: number;
  totalSentences: number;
  score: PronunciationScore;
  nativePitch: PitchFrame[];
  userPitch: PitchFrame[];
  dtwPath: [number, number][] | null;
  recordingBlob: Blob | null;
  recordingDuration?: number;
  nativeAudioUrl: string | null;
  sentenceStart?: number;
  sentenceEnd?: number;
  onRetry: () => void;
  onNext: () => void;
}

export function SentenceComparisonResult({
  sentenceIndex,
  totalSentences,
  nativePitch,
  userPitch,
  dtwPath,
  recordingBlob,
  recordingDuration,
  nativeAudioUrl,
  sentenceStart,
  sentenceEnd,
  onRetry,
  onNext,
}: SentenceComparisonResultProps) {
  const isLastSentence = sentenceIndex >= totalSentences - 1;

  return (
    <div className="space-y-4">
      {/* 억양 비교 차트 */}
      <div className="overflow-hidden rounded-xl border border-border bg-surface p-3">
        <p className="mb-1 text-[10px] font-medium text-foreground-muted">
          억양 비교 · 문장 {sentenceIndex + 1}/{totalSentences}
        </p>
        <PitchComparisonChart nativePitch={nativePitch} userPitch={userPitch} dtwPath={dtwPath} />
      </div>

      {/* 음성 재생 비교 */}
      {(nativeAudioUrl || recordingBlob) && (
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <div className="border-b border-border px-3 py-1.5">
            <span className="text-[10px] font-semibold text-foreground-muted">음성 비교</span>
          </div>
          <div className="space-y-1 px-3 py-2.5">
            {nativeAudioUrl && (
              <AudioPlaybackRow
                label="원어민"
                audioUrl={nativeAudioUrl}
                startTime={sentenceStart}
                endTime={sentenceEnd}
                color="primary"
              />
            )}
            {recordingBlob && (
              <AudioPlaybackRow
                label="내 발음"
                blob={recordingBlob}
                knownDuration={recordingDuration}
                color="blue"
              />
            )}
          </div>
        </div>
      )}

      {/* 액션 버튼 */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onRetry}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium text-foreground-secondary transition-all hover:bg-surface-secondary active:scale-[0.98]"
        >
          <RotateCcw size={14} />
          다시 시도
        </button>
        <button
          onClick={onNext}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-600 active:scale-[0.98]"
        >
          {isLastSentence ? "완료" : "다음 문장"}
          {!isLastSentence && <ChevronRight size={14} />}
        </button>
      </div>
    </div>
  );
}
