"use client";

// 문항별 탭: PC 세로 막대 차트 + 모바일 가로 바 아코디언
import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  SkipForward,
  Lightbulb,
  Target,
  BarChart3,
  Mic2,
  BookOpen,
  Play,
  Pause,
  ChevronDown,
} from "lucide-react";
import type {
  MockTestEvaluation,
  MockTestAnswer,
  CoachingFeedback,
  TaskFulfillment,
  PronunciationAssessment,
} from "@/lib/types/mock-exam";
import { getPronunciationLabel } from "@/lib/types/mock-exam";
import { QT_KO, CB_KO, getSkillColor } from "./shared-helpers";

// ── Props ──

interface QuestionsTabProps {
  evaluations: MockTestEvaluation[];
  answers: MockTestAnswer[];
  questions: Array<{
    id: string;
    question_english: string;
    question_korean: string;
    question_type_eng: string;
    topic: string;
    category: string;
  }>;
}

// ── 문항 데이터 통합 ──

interface QuestionData {
  questionNumber: number;
  answer: MockTestAnswer | null;
  evaluation: MockTestEvaluation | null;
  question: QuestionsTabProps["questions"][number] | null;
  isSkipped: boolean;
  passRate: number;
  fulfillmentStatus: "fulfilled" | "partial" | "failed" | "none";
  pronunciationAvg: number;
}

// ── 바 색상 헬퍼 ──

function getBarColor(passRate: number, isSkipped: boolean) {
  if (isSkipped) return "bg-foreground-muted/20";
  if (passRate >= 0.8) return "bg-green-400";
  if (passRate < 0.5) return "bg-red-400";
  return "bg-primary-400";
}

function getBarHoverColor(passRate: number, isSkipped: boolean) {
  if (isSkipped) return "hover:bg-foreground-muted/30";
  if (passRate >= 0.8) return "hover:bg-green-500";
  if (passRate < 0.5) return "hover:bg-red-500";
  return "hover:bg-primary-500";
}

function getStatusIcon(item: QuestionData) {
  if (item.isSkipped) return { Icon: SkipForward, color: "text-foreground-muted" };
  if (item.fulfillmentStatus === "fulfilled") return { Icon: CheckCircle2, color: "text-green-500" };
  if (item.fulfillmentStatus === "partial") return { Icon: AlertTriangle, color: "text-yellow-500" };
  if (item.fulfillmentStatus === "failed") return { Icon: XCircle, color: "text-red-500" };
  return null;
}

function getStatusChar(item: QuestionData) {
  if (item.isSkipped) return { char: "—", color: "text-foreground-muted" };
  if (item.fulfillmentStatus === "fulfilled") return { char: "✓", color: "text-green-500" };
  if (item.fulfillmentStatus === "partial") return { char: "△", color: "text-yellow-500" };
  if (item.fulfillmentStatus === "failed") return { char: "✗", color: "text-red-500" };
  return { char: "", color: "text-foreground-muted" };
}

// ── 메인 ──

