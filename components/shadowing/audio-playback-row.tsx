"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Play, Pause } from "lucide-react";

interface AudioPlaybackRowProps {
  label: string;
  audioUrl?: string;      // URL 기반 (원어민)
  blob?: Blob;            // Blob 기반 (녹음)
  startTime?: number;     // 구간 시작 (초) — URL 모드에서 사용
  endTime?: number;       // 구간 끝 (초) — URL 모드에서 사용
  knownDuration?: number; // Blob의 실제 재생 시간 (초) — WebM duration 문제 해결용
  color?: "primary" | "blue";
}

export function AudioPlaybackRow({
  label,
  audioUrl,
  blob,
  startTime,
  endTime,
  knownDuration,
  color = "primary",
}: AudioPlaybackRowProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const blobUrlRef = useRef<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const playStartRef = useRef(0); // 재생 시작 시점 (경과 시간 추적용)

  // Blob → URL
  useEffect(() => {
    if (blob) {
      const url = URL.createObjectURL(blob);
      blobUrlRef.current = url;
      return () => {
        URL.revokeObjectURL(url);
        blobUrlRef.current = null;
      };
    }
  }, [blob]);

  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
    setProgress(0);
  }, []);

  // 언마운트 시 정리
  useEffect(() => {
    return () => {
      cleanup();
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.src = "";
      }
    };
  }, [cleanup]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      audioRef.current?.pause();
      cleanup();
      return;
    }

    const src = blob ? blobUrlRef.current : audioUrl;
    if (!src) return;

    const audio = new Audio(src);
    audioRef.current = audio;

    // 구간 재생 (원어민)
    if (startTime != null && !blob) {
      audio.currentTime = startTime;
    }

    // 재생 시간 결정
    const segmentDuration = endTime && startTime != null && !blob
      ? endTime - startTime
      : undefined;

    audio.onended = cleanup;
    audio.onerror = cleanup;

    // 재생 시작 시점 기록 (Blob의 경과 시간 추적용)
    playStartRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      if (!audio) return;

      if (segmentDuration && startTime != null) {
        // 구간 재생 모드 (원어민)
        const elapsed = audio.currentTime - startTime;
        setProgress(Math.min(1, elapsed / segmentDuration));
        if (audio.currentTime >= (endTime ?? audio.duration)) {
          audio.pause();
          cleanup();
        }
      } else if (blob && knownDuration && knownDuration > 0) {
        // Blob 모드 — knownDuration으로 프로그레스 바만 표시
        // 재생 중지는 audio.onended에 맡김 (강제 pause 하지 않음)
        const elapsed = (Date.now() - playStartRef.current) / 1000;
        setProgress(Math.min(1, elapsed / (knownDuration + 1))); // +1초 여유
      } else if (audio.duration > 0 && Number.isFinite(audio.duration)) {
        // 일반 재생 모드
        setProgress(audio.currentTime / audio.duration);
      }
    }, 50);

    audio.play().catch(cleanup);
    setIsPlaying(true);
  }, [isPlaying, audioUrl, blob, startTime, endTime, knownDuration, cleanup]);

  const btnColor = color === "blue"
    ? "bg-blue-500 hover:bg-blue-600"
    : "bg-primary-500 hover:bg-primary-600";

  const barColor = color === "blue" ? "bg-blue-400" : "bg-primary-400";

  return (
    <div className="flex items-center gap-2.5">
      <button
        onClick={togglePlay}
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white transition-colors ${btnColor}`}
      >
        {isPlaying ? <Pause size={11} /> : <Play size={11} className="ml-px" />}
      </button>
      <span className="w-12 shrink-0 text-[11px] font-medium text-foreground-secondary">{label}</span>
      <div className="h-1 flex-1 overflow-hidden rounded-full bg-surface-secondary">
        <div
          className={`h-1 rounded-full ${barColor} transition-[width] duration-100`}
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
