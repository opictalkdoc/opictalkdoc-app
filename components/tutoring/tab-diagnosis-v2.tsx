"use client";

import {
  Stethoscope,
  Target,
  AlertTriangle,
  ChevronRight,
  Play,
  Shield,
  ArrowRight,
  MessageCircle,
  BarChart3,
  Loader2,
  FileWarning,
} from "lucide-react";
import { NoCreditCard } from "@/components/trial/no-credit-card";
import {
  TIER_LABELS,
  TIER_CONFIGS,
  type BottleneckResult,
  type TutoringTier,
} from "@/lib/types/tutoring-v2";
import type { DiagnosisV2Result, TutoringCreditResult } from "@/lib/actions/tutoring-v2";

/* ── Props ── */

interface TabDiagnosisV2Props {
  diagnosisData: DiagnosisV2Result | null;
  errorMessage: string | null;
  creditData: TutoringCreditResult | null;
  isStarting: boolean;
  onStartTutoring: () => void;
  onResumeSession: (sessionId: string) => void;
  hasActiveSession: boolean;
}

/* ── 진단서 스타일 공통 ── */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[15px] font-extrabold text-[#2f3644]">
      <span className="mr-1.5 text-[#2449d8]">&bull;</span>
      {children}
    </h3>
  );
}

function SectionDivider() {
  return <div className="border-b border-[#d0d7e2]" />;
}

/* ── 등급 배지 ── */

function GradeBadge({ grade }: { grade: string }) {
  return (
    <span className="inline-flex items-center justify-center rounded-full bg-primary-50 px-3 py-1 text-sm font-bold text-primary-700">
      {grade}
    </span>
  );
}

/* ── 병목 스코어 바 ── */

