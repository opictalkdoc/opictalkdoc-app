"use client";

import { useShadowingStore } from "@/lib/stores/shadowing";

interface SentenceMasteryDotsProps {
  onDotClick: (index: number) => void;
}

export function SentenceMasteryDots({ onDotClick }: SentenceMasteryDotsProps) {
  const { sentences, shadowIndex, shadowPlayCounts } = useShadowingStore();

  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 px-2">
      {sentences.map((_, i) => {
        const count = shadowPlayCounts[i] ?? 0;
        const isActive = i === shadowIndex;

        // 마스터리 색상: 0회=회색, 1-2회=주황, 3+회=초록
        let dotColor = "bg-border";
        if (count >= 3) dotColor = "bg-green-400";
        else if (count >= 1) dotColor = "bg-amber-400";

        return (
          <button
            key={i}
            onClick={() => onDotClick(i)}
            className={`h-2 w-2 rounded-full transition-all ${dotColor} ${
              isActive ? "scale-150 ring-2 ring-primary-300 ring-offset-1" : "hover:scale-125"
            }`}
            title={`문장 ${i + 1} (${count}회 연습)`}
          />
        );
      })}
    </div>
  );
}
