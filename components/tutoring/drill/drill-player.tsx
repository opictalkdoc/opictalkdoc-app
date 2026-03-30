"use client";

import { useState, useCallback } from "react";
import {
  Mic,
  Square,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Loader2,
  Puzzle,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useRecorder } from "@/lib/hooks/use-recorder";
import { submitDrillAttempt, getDrillData } from "@/lib/actions/tutoring";
import type {
  TutoringDrill,
  TutoringAttempt,
  Layer1Result,
  Layer2Result,
  ChecklistItem,
} from "@/lib/types/tutoring";

// ── 레벨별 Frame 강도 설정 (설계서 D-8) ──
const LEVEL_FRAME_CONFIG: Record<string, {
  showKorean: boolean;
  showExample: boolean;
  allowSlotRescueQ1: boolean;
  allowSlotRescueQ2: boolean;
}> = {
  IL:  { showKorean: true,  showExample: true,  allowSlotRescueQ1: true,  allowSlotRescueQ2: true },
  IM1: { showKorean: true,  showExample: true,  allowSlotRescueQ1: true,  allowSlotRescueQ2: true },
  IM2: { showKorean: true,  showExample: false, allowSlotRescueQ1: true,  allowSlotRescueQ2: false },
  IM3: { showKorean: false, showExample: false, allowSlotRescueQ1: true,  allowSlotRescueQ2: false },
  IH:  { showKorean: false, showExample: false, allowSlotRescueQ1: false, allowSlotRescueQ2: false },
  AL:  { showKorean: false, showExample: false, allowSlotRescueQ1: false, allowSlotRescueQ2: false },
};

const Q_LABELS = ["학습", "적용", "독립 수행"] as const;
const HINT_LABELS: Record<string, string> = {
  full: "가이드 제공",
  reduced: "힌트 축소",
  minimal: "혼자 하기",
};

interface DrillPlayerProps {
  drill: TutoringDrill;
  drillIndex: number;
  totalDrills: number;
  attempts: TutoringAttempt[];
  targetLevel: string;
  onAttemptComplete: () => void;
  onDrillPassed: () => void;
  onAllDrillsComplete: () => void;
}

type DrillPhase = "ready" | "recording" | "submitting" | "feedback" | "slot_rescue" | "passed";

