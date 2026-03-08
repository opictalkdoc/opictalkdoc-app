"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Mic2,
  Loader2,
  BarChart3,
  Lightbulb,
  BookOpen,
  Target,
  Pause,
  Play,
} from "lucide-react";
import { getEvaluation } from "@/lib/actions/mock-exam";
import type {
  MockTestEvaluation,
  CoachingFeedback,
  TaskFulfillment,
  PronunciationAssessment,
} from "@/lib/types/mock-exam";
import { getPronunciationLabel } from "@/lib/types/mock-exam";

// question_type 한글
const QT_KO: Record<string, string> = {
  description: "묘사",
  routine: "루틴",
  asking_questions: "질문하기",
  comparison: "비교",
  experience_specific: "특정경험",
  experience_habitual: "습관경험",
  experience_past: "과거경험",
  suggest_alternatives: "대안제시",
  comparison_change: "비교변화",
  social_issue: "사회이슈",
};

// skill_summary 색상 (1~5)
function getSkillColor(score: number): string {
  if (score >= 4) return "text-green-600 bg-green-50";
  if (score >= 3) return "text-yellow-600 bg-yellow-50";
  return "text-red-500 bg-red-50";
}

// ── Props ──

interface TrainingEvalPanelProps {
  sessionId: string;
  questionNumber: number;
  questionInfo: {
    question_english: string;
    question_korean: string;
    question_type_eng: string;
    topic: string;
    category: string;
  } | null;
  onClose: () => void;
}

// ── 메인 컴포넌트 (인라인 뷰 — 세션 콘텐츠 영역을 대체) ──

