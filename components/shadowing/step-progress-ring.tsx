"use client";

interface StepProgressRingProps {
  progress: number; // 0-1
  size?: number;
  strokeWidth?: number;
}

export function StepProgressRing({
  progress,
  size = 16,
  strokeWidth = 2,
}: StepProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.max(0, Math.min(1, progress)));

  return (
    <svg width={size} height={size} className="shrink-0 -rotate-90">
      {/* 배경 원 */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-border"
      />
      {/* 진행률 원 */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="text-primary-500 transition-all duration-500"
      />
    </svg>
  );
}