export function QuestionsTab({ evaluations, answers, questions }: QuestionsTabProps) {
  const [expandedQ, setExpandedQ] = useState<number | null>(null);
  const detailRef = useRef<HTMLDivElement | null>(null);
  const mobileRowRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const qMap = useMemo(() => new Map(questions.map((q) => [q.id, q])), [questions]);
  const evalMap = useMemo(() => new Map(evaluations.map((e) => [e.question_number, e])), [evaluations]);
  const ansMap = useMemo(() => new Map(answers.map((a) => [a.question_number, a])), [answers]);

  // Q2~Q15 데이터 통합
  const items = useMemo<QuestionData[]>(() => {
    return Array.from({ length: 14 }, (_, i) => {
      const qNum = i + 2;
      const ans = ansMap.get(qNum) || null;
      const ev = evalMap.get(qNum) || null;
      const questionId = ans?.question_id || ev?.question_id;
      const question = questionId ? qMap.get(questionId) || null : null;
      const isSkipped = !!(ans?.skipped || ev?.skipped);
      const passRate = ev?.pass_rate != null ? Number(ev.pass_rate) : 0;
      const tf = ev?.task_fulfillment;
      const fulfillmentStatus = tf?.status || "none";
      const pa = ev?.pronunciation_assessment;
      const pronunciationAvg = pa
        ? ((Number(pa.accuracy_score) || 0) + (Number(pa.prosody_score) || 0) + (Number(pa.fluency_score) || 0)) / 3
        : 0;

      return { questionNumber: qNum, answer: ans, evaluation: ev, question, isSkipped, passRate, fulfillmentStatus, pronunciationAvg };
    });
  }, [ansMap, evalMap, qMap]);

  // 요약 통계
  const stats = useMemo(() => {
    const answered = items.filter((i) => !i.isSkipped);
    const fulfilled = items.filter((i) => i.fulfillmentStatus === "fulfilled").length;
    const avgPassRate = answered.length > 0
      ? answered.reduce((sum, i) => sum + i.passRate, 0) / answered.length
      : 0;
    const pronItems = answered.filter((i) => i.pronunciationAvg > 0);
    const avgPron = pronItems.length > 0
      ? pronItems.reduce((sum, i) => sum + i.pronunciationAvg, 0) / pronItems.length
      : 0;
    const skipped = items.filter((i) => i.isSkipped).length;

    return { total: 14, answered: answered.length, fulfilled, skipped, avgPassRate, avgPron };
  }, [items]);

  const selectedItem = expandedQ != null ? items.find((i) => i.questionNumber === expandedQ) || null : null;

  // 자동 스크롤
  useEffect(() => {
    if (expandedQ != null) {
      requestAnimationFrame(() => {
        // PC: 상세 패널 헤더로 스크롤
        if (window.innerWidth >= 768 && detailRef.current) {
          detailRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        // 모바일: 아코디언 행으로 스크롤
        if (window.innerWidth < 768) {
          const row = mobileRowRefs.current.get(expandedQ);
          if (row) row.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      });
    }
  }, [expandedQ]);

  const handleSelect = useCallback((qNum: number) => {
    setExpandedQ((prev) => (prev === qNum ? null : qNum));
  }, []);

  return (
    <div>
      {/* ═══ PC: Q번호 버튼 (sticky) — 스크롤 컨테이너 직속, 차트와 동일 패딩 ═══ */}
      <div className="sticky top-0 z-10 hidden md:block bg-background">
        <div className="mx-auto max-w-5xl px-3 pt-4 pb-2 sm:px-6">
          <div className="rounded-xl border border-border bg-surface px-4 py-2">
            <div className="flex gap-1.5">
              {items.map((item) => {
                const isSelected = expandedQ === item.questionNumber;
                return (
                  <button
                    key={item.questionNumber}
                    onClick={() => handleSelect(item.questionNumber)}
                    className={`flex-1 rounded py-1 text-[11px] font-bold transition-colors ${
                      isSelected
                        ? "bg-primary-500 text-white"
                        : "bg-surface-secondary text-foreground-secondary hover:bg-primary-100 hover:text-primary-600"
                    }`}
                  >
                    Q{item.questionNumber}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

    <div className="mx-auto max-w-5xl px-3 pb-4 sm:px-6 sm:pb-6 space-y-4 pt-4 md:pt-0">
      {/* ═══ 요약 통계 바 — 모바일만 ═══ */}
      <div className="md:hidden rounded-xl border border-border bg-surface p-3">
        <div className="grid grid-cols-3 gap-3">
          <StatItem label="과제충족" value={`${stats.fulfilled}/${stats.total}`} sub="문항" />
          <StatItem
            label="평균 완성도"
            value={`${(stats.avgPassRate * 100).toFixed(0)}%`}
            color={stats.avgPassRate >= 0.8 ? "text-green-600" : stats.avgPassRate < 0.6 ? "text-red-500" : "text-foreground"}
          />
          <StatItem
            label="평균 발음"
            value={stats.avgPron > 0 ? stats.avgPron.toFixed(0) : "—"}
            color={stats.avgPron >= 80 ? "text-green-600" : stats.avgPron < 60 ? "text-red-500" : "text-foreground"}
          />
        </div>
      </div>

      {/* ═══ PC: 세로 막대 차트 (Q버튼 없이 막대만) ═══ */}
      <div className="hidden md:block">
        <VerticalBarChart items={items} selectedQ={expandedQ} onSelect={handleSelect} />
      </div>

      {/* ═══ PC: 선택한 문항 상세 ═══ */}
      {!selectedItem && (
        <p className="hidden md:block text-center text-sm text-foreground-muted py-6">
          문항 번호를 클릭하면 상세 분석을 볼 수 있습니다.
        </p>
      )}
      {selectedItem && (
        <div key={selectedItem.questionNumber} ref={detailRef} className="hidden md:block scroll-mt-[76px]">
          <div className="rounded-xl border-2 border-primary-200 bg-surface overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between border-b border-border bg-primary-50/30 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-600">
                  {selectedItem.questionNumber}
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground line-clamp-1">
                    {selectedItem.question?.question_korean || `문항 ${selectedItem.questionNumber}`}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-foreground-muted">
                    {selectedItem.question?.question_type_eng && (
                      <span>{QT_KO[selectedItem.question.question_type_eng] || selectedItem.question.question_type_eng}</span>
                    )}
                    {selectedItem.evaluation?.checkbox_type && (
                      <span>· {CB_KO[selectedItem.evaluation.checkbox_type] || selectedItem.evaluation.checkbox_type}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-primary-600">
                  {(selectedItem.passRate * 100).toFixed(0)}%
                </span>
                <button
                  onClick={() => setExpandedQ(null)}
                  className="rounded-lg p-1.5 text-foreground-muted hover:bg-surface-secondary"
                >
                  <XCircle size={18} />
                </button>
              </div>
            </div>
            <DetailPanel item={selectedItem} />
          </div>
        </div>
      )}

      {/* ═══ 모바일: 가로 바 아코디언 ═══ */}
      <div className="md:hidden rounded-xl border border-border bg-surface overflow-hidden divide-y divide-border/50">
        {items.map((item) => {
          const isExpanded = expandedQ === item.questionNumber;
          const { isSkipped, passRate, question, evaluation } = item;
          const barColor = getBarColor(passRate, isSkipped);
          const status = getStatusIcon(item);
          const duration = evaluation?.audio_duration ? Number(evaluation.audio_duration) : 0;

          return (
            <div
              key={item.questionNumber}
              ref={(el) => { if (el) mobileRowRefs.current.set(item.questionNumber, el); }}
            >
              {/* 행 헤더 */}
              <button
                onClick={() => handleSelect(item.questionNumber)}
                className={`flex w-full items-center gap-2 px-3 py-2.5 text-left transition-colors ${
                  isExpanded ? "bg-primary-50/50" : "hover:bg-surface-secondary/30"
                }`}
              >
                {/* Q번호 배지 */}
                <span className={`flex h-6 shrink-0 items-center justify-center rounded-full px-2 text-[11px] font-bold ${
                  isExpanded ? "bg-primary-500 text-white" : "bg-surface-secondary text-foreground-secondary"
                }`}>
                  Q{item.questionNumber}
                </span>

                {/* 완성도 바 or 건너뜀 */}
                {!isSkipped ? (
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <div className="h-2 flex-1 rounded-full bg-surface-secondary">
                      <div
                        className={`h-2 rounded-full transition-all ${barColor}`}
                        style={{ width: `${passRate * 100}%` }}
                      />
                    </div>
                    <span className="w-8 shrink-0 text-right text-xs font-medium tabular-nums text-foreground">
                      {(passRate * 100).toFixed(0)}%
                    </span>
                  </div>
                ) : (
                  <span className="flex-1 text-xs text-foreground-muted">건너뜀</span>
                )}

                {/* 답변 시간 */}
                {!isSkipped && duration > 0 && (
                  <span className={`shrink-0 text-[11px] tabular-nums ${
                    duration < 20 ? "font-medium text-red-500" : "text-foreground-muted"
                  }`}>
                    {duration.toFixed(0)}초
                  </span>
                )}

                {/* 상태 아이콘 */}
                {status && <status.Icon size={14} className={`shrink-0 ${status.color}`} />}

                {/* 화살표 */}
                <ChevronDown
                  size={14}
                  className={`shrink-0 text-foreground-muted transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                />
              </button>

              {/* 펼쳐진 상세 */}
              {isExpanded && (
                <div className="border-t border-border/50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* 유형 + 완성도 미니 헤더 */}
                  <div className="flex items-center justify-between bg-primary-50/20 px-3 py-1.5">
                    <span className="text-[11px] text-foreground-muted">
                      {question?.question_type_eng
                        ? QT_KO[question.question_type_eng] || question.question_type_eng
                        : ""}
                      {evaluation?.checkbox_type
                        ? ` · ${CB_KO[evaluation.checkbox_type] || evaluation.checkbox_type}`
                        : ""}
                    </span>
                    <span className="text-[11px] font-medium text-primary-600">
                      완성도 {(passRate * 100).toFixed(0)}%
                    </span>
                  </div>
                  <DetailPanel item={item} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
    </div>
  );
}

// ── PC 세로 막대 차트 ──

function VerticalBarChart({
  items,
  selectedQ,
  onSelect,
}: {
  items: QuestionData[];
  selectedQ: number | null;
  onSelect: (qNum: number) => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4 pb-3">
      <div className="flex gap-1.5">
        {items.map((item) => {
          const isSelected = selectedQ === item.questionNumber;
          const { isSkipped, passRate, evaluation } = item;
          const heightPercent = isSkipped ? 3 : Math.max(3, passRate * 100);
          const barBg = getBarColor(passRate, isSkipped);
          const duration = evaluation?.audio_duration ? Number(evaluation.audio_duration) : 0;
          const { char: statusChar, color: statusColor } = getStatusChar(item);

          return (
            <div key={item.questionNumber} className="flex flex-1 flex-col items-center gap-1">
              {/* 퍼센트 라벨 */}
              <span className={`shrink-0 text-[11px] font-medium tabular-nums ${
                isSelected ? "text-primary-600" : "text-foreground-secondary"
              }`}>
                {isSkipped ? "—" : (passRate * 100).toFixed(0)}
              </span>

              {/* 막대 */}
              <div className="flex w-full h-[160px] items-end px-0.5">
                <div
                  className={`w-full rounded-t transition-all ${barBg} ${
                    isSelected ? "ring-2 ring-primary-500 ring-offset-1" : ""
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />
              </div>

              {/* 하단 라벨 */}
              <div className={`w-full space-y-0.5 border-t border-border/50 pt-1.5 text-center ${isSelected ? "opacity-100" : "opacity-75"}`}>
                <p className={`text-[10px] tabular-nums ${
                  !isSkipped && duration > 0 && duration < 20
                    ? "font-medium text-red-500"
                    : "text-foreground-muted"
                }`}>
                  {isSkipped || duration <= 0 ? "—" : `${duration.toFixed(0)}초`}
                </p>
                <p className={`text-[11px] font-medium ${statusColor}`}>{statusChar}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── 통계 아이템 ──

function StatItem({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="text-center">
      <p className="text-xs text-foreground-muted mb-0.5">{label}</p>
      <p className={`text-lg font-bold ${color || "text-foreground"}`}>
        {value}
        {sub && <span className="text-xs font-normal text-foreground-muted ml-0.5">{sub}</span>}
      </p>
    </div>
  );
}

// ── 상세 패널 (5단계 코칭) ──

function DetailPanel({ item }: { item: QuestionData }) {
  const { evaluation, question, isSkipped } = item;

  if (isSkipped) {
    return <SkippedPanel evaluation={evaluation} />;
  }

  if (!evaluation) {
    return <p className="px-4 py-6 text-sm text-foreground-muted text-center">평가 데이터가 없습니다.</p>;
  }

  const coaching = evaluation.coaching_feedback as CoachingFeedback | null;
  if (!coaching) {
    return <p className="px-4 py-6 text-sm text-foreground-muted text-center">코칭 데이터가 아직 생성되지 않았습니다.</p>;
  }

  const taskFulfillment = evaluation.task_fulfillment;
  const priorityPrescription = evaluation.priority_prescription;

  return (
    <div className="divide-y divide-border/50">
      {/* 질문 원문 */}
      {question && (
        <div className="px-4 py-2.5">
          <p className="text-xs text-foreground-muted">Question</p>
          <p className="text-sm text-foreground mt-0.5">{question.question_english}</p>
          <p className="mt-0.5 text-xs text-foreground-secondary">{question.question_korean}</p>
        </div>
      )}

      {/* 나의 답변 + 오디오 플레이어 */}
      {evaluation.transcript && (
        <div className="px-4 py-3">
          <TranscriptWithAudio evaluation={evaluation} answer={item.answer} />
        </div>
      )}

      {/* Step 1: 인사이트 + 과제충족 */}
      <div className="px-4 py-3 space-y-2.5">
        {coaching.one_line_insight && (
          <div className="flex items-start gap-2 rounded-lg bg-primary-50/50 p-3">
            <Lightbulb size={14} className="mt-0.5 shrink-0 text-primary-500" />
            <p className="text-sm leading-relaxed text-foreground">{coaching.one_line_insight}</p>
          </div>
        )}
        {taskFulfillment && <TaskFulfillmentBlock fulfillment={taskFulfillment} />}
      </div>

      {/* Step 2: 최우선 처방 */}
      {priorityPrescription && priorityPrescription.length > 0 && (
        <div className="px-4 py-3">
          <p className="text-xs font-medium text-primary-600 mb-2 flex items-center gap-1">
            <Target size={12} />
            최우선 처방
          </p>
          <div className="space-y-2">
            {priorityPrescription.map((p, i) => (
              <div key={i} className="rounded-lg border border-primary-200 bg-primary-50/30 p-3">
                <p className="text-xs font-medium text-foreground">{p.action}</p>
                <p className="text-xs text-foreground-secondary mt-1">{p.why}</p>
                {p.example && (
                  <p className="text-xs text-primary-600 mt-1.5 italic">&ldquo;{p.example}&rdquo;</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: 구조 + 교정 */}
      <div className="px-4 py-3 space-y-3">
        {coaching.structure_evaluation && (
          <div>
            <p className="text-xs font-medium text-foreground-muted mb-2">답변 구조</p>
            <div className="rounded-lg bg-surface-secondary/50 p-2.5 space-y-2">
              {Object.entries(coaching.structure_evaluation).map(([key, value]) => (
                <div key={key}>
                  <p className="text-[11px] font-medium text-foreground-muted">{key}</p>
                  <p className="text-xs text-foreground-secondary leading-relaxed">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {coaching.key_corrections && coaching.key_corrections.length > 0 && (
          <div>
            <p className="text-xs font-medium text-foreground-muted mb-2">
              핵심 교정 ({coaching.key_corrections.length})
            </p>
            <ul className="space-y-1.5">
              {coaching.key_corrections.map((c, i) => (
                <li key={i} className="flex items-start gap-2 rounded-lg border border-border bg-surface p-2.5 text-xs leading-relaxed text-foreground">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary-100 text-[11px] font-bold text-primary-600">
                    {i + 1}
                  </span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Step 4: 답변 개선 */}
      {coaching.answer_improvement && (
        <div className="px-4 py-3">
          <p className="text-xs font-medium text-foreground-muted mb-2">이렇게 말하면 더 좋아요</p>
          <div className="space-y-2.5">
            <div className="rounded-lg bg-green-50/50 p-2.5">
              <p className="text-xs font-medium text-green-700 mb-1">교정 답변 — 문법만 수정</p>
              <p className="text-[13px] leading-relaxed text-foreground">{coaching.answer_improvement.corrected_version}</p>
            </div>
            <div className="rounded-lg bg-primary-50/50 p-2.5">
              <p className="text-xs font-medium text-primary-600 mb-1">더 나은 답변 — 목표 등급 수준</p>
              <p className="text-[13px] leading-relaxed text-foreground">{coaching.answer_improvement.better_version}</p>
            </div>
            {coaching.answer_improvement.what_changed && (
              <div>
                <p className="text-xs font-medium text-foreground-muted mb-1">개선 포인트</p>
                <p className="text-xs text-foreground-secondary">{coaching.answer_improvement.what_changed}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 5: 전달 분석 (영역별 + 발음 + 심층) */}
      <div className="px-4 py-3 space-y-3">
        {coaching.skill_summary && (
          <div>
            <p className="text-xs font-medium text-foreground-muted mb-2 flex items-center gap-1">
              <BarChart3 size={12} className="text-primary-400" />
              영역별 분석
            </p>
            <div className={`grid gap-1.5 sm:gap-2 ${Object.keys(coaching.skill_summary).length <= 5 ? "grid-cols-5" : "grid-cols-3 sm:grid-cols-4"}`}>
              {Object.entries(coaching.skill_summary).map(([key, score]) => (
                <div key={key} className={`rounded-lg p-2 text-center ${getSkillColor(score)}`}>
                  <p className="text-[11px] font-medium opacity-80 truncate">{key}</p>
                  <p className="text-sm font-bold">{score}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {evaluation.pronunciation_assessment && (
          <PronunciationBlock assessment={evaluation.pronunciation_assessment} />
        )}

        {coaching.deep_analysis && (
          <div>
            <p className="text-xs font-medium text-foreground-muted mb-2 flex items-center gap-1">
              <BookOpen size={12} className="text-primary-400" />
              심층 분석
            </p>
            <div className="rounded-lg bg-surface-secondary/30 p-3 space-y-3">
              {coaching.deep_analysis.strengths && (
                <div>
                  <p className="text-xs font-medium text-green-600 mb-1">강점</p>
                  <p className="text-xs text-foreground-secondary">{coaching.deep_analysis.strengths}</p>
                </div>
              )}
              {coaching.deep_analysis.weaknesses && (
                <div>
                  <p className="text-xs font-medium text-red-500 mb-1">약점</p>
                  <p className="text-xs text-foreground-secondary">{coaching.deep_analysis.weaknesses}</p>
                </div>
              )}
              {coaching.deep_analysis.target_gap && (
                <div>
                  <p className="text-xs font-medium text-primary-500 mb-1">목표 도달을 위해</p>
                  <p className="text-xs text-foreground-secondary">{coaching.deep_analysis.target_gap}</p>
                </div>
              )}
              {coaching.deep_analysis.practice_suggestion && (
                <div className="rounded bg-surface p-2">
                  <p className="text-xs font-medium text-foreground mb-0.5">연습 제안</p>
                  <p className="text-xs text-foreground-secondary">{coaching.deep_analysis.practice_suggestion}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── 건너뜀 패널 ──

function SkippedPanel({ evaluation }: { evaluation: MockTestEvaluation | null }) {
  const coaching = evaluation?.coaching_feedback as CoachingFeedback | null;
  const rescue = coaching?.rescue;
  const prescription = evaluation?.priority_prescription;

  return (
    <div className="px-4 py-4 space-y-3">
      <p className="text-sm text-foreground-muted">이 문항은 건너뛰었습니다.</p>
      {rescue && (
        <div className="rounded-lg bg-primary-50/50 p-3 space-y-2">
          <p className="text-xs font-medium text-primary-600">다음엔 이렇게 시작해보세요</p>
          <p className="text-sm font-medium text-foreground italic">&ldquo;{rescue.start_template}&rdquo;</p>
          <p className="text-xs text-foreground-secondary">{rescue.recovery_tip}</p>
          {rescue.tone && <p className="text-xs text-foreground-muted">{rescue.tone}</p>}
        </div>
      )}
      {prescription && prescription.length > 0 && (
        <div className="rounded-lg border border-primary-200 bg-primary-50/30 p-3">
          <p className="text-xs font-medium text-primary-600 mb-1">처방</p>
          {prescription.map((p, i) => (
            <div key={i} className="text-xs text-foreground-secondary">
              <p className="font-medium text-foreground">{p.action}</p>
              <p className="text-xs mt-0.5">{p.why}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── 과제충족 블록 ──

function TaskFulfillmentBlock({ fulfillment }: { fulfillment: TaskFulfillment }) {
  const statusConfig = {
    fulfilled: { label: "충족", color: "text-green-600 bg-green-50", icon: "✓" },
    partial: { label: "부분 충족", color: "text-yellow-600 bg-yellow-50", icon: "△" },
    failed: { label: "미충족", color: "text-red-500 bg-red-50", icon: "✗" },
  };
  const s = statusConfig[fulfillment.status] || statusConfig.failed;

  return (
    <div className="rounded-lg bg-surface-secondary/50 p-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-foreground-muted">과제 수행</p>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${s.color}`}>
          {s.icon} {s.label}
        </span>
      </div>
      <div className="space-y-1">
        {fulfillment.checklist?.required?.map((item, i) => (
          <div key={`r-${i}`} className="flex items-start gap-1.5 text-xs">
            {item.pass ? (
              <CheckCircle2 size={10} className="mt-0.5 shrink-0 text-green-500" />
            ) : (
              <XCircle size={10} className="mt-0.5 shrink-0 text-red-400" />
            )}
            <span className={item.pass ? "text-foreground-secondary" : "text-red-600 font-medium"}>
              {item.item}
            </span>
          </div>
        ))}
        {fulfillment.checklist?.advanced?.map((item, i) => (
          <div key={`a-${i}`} className="flex items-start gap-1.5 text-xs">
            {item.pass ? (
              <CheckCircle2 size={10} className="mt-0.5 shrink-0 text-green-500" />
            ) : (
              <XCircle size={10} className="mt-0.5 shrink-0 text-yellow-500" />
            )}
            <span className={item.pass ? "text-foreground-secondary" : "text-yellow-700"}>
              {item.item}
            </span>
          </div>
        ))}
      </div>
      {fulfillment.reason && (
        <p className="mt-2 text-xs text-foreground-muted">{fulfillment.reason}</p>
      )}
    </div>
  );
}

// ── 답변 원문 + 오디오 플레이어 ──

function TranscriptWithAudio({ evaluation, answer }: { evaluation: MockTestEvaluation; answer: MockTestAnswer | null }) {
  const audioUrl = answer?.audio_url || evaluation.audio_url;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const ensureAudio = useCallback(() => {
    if (audioRef.current || !audioUrl) return audioRef.current;
    const audio = new Audio(audioUrl);
    audio.addEventListener("loadedmetadata", () => setDuration(audio.duration));
    audio.addEventListener("timeupdate", () => setCurrentTime(audio.currentTime));
    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });
    audioRef.current = audio;
    return audio;
  }, [audioUrl]);

  const togglePlay = useCallback(() => {
    const audio = ensureAudio();
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  }, [ensureAudio, isPlaying]);

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = ensureAudio();
    if (!audio || !progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * (audio.duration || 0);
    setCurrentTime(audio.currentTime);
  }, [ensureAudio]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div>
      {audioUrl && (
        <div className="mb-2 flex items-center gap-2 rounded-lg border border-border bg-surface-secondary/50 px-3 py-2">
          <button
            onClick={togglePlay}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-500 text-white transition-colors hover:bg-primary-600 active:scale-95"
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
          </button>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div
              ref={progressBarRef}
              onClick={handleSeek}
              className="group relative h-1.5 cursor-pointer rounded-full bg-border"
            >
              <div
                className="h-full rounded-full bg-primary-500 transition-[width] duration-150 ease-linear"
                style={{ width: `${progress}%` }}
              />
              <div
                className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-primary-500 opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                style={{ left: `calc(${progress}% - 6px)`, opacity: isPlaying || progress > 0 ? 1 : undefined }}
              />
            </div>
            <div className="flex justify-between text-xs text-foreground-muted">
              <span>{formatTime(currentTime)}</span>
              <span>{duration > 0 ? formatTime(duration) : evaluation.audio_duration ? formatTime(evaluation.audio_duration) : "--:--"}</span>
            </div>
          </div>
        </div>
      )}

      <p className="whitespace-pre-wrap rounded-lg border border-border bg-white p-3 text-[13px] leading-relaxed text-foreground">
        {evaluation.transcript}
      </p>

      <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-foreground-muted">
        {evaluation.wpm != null && evaluation.wpm > 0 && <span>WPM: {evaluation.wpm}</span>}
        {evaluation.audio_duration != null && Number(evaluation.audio_duration) > 0 && (
          <span>{Number(evaluation.audio_duration).toFixed(0)}초</span>
        )}
        {evaluation.filler_count != null && evaluation.filler_count > 0 && (
          <span>필러: {evaluation.filler_count}개</span>
        )}
        {evaluation.long_pause_count != null && evaluation.long_pause_count > 0 && (
          <span>긴 침묵: {evaluation.long_pause_count}</span>
        )}
      </div>
    </div>
  );
}

// ── 발음 블록 ──

function PronunciationBlock({ assessment }: { assessment: PronunciationAssessment }) {
  const accuracy = Number(assessment.accuracy_score) || 0;
  const pronLabel = getPronunciationLabel(accuracy);

  return (
    <div>
      <p className="text-xs font-medium text-foreground-muted mb-2 flex items-center gap-1">
        <Mic2 size={12} className="text-primary-400" />
        발음 이해도
      </p>
      <div className="flex items-center gap-3">
        <span className={`text-lg font-bold ${pronLabel.color}`}>{pronLabel.label}</span>
        <div className="flex gap-3 text-xs text-foreground-muted">
          <span>정확도 {accuracy.toFixed(0)}</span>
          <span>운율 {(Number(assessment.prosody_score) || 0).toFixed(0)}</span>
          <span>유창성 {(Number(assessment.fluency_score) || 0).toFixed(0)}</span>
        </div>
      </div>
    </div>
  );
}
