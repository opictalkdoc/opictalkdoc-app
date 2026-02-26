"use client";

import {
  Trophy,
  ThumbsUp,
  AlertTriangle,
  Lightbulb,
  BarChart3,
} from "lucide-react";
import type { ShadowingEvaluation } from "@/lib/types/scripts";
import { TARGET_LEVEL_LABELS } from "@/lib/types/scripts";

interface EvaluationResultProps {
  evaluation: ShadowingEvaluation;
}

const SCORE_LABELS: { key: keyof Pick<
  ShadowingEvaluation,
  "pronunciation" | "fluency" | "grammar" | "vocabulary" | "content_score"
>; label: string; color: string }[] = [
  { key: "pronunciation", label: "발음", color: "bg-blue-500" },
  { key: "fluency", label: "유창성", color: "bg-green-500" },
  { key: "grammar", label: "문법", color: "bg-purple-500" },
  { key: "vocabulary", label: "어휘", color: "bg-orange-500" },
  { key: "content_score", label: "내용", color: "bg-pink-500" },
];

export function EvaluationResult({ evaluation }: EvaluationResultProps) {
  const levelLabel =
    evaluation.estimated_level
      ? TARGET_LEVEL_LABELS[evaluation.estimated_level] || evaluation.estimated_level
      : "평가 불가";

  return (
    <div className="space-y-5">
      {/* 종합 점수 */}
      <div className="flex flex-col items-center rounded-[var(--radius-xl)] border border-primary-200 bg-primary-50/30 p-6">
        <Trophy size={28} className="text-primary-500" />
        <p className="mt-2 text-xs font-medium text-primary-600">종합 점수</p>
        <p className="mt-1 text-4xl font-bold text-foreground">
          {evaluation.overall_score ?? "--"}
          <span className="text-lg text-foreground-muted">/100</span>
        </p>
        <p className="mt-2 rounded-full bg-primary-100 px-3 py-0.5 text-sm font-semibold text-primary-700">
          {levelLabel}
        </p>
      </div>

      {/* 5영역 점수 바 */}
      <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <BarChart3 size={16} />
          영역별 점수
        </div>
        <div className="mt-4 space-y-3">
          {SCORE_LABELS.map(({ key, label, color }) => {
            const score = evaluation[key] ?? 0;
            return (
              <div key={key}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">{label}</span>
                  <span className="font-bold text-foreground">{score}</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-surface-secondary">
                  <div
                    className={`h-2 rounded-full ${color} transition-all`}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 스크립트 활용도 */}
      {evaluation.script_utilization != null && (
        <div className="flex items-center justify-between rounded-lg border border-border bg-surface p-3">
          <span className="text-sm text-foreground-secondary">
            스크립트 활용도
          </span>
          <span className="text-sm font-bold text-primary-600">
            {evaluation.script_utilization}%
          </span>
        </div>
      )}

      {/* 강점 */}
      {evaluation.strengths?.length > 0 && (
        <div className="rounded-[var(--radius-xl)] border border-green-200 bg-green-50/50 p-4">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-green-700">
            <ThumbsUp size={14} />
            잘한 점
          </div>
          <ul className="mt-2 space-y-1">
            {evaluation.strengths.map((s, i) => (
              <li key={i} className="text-sm text-green-700">
                • {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 개선점 */}
      {evaluation.weaknesses?.length > 0 && (
        <div className="rounded-[var(--radius-xl)] border border-amber-200 bg-amber-50/50 p-4">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-amber-700">
            <AlertTriangle size={14} />
            개선할 점
          </div>
          <ul className="mt-2 space-y-1">
            {evaluation.weaknesses.map((w, i) => (
              <li key={i} className="text-sm text-amber-700">
                • {w}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 학습 제안 */}
      {evaluation.suggestions?.length > 0 && (
        <div className="rounded-[var(--radius-xl)] border border-blue-200 bg-blue-50/50 p-4">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-blue-700">
            <Lightbulb size={14} />
            학습 제안
          </div>
          <ul className="mt-2 space-y-1">
            {evaluation.suggestions.map((s, i) => (
              <li key={i} className="text-sm text-blue-700">
                • {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* STT 결과 */}
      {evaluation.transcript && (
        <details className="rounded-lg border border-border bg-surface p-3">
          <summary className="cursor-pointer text-xs font-medium text-foreground-muted">
            내 발화 텍스트 보기
          </summary>
          <p className="mt-2 text-sm leading-relaxed text-foreground-secondary">
            {evaluation.transcript}
          </p>
        </details>
      )}
    </div>
  );
}
