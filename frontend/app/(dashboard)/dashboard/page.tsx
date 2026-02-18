import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "대시보드",
};

export default function DashboardPage() {
  return (
    <div>
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">대시보드</h1>
        <Badge variant="default">Beta</Badge>
      </div>
      <p className="mt-2 text-foreground-secondary">
        학습 현황과 진도를 확인하세요.
      </p>

      {/* 플레이스홀더 카드 */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { title: "오늘의 학습", value: "준비 중" },
          { title: "현재 목표 등급", value: "IM2" },
          { title: "학습 일수", value: "0일" },
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-[var(--radius-xl)] border border-border bg-surface p-6"
          >
            <p className="text-sm text-foreground-secondary">{card.title}</p>
            <p className="mt-2 text-2xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