export function DrillPlayer({
  drill,
  drillIndex,
  totalDrills,
  attempts,
  targetLevel,
  onAttemptComplete,
  onDrillPassed,
  onAllDrillsComplete,
}: DrillPlayerProps) {
  const [phase, setPhase] = useState<DrillPhase>("ready");
  const [showExample, setShowExample] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rescueSlots, setRescueSlots] = useState<string[]>([]);

  const recorder = useRecorder({ maxDuration: 120, minDuration: 3 });

  const retryCount = attempts.length;
  const lastAttempt = attempts[attempts.length - 1];
  const levelConfig = LEVEL_FRAME_CONFIG[targetLevel] ?? LEVEL_FRAME_CONFIG.IM3;
  const qLabel = Q_LABELS[drillIndex - 1] ?? "";
  const hintLabel = HINT_LABELS[drill.hint_level] ?? "";

  const canSlotRescue =
    (drillIndex === 1 && levelConfig.allowSlotRescueQ1) ||
    (drillIndex === 2 && levelConfig.allowSlotRescueQ2);

  const frameSlots = (drill.frame_slots ?? []) as { slot: string; frame_en: string; label_ko: string }[];

  // ── 녹음 시작 ──
  const handleStartRecording = useCallback(async () => {
    await recorder.startRecording();
    setPhase("recording");
  }, [recorder]);

  // ── 녹음 종료 + 제출 ──
  const handleStopAndSubmit = useCallback(async () => {
    recorder.stopRecording();
    setPhase("submitting");
    setIsSubmitting(true);

    await new Promise((r) => setTimeout(r, 300));

    if (!recorder.audioBlob) {
      setPhase("ready");
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await submitDrillAttempt(drill.id, recorder.audioBlob);
      if (result.error) {
        console.error("제출 실패:", result.error);
        setPhase("ready");
      } else {
        await new Promise((r) => setTimeout(r, 4000));
        onAttemptComplete();
        const drillData = await getDrillData(drill.focus_id);
        const updatedAttempts = (drillData.data?.attempts ?? []).filter(
          (a) => a.drill_id === drill.id
        );
        const latest = updatedAttempts[updatedAttempts.length - 1];

        if (latest?.result === "pass") {
          setPhase("passed");
          setTimeout(() => {
            if (drillIndex >= totalDrills) {
              onAllDrillsComplete();
            } else {
              onDrillPassed();
            }
          }, 1500);
        } else {
          const layer1 = latest?.layer1_result as Layer1Result | null;
          if (layer1 && canSlotRescue && layer1.failed_flags.length >= 2 && retryCount >= 1) {
            setRescueSlots(layer1.failed_flags);
          }
          setPhase("feedback");
        }
      }
    } catch {
      setPhase("ready");
    } finally {
      setIsSubmitting(false);
      recorder.reset();
    }
  }, [recorder, drill.id, drill.focus_id, drillIndex, totalDrills, retryCount, canSlotRescue, onAttemptComplete, onDrillPassed, onAllDrillsComplete]);

  const handleRetry = useCallback(() => {
    setPhase("ready");
    setRescueSlots([]);
    recorder.reset();
  }, [recorder]);

  const handleSlotRescue = useCallback(() => setPhase("slot_rescue"), []);
  const handleSlotRescueComplete = useCallback(() => {
    setPhase("ready");
    setRescueSlots([]);
  }, []);

  return (
    <div className="flex flex-1 min-h-0 flex-col bg-background">
      {/* ── 상단: 진행 상태 바 ── */}
      <div className="border-b border-border bg-surface px-4 pb-3 pt-4 sm:px-6">
        <div className="mx-auto max-w-2xl">
          {/* Q 라벨 + 힌트 레벨 */}
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-primary-500 px-2 py-0.5 text-[11px] font-bold text-white">
                Q{drillIndex}
              </span>
              <span className="text-[13px] font-medium text-foreground">{qLabel}</span>
            </div>
            <span className="rounded-full border border-primary-200 bg-primary-50 px-2.5 py-0.5 text-[11px] font-medium text-primary-700">
              {hintLabel}
            </span>
          </div>

          {/* 진행 바 */}
          <div className="h-1 overflow-hidden rounded-full bg-surface-secondary">
            <div
              className="h-full rounded-full bg-primary-500 transition-all duration-500"
              style={{ width: `${(drillIndex / totalDrills) * 100}%` }}
            />
          </div>

          {/* 목표 */}
          {drill.goal && (
            <p className="mt-2 text-xs text-foreground-secondary">
              <Sparkles className="mr-1 inline h-3 w-3 text-primary-500" />
              {drill.goal}
            </p>
          )}
        </div>
      </div>

      {/* ── 메인 콘텐츠 (스크롤 영역) ── */}
      <div className="relative h-0 flex-grow">
        <div className="absolute inset-0 overflow-y-auto px-4 pb-24 pt-5 sm:px-6 max-md:[scrollbar-width:none] max-md:[&::-webkit-scrollbar]:hidden">
          <div className="mx-auto max-w-2xl space-y-4">

            {/* 질문 카드 */}
            <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-4 sm:p-5">
              <p className="text-[13px] font-medium leading-relaxed text-foreground sm:text-[15px]">
                {drill.question_english}
              </p>
              {drill.topic && (
                <span className="mt-2 inline-block rounded-full bg-surface-secondary px-2 py-0.5 text-[11px] text-foreground-muted">
                  {drill.topic}
                </span>
              )}
            </div>

            {/* Slot Rescue 모드 */}
            {phase === "slot_rescue" && (
              <SlotRescuePanel
                allSlots={frameSlots}
                failedFlags={rescueSlots}
                showKorean={levelConfig.showKorean}
                onComplete={handleSlotRescueComplete}
              />
            )}

            {/* Frame 카드 (hint_level + 레벨별 강도) */}
            {phase !== "slot_rescue" && drill.hint_level !== "minimal" && frameSlots.length > 0 && (
              <FrameCards
                slots={frameSlots}
                collapsed={drill.hint_level === "reduced"}
                showKorean={levelConfig.showKorean}
                failedSlots={phase === "feedback" ? rescueSlots : []}
              />
            )}

            {/* Q3 규칙 1줄 */}
            {phase !== "slot_rescue" && drill.hint_level === "minimal" && drill.rule_only_hint && (
              <div className="rounded-[var(--radius-lg)] border border-primary-200 bg-primary-50/50 p-3 sm:p-4">
                <p className="text-xs font-medium text-primary-700 sm:text-[13px]">
                  <Sparkles className="mr-1 inline h-3 w-3" />
                  {drill.rule_only_hint}
                </p>
              </div>
            )}

            {/* 예시 보기 (Q1 + 레벨 허용 시) */}
            {phase !== "slot_rescue" && drill.hint_level === "full" && levelConfig.showExample && drill.sample_answer && (
              <div>
                <button
                  onClick={() => setShowExample(!showExample)}
                  className="flex items-center gap-1.5 text-[11px] font-medium text-foreground-secondary transition-colors hover:text-foreground"
                >
                  {showExample ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  예시 답변 보기
                </button>
                {showExample && (
                  <div className="mt-2 rounded-[var(--radius-lg)] border border-border bg-surface-secondary p-3 sm:p-4">
                    <p className="text-xs italic leading-relaxed text-foreground-secondary sm:text-[13px]">
                      {drill.sample_answer}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 피드백 결과 */}
            {phase === "feedback" && lastAttempt && (
              <FeedbackPanel
                attempt={lastAttempt}
                canSlotRescue={canSlotRescue && rescueSlots.length >= 2}
                onRetry={handleRetry}
                onSlotRescue={handleSlotRescue}
              />
            )}

            {/* PASS 전환 */}
            {phase === "passed" && (
              <div className="rounded-[var(--radius-xl)] border border-green-200 bg-green-50 p-4 text-center">
                <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-green-500" />
                <p className="text-[13px] font-semibold text-green-700">통과!</p>
                <p className="mt-1 text-xs text-green-600">
                  {drillIndex >= totalDrills
                    ? "모든 드릴을 완료했어요"
                    : "다음 문항으로 넘어갑니다..."}
                </p>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ── 하단: 녹음 컨트롤 (고정) ── */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-border bg-surface px-4 py-[14px] sm:px-6">
        <div className="mx-auto flex max-w-2xl items-center justify-center gap-3">
          {/* 녹음 버튼 — ready 상태 */}
          {phase === "ready" && (
            <button
              onClick={handleStartRecording}
              className="flex h-10 flex-1 max-w-sm items-center justify-center gap-2 rounded-full bg-primary-500 text-[13px] font-semibold text-white transition-all hover:bg-primary-700 active:scale-[0.97]"
            >
              <Mic className="h-4 w-4" />
              답변 녹음하기
            </button>
          )}

          {/* Slot Rescue 완료 → 전체 재녹음 */}
          {phase === "slot_rescue" && (
            <button
              onClick={handleSlotRescueComplete}
              className="flex h-10 flex-1 max-w-sm items-center justify-center gap-2 rounded-full bg-primary-500 text-[13px] font-semibold text-white transition-all hover:bg-primary-700 active:scale-[0.97]"
            >
              <ArrowRight className="h-4 w-4" />
              전체 답변으로 돌아가기
            </button>
          )}

          {/* 녹음 중 */}
          {phase === "recording" && (
            <>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />
                <span className="text-sm font-medium tabular-nums text-foreground-secondary">
                  {Math.floor(recorder.duration)}초
                </span>
              </div>
              <button
                onClick={handleStopAndSubmit}
                className="flex h-10 flex-1 max-w-sm items-center justify-center gap-2 rounded-full bg-red-500 text-[13px] font-semibold text-white transition-all hover:bg-red-600 active:scale-[0.97]"
              >
                <Square className="h-3.5 w-3.5" />
                녹음 완료
              </button>
            </>
          )}

          {/* 제출/분석 중 */}
          {phase === "submitting" && (
            <div className="flex items-center gap-2 text-sm text-foreground-secondary">
              <Loader2 className="h-4 w-4 animate-spin text-primary-500" />
              답변을 분석하고 있어요...
            </div>
          )}

          {/* 피드백 후 다시 말하기 */}
          {phase === "feedback" && lastAttempt?.result !== "pass" && (
            <>
              <button
                onClick={handleRetry}
                className="flex h-10 flex-1 max-w-sm items-center justify-center gap-2 rounded-full bg-primary-500 text-[13px] font-semibold text-white transition-all hover:bg-primary-700 active:scale-[0.97]"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                다시 말하기
              </button>
              {retryCount > 0 && (
                <span className="shrink-0 text-xs text-foreground-muted">
                  {retryCount}회 시도
                </span>
              )}
            </>
          )}

          {/* PASS 전환 중 */}
          {phase === "passed" && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              다음으로 이동 중...
            </div>
          )}

          {/* 시도 횟수 (ready 상태에서만) */}
          {retryCount > 0 && phase === "ready" && (
            <span className="shrink-0 text-xs text-foreground-muted">
              {retryCount}회 시도
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Frame 카드 ── */

function FrameCards({
  slots,
  collapsed,
  showKorean,
  failedSlots,
}: {
  slots: { slot: string; frame_en: string; label_ko: string }[];
  collapsed: boolean;
  showKorean: boolean;
  failedSlots: string[];
}) {
  const [isExpanded, setIsExpanded] = useState(!collapsed);

  return (
    <div className="rounded-[var(--radius-xl)] border border-border bg-surface">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between px-4 py-3 text-xs font-semibold text-foreground"
      >
        <span>말하기 구조</span>
        {isExpanded ? <ChevronUp className="h-4 w-4 text-foreground-muted" /> : <ChevronDown className="h-4 w-4 text-foreground-muted" />}
      </button>
      {isExpanded && (
        <div className="space-y-2 border-t border-border px-4 pb-4 pt-3">
          {slots.map((slot, idx) => {
            const isFailed = failedSlots.some((f) =>
              f.toLowerCase().includes(slot.slot.toLowerCase().replace(/_/g, ""))
            );
            return (
              <div
                key={slot.slot}
                className={`flex items-center gap-3 rounded-[var(--radius-lg)] p-3 transition-colors ${
                  isFailed
                    ? "border border-accent-300 bg-accent-50"
                    : "bg-surface-secondary"
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    isFailed
                      ? "bg-accent-100 text-accent-600"
                      : "bg-primary-100 text-primary-600"
                  }`}
                >
                  {idx + 1}
                </span>
                <div>
                  <p className="text-xs font-medium text-foreground sm:text-[13px]">{slot.frame_en}</p>
                  {showKorean && (
                    <p className="mt-0.5 text-[11px] text-foreground-secondary">{slot.label_ko}</p>
                  )}
                  {isFailed && (
                    <p className="mt-0.5 text-[11px] font-medium text-accent-600">← 이 부분이 빠졌어요</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Slot Rescue 패널 ── */

function SlotRescuePanel({
  allSlots,
  failedFlags,
  showKorean,
  onComplete,
}: {
  allSlots: { slot: string; frame_en: string; label_ko: string }[];
  failedFlags: string[];
  showKorean: boolean;
  onComplete: () => void;
}) {
  const rescueSlots = allSlots.filter((slot) =>
    failedFlags.some((f) =>
      f.toLowerCase().includes(slot.slot.toLowerCase().replace(/_/g, ""))
    )
  );

  if (rescueSlots.length === 0) return null;

  return (
    <div className="rounded-[var(--radius-xl)] border-2 border-yellow-300 bg-yellow-50 p-4 sm:p-5">
      <div className="mb-3 flex items-center gap-2">
        <Puzzle className="h-4 w-4 text-yellow-600" />
        <h4 className="text-xs font-semibold text-yellow-800">빠진 부분 연습하기</h4>
      </div>
      <p className="mb-4 text-[11px] text-yellow-700">
        아래 구조를 머릿속에 넣고, 전체 답변으로 돌아가서 다시 말해보세요.
      </p>
      <div className="space-y-2">
        {rescueSlots.map((slot) => (
          <div key={slot.slot} className="rounded-[var(--radius-lg)] border border-yellow-200 bg-white p-3">
            <p className="text-xs font-medium text-foreground sm:text-[13px]">{slot.frame_en}</p>
            {showKorean && (
              <p className="mt-0.5 text-[11px] text-foreground-secondary">{slot.label_ko}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── 피드백 패널 ── */

function FeedbackPanel({
  attempt,
  canSlotRescue,
  onRetry,
  onSlotRescue,
}: {
  attempt: TutoringAttempt;
  canSlotRescue: boolean;
  onRetry: () => void;
  onSlotRescue: () => void;
}) {
  const layer1 = attempt.layer1_result as Layer1Result | null;
  const layer2 = attempt.layer2_result as Layer2Result | null;
  const isPassed = attempt.result === "pass";

  // Layer 2 우선
  if (layer2) {
    return (
      <div className="space-y-3 rounded-[var(--radius-xl)] border border-border bg-surface p-4 sm:p-5">
        <div className="flex items-center gap-2">
          {layer2.pass_or_retry === "pass" ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
          )}
          <span className={`text-xs font-semibold ${layer2.pass_or_retry === "pass" ? "text-green-700" : "text-yellow-700"}`}>
            {layer2.pass_or_retry === "pass" ? "PASS" : "다시 한번 해볼게요"}
          </span>
        </div>
        <p className="text-xs text-foreground sm:text-[13px]">{layer2.praise_one}</p>
        {layer2.fix_one_or_two.length > 0 && (
          <div className="space-y-1.5">
            {layer2.fix_one_or_two.map((fix, i) => (
              <p key={i} className="text-xs text-foreground-secondary sm:text-[13px]">⚠️ {fix}</p>
            ))}
          </div>
        )}
        {layer2.correction_examples?.length > 0 && (
          <div className="rounded-[var(--radius-lg)] bg-surface-secondary p-3">
            {layer2.correction_examples.map((ex, i) => (
              <p key={i} className="text-xs italic text-foreground-secondary sm:text-[13px]">{ex}</p>
            ))}
          </div>
        )}
        {layer2.target_connection_hint && (
          <p className="text-[11px] text-primary-600">{layer2.target_connection_hint}</p>
        )}
        {layer2.pass_or_retry === "retry" && layer2.retry_instruction && (
          <p className="text-xs font-medium text-foreground sm:text-[13px]">👉 {layer2.retry_instruction}</p>
        )}
      </div>
    );
  }

  // Layer 1
  if (layer1) {
    return (
      <div className="space-y-3 rounded-[var(--radius-xl)] border border-border bg-surface p-4 sm:p-5">
        <div className="flex items-center gap-2">
          {isPassed ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <RefreshCw className="h-5 w-5 text-yellow-500" />
          )}
          <span className={`text-xs font-semibold ${isPassed ? "text-green-700" : "text-yellow-700"}`}>
            {layer1.student_feedback.status_label}
          </span>
        </div>
        <p className="text-xs text-foreground sm:text-[13px]">{layer1.student_feedback.praise}</p>
        <div className="space-y-1.5">
          {layer1.student_feedback.checklist.map((item: ChecklistItem, i: number) => (
            <div key={i} className="flex items-center gap-2 text-xs sm:text-[13px]">
              {item.status === "pass" ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 shrink-0 text-accent-500" />
              )}
              <span className={item.status === "pass" ? "text-foreground" : "text-accent-600 font-medium"}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
        {!isPassed && layer1.student_feedback.retry_instruction && (
          <p className="text-sm font-medium text-foreground">
            👉 {layer1.student_feedback.retry_instruction}
          </p>
        )}
        {!isPassed && canSlotRescue && (
          <button
            onClick={onSlotRescue}
            className="mt-1 flex w-full items-center justify-center gap-2 rounded-[var(--radius-lg)] border border-yellow-300 bg-yellow-50 px-4 py-2.5 text-xs font-medium text-yellow-700 transition-colors hover:bg-yellow-100"
          >
            <Puzzle className="h-3.5 w-3.5" />
            빠진 부분 연습하기
          </button>
        )}
      </div>
    );
  }

  return null;
}
