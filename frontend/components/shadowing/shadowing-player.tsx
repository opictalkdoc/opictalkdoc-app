"use client";

import { useRef, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
} from "lucide-react";
import { useShadowingStore } from "@/lib/stores/shadowing";

interface ShadowingPlayerProps {
  // 문장별 모드 (Step 2/3): 특정 문장만 재생
  sentenceMode?: boolean;
  sentenceIndex?: number;
  onSentenceEnd?: () => void;
  // 전체 재생 모드 (Step 1)
  onTimeUpdate?: (time: number) => void;
  showSpeedControl?: boolean;
}

export function ShadowingPlayer({
  sentenceMode = false,
  sentenceIndex,
  onSentenceEnd,
  onTimeUpdate,
  showSpeedControl = false,
}: ShadowingPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const {
    audioUrl,
    sentences,
    isPlaying,
    currentTime,
    playbackRate,
    setPlaying,
    setCurrentTime,
    setPlaybackRate,
  } = useShadowingStore();

  // 오디오 시간 업데이트
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    function handleTimeUpdate() {
      const t = audio!.currentTime;
      setCurrentTime(t);
      onTimeUpdate?.(t);

      // 문장별 모드: 문장 끝에 도달하면 정지
      if (sentenceMode && sentenceIndex != null) {
        const sent = sentences[sentenceIndex];
        if (sent && t >= sent.end) {
          audio!.pause();
          setPlaying(false);
          onSentenceEnd?.();
        }
      }
    }

    function handleEnded() {
      setPlaying(false);
    }

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [sentenceMode, sentenceIndex, sentences, setCurrentTime, setPlaying, onSentenceEnd, onTimeUpdate]);

  // 재생 속도 동기화
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;

    if (isPlaying) {
      audio.pause();
      setPlaying(false);
    } else {
      // 문장별 모드: 해당 문장 시작 지점으로 이동
      if (sentenceMode && sentenceIndex != null) {
        const sent = sentences[sentenceIndex];
        if (sent) {
          audio.currentTime = sent.start;
        }
      }
      audio.play().catch(console.error);
      setPlaying(true);
    }
  }, [isPlaying, audioUrl, sentenceMode, sentenceIndex, sentences, setPlaying]);

  const skipForward = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (sentenceMode) return; // 문장별 모드에서는 비활성
    audio.currentTime = Math.min(audio.currentTime + 5, audio.duration);
  }, [sentenceMode]);

  const skipBackward = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (sentenceMode) return;
    audio.currentTime = Math.max(audio.currentTime - 5, 0);
  }, [sentenceMode]);

  const restart = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (sentenceMode && sentenceIndex != null) {
      const sent = sentences[sentenceIndex];
      if (sent) audio.currentTime = sent.start;
    } else {
      audio.currentTime = 0;
    }
  }, [sentenceMode, sentenceIndex, sentences]);

  // 프로그레스 바 계산
  const duration = audioRef.current?.duration || 0;
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  function formatTime(sec: number): string {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  return (
    <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-4">
      {/* 숨겨진 오디오 엘리먼트 */}
      {audioUrl && <audio ref={audioRef} src={audioUrl} preload="auto" />}

      {/* 프로그레스 바 */}
      <div className="mb-3">
        <div
          className="h-1.5 cursor-pointer rounded-full bg-surface-secondary"
          onClick={(e) => {
            const audio = audioRef.current;
            if (!audio || !duration) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const ratio = (e.clientX - rect.left) / rect.width;
            audio.currentTime = ratio * duration;
          }}
        >
          <div
            className="h-1.5 rounded-full bg-primary-500 transition-[width] duration-100"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="mt-1 flex justify-between text-xs text-foreground-muted">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* 재생 컨트롤 */}
      <div className="flex items-center justify-center gap-5">
        {!sentenceMode && (
          <button
            onClick={skipBackward}
            className="text-foreground-secondary transition-colors hover:text-foreground"
          >
            <SkipBack size={18} />
          </button>
        )}

        {sentenceMode && (
          <button
            onClick={restart}
            className="text-foreground-secondary transition-colors hover:text-foreground"
            title="다시 듣기"
          >
            <RotateCcw size={18} />
          </button>
        )}

        <button
          onClick={togglePlay}
          disabled={!audioUrl}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-500 text-white transition-colors hover:bg-primary-600 disabled:opacity-50"
        >
          {isPlaying ? (
            <Pause size={20} />
          ) : (
            <Play size={20} className="ml-0.5" />
          )}
        </button>

        {!sentenceMode && (
          <button
            onClick={skipForward}
            className="text-foreground-secondary transition-colors hover:text-foreground"
          >
            <SkipForward size={18} />
          </button>
        )}
      </div>

      {/* 속도 조절 */}
      {showSpeedControl && (
        <div className="mt-3 flex items-center justify-center gap-2">
          {[0.75, 1.0, 1.25, 1.5].map((rate) => (
            <button
              key={rate}
              onClick={() => setPlaybackRate(rate)}
              className={`rounded-md px-2 py-0.5 text-xs font-medium transition-colors ${
                playbackRate === rate
                  ? "bg-primary-500 text-white"
                  : "bg-surface-secondary text-foreground-muted hover:text-foreground"
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// 현재 재생 중인 문장의 인덱스를 계산하는 헬퍼
export function useActiveSentenceIndex(): number {
  const { sentences, currentTime } = useShadowingStore();
  for (let i = 0; i < sentences.length; i++) {
    if (currentTime >= sentences[i].start && currentTime < sentences[i].end) {
      return i;
    }
  }
  return -1;
}
