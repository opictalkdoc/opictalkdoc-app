"use client";

// 종합 탭: S1(등급 스냅샷) + S2(FACT 영역) + S4(로드맵) + CTA
import {
  TrendingUp,
  ArrowRight,
  BarChart3,
  AlertTriangle,
  Map,
  Target,
  Zap,
} from "lucide-react";
import type {
  MockTestReport,
  MockExamHistoryItem,
  OpicLevel,
  CoachingReportV3,
} from "@/lib/types/mock-exam";
import {
  OPIC_LEVEL_DESC,
  FACT_LABELS,
} from "@/lib/types/mock-exam";
import { getLevelDiff, TYPE_MAP_KO, CATEGORY_KO } from "./shared-helpers";

interface OverviewTabProps {
  report: MockTestReport;
  coaching: CoachingReportV3 | null;
  sessionDate: string;
  mode: string;
  previousResult?: MockExamHistoryItem | null;
}

export function OverviewTab({
  report,
  coaching,
  sessionDate,
  mode,
  previousResult,
}: OverviewTabProps) {
  const snapshot = coaching?.snapshot;
  const levelDiff = getLevelDiff(
    report.final_level,
    previousResult?.final_level ?? null,
  );
  const ge = coaching?.grade_explanation;
  const roadmap = coaching?.roadmap;
  const recommendation = coaching?.training_recommendation;

  return (
    <div className="space-y-4">
      {/* ═══ S1: 결과 스냅샷 ═══ */}
      <div className="rounded-xl border border-border bg-surface p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">모의고사 결과</h3>
          <span className="text-xs text-foreground-muted">
            {new Date(sessionDate).toLocaleDateString("ko-KR")} ·{" "}
            {mode === "training" ? "훈련" : "실전"}
          </span>
        </div>

        {/* 등급 배지 */}
        <div className="flex flex-col items-center">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary-50 ring-4 ring-primary-100 sm:h-24 sm:w-24">
            <span className="text-2xl font-bold text-primary-600 sm:text-3xl">
              {report.final_level || "—"}
            </span>
            {levelDiff?.direction === "up" && (
              <div className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-green-500">
                <TrendingUp size={14} className="text-white" />
              </div>
            )}
          </div>

          <p className="mt-2 text-sm text-foreground-secondary text-center">
            {snapshot?.grade_interpretation ||
              (report.final_level ? OPIC_LEVEL_DESC[report.final_level as OpicLevel] : "등급 미산출")}
          </p>

          {report.target_level && report.final_level && (
            <div className="mt-1.5 flex items-center gap-2 text-xs text-foreground-muted">
              <span>{report.final_level}</span>
              <ArrowRight size={10} />
              <span className="font-medium text-primary-500">{report.target_level}</span>
              <span>(목표)</span>
            </div>
          )}

          {report.total_score != null && (
            <p className="mt-2 text-3xl font-bold text-foreground">
              {Number(report.total_score ?? 0).toFixed(1)}
              <span className="text-base font-normal text-foreground-muted"> / 100</span>
            </p>
          )}
        </div>

        {/* 한줄 총평 */}
        {snapshot?.headline && (
          <div className="mt-4 rounded-lg bg-surface-secondary/50 p-3">
            <p className="text-sm leading-relaxed text-foreground">{snapshot.headline}</p>
          </div>
        )}

        {/* 진단 태그 */}
        {snapshot?.diagnosis_tags && snapshot.diagnosis_tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5 justify-center">
            {snapshot.diagnosis_tags.map((tag, i) => (
              <span
                key={i}
                className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-600"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 이전 비교 */}
        {previousResult && previousResult.final_level && (
          <div className="mt-4 rounded-lg border border-primary-100 bg-primary-50/30 p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground-secondary">이전 대비</span>
              <div className="flex items-center gap-2">
                <span className="text-foreground-muted">{previousResult.final_level}</span>
                <ArrowRight size={12} className="text-foreground-muted" />
                <span className="font-bold text-foreground">{report.final_level}</span>
                {levelDiff && levelDiff.direction !== "same" && (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${
                      levelDiff.direction === "up"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-500"
                    }`}
                  >
                    {levelDiff.direction === "up" ? "+" : ""}{levelDiff.diff}단계
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═══ S2: 왜 이 등급인지 ═══ */}
      {ge && (
        <div className="rounded-xl border border-border bg-surface p-4 sm:p-6">
          <h4 className="flex items-center gap-2 font-semibold text-foreground mb-4">
            <BarChart3 size={16} className="text-primary-500" />
            왜 이 등급인지
          </h4>

          <div className="space-y-3">
            {(["F", "A", "C", "T"] as const).map((key) => {
              const field = `score_${key.toLowerCase()}` as keyof typeof report;
              const value = Number(report[field]) || 0;
              const interpretation = ge.fact_interpretation?.[key];
              return (
                <div key={key}>
                  <div className="flex items-center gap-3">
                    <span className="w-20 text-xs text-foreground-secondary">{FACT_LABELS[key]}</span>
                    <div className="flex-1">
                      <div className="h-2.5 rounded-full bg-surface-secondary">
                        <div
                          className="h-2.5 rounded-full bg-primary-500 transition-all"
                          style={{ width: `${(value / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="w-10 text-right text-sm font-medium text-foreground">{value.toFixed(1)}</span>
                  </div>
                  {interpretation && (
                    <p className="mt-0.5 ml-[calc(5rem+0.75rem)] text-xs text-foreground-muted leading-relaxed">
                      {interpretation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {ge.difficulty_interpretation && (
            <div className="mt-4 rounded-lg bg-surface-secondary/50 p-3">
              <div className="flex gap-4 mb-1.5 text-xs text-foreground-secondary">
                <span>기초 달성도: <strong className="text-foreground">{((Number(report.int_pass_rate) || 0) * 100).toFixed(0)}%</strong></span>
                <span>심화 달성도: <strong className="text-foreground">{((Number(report.adv_pass_rate) || 0) * 100).toFixed(0)}%</strong></span>
              </div>
              <p className="text-xs text-foreground-muted">{ge.difficulty_interpretation}</p>
            </div>
          )}

          <p className="mt-2 text-xs text-foreground-muted">* Q1 자기소개는 평가 제외</p>

          {ge.grade_blockers && ge.grade_blockers.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-medium text-foreground mb-2 flex items-center gap-1.5">
                <AlertTriangle size={12} className="text-yellow-500" />
                등급 결정 핵심 사유
              </p>
              <ol className="space-y-1.5">
                {ge.grade_blockers.map((b, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-yellow-100 text-[11px] font-bold text-yellow-700">
                      {i + 1}
                    </span>
                    <span className="text-xs text-foreground-secondary leading-relaxed">{b}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}

      {/* ═══ S4: 목표 등급 로드맵 ═══ */}
      {roadmap && (
        <div className="rounded-xl border border-border bg-surface p-4 sm:p-6">
          <h4 className="flex items-center gap-2 font-semibold text-foreground mb-4">
            <Map size={16} className="text-primary-500" />
            목표 등급 로드맵
          </h4>

          <div className="flex items-center justify-center gap-2 mb-4 text-sm">
            <span className="rounded-lg bg-surface-secondary px-3 py-1.5 font-bold text-foreground">
              {report.final_level || "—"}
            </span>
            <ArrowRight size={16} className="text-primary-400" />
            <span className="rounded-lg bg-primary-50 px-3 py-1.5 font-bold text-primary-600 ring-2 ring-primary-200">
              {roadmap.current_to_next.split("→")[1]?.trim() || report.target_level || "—"}
            </span>
            {roadmap.next_to_target && (
              <>
                <ArrowRight size={16} className="text-foreground-muted" />
                <span className="rounded-lg bg-surface-secondary px-3 py-1.5 font-medium text-foreground-secondary">
                  {report.target_level || roadmap.next_to_target.split("→")[1]?.trim() || "—"}
                </span>
              </>
            )}
          </div>

          {roadmap.personal_blockers && roadmap.personal_blockers.length > 0 && (
            <div className="rounded-lg bg-yellow-50/50 p-3 mb-3">
              <p className="text-xs font-medium text-yellow-700 mb-1.5">지금 넘어야 할 장벽</p>
              <ul className="space-y-1">
                {roadmap.personal_blockers.map((b, i) => (
                  <li key={i} className="text-xs text-foreground-secondary flex items-start gap-1.5">
                    <AlertTriangle size={10} className="shrink-0 mt-0.5 text-yellow-500" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {roadmap.long_term_goals && roadmap.long_term_goals.length > 0 && (
            <div className="rounded-lg bg-primary-50/50 p-3">
              <p className="text-xs font-medium text-primary-600 mb-1.5">장기 목표</p>
              <ul className="space-y-1">
                {roadmap.long_term_goals.map((g, i) => (
                  <li key={i} className="text-xs text-foreground-secondary flex items-start gap-1.5">
                    <Target size={10} className="shrink-0 mt-0.5 text-primary-400" />
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* ═══ CTA ═══ */}
      {recommendation && (
        <div className="rounded-xl border-2 border-primary-200 bg-primary-50/30 p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100">
              <Zap size={20} className="text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-foreground mb-1">{recommendation.course_title}</h4>
              <div className="flex flex-wrap gap-2 text-xs text-foreground-secondary mb-3">
                <span>하루 {recommendation.estimated_daily_minutes}분</span>
                <span>·</span>
                <span>{recommendation.session_count}회 세션</span>
              </div>
              {recommendation.focus_areas && recommendation.focus_areas.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {recommendation.focus_areas.map((tag) => (
                    <span key={tag} className="rounded-full bg-primary-100 px-2 py-0.5 text-[11px] font-medium text-primary-700">
                      {TYPE_MAP_KO[tag] || CATEGORY_KO[tag] || tag}
                    </span>
                  ))}
                </div>
              )}
              <a
                href="/tutoring?tab=prescription"
                className="flex items-center justify-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-600 transition-colors"
              >
                <Zap size={14} />
                맞춤 훈련 시작하기
                <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
