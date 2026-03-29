"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Play, Pause } from "lucide-react";

interface RecordingComparisonProps {
  originalUrl: string;
  recordingBlob: Blob;
  originalLabel?: string;
  recordingLabel?: string;
}

interface AudioRowState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}

function AudioRow({
  label,
  state,
  onToggle,
}: {
  label: string;
  state: AudioRowState;
  onToggle: () => void;
}) {
  const progress = state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0;

  function formatTime(sec: number): string {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onToggle}
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
          state.isPlaying
            ? "bg-primary-500 text-white"
            : "bg-surface-secondary text-foreground-secondary hover:bg-primary-100"
        }`}
      >
        {state.isPlaying ? <Pause size={12} /> : <Play size={12} className="ml-px" />}
      </button>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[11px] font-medium text-foreground-secondary">{label}</span>
          <span className="text-[10px] tabular-nums text-foreground-muted">
            {formatTime(state.currentTime)} / {formatTime(state.duration)}
          </span>
        </div>
        <div className="h-1 rounded-full bg-surface-secondary">
          <div
            className="h-1 rounded-full bg-primary-400 transition-[width] duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export function RecordingComparison({
  originalUrl,
  recordingBlob,
  originalLabel = "원본",
  recordingLabel = "내 녹음",
}: RecordingComparisonProps) {
  const originalAudioRef = useRef<HTMLAudioElement | null>(null);
  const recordingAudioRef = useRef<HTMLAudioElement | null>(null);

  const [originalState, setOriginalState] = useState<AudioRowState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
  });

  const [recordingState, setRecordingState] = useState<AudioRowState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
  });

  // 원본 오디오 초기화 + 정리
  useEffect(() => {
    const audio = new Audio(originalUrl);
    originalAudioRef.current = audio;

    const onTime = () =>
      setOriginalState((s) => ({ ...s, currentTime: audio.currentTime }));
    const onLoaded = () =>
      setOriginalState((s) => ({ ...s, duration: audio.duration }));
    const onEnded = () =>
      setOriginalState((s) => ({ ...s, isPlaying: false }));

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.pause();
      audio.src = "";
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended", onEnded);
      originalAudioRef.current = null;
    };
  }, [originalUrl]);

  // 녹음 오디오 초기화 + 정리
  useEffect(() => {
    const url = URL.createObjectURL(recordingBlob);
    const audio = new Audio(url);
    recordingAudioRef.current = audio;

    const onTime = () =>
      setRecordingState((s) => ({ ...s, currentTime: audio.currentTime }));
    const onLoaded = () =>
      setRecordingState((s) => ({ ...s, duration: audio.duration }));
    const onEnded = () =>
      setRecordingState((s) => ({ ...s, isPlaying: false }));

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.pause();
      audio.src = "";
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended", onEnded);
      recordingAudioRef.current = null;
      URL.revokeObjectURL(url);
    };
  }, [recordingBlob]);

  const toggleOriginal = useCallback(() => {
    const audio = originalAudioRef.current;
    if (!audio) return;

    // 다른 쪽 정지
    recordingAudioRef.current?.pause();
    setRecordingState((s) => ({ ...s, isPlaying: false }));

    if (originalState.isPlaying) {
      audio.pause();
      setOriginalState((s) => ({ ...s, isPlaying: false }));
    } else {
      audio.currentTime = 0;
      audio.play().catch(console.error);
      setOriginalState((s) => ({ ...s, isPlaying: true }));
    }
  }, [originalState.isPlaying]);

  const toggleRecording = useCallback(() => {
    const audio = recordingAudioRef.current;
    if (!audio) return;

    // 다른 쪽 정지
    originalAudioRef.current?.pause();
    setOriginalState((s) => ({ ...s, isPlaying: false }));

    if (recordingState.isPlaying) {
      audio.pause();
      setRecordingState((s) => ({ ...s, isPlaying: false }));
    } else {
      audio.currentTime = 0;
      audio.play().catch(console.error);
      setRecordingState((s) => ({ ...s, isPlaying: true }));
    }
  }, [recordingState.isPlaying]);

  return (
    <div className="overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface">
      <div className="border-b border-border px-4 py-2">
        <span className="text-[11px] font-semibold text-foreground-secondary">녹음 비교</span>
      </div>
      <div className="space-y-3 p-4">
        <AudioRow
          label={originalLabel}
          state={originalState}
          onToggle={toggleOriginal}
        />
        <AudioRow
          label={recordingLabel}
          state={recordingState}
          onToggle={toggleRecording}
        />
      </div>
    </div>
  );
}
