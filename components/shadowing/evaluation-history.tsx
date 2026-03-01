"use client";

import { useQuery } from "@tanstack/react-query";
import { BarChart3, Clock, Trophy, ChevronRight } from "lucide-react";
import { getShadowingHistory } from "@/lib/actions/scripts";
import { TARGET_LEVEL_SHORT_LABELS } from "@/lib/types/scripts";
import type { ShadowingHistoryItem, TargetLevel } from "@/lib/types/scripts";

interface EvaluationHistoryProps {
  initialData?: ShadowingHistoryItem[];
}

export function EvaluationHistory({ initialData }: EvaluationHistoryProps) {
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["shadowing-history"],
    queryFn: async () => {
      const result = await getShadowingHistory();
      return result.data ?? [];
    },
    initialData,
    staleTime: 5 * 60 * 1000,
  });

  // 완료된 세션만 (평가 결과 있는 것)
  const completedItems = items.filter(
    (item) => item.status === "completed" && item.evaluation
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (completedItems.length === 0) {
    return (
      <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-6 text-center">
        <BarChart3 size={24} className="mx-auto text-foreground-muted" />
        <p className="mt-2 text-sm text-foreground-secondary">
          아직 평가 이력이 없습니다
        </p>
        <p className="mt-1 text-xs text-foreground-muted">
          Step 5 실전 훈련을 완료하면 여기에 기록됩니다
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <BarChart3 size={16} />
        평가 이력 ({completedItems.length}건)
      </div>

      <div className="space-y-2">
        {completedItems.map((item) => {
          const eval_ = item.evaluation!;
          const levelLabel = eval_.estimated_level
            ? TARGET_LEVEL_SHORT_LABELS[eval_.estimated_level as TargetLevel] ||
              eval_.estimated_level
            : "--";
          const date = new Date(item.started_at);
          const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;

          return (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3"
            >
              {/* 점수 */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-50">
                <span className="text-sm font-bold text-primary-600">
                  {eval_.overall_score ?? "--"}
                </span>
              </div>

              {/* 정보 */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {item.topic || item.question_korean || "실전 평가"}
                </p>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-foreground-muted">
                  <span className="flex items-center gap-0.5">
                    <Trophy size={10} />
                    {levelLabel}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Clock size={10} />
                    {item.audio_duration
                      ? `${Math.floor(item.audio_duration / 60)}:${(
                          item.audio_duration % 60
                        )
                          .toString()
                          .padStart(2, "0")}`
                      : "--"}
                  </span>
                  <span>{dateStr}</span>
                </div>
              </div>

              {/* 세부 점수 미니 바 */}
              <div className="hidden shrink-0 gap-1 sm:flex">
                {[
                  { score: eval_.pronunciation, color: "bg-blue-400" },
                  { score: eval_.fluency, color: "bg-green-400" },
                ].map(({ score, color }, idx) => (
                  <div key={idx} className="w-8">
                    <div className="h-1 overflow-hidden rounded-full bg-surface-secondary">
                      <div
                        className={`h-1 rounded-full ${color}`}
                        style={{ width: `${score ?? 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <ChevronRight
                size={14}
                className="shrink-0 text-foreground-muted"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
