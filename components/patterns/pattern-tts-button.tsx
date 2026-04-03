"use client";

import { useState, useCallback, useRef } from "react";
import { Volume2, Square } from "lucide-react";

interface PatternTtsButtonProps {
  /** MP3 파일 경로 (예: /patterns-audio/description/desc_1_01_0.mp3) */
  audioSrc: string;
  size?: "sm" | "md";
}

export function PatternTtsButton({ audioSrc, size = "md" }: PatternTtsButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlay = useCallback(() => {
    // 재생 중이면 정지
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      return;
    }

    // 기존 오디오 정리
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audio = new Audio(audioSrc);
    audio.onended = () => setIsPlaying(false);
    audio.onerror = () => setIsPlaying(false);

    audioRef.current = audio;
    setIsPlaying(true);
    audio.play().catch(() => setIsPlaying(false));
  }, [audioSrc, isPlaying]);

  const iconSize = size === "sm" ? 14 : 16;
  const btnClass =
    size === "sm"
      ? "h-7 w-7 rounded-md"
      : "h-8 w-8 rounded-lg";

  return (
    <button
      onClick={handlePlay}
      className={`${btnClass} inline-flex shrink-0 items-center justify-center transition-all ${
        isPlaying
          ? "bg-primary-100 text-primary-600"
          : "bg-surface-secondary text-foreground-muted hover:bg-primary-50 hover:text-primary-500"
      }`}
      aria-label={isPlaying ? "정지" : "듣기"}
    >
      {isPlaying ? (
        <Square size={iconSize} className="fill-current" />
      ) : (
        <Volume2 size={iconSize} />
      )}
    </button>
  );
}
