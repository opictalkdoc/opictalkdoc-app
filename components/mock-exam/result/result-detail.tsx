"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  Mic2,
  SkipForward,
  Lightbulb,
  BookOpen,
  BarChart3,
  Target,
} from "lucide-react";
import type {
  MockTestEvaluation,
  MockTestAnswer,
  CoachingFeedback,
  PronunciationAssessment,
  TaskFulfillment,
} from "@/lib/types/mock-exam";
import { EVAL_STATUS_LABELS, getPronunciationLabel } from "@/lib/types/mock-exam";

// ── Props ──

interface ResultDetailProps {
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

// question_type 한글 (v3 DB 실제 값 + v2 호환)
const QT_KO: Record<string, string> = {
  description: "묘사",
  routine: "루틴",
  comparison: "비교",
  past_childhood: "어린시절",
  past_special: "특별경험",
  past_recent: "과거습관",
  rp_11: "질문하기",
  rp_12: "대안제시",
  adv_14: "비교변화",
  adv_15: "사회이슈",
  // v2 호환
  asking_questions: "질문하기",
  experience_specific: "특정경험",
  experience_habitual: "습관경험",
  experience_past: "과거경험",
  suggest_alternatives: "대안제시",
  comparison_change: "비교변화",
  social_issue: "사회이슈",
};

// checkbox_type 한글
const CB_KO: Record<string, string> = {
  INT: "기초",
  ADV: "심화",
  AL: "고급",
};

// skill_summary 라벨 색상 (1~5)
function getSkillColor(score: number): string {
  if (score >= 4) return "text-green-600 bg-green-50";
  if (score >= 3) return "text-yellow-600 bg-yellow-50";
  return "text-red-500 bg-red-50";
}



// ── 메인 ──

export function ResultDetail({
  evaluations,
  answers,
  questions,
}: ResultDetailProps) {
  const qMap = new Map(questions.map((q) => [q.id, q]));
  const evalMap = new Map(evaluations.map((e) => [e.question_number, e]));
  const ansMap = new Map(answers.map((a) => [a.question_number, a]));

  // Q2~Q15
  const questionNumbers = Array.from({ length: 14 }, (_, i) => i + 2);

  return (
    <div className="mt-4 space-y-2">
      {questionNumbers.map((qNum) => {
        const ans = ansMap.get(qNum);
        const ev = evalMap.get(qNum);
        const questionId = ans?.question_id || ev?.question_id;
        const question = questionId ? qMap.get(questionId) : undefined;

        return (
          <QuestionCard
            key={qNum}
            questionNumber={qNum}
            answer={ans || null}
            evaluation={ev || null}
            question={question || null}
          />
        );
      })}
    </div>
  );
}

// ── 문항 카드 (V2 5-Layer) ──

function QuestionCard({
  questionNumber,
  answer,
  evaluation,
  question,
}: {
  questionNumber: number;
  answer: MockTestAnswer | null;
  evaluation: MockTestEvaluation | null;
  question: {
    id: string;
    question_english: string;
    question_korean: string;
    question_type_eng: string;
    topic: string;
    category: string;
  } | null;
}) {
  const [open, setOpen] = useState(false);

  const isSkipped = answer?.skipped || evaluation?.skipped;
  const evalStatus = answer?.eval_status || "pending";
  const coaching = evaluation?.coaching_feedback as CoachingFeedback | null;

  // 상태 표시: 코칭 한줄평이 있으면 그걸 미리보기로
  const previewText = coaching?.one_line_insight;

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      {/* 헤더 */}
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-start gap-2 px-3 py-2.5 text-left transition-colors hover:bg-surface-secondary/30 sm:gap-3 sm:px-4 sm:py-3"
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-secondary text-[10px] font-bold text-foreground-secondary mt-0.5">
          {questionNumber}
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground line-clamp-1">
            {question?.question_korean || `문항 ${questionNumber}`}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            {question?.question_type_eng && (
              <span className="text-[10px] text-foreground-muted">
                {QT_KO[question.question_type_eng] || question.question_type_eng}
              </span>
            )}
            {evaluation?.checkbox_type && (
              <span className="text-[10px] text-foreground-muted">
                · {CB_KO[evaluation.checkbox_type] || evaluation.checkbox_type}
              </span>
            )}
          </div>
          {/* V2: 한줄 인사이트 미리보기 */}
          {!open && previewText && !isSkipped && (
            <p className="mt-1 text-[11px] text-foreground-secondary line-clamp-1">
              {previewText}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0 mt-0.5">
          {isSkipped ? (
            <span className="flex items-center gap-1 rounded-full bg-surface-secondary px-2 py-0.5 text-[10px] text-foreground-muted">
              <SkipForward size={10} />
              건너뜀
            </span>
          ) : evalStatus !== "completed" ? (
            <span className="text-[10px] text-yellow-600">
              {EVAL_STATUS_LABELS[evalStatus as keyof typeof EVAL_STATUS_LABELS] || evalStatus}
            </span>
          ) : null}
          {open ? (
            <ChevronUp size={14} className="text-foreground-muted" />
          ) : (
            <ChevronDown size={14} className="text-foreground-muted" />
          )}
        </div>
      </button>

      {/* 펼침: V3 5단계 표시 */}
      {open && (
        <div className="border-t border-border bg-surface-secondary/10">
          {isSkipped ? (
            <SkippedContent evaluation={evaluation} />
          ) : !evaluation || evaluation.skipped ? (
            <p className="px-4 py-3 text-sm text-foreground-muted">평가 데이터가 없습니다.</p>
          ) : coaching ? (
            <V3CoachingContent
              evaluation={evaluation}
              coaching={coaching}
              question={question}
            />
          ) : (
            <p className="px-4 py-3 text-sm text-foreground-muted">
              코칭 데이터가 아직 생성되지 않았습니다.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ── 건너뜀/무응답 콘텐츠 (v3 구제 메시지 포함) ──

function SkippedContent({ evaluation }: { evaluation: MockTestEvaluation | null }) {
  const coaching = evaluation?.coaching_feedback as CoachingFeedback | null;
  const rescue = coaching?.rescue;
  const prescription = evaluation?.priority_prescription;

  return (
    <div className="px-3 py-3 sm:px-4 space-y-3">
      <p className="text-sm text-foreground-muted">이 문항은 건너뛰었습니다.</p>
      {/* v3 구제 메시지 */}
      {rescue && (
        <div className="rounded-lg bg-primary-50/50 p-3 space-y-2">
          <p className="text-xs font-medium text-primary-600">다음엔 이렇게 시작해보세요</p>
          <p className="text-sm font-medium text-foreground italic">
            &ldquo;{rescue.start_template}&rdquo;
          </p>
          <p className="text-[11px] text-foreground-secondary">{rescue.recovery_tip}</p>
          {rescue.tone && (
            <p className="text-[10px] text-foreground-muted">{rescue.tone}</p>
          )}
        </div>
      )}
      {prescription && prescription.length > 0 && (
        <div className="rounded-lg border border-primary-200 bg-primary-50/30 p-3">
          <p className="text-[10px] font-medium text-primary-600 mb-1">처방</p>
          {prescription.map((p, i) => (
            <div key={i} className="text-[11px] text-foreground-secondary">
              <p className="font-medium text-foreground">{p.action}</p>
              <p className="text-[10px] mt-0.5">{p.why}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── V3 코칭 콘텐츠 (5단계 표시) ──
// 1. 과제충족 2. 최우선처방 3. 구조+교정 4. 답변개선 5. 전달+습관

function V3CoachingContent({
  evaluation,
  coaching,
  question,
}: {
  evaluation: MockTestEvaluation;
  coaching: CoachingFeedback;
  question: {
    question_english: string;
  } | null;
}) {
  const [showDeep, setShowDeep] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  const taskFulfillment = evaluation.task_fulfillment;
  const priorityPrescription = evaluation.priority_prescription;
  const feedbackBranch = evaluation.feedback_branch;

  return (
    <div className="divide-y divide-border/50">
      {/* 질문 원문 */}
      {question && (
        <div className="px-3 py-2.5 sm:px-4">
          <p className="text-xs text-foreground-muted">Question</p>
          <p className="text-sm text-foreground mt-0.5">{question.question_english}</p>
        </div>
      )}

      {/* Step 1: 과제충족 + 한줄 인사이트 */}
      <div className="px-3 py-3 sm:px-4 space-y-2.5">
        {/* 한줄 인사이트 */}
        <div className="flex items-start gap-2 rounded-lg bg-primary-50/50 p-3">
          <Lightbulb size={14} className="mt-0.5 shrink-0 text-primary-500" />
          <p className="text-sm leading-relaxed text-foreground">
            {coaching.one_line_insight}
          </p>
        </div>

        {/* 과제충족 상태 (v3) */}
        {taskFulfillment && (
          <TaskFulfillmentSection fulfillment={taskFulfillment} feedbackBranch={feedbackBranch} />
        )}
      </div>

      {/* Step 2: 최우선 처방 (v3) */}
      {priorityPrescription && priorityPrescription.length > 0 && (
        <div className="px-3 py-3 sm:px-4">
          <p className="text-xs font-medium text-primary-600 mb-2 flex items-center gap-1">
            <Target size={12} />
            최우선 처방
          </p>
          <div className="space-y-2">
            {priorityPrescription.map((p, i) => (
              <div key={i} className="rounded-lg border border-primary-200 bg-primary-50/30 p-3">
                <p className="text-[12px] font-medium text-foreground">{p.action}</p>
                <p className="text-[10px] text-foreground-secondary mt-1">{p.why}</p>
                {p.example && (
                  <p className="text-[11px] text-primary-600 mt-1.5 italic">&ldquo;{p.example}&rdquo;</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: 구조 + 핵심 교정 */}
      <div className="px-3 py-3 sm:px-4 space-y-3">
        {/* 구조 평가 */}
        {coaching.structure_evaluation && (
          <div>
            <p className="text-xs font-medium text-foreground-muted mb-2">답변 구조</p>
            <StructureSection structure={coaching.structure_evaluation} />
          </div>
        )}

        {/* 핵심 교정 */}
        {coaching.key_corrections && coaching.key_corrections.length > 0 && (
          <div>
            <p className="text-xs font-medium text-foreground-muted mb-2">
              핵심 교정 ({coaching.key_corrections.length})
            </p>
            <ul className="space-y-1.5">
              {coaching.key_corrections.map((c, i) => (
                <li key={i} className="flex items-start gap-2 rounded-lg border border-border bg-surface p-2.5 text-[11px] leading-relaxed text-foreground">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary-100 text-[9px] font-bold text-primary-600">
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
        <div className="px-3 py-3 sm:px-4">
          <p className="text-xs font-medium text-foreground-muted mb-2">
            이렇게 말하면 더 좋아요
          </p>
          <AnswerImprovementSection improvement={coaching.answer_improvement} />
        </div>
      )}

      {/* Step 5: 전달 + 영역별 분석 */}
      <div className="px-3 py-3 sm:px-4 space-y-3">
        {/* 영역별 점수 */}
        {coaching.skill_summary && (
          <div>
            <p className="text-xs font-medium text-foreground-muted mb-2 flex items-center gap-1">
              <BarChart3 size={12} className="text-primary-400" />
              영역별 분석
            </p>
            <SkillSummaryGrid skills={coaching.skill_summary} />
          </div>
        )}

        {/* 발음 이해도 */}
        {evaluation.pronunciation_assessment && (
          <PronunciationSection assessment={evaluation.pronunciation_assessment} />
        )}
      </div>

      {/* 부가 섹션 (접힘) */}
      <div className="px-3 py-2.5 sm:px-4 space-y-1">
        {/* 심층 분석 */}
        {coaching.deep_analysis && (
          <button
            onClick={() => setShowDeep(!showDeep)}
            className="flex w-full items-center justify-between py-1.5 text-xs text-foreground-secondary hover:text-foreground"
          >
            <span className="flex items-center gap-1">
              <BookOpen size={12} />
              심층 분석 보기
            </span>
            {showDeep ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        )}
        {showDeep && coaching.deep_analysis && (
          <DeepAnalysisSection analysis={coaching.deep_analysis} />
        )}

        {/* 내 답변 원문 */}
        {evaluation.transcript && (
          <>
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className="flex w-full items-center justify-between py-1.5 text-xs text-foreground-secondary hover:text-foreground"
            >
              <span>내 답변 원문</span>
              {showTranscript ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
            {showTranscript && (
              <TranscriptSection transcript={evaluation.transcript} evaluation={evaluation} />
            )}
          </>
        )}

      </div>
    </div>
  );
}

// ── 과제충족 섹션 (v3 Step 1) ──

function TaskFulfillmentSection({
  fulfillment,
  feedbackBranch,
}: {
  fulfillment: TaskFulfillment;
  feedbackBranch: string | null;
}) {
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
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${s.color}`}>
          {s.icon} {s.label}
        </span>
      </div>

      {/* 체크리스트 */}
      <div className="space-y-1">
        {fulfillment.checklist.required.map((item, i) => (
          <div key={`r-${i}`} className="flex items-start gap-1.5 text-[10px]">
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
        {fulfillment.checklist.advanced.map((item, i) => (
          <div key={`a-${i}`} className="flex items-start gap-1.5 text-[10px]">
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
        <p className="mt-2 text-[10px] text-foreground-muted">{fulfillment.reason}</p>
      )}
    </div>
  );
}

// ── 답변 개선 (Layer 3) — v3 ──

function AnswerImprovementSection({ improvement }: { improvement: CoachingFeedback["answer_improvement"] }) {
  return (
    <div className="space-y-2.5">
      <div className="rounded-lg bg-green-50/50 p-2.5">
        <p className="text-[10px] font-medium text-green-700 mb-1">교정 답변 — 문법만 수정</p>
        <p className="text-[11px] leading-relaxed text-foreground">
          {improvement.corrected_version}
        </p>
      </div>

      <div className="rounded-lg bg-primary-50/50 p-2.5">
        <p className="text-[10px] font-medium text-primary-600 mb-1">더 나은 답변 — 목표 등급 수준</p>
        <p className="text-[11px] leading-relaxed text-foreground">
          {improvement.better_version}
        </p>
      </div>

      {improvement.what_changed && (
        <div>
          <p className="text-[10px] font-medium text-foreground-muted mb-1">개선 포인트</p>
          <p className="text-[10px] text-foreground-secondary">{improvement.what_changed}</p>
        </div>
      )}
    </div>
  );
}

// ── 영역별 분석 그리드 (Layer 4) — v3: Record<string, number> ──

function SkillSummaryGrid({ skills }: { skills: Record<string, number> }) {
  const entries = Object.entries(skills);

  return (
    <div className={`grid gap-1.5 sm:gap-2 ${entries.length <= 5 ? "grid-cols-5" : "grid-cols-3 sm:grid-cols-4"}`}>
      {entries.map(([key, score]) => (
        <div
          key={key}
          className={`rounded-lg p-2 text-center ${getSkillColor(score)}`}
        >
          <p className="text-[9px] font-medium opacity-80 truncate">
            {key}
          </p>
          <p className="text-sm font-bold">{score}</p>
        </div>
      ))}
    </div>
  );
}

// ── 구조 평가 (Layer 4) — v3: Record<string, string> ──

function StructureSection({ structure }: { structure: Record<string, string> }) {
  const entries = Object.entries(structure);

  return (
    <div className="rounded-lg bg-surface-secondary/50 p-2.5 space-y-2">
      {entries.map(([key, value]) => (
        <div key={key}>
          <p className="text-[9px] font-medium text-foreground-muted">{key}</p>
          <p className="text-[10px] text-foreground-secondary leading-relaxed">{value}</p>
        </div>
      ))}
    </div>
  );
}

// ── 발음 이해도 (V2 라벨 변환) ──

function PronunciationSection({ assessment }: { assessment: PronunciationAssessment }) {
  const accuracy = assessment.accuracy_score ?? 0;
  const pronLabel = getPronunciationLabel(accuracy);

  return (
    <div>
      <p className="text-xs font-medium text-foreground-muted mb-2 flex items-center gap-1">
        <Mic2 size={12} className="text-primary-400" />
        발음 이해도
      </p>
      <div className="flex items-center gap-3">
        <span className={`text-lg font-bold ${pronLabel.color}`}>
          {pronLabel.label}
        </span>
        <div className="flex gap-3 text-[10px] text-foreground-muted">
          <span>정확도 {accuracy.toFixed(0)}</span>
          <span>운율 {(assessment.prosody_score ?? 0).toFixed(0)}</span>
          <span>유창성 {(assessment.fluency_score ?? 0).toFixed(0)}</span>
        </div>
      </div>
    </div>
  );
}

// ── 심층 분석 (Layer 5) — v3: flat string 구조 ──

function DeepAnalysisSection({ analysis }: { analysis: CoachingFeedback["deep_analysis"] }) {
  return (
    <div className="rounded-lg bg-surface-secondary/30 p-3 space-y-3 mb-2">
      {analysis.strengths && (
        <div>
          <p className="text-[10px] font-medium text-green-600 mb-1">강점</p>
          <p className="text-[10px] text-foreground-secondary">{analysis.strengths}</p>
        </div>
      )}

      {analysis.weaknesses && (
        <div>
          <p className="text-[10px] font-medium text-red-500 mb-1">약점</p>
          <p className="text-[10px] text-foreground-secondary">{analysis.weaknesses}</p>
        </div>
      )}

      {analysis.target_gap && (
        <div>
          <p className="text-[10px] font-medium text-primary-500 mb-1">목표 도달을 위해</p>
          <p className="text-[10px] text-foreground-secondary">{analysis.target_gap}</p>
        </div>
      )}

      {analysis.practice_suggestion && (
        <div className="rounded bg-surface p-2">
          <p className="text-[10px] font-medium text-foreground mb-0.5">연습 제안</p>
          <p className="text-[10px] text-foreground-secondary">{analysis.practice_suggestion}</p>
        </div>
      )}
    </div>
  );
}

// ── 트랜스크립트 (접힌 섹션) ──

function TranscriptSection({ transcript, evaluation }: { transcript: string; evaluation: MockTestEvaluation }) {
  return (
    <div className="mb-2">
      <p className="whitespace-pre-wrap rounded-lg bg-surface p-3 text-[11px] leading-relaxed text-foreground">
        {transcript}
      </p>
      <div className="mt-1 flex gap-3 text-[10px] text-foreground-muted">
        {evaluation.wpm != null && <span>WPM: {evaluation.wpm}</span>}
        {evaluation.audio_duration != null && (
          <span>{evaluation.audio_duration.toFixed(0)}초</span>
        )}
        {evaluation.filler_count != null && evaluation.filler_count > 0 && (
          <span>필러: {evaluation.filler_count}개</span>
        )}
      </div>
    </div>
  );
}

// ── 체크박스 섹션 (접힌 섹션) ──