function BottleneckBar({
  bottleneck,
  maxScore,
}: {
  bottleneck: BottleneckResult;
  maxScore: number;
}) {
  const widthPct = maxScore > 0 ? Math.round((bottleneck.score / maxScore) * 100) : 0;

  // 순위별 컬러
  const colorMap: Record<number, { bar: string; badge: string; text: string }> = {
    1: {
      bar: "bg-primary-500",
      badge: "bg-primary-500 text-white",
      text: "text-primary-700",
    },
    2: {
      bar: "bg-secondary-500",
      badge: "bg-secondary-500 text-white",
      text: "text-secondary-700",
    },
    3: {
      bar: "bg-accent-500",
      badge: "bg-accent-500 text-white",
      text: "text-accent-700",
    },
  };

  const colors = colorMap[bottleneck.rank] ?? colorMap[3];

  return (
    <div className="rounded-xl border border-[#d0d7e2] bg-white p-4 sm:p-5">
      {/* 헤더: 순위 + 이름 + 점수 */}
      <div className="mb-3 flex items-center gap-2.5">
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${colors.badge}`}
        >
          {bottleneck.rank}
        </span>
        <span className="text-[14px] font-bold text-[#2f3644]">
          {bottleneck.drill_code.replace(/_/g, " ")}
        </span>
        <span className={`ml-auto text-sm font-semibold ${colors.text}`}>
          {bottleneck.score.toFixed(1)}점
        </span>
      </div>

      {/* 바 차트 */}
      <div className="mb-3 h-2.5 overflow-hidden rounded-full bg-[#e8ecf0]">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colors.bar}`}
          style={{ width: `${Math.max(widthPct, 5)}%` }}
        />
      </div>

      {/* 빈도 + 게이트 플래그 */}
      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-[#5f6976]">
        <span>
          15문항 중 <strong className="text-[#2f3644]">{bottleneck.frequency}</strong>
          문항에서 관찰
        </span>
        {bottleneck.gate_flag && (
          <span className="inline-flex items-center gap-0.5 rounded bg-red-50 px-1.5 py-0.5 text-[11px] font-bold text-red-600">
            <Shield size={10} />
            승급 필수 해소
          </span>
        )}
        {bottleneck.tier_relevance === "essential" && !bottleneck.gate_flag && (
          <span className="rounded bg-primary-50 px-1.5 py-0.5 text-[11px] font-bold text-primary-600">
            Tier {bottleneck.current_tier} 필수
          </span>
        )}
      </div>

      {/* 증거 인용 */}
      {bottleneck.evidence_samples && bottleneck.evidence_samples.length > 0 && (
        <div className="mt-2 space-y-1.5">
          {bottleneck.evidence_samples.slice(0, 2).map((sample, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 rounded-lg bg-[#f5f7fa] px-3 py-2"
            >
              <MessageCircle
                size={14}
                className="mt-0.5 shrink-0 text-[#8a93a1]"
              />
              <span className="text-[13px] leading-[1.7] text-[#5f6976] italic">
                &ldquo;{sample}&rdquo;
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── 메인 컴포넌트 ── */

export function TabDiagnosisV2({
  diagnosisData,
  errorMessage,
  creditData,
  isStarting,
  onStartTutoring,
  onResumeSession,
  hasActiveSession,
}: TabDiagnosisV2Props) {
  // 에러 상태 — 모의고사 미응시 등
  if (errorMessage) {
    return (
      <div className="mx-auto w-full max-w-[860px]">
        <div className="rounded-xl border border-[#d0d7e2] bg-white p-6 text-center shadow-[0_12px_36px_rgba(20,28,38,0.06)] sm:p-10">
          <FileWarning size={48} className="mx-auto mb-4 text-foreground-muted" />
          <h3 className="mb-2 text-lg font-bold text-foreground">
            진단 데이터가 없습니다
          </h3>
          <p className="text-sm leading-relaxed text-foreground-secondary">
            {errorMessage}
          </p>
        </div>
      </div>
    );
  }

  // 데이터 없으면 로딩
  if (!diagnosisData) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 size={24} className="animate-spin text-primary-500" />
      </div>
    );
  }

  const {
    tier,
    tierConfig,
    currentGrade,
    targetGrade,
    bottlenecks,
    latestSessionDate,
    latestSessionMode,
  } = diagnosisData;

  const maxScore = bottlenecks.length > 0
    ? Math.max(...bottlenecks.map((b) => b.score))
    : 1;

  const hasCredit = (creditData?.totalCredits ?? 0) > 0;

  // 날짜 포맷
  const formattedDate = (() => {
    try {
      return new Date(latestSessionDate).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return latestSessionDate;
    }
  })();

  const modeLabel = latestSessionMode === "test" ? "실전" : "훈련";

  return (
    <div className="mx-auto w-full max-w-[860px] px-0 sm:px-4">
      <div className="overflow-hidden rounded-xl border border-[#d0d7e2] bg-white shadow-[0_12px_36px_rgba(20,28,38,0.06)]">
        {/* 섹션 1: 진단 요약 */}
        <div className="px-5 py-5 sm:px-10 sm:py-6">
          <SectionTitle>진단 요약</SectionTitle>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <GradeBadge grade={currentGrade} />
            <ArrowRight size={16} className="text-foreground-muted" />
            <span className="text-sm font-medium text-foreground-secondary">
              {targetGrade ? `목표 ${targetGrade}` : "다음 등급"}
            </span>
            <span className="ml-auto text-xs text-[#8a93a1]">
              {TIER_LABELS[tier]}
            </span>
          </div>

          <p className="mt-2 text-xs text-[#8a93a1]">
            {formattedDate} {modeLabel} 모의고사 기반
          </p>

          {/* GPT 한줄 진단 */}
          {diagnosisData.bottlenecks.length > 0 && (
            <div className="mt-4 rounded-lg bg-[#f5f7fa] px-4 py-3">
              <p className="text-[14px] leading-[1.9] text-[#2f3644]">
                {/* GPT diagnosis_text가 있으면 표시, 없으면 자동 생성 요약 */}
                15문항 중{" "}
                <strong className="text-[#2449d8]">
                  {bottlenecks[0]?.frequency ?? 0}
                </strong>
                개에서{" "}
                <strong className="text-[#2449d8]">
                  {bottlenecks[0]?.drill_code.replace(/_/g, " ")}
                </strong>{" "}
                문제가 관찰되었습니다. {tierConfig.actflKey}을 위해 이 병목부터
                해결하면 다음 등급에 가까워집니다.
              </p>
            </div>
          )}
        </div>

        <SectionDivider />

        {/* 섹션 2: 현재 티어 분석 */}
        <div className="px-5 py-5 sm:px-10 sm:py-6">
          <SectionTitle>현재 티어 분석</SectionTitle>

          <div className="mt-4 rounded-lg border border-[#e8ecf0] bg-[#fafbfc] p-4">
            <div className="mb-2 flex items-center gap-2">
              <Target size={16} className="text-[#2449d8]" />
              <span className="text-[14px] font-bold text-[#2f3644]">
                {TIER_LABELS[tier]}
              </span>
            </div>

            <p className="mb-3 text-[14px] leading-[1.9] text-[#2f3644]">
              <strong>ACTFL 승급 핵심:</strong> {tierConfig.actflKey}
            </p>

            <p className="text-[14px] leading-[1.9] text-[#5f6976]">
              <strong>교수법:</strong> {tierConfig.scaffold} &mdash;{" "}
              {tierConfig.description}
            </p>
          </div>
        </div>

        <SectionDivider />

        {/* 섹션 3: 병목 분석 */}
        <div className="px-5 py-5 sm:px-10 sm:py-6">
          <SectionTitle>병목 분석</SectionTitle>

          {bottlenecks.length === 0 ? (
            <div className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-center">
              <p className="text-sm text-green-700">
                현재 티어에서 주요 병목이 발견되지 않았습니다.
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {bottlenecks.slice(0, 3).map((bn) => (
                <BottleneckBar
                  key={bn.wp_code}
                  bottleneck={bn}
                  maxScore={maxScore}
                />
              ))}
            </div>
          )}
        </div>

        <SectionDivider />

        {/* 섹션 4: CTA */}
        <div className="px-5 py-5 sm:px-10 sm:py-6">
          {!hasCredit ? (
            <NoCreditCard type="tutoring" credits={creditData?.totalCredits ?? 0} />
          ) : hasActiveSession ? (
            <button
              onClick={() => onResumeSession("")}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-primary-600"
            >
              <Play size={16} />
              이어서 진행하기
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={onStartTutoring}
              disabled={isStarting || bottlenecks.length === 0}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isStarting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  시작 중...
                </>
              ) : (
                <>
                  <Stethoscope size={16} />
                  튜터링 시작하기
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          )}

          {hasCredit && (
            <p className="mt-2 text-center text-xs text-[#8a93a1]">
              튜터링 크레딧:{" "}
              <strong className="text-[#2f3644]">
                {creditData?.totalCredits ?? 0}
              </strong>
              회 남음
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