export function TrainingEvalPanel({
  sessionId,
  questionNumber,
  questionInfo,
  onClose,
}: TrainingEvalPanelProps) {
  const [data, setData] = useState<MockTestEvaluation | null>(null);
  const [loading, setLoading] = useState(true);

  // questionNumber 변경 시 데이터 로드
  useEffect(() => {
    setLoading(true);
    setData(null);
    getEvaluation({
      session_id: sessionId,
      question_number: questionNumber,
    }).then((res) => {
      setData(res.data || null);
      setLoading(false);
    });
  }, [sessionId, questionNumber]);

  const coaching = data?.coaching_feedback as CoachingFeedback | null;

  return (
    <div className="mx-auto flex h-0 w-full max-w-5xl flex-grow flex-col overflow-hidden px-3 py-2 sm:px-6 sm:py-4 animate-fadeIn">
      {/* 헤더 */}
      <div className="shrink-0 mb-3 flex items-center gap-3 md:mb-4">
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-surface-secondary md:h-9 md:w-9"
        >
          <ArrowLeft size={18} className="text-foreground-secondary" />
        </button>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 md:h-9 md:w-9">
            <BarChart3 size={14} className="text-emerald-600 md:h-[18px] md:w-[18px]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground md:text-base">
              Q{questionNumber} 개별 평가
            </h3>
            {questionInfo && (
              <p className="text-[10px] text-foreground-muted md:text-xs">
                {QT_KO[questionInfo.question_type_eng] || questionInfo.question_type_eng}
                {questionInfo.topic && ` · ${questionInfo.topic}`}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 콘텐츠 — 스크롤 영역 */}
      <div className="h-0 flex-grow overflow-y-auto rounded-xl border border-border bg-surface p-4 max-md:[scrollbar-width:none] max-md:[&::-webkit-scrollbar]:hidden md:p-6">
        {loading ? (
          <div className="flex flex-col items-center py-12">
            <Loader2 size={24} className="animate-spin text-primary-500" />
            <p className="mt-2 text-sm text-foreground-secondary">
              평가 결과를 불러오는 중...
            </p>
          </div>
        ) : !data ? (
          <p className="py-12 text-center text-sm text-foreground-muted">
            평가 데이터가 없습니다.
          </p>
        ) : data.skipped ? (
          <p className="py-12 text-center text-sm text-foreground-muted">
            이 문항은 건너뛰었습니다.
          </p>
        ) : coaching ? (
          <V3CoachingView
            evaluation={data}
            coaching={coaching}
            questionInfo={questionInfo}
          />
        ) : (
          <p className="py-12 text-center text-sm text-foreground-muted">
            코칭 데이터가 아직 생성되지 않았습니다.
          </p>
        )}
      </div>

      {/* 하단 돌아가기 버튼 */}
      <div className="shrink-0 mt-3 md:mt-4">
        <button
          onClick={onClose}
          className="w-full rounded-xl bg-surface-secondary py-2.5 text-sm font-medium text-foreground-secondary transition-colors hover:bg-border md:py-3"
        >
          시험으로 돌아가기
        </button>
      </div>
    </div>
  );
}

// ── V3 코칭 뷰 (v3 설계 5단계) ──
// Step 1: 과제충족 + 인사이트
// Step 2: 최우선 처방
// Step 3: 구조 + 핵심 교정
// Step 4: 이렇게 말하면 더 좋아요
// Step 5: 전달 분석 (영역별 + 발음 + 심층)

function V3CoachingView({
  evaluation,
  coaching,
  questionInfo,
}: {
  evaluation: MockTestEvaluation;
  coaching: CoachingFeedback;
  questionInfo: TrainingEvalPanelProps["questionInfo"];
}) {
  const taskFulfillment = evaluation.task_fulfillment;
  const priorityPrescription = evaluation.priority_prescription;

  return (
    <div className="space-y-4 md:space-y-5">
      {/* 질문 원문 */}
      {questionInfo && (
        <div>
          <p className="text-[10px] font-medium text-foreground-muted mb-1 md:text-xs">Question</p>
          <p className="text-sm leading-relaxed text-foreground md:text-base">
            {questionInfo.question_english}
          </p>
          <p className="mt-0.5 text-xs text-foreground-secondary md:text-sm">
            {questionInfo.question_korean}
          </p>
        </div>
      )}

      {/* 나의 답변 + 오디오 */}
      {evaluation.transcript && (
        <TranscriptWithAudio evaluation={evaluation} />
      )}

      {/* 구분선 */}
      <div className="border-t border-border" />

      {/* Step 1: 과제충족 + AI 코치 인사이트 */}
      <div className="space-y-2.5">
        {/* 한줄 인사이트 */}
        <div className="flex items-start gap-2 rounded-lg bg-primary-50/50 p-3 md:p-4">
          <Lightbulb size={16} className="mt-0.5 shrink-0 text-primary-500" />
          <p className="text-sm leading-relaxed text-foreground md:text-base">
            {coaching.one_line_insight}
          </p>
        </div>

        {/* 과제충족 (v3) */}
        {taskFulfillment && (
          <TaskFulfillmentSection fulfillment={taskFulfillment} />
        )}
      </div>

      {/* Step 2: 최우선 처방 (v3) */}
      {priorityPrescription && priorityPrescription.length > 0 && (
        <div>
          <p className="text-xs font-medium text-primary-600 mb-2 flex items-center gap-1 md:text-sm">
            <Target size={14} />
            최우선 처방
          </p>
          <div className="space-y-2">
            {priorityPrescription.map((p, i) => (
              <div key={i} className="rounded-lg border border-primary-200 bg-primary-50/30 p-3 md:p-4">
                <p className="text-xs font-medium text-foreground md:text-sm">{p.action}</p>
                <p className="text-[10px] text-foreground-secondary mt-1 md:text-xs">{p.why}</p>
                {p.example && (
                  <p className="text-[11px] text-primary-600 mt-1.5 italic md:text-xs">&ldquo;{p.example}&rdquo;</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: 구조 + 핵심 교정 */}
      <div className="space-y-3">
        {coaching.structure_evaluation && (
          <div>
            <p className="text-xs font-medium text-foreground-muted mb-2 md:text-sm">답변 구조</p>
            <StructureSection structure={coaching.structure_evaluation} />
          </div>
        )}

        {coaching.key_corrections && coaching.key_corrections.length > 0 && (
          <div>
            <p className="text-xs font-medium text-foreground-muted mb-2 md:text-sm">
              핵심 교정 ({coaching.key_corrections.length})
            </p>
            <ul className="space-y-1.5">
              {coaching.key_corrections.map((c, i) => (
                <li key={i} className="flex items-start gap-2 rounded-lg border border-border bg-surface p-3 text-xs leading-relaxed text-foreground md:p-4 md:text-sm">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-[10px] font-bold text-primary-600">
                    {i + 1}
                  </span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Step 4: 이렇게 말하면 더 좋아요 */}
      {coaching.answer_improvement && (
        <div>
          <p className="text-xs font-medium text-foreground-muted mb-2 md:text-sm">
            이렇게 말하면 더 좋아요
          </p>
          <AnswerImprovementSection improvement={coaching.answer_improvement} />
        </div>
      )}

      {/* Step 5: 전달 분석 (영역별 + 발음 + 심층) */}
      <div className="space-y-3">
        {coaching.skill_summary && (
          <div>
            <p className="text-xs font-medium text-foreground-muted mb-2 flex items-center gap-1 md:text-sm">
              <BarChart3 size={12} className="text-primary-400" />
              영역별 분석
            </p>
            <SkillSummaryGrid skills={coaching.skill_summary} />
          </div>
        )}

        {evaluation.pronunciation_assessment && (
          <PronunciationSectionV2 assessment={evaluation.pronunciation_assessment} />
        )}

        {coaching.deep_analysis && (
          <div>
            <p className="text-xs font-medium text-foreground-muted mb-2 flex items-center gap-1 md:text-sm">
              <BookOpen size={12} className="text-primary-400" />
              심층 분석
            </p>
            <DeepAnalysisSection analysis={coaching.deep_analysis} />
          </div>
        )}
      </div>
    </div>
  );
}


// ── 과제충족 섹션 (v3 Step 1) ──

function TaskFulfillmentSection({ fulfillment }: { fulfillment: TaskFulfillment }) {
  const statusConfig = {
    fulfilled: { label: "충족", color: "text-green-600 bg-green-50", icon: "✓" },
    partial: { label: "부분 충족", color: "text-yellow-600 bg-yellow-50", icon: "△" },
    failed: { label: "미충족", color: "text-red-500 bg-red-50", icon: "✗" },
  };
  const s = statusConfig[fulfillment.status] || statusConfig.failed;

  return (
    <div className="rounded-lg bg-surface-secondary/50 p-3 md:p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-foreground-muted md:text-sm">과제 수행</p>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium md:text-xs ${s.color}`}>
          {s.icon} {s.label}
        </span>
      </div>

      {/* 체크리스트 */}
      <div className="space-y-1">
        {fulfillment.checklist.required.map((item, i) => (
          <div key={`r-${i}`} className="flex items-start gap-1.5 text-[10px] md:text-xs">
            {item.pass ? (
              <CheckCircle2 size={12} className="mt-0.5 shrink-0 text-green-500" />
            ) : (
              <XCircle size={12} className="mt-0.5 shrink-0 text-red-400" />
            )}
            <span className={item.pass ? "text-foreground-secondary" : "text-red-600 font-medium"}>
              {item.item}
            </span>
          </div>
        ))}
        {fulfillment.checklist.advanced.map((item, i) => (
          <div key={`a-${i}`} className="flex items-start gap-1.5 text-[10px] md:text-xs">
            {item.pass ? (
              <CheckCircle2 size={12} className="mt-0.5 shrink-0 text-green-500" />
            ) : (
              <XCircle size={12} className="mt-0.5 shrink-0 text-yellow-500" />
            )}
            <span className={item.pass ? "text-foreground-secondary" : "text-yellow-700"}>
              {item.item}
            </span>
          </div>
        ))}
      </div>

      {fulfillment.reason && (
        <p className="mt-2 text-[10px] text-foreground-muted md:text-xs">{fulfillment.reason}</p>
      )}
    </div>
  );
}

// ── 답변 개선 (Step 4) ──

function AnswerImprovementSection({ improvement }: { improvement: CoachingFeedback["answer_improvement"] }) {
  return (
    <div className="space-y-2.5">
      <div className="rounded-lg bg-green-50/50 p-3">
        <p className="text-[10px] font-medium text-green-700 mb-1 md:text-xs">교정 답변 — 문법만 수정</p>
        <p className="text-xs leading-relaxed text-foreground md:text-sm md:leading-6">
          {improvement.corrected_version}
        </p>
      </div>

      <div className="rounded-lg bg-primary-50/50 p-3">
        <p className="text-[10px] font-medium text-primary-600 mb-1 md:text-xs">더 나은 답변 — 목표 등급 수준</p>
        <p className="text-xs leading-relaxed text-foreground md:text-sm md:leading-6">
          {improvement.better_version}
        </p>
      </div>

      {improvement.what_changed && (
        <div>
          <p className="text-[10px] font-medium text-foreground-muted mb-1 md:text-xs">개선 포인트</p>
          <p className="text-[11px] text-foreground-secondary md:text-xs">{improvement.what_changed}</p>
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
          className={`rounded-lg p-2 text-center md:p-2.5 ${getSkillColor(score)}`}
        >
          <p className="text-[9px] font-medium opacity-80 md:text-[10px] truncate">
            {key}
          </p>
          <p className="text-base font-bold md:text-lg">{score}</p>
        </div>
      ))}
    </div>
  );
}

// ── 구조 평가 (Layer 4) — v3: Record<string, string> ──

function StructureSection({ structure }: { structure: Record<string, string> }) {
  const entries = Object.entries(structure);

  return (
    <div className="rounded-lg bg-surface-secondary/50 p-3 space-y-2 md:p-4">
      {entries.map(([key, value]) => (
        <div key={key}>
          <p className="text-[10px] font-medium text-foreground-muted md:text-xs">{key}</p>
          <p className="text-[11px] text-foreground-secondary leading-relaxed md:text-xs">{value}</p>
        </div>
      ))}
    </div>
  );
}

// ── 발음 이해도 ──

function PronunciationSectionV2({ assessment }: { assessment: PronunciationAssessment }) {
  const accuracy = assessment.accuracy_score ?? 0;
  const pronLabel = getPronunciationLabel(accuracy);

  return (
    <div>
      <p className="text-xs font-medium text-foreground-muted mb-2 flex items-center gap-1 md:text-sm">
        <Mic2 size={12} className="text-primary-400" />
        발음 이해도
      </p>
      <div className="flex items-center gap-3">
        <span className={`text-lg font-bold md:text-xl ${pronLabel.color}`}>
          {pronLabel.label}
        </span>
        <div className="flex gap-3 text-[10px] text-foreground-muted md:text-xs">
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
    <div className="rounded-lg bg-surface-secondary/30 p-3 space-y-3 mb-2 md:p-4">
      {analysis.strengths && (
        <div>
          <p className="text-[11px] font-medium text-green-600 mb-1 md:text-xs">강점</p>
          <p className="text-[11px] text-foreground-secondary md:text-xs">{analysis.strengths}</p>
        </div>
      )}

      {analysis.weaknesses && (
        <div>
          <p className="text-[11px] font-medium text-red-500 mb-1 md:text-xs">약점</p>
          <p className="text-[11px] text-foreground-secondary md:text-xs">{analysis.weaknesses}</p>
        </div>
      )}

      {analysis.target_gap && (
        <div>
          <p className="text-[11px] font-medium text-primary-500 mb-1 md:text-xs">목표 도달을 위해</p>
          <p className="text-[11px] text-foreground-secondary md:text-xs">{analysis.target_gap}</p>
        </div>
      )}

      {analysis.practice_suggestion && (
        <div className="rounded bg-surface p-2 md:p-3">
          <p className="text-[11px] font-medium text-foreground mb-0.5 md:text-xs">연습 제안</p>
          <p className="text-[11px] text-foreground-secondary md:text-xs">{analysis.practice_suggestion}</p>
        </div>
      )}
    </div>
  );
}

// ── 답변 원문 + 오디오 플레이어 ──

function TranscriptWithAudio({ evaluation }: { evaluation: MockTestEvaluation }) {
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
    if (audioRef.current || !evaluation.audio_url) return audioRef.current;
    const audio = new Audio(evaluation.audio_url);
    audio.addEventListener("loadedmetadata", () => setDuration(audio.duration));
    audio.addEventListener("timeupdate", () => setCurrentTime(audio.currentTime));
    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });
    audioRef.current = audio;
    return audio;
  }, [evaluation.audio_url]);

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
    <div className="mb-2">
      {/* 오디오 플레이어 */}
      {evaluation.audio_url && (
        <div className="mb-2 flex items-center gap-2 rounded-lg border border-border bg-surface-secondary/50 px-3 py-2 md:gap-3 md:px-4 md:py-2.5">
          <button
            onClick={togglePlay}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-500 text-white transition-colors hover:bg-primary-600 active:scale-95 md:h-9 md:w-9"
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
          </button>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div
              ref={progressBarRef}
              onClick={handleSeek}
              className="group relative h-1.5 cursor-pointer rounded-full bg-border md:h-2"
            >
              <div
                className="h-full rounded-full bg-primary-500 transition-[width] duration-150 ease-linear"
                style={{ width: `${progress}%` }}
              />
              <div
                className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-primary-500 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 md:h-3.5 md:w-3.5"
                style={{ left: `calc(${progress}% - 6px)`, opacity: isPlaying || progress > 0 ? 1 : undefined }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-foreground-muted md:text-xs">
              <span>{formatTime(currentTime)}</span>
              <span>{duration > 0 ? formatTime(duration) : evaluation.audio_duration ? formatTime(evaluation.audio_duration) : "--:--"}</span>
            </div>
          </div>
        </div>
      )}

      {/* 트랜스크립트 */}
      <p className="whitespace-pre-wrap rounded-lg border border-border bg-white p-3 text-xs leading-relaxed text-foreground md:p-4 md:text-sm md:leading-7">
        {evaluation.transcript}
      </p>

      {/* 메타 정보 */}
      <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-foreground-muted md:mt-2 md:gap-x-4 md:text-xs">
        {evaluation.wpm != null && evaluation.wpm > 0 && <span>WPM: {evaluation.wpm.toFixed(0)}</span>}
        {evaluation.audio_duration != null && evaluation.audio_duration > 0 && (
          <span>{evaluation.audio_duration.toFixed(0)}초</span>
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

