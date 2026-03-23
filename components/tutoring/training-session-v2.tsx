"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Mic,
  MicOff,
  Square,
  Play,
  CheckCircle2,
  XCircle,
  ChevronRight,
  RotateCcw,
  BookOpen,
  Target,
  Trophy,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useRecorder } from "@/lib/hooks/use-recorder";
import { createClient } from "@/lib/supabase";
import { completeTrainingV2 } from "@/lib/actions/tutoring-v2";
import type {
  TutoringTrainingV2,
  TutoringPrescriptionV2,
  TutoringAttemptV2,
  DrillDefinition,
  TutoringSessionV2,
  EvaluationGptResult,
  TrainingApproach,
  TrainingQuestion,
} from "@/lib/types/tutoring-v2";

// ── 상수 ──

const APPROACH_LABEL: Record<TrainingApproach, string> = {
  frame_install: "틀 장착",
  swap_drill: "바꿔 끼기",
  self_correction: "자기 교정",
  timed_pressure: "시간 압박",
  pattern_drill: "패턴 반복",
};

// ── Props ──

interface TrainingSessionV2Props {
  training: TutoringTrainingV2;
  prescription: TutoringPrescriptionV2;
  drill: DrillDefinition;
  initialAttempts: TutoringAttemptV2[];
  session: TutoringSessionV2;
}

// ── 5-Screen 타입 ──

type ScreenType = "brief" | "demo" | "practice" | "check" | "recap";
const SCREENS: ScreenType[] = ["brief", "demo", "practice", "check", "recap"];

export function TrainingSessionV2({
  training,
  prescription,
  drill,
  initialAttempts,
  session,
}: TrainingSessionV2Props) {
  const router = useRouter();

  // ── 상태 ──
  const [currentScreen, setCurrentScreen] = useState<ScreenType>(
    initialAttempts.length > 0 && initialAttempts.length >= training.max_rounds
      ? "recap"
      : "brief"
  );
  const [currentRound, setCurrentRound] = useState(initialAttempts.length + 1);
  const [attempts, setAttempts] = useState<TutoringAttemptV2[]>(initialAttempts);
  const [latestEvaluation, setLatestEvaluation] = useState<EvaluationGptResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationError, setEvaluationError] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);

  // 녹음 훅
  const recorder = useRecorder({
    maxDuration: 120,
    minDuration: 5,
    timeWarningAt: 15,
  });

  // transcript (Web Speech API)
  const [transcript, setTranscript] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef("");

  // ── Web Speech API 초기화 ──
  const startSpeechRecognition = useCallback(() => {
    // Web Speech API 지원 확인
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const W = window as any;
    const SpeechRecognitionCtor = W.SpeechRecognition || W.webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      console.warn("Web Speech API 미지원 — transcript 수동 입력 필요");
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let finalTranscript = "";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript + " ";
        } else {
          interim += result[0].transcript;
        }
      }
      const combined = (finalTranscript + interim).trim();
      transcriptRef.current = combined;
      setTranscript(combined);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      // not-allowed, aborted 등은 무시 (녹음은 별도로 진행됨)
      if (event.error !== "aborted") {
        console.warn("Speech recognition:", event.error);
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
  }, []);

  const stopSpeechRecognition = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  }, []);

  // ── 녹음 시작 ──
  const handleStartRecording = useCallback(async () => {
    setTranscript("");
    transcriptRef.current = "";
    setEvaluationError(null);
    await recorder.startRecording();
    startSpeechRecognition();
  }, [recorder, startSpeechRecognition]);

  // ── 녹음 중지 ──
  const handleStopRecording = useCallback(() => {
    recorder.stopRecording();
    stopSpeechRecognition();
  }, [recorder, stopSpeechRecognition]);

  // ── 오디오 업로드 + EF 호출 ──
  const handleSubmit = useCallback(async () => {
    if (!recorder.audioBlob) return;

    setIsEvaluating(true);
    setEvaluationError(null);

    try {
      const supabase = createClient();
      const { data: { session: authSession } } = await supabase.auth.getSession();
      if (!authSession) throw new Error("로그인이 필요합니다");

      // 1. Storage 업로드
      const fileName = `${training.id}_r${currentRound}_${Date.now()}.wav`;
      const filePath = `${authSession.user.id}/${fileName}`;

      const { error: uploadErr } = await supabase.storage
        .from("tutoring-recordings")
        .upload(filePath, recorder.audioBlob, {
          contentType: "audio/wav",
          upsert: false,
        });

      if (uploadErr) {
        console.error("업로드 실패:", uploadErr);
        throw new Error("오디오 업로드 실패");
      }

      const { data: urlData } = supabase.storage
        .from("tutoring-recordings")
        .getPublicUrl(filePath);

      const audioUrl = urlData?.publicUrl || null;

      // 2. transcript 확인
      const finalTranscript = transcriptRef.current || transcript;
      if (!finalTranscript || finalTranscript.length < 5) {
        throw new Error("음성 인식 결과가 부족합니다. 다시 시도해주세요.");
      }

      // 3. 메트릭 계산
      const durationSec = recorder.duration;
      const words = finalTranscript.split(/\s+/).filter(Boolean);
      const wordCount = words.length;
      const wpm = durationSec > 0 ? Math.round((wordCount / durationSec) * 60) : 0;

      // 4. Edge Function 호출
      const efUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/tutoring-v2-evaluate`;

      const efResp = await fetch(efUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authSession.access_token}`,
        },
        body: JSON.stringify({
          training_id: training.id,
          round_number: currentRound,
          transcript: finalTranscript,
          duration_sec: durationSec,
          word_count: wordCount,
          wpm,
          audio_url: audioUrl,
        }),
      });

      if (!efResp.ok) {
        const errData = await efResp.json().catch(() => ({}));
        throw new Error(errData.error || `평가 실패 (${efResp.status})`);
      }

      const efResult = await efResp.json();

      // 5. 결과 반영
      const evaluation = efResult.evaluation as EvaluationGptResult;
      setLatestEvaluation(evaluation);

      // 시도 추가
      const newAttempt: TutoringAttemptV2 = {
        id: efResult.attempt_id,
        training_id: training.id,
        round_number: currentRound,
        transcript: finalTranscript,
        audio_url: audioUrl,
        duration_sec: durationSec,
        word_count: wordCount,
        wpm,
        evaluation,
        passed: evaluation.passed,
        created_at: new Date().toISOString(),
      };
      setAttempts((prev) => [...prev, newAttempt]);

      // 6. Screen 전환
      setCurrentScreen("check");
    } catch (err) {
      setEvaluationError(
        err instanceof Error ? err.message : "평가 중 오류가 발생했습니다"
      );
    } finally {
      setIsEvaluating(false);
    }
  }, [recorder, training.id, currentRound, transcript]);

  // ── 다시 시도 (Check → Practice) ──
  const handleRetry = useCallback(() => {
    setCurrentRound((prev) => prev + 1);
    setLatestEvaluation(null);
    recorder.reset();
    setTranscript("");
    transcriptRef.current = "";
    setCurrentScreen("practice");
  }, [recorder]);

  // ── 다음 단계 (Check → Recap 또는 다음 라운드) ──
  const handleNext = useCallback(() => {
    const passCount = attempts.filter((a) => a.passed).length;
    const trainingPassed = passCount >= 2;
    const isLastRound = attempts.length >= training.max_rounds;

    if (trainingPassed || isLastRound) {
      setCurrentScreen("recap");
    } else {
      handleRetry();
    }
  }, [attempts, training.max_rounds, handleRetry]);

  // ── 훈련 완료 ──
  const handleComplete = useCallback(async () => {
    setIsCompleting(true);
    await completeTrainingV2(training.id);
    setIsCompleting(false);
    router.push("/tutoring");
  }, [training.id, router]);

  // ── 전체 판정 ──
  const passCount = attempts.filter((a) => a.passed).length;
  const trainingPassed = passCount >= 2;

  // ── 렌더링 ──

  return (
    <div className="relative h-0 flex-grow">
      <div className="absolute inset-0 overflow-y-auto max-md:[scrollbar-width:none] max-md:[&::-webkit-scrollbar]:hidden">
        {/* 진행 상태 바 */}
        <div className="sticky top-0 z-10 border-b border-border bg-surface/95 px-4 py-2 backdrop-blur-md">
          <div className="mx-auto flex max-w-3xl items-center justify-between">
            <div className="flex items-center gap-2">
              {SCREENS.map((screen, idx) => (
                <div
                  key={screen}
                  className={`h-1.5 w-8 rounded-full transition-colors ${
                    SCREENS.indexOf(currentScreen) >= idx
                      ? "bg-primary-500"
                      : "bg-border"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-foreground-muted">
              {APPROACH_LABEL[drill.approach as TrainingApproach] || drill.approach}
            </span>
          </div>
        </div>

        <div className="mx-auto w-full max-w-3xl px-4 py-6 md:px-8 md:py-10">
          {currentScreen === "brief" && (
            <ScreenBrief
              drill={drill}
              prescription={prescription}
              session={session}
              onStart={() => setCurrentScreen("demo")}
            />
          )}

          {currentScreen === "demo" && (
            <ScreenDemo
              drill={drill}
              prescription={prescription}
              onStart={() => {
                recorder.reset();
                setTranscript("");
                transcriptRef.current = "";
                setCurrentScreen("practice");
              }}
            />
          )}

          {currentScreen === "practice" && (
            <ScreenPractice
              drill={drill}
              currentRound={currentRound}
              maxRounds={training.max_rounds}
              question={
                training.question_ids?.[currentRound - 1] ?? null
              }
              recorder={recorder}
              transcript={transcript}
              isEvaluating={isEvaluating}
              evaluationError={evaluationError}
              onStartRecording={handleStartRecording}
              onStopRecording={handleStopRecording}
              onSubmit={handleSubmit}
            />
          )}

          {currentScreen === "check" && latestEvaluation && (
            <ScreenCheck
              evaluation={latestEvaluation}
              currentRound={currentRound}
              maxRounds={training.max_rounds}
              passCount={passCount}
              totalAttempts={attempts.length}
              onRetry={handleRetry}
              onNext={handleNext}
            />
          )}

          {currentScreen === "recap" && (
            <ScreenRecap
              drill={drill}
              attempts={attempts}
              trainingPassed={trainingPassed}
              passCount={passCount}
              isCompleting={isCompleting}
              onComplete={handleComplete}
              onBack={() => router.push("/tutoring")}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// Screen 0: Brief — 약점 요약 + 드릴 설명 + 성공 기준
// ═══════════════════════════════════════════════════

function ScreenBrief({
  drill,
  prescription,
  session,
  onStart,
}: {
  drill: DrillDefinition;
  prescription: TutoringPrescriptionV2;
  session: TutoringSessionV2;
  onStart: () => void;
}) {
  const prescriptionData = prescription.prescription_data;

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="text-center">
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-bold text-primary-700">
          <Target size={14} />
          오늘의 훈련
        </div>
        <h1 className="text-xl font-bold text-foreground">
          {drill.name_ko}
        </h1>
        <p className="mt-1 text-sm text-foreground-secondary">
          {APPROACH_LABEL[drill.approach as TrainingApproach]} 방식으로 훈련합니다
        </p>
      </div>

      {/* 약점 설명 */}
      {prescriptionData?.what_to_fix && (
        <section className="rounded-xl border border-border bg-surface p-5">
          <h3 className="mb-2 flex items-center gap-1.5 text-[15px] font-extrabold text-foreground">
            <span className="text-[#2449d8]">•</span> 뭘 고칠까?
          </h3>
          <p className="text-[14px] leading-[1.9] text-[#2f3644]">
            {prescriptionData.what_to_fix}
          </p>
        </section>
      )}

      {/* 드릴 설명 */}
      <section className="rounded-xl border border-border bg-surface p-5">
        <h3 className="mb-2 flex items-center gap-1.5 text-[15px] font-extrabold text-foreground">
          <span className="text-[#2449d8]">•</span> 훈련 방법
        </h3>
        <p className="text-[14px] leading-[1.9] text-[#2f3644]">
          {drill.training_method?.description || "이 드릴의 훈련 방법을 따릅니다."}
        </p>
      </section>

      {/* 성공 기준 */}
      <section className="rounded-xl border border-border bg-surface p-5">
        <h3 className="mb-2 flex items-center gap-1.5 text-[15px] font-extrabold text-foreground">
          <span className="text-[#2449d8]">•</span> 성공 기준
        </h3>
        <div className="rounded-lg bg-primary-50 p-3">
          <p className="text-[14px] font-semibold text-primary-700">
            {drill.success_criteria?.metric}: {drill.success_criteria?.threshold}
          </p>
        </div>
      </section>

      {/* 외울 표현 (있으면) */}
      {drill.training_method?.target_expressions &&
        drill.training_method.target_expressions.length > 0 && (
          <section className="rounded-xl border border-border bg-surface p-5">
            <h3 className="mb-2 flex items-center gap-1.5 text-[15px] font-extrabold text-foreground">
              <span className="text-[#2449d8]">•</span> 외울 표현
            </h3>
            <ul className="space-y-1.5">
              {drill.training_method.target_expressions.map((expr, i) => (
                <li
                  key={i}
                  className="rounded-lg bg-surface-secondary px-3 py-2 text-[14px] font-medium text-foreground"
                >
                  {expr}
                </li>
              ))}
            </ul>
          </section>
        )}

      {/* 템플릿 (있으면) */}
      {drill.training_method?.template && (
        <section className="rounded-xl border border-border bg-surface p-5">
          <h3 className="mb-2 flex items-center gap-1.5 text-[15px] font-extrabold text-foreground">
            <span className="text-[#2449d8]">•</span> 만능 틀
          </h3>
          <pre className="whitespace-pre-wrap rounded-lg bg-surface-secondary p-4 text-[13px] leading-[1.8] text-foreground">
            {drill.training_method.template}
          </pre>
        </section>
      )}

      {/* 격려 */}
      {prescriptionData?.encouragement && (
        <p className="text-center text-[14px] text-foreground-secondary italic">
          &ldquo;{prescriptionData.encouragement}&rdquo;
        </p>
      )}

      {/* 시작 버튼 */}
      <button
        onClick={onStart}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-6 py-4 text-base font-bold text-white shadow-md transition-all hover:bg-primary-700 active:scale-[0.98]"
      >
        시작하기
        <ChevronRight size={20} />
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// Screen 1: Demo — 시범 (접근법에 따라 내용 다름)
// ═══════════════════════════════════════════════════

function ScreenDemo({
  drill,
  prescription,
  onStart,
}: {
  drill: DrillDefinition;
  prescription: TutoringPrescriptionV2;
  onStart: () => void;
}) {
  const prescriptionData = prescription.prescription_data;
  const approach = drill.approach as TrainingApproach;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
          <BookOpen size={14} />
          시범
        </div>
        <h2 className="text-lg font-bold text-foreground">
          이렇게 하는 거야
        </h2>
      </div>

      {/* 접근법별 내용 */}
      {approach === "frame_install" && (
        <section className="space-y-4">
          {drill.training_method?.template && (
            <div className="rounded-xl border border-border bg-surface p-5">
              <h3 className="mb-3 text-[15px] font-extrabold text-foreground">
                장착할 틀
              </h3>
              <pre className="whitespace-pre-wrap rounded-lg bg-primary-50 p-4 text-[14px] leading-[2] text-primary-700">
                {drill.training_method.template}
              </pre>
            </div>
          )}
          {prescriptionData?.after_example && (
            <div className="rounded-xl border border-border bg-surface p-5">
              <h3 className="mb-2 text-[15px] font-extrabold text-foreground">
                모범 답변 예시
              </h3>
              <p className="text-[14px] leading-[1.9] text-[#2f3644]">
                {prescriptionData.after_example}
              </p>
            </div>
          )}
        </section>
      )}

      {approach === "swap_drill" && (
        <section className="space-y-4">
          {prescriptionData?.before_example && (
            <div className="rounded-xl border border-border bg-surface p-5">
              <h3 className="mb-2 text-[15px] font-extrabold text-foreground">
                Before (현재)
              </h3>
              <p className="text-[14px] leading-[1.9] text-red-600">
                {prescriptionData.before_example}
              </p>
            </div>
          )}
          {prescriptionData?.after_example && (
            <div className="rounded-xl border border-border bg-surface p-5">
              <h3 className="mb-2 text-[15px] font-extrabold text-foreground">
                After (목표)
              </h3>
              <p className="text-[14px] leading-[1.9] text-green-700">
                {prescriptionData.after_example}
              </p>
            </div>
          )}
          {drill.training_method?.target_expressions &&
            drill.training_method.target_expressions.length > 0 && (
              <div className="rounded-xl border border-border bg-surface p-5">
                <h3 className="mb-2 text-[15px] font-extrabold text-foreground">
                  바꿔 끼울 표현
                </h3>
                <div className="flex flex-wrap gap-2">
                  {drill.training_method.target_expressions.map((expr, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-primary-50 px-3 py-1 text-[13px] font-semibold text-primary-700"
                    >
                      {expr}
                    </span>
                  ))}
                </div>
              </div>
            )}
        </section>
      )}

      {approach === "self_correction" && (
        <section className="space-y-4">
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="mb-2 text-[15px] font-extrabold text-foreground">
              자기 교정 방법
            </h3>
            <p className="text-[14px] leading-[1.9] text-[#2f3644]">
              {drill.training_method?.description ||
                "틀린 부분을 인지하고, 즉시 고쳐서 다시 말하는 연습입니다."}
            </p>
          </div>
          {prescriptionData?.before_example && prescriptionData?.after_example && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-red-50 p-4">
                <p className="mb-1 text-xs font-bold text-red-600">Before</p>
                <p className="text-[14px] text-red-700">
                  {prescriptionData.before_example}
                </p>
              </div>
              <div className="rounded-lg bg-green-50 p-4">
                <p className="mb-1 text-xs font-bold text-green-600">After</p>
                <p className="text-[14px] text-green-700">
                  {prescriptionData.after_example}
                </p>
              </div>
            </div>
          )}
        </section>
      )}

      {(approach === "timed_pressure" || approach === "pattern_drill") && (
        <section className="rounded-xl border border-border bg-surface p-5">
          <h3 className="mb-2 text-[15px] font-extrabold text-foreground">
            {approach === "timed_pressure" ? "시간 배분 안내" : "패턴 학습"}
          </h3>
          <p className="text-[14px] leading-[1.9] text-[#2f3644]">
            {drill.training_method?.description}
          </p>
          {drill.training_method?.target_expressions &&
            drill.training_method.target_expressions.length > 0 && (
              <div className="mt-3 space-y-1.5">
                {drill.training_method.target_expressions.map((expr, i) => (
                  <div
                    key={i}
                    className="rounded-lg bg-surface-secondary px-3 py-2 text-[14px] text-foreground"
                  >
                    {expr}
                  </div>
                ))}
              </div>
            )}
        </section>
      )}

      {/* 연습 시작 버튼 */}
      <button
        onClick={onStart}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-6 py-4 text-base font-bold text-white shadow-md transition-all hover:bg-primary-700 active:scale-[0.98]"
      >
        연습 시작
        <Play size={20} />
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// Screen 2: Practice — 질문 → 녹음 → 제출
// ═══════════════════════════════════════════════════

function ScreenPractice({
  drill,
  currentRound,
  maxRounds,
  question,
  recorder,
  transcript,
  isEvaluating,
  evaluationError,
  onStartRecording,
  onStopRecording,
  onSubmit,
}: {
  drill: DrillDefinition;
  currentRound: number;
  maxRounds: number;
  question: { id: string; text: string; topic: string } | null;
  recorder: ReturnType<typeof useRecorder>;
  transcript: string;
  isEvaluating: boolean;
  evaluationError: string | null;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onSubmit: () => void;
}) {
  // 볼륨 바 높이 계산
  const volumeHeight = Math.max(4, recorder.volume * 100);

  return (
    <div className="space-y-6">
      {/* 라운드 표시 */}
      <div className="text-center">
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
          <Mic size={14} />
          라운드 {currentRound} / {maxRounds}
        </div>
        <h2 className="text-lg font-bold text-foreground">
          {drill.name_ko} 연습
        </h2>
      </div>

      {/* 연습 질문 */}
      {question ? (
        <div className="rounded-xl border border-primary-200 bg-primary-50/50 p-4">
          <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-primary-600">
            <BookOpen size={14} />
            {question.topic && <span>{question.topic}</span>}
          </div>
          <p className="text-[15px] font-medium leading-relaxed text-foreground">
            {question.text}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-600">
            연습 질문을 불러올 수 없습니다. 튜터링을 다시 시작해주세요.
          </p>
        </div>
      )}

      {/* 성공 기준 리마인더 */}
      <div className="rounded-lg bg-amber-50 px-4 py-2.5 text-center text-[13px] font-medium text-amber-700">
        🎯 목표: {drill.success_criteria?.threshold}
      </div>

      {/* 녹음 UI */}
      <div className="flex flex-col items-center gap-6 py-8">
        {/* 볼륨 인디케이터 */}
        {recorder.state === "recording" && (
          <div className="flex items-end gap-1 h-16">
            {[0.3, 0.6, 1, 0.8, 0.5, 0.9, 0.4, 0.7, 1, 0.6].map((scale, i) => (
              <div
                key={i}
                className="w-1.5 rounded-full bg-primary-500 transition-all duration-150"
                style={{
                  height: `${Math.max(4, volumeHeight * scale)}%`,
                  opacity: 0.4 + recorder.volume * 0.6,
                }}
              />
            ))}
          </div>
        )}

        {/* 녹음 버튼 */}
        <div className="relative">
          {recorder.state === "idle" && (
            <button
              onClick={onStartRecording}
              disabled={isEvaluating}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-500 text-white shadow-lg transition-all hover:bg-primary-700 hover:shadow-xl active:scale-95 disabled:opacity-50"
            >
              <Mic size={32} />
            </button>
          )}

          {recorder.state === "recording" && (
            <button
              onClick={onStopRecording}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-all hover:bg-red-600 active:scale-95 animate-pulse"
            >
              <Square size={28} />
            </button>
          )}

          {recorder.state === "stopped" && !isEvaluating && (
            <button
              onClick={onSubmit}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-all hover:bg-green-600 active:scale-95"
            >
              <ArrowRight size={32} />
            </button>
          )}

          {isEvaluating && (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-surface-secondary shadow-lg">
              <Loader2 size={32} className="animate-spin text-primary-500" />
            </div>
          )}
        </div>

        {/* 상태 텍스트 */}
        <div className="text-center">
          {recorder.state === "idle" && (
            <p className="text-sm text-foreground-secondary">
              버튼을 눌러 녹음을 시작하세요
            </p>
          )}
          {recorder.state === "recording" && (
            <div className="space-y-1">
              <p className="text-lg font-bold tabular-nums text-foreground">
                {Math.floor(recorder.duration / 60)}:{String(recorder.duration % 60).padStart(2, "0")}
              </p>
              {recorder.warningMessage && (
                <p className="text-sm font-medium text-amber-600">
                  {recorder.warningMessage}
                </p>
              )}
            </div>
          )}
          {recorder.state === "stopped" && !isEvaluating && (
            <p className="text-sm text-foreground-secondary">
              제출 버튼을 눌러 평가를 받으세요
            </p>
          )}
          {isEvaluating && (
            <p className="text-sm text-primary-500">
              평가 중... 잠시만 기다려주세요
            </p>
          )}
        </div>

        {/* transcript 미리보기 */}
        {transcript && (
          <div className="w-full rounded-lg bg-surface-secondary p-4">
            <p className="mb-1 text-xs font-bold text-foreground-muted">
              인식된 텍스트
            </p>
            <p className="text-[14px] leading-[1.8] text-foreground">
              {transcript}
            </p>
          </div>
        )}

        {/* 에러 */}
        {(evaluationError || recorder.error) && (
          <div className="w-full rounded-lg bg-red-50 p-4 text-center">
            <p className="text-sm text-red-600">
              {evaluationError || recorder.error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// Screen 3: Check — GPT 평가 결과 표시
// ═══════════════════════════════════════════════════

function ScreenCheck({
  evaluation,
  currentRound,
  maxRounds,
  passCount,
  totalAttempts,
  onRetry,
  onNext,
}: {
  evaluation: EvaluationGptResult;
  currentRound: number;
  maxRounds: number;
  passCount: number;
  totalAttempts: number;
  onRetry: () => void;
  onNext: () => void;
}) {
  const trainingPassed = passCount >= 2;
  const canRetry = totalAttempts < maxRounds && !trainingPassed;

  return (
    <div className="space-y-6">
      {/* 결과 헤더 */}
      <div className="text-center">
        {evaluation.passed ? (
          <>
            <div className="mb-3 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 size={36} className="text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-green-700">통과!</h2>
          </>
        ) : (
          <>
            <div className="mb-3 inline-flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
              <XCircle size={36} className="text-amber-600" />
            </div>
            <h2 className="text-xl font-bold text-amber-700">아쉽지만 미달</h2>
          </>
        )}
        <p className="mt-1 text-sm text-foreground-secondary">
          라운드 {currentRound} / {maxRounds} · 통과 {passCount}회
        </p>
      </div>

      {/* 충족률 바 */}
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-bold text-foreground">충족률</span>
          <span
            className={`text-lg font-bold ${
              evaluation.fulfillment_rate >= 70
                ? "text-green-600"
                : evaluation.fulfillment_rate >= 40
                  ? "text-amber-600"
                  : "text-red-600"
            }`}
          >
            {evaluation.fulfillment_rate}%
          </span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-surface-secondary">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              evaluation.fulfillment_rate >= 70
                ? "bg-green-500"
                : evaluation.fulfillment_rate >= 40
                  ? "bg-amber-500"
                  : "bg-red-500"
            }`}
            style={{ width: `${evaluation.fulfillment_rate}%` }}
          />
        </div>
      </div>

      {/* 항목별 판정 */}
      <section className="rounded-xl border border-border bg-surface p-5">
        <h3 className="mb-3 flex items-center gap-1.5 text-[15px] font-extrabold text-foreground">
          <span className="text-[#2449d8]">•</span> 성공 기준 체크
        </h3>
        <div className="space-y-3">
          {evaluation.criteria_check.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-lg bg-surface-secondary px-4 py-3"
            >
              {item.pass ? (
                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0 text-green-500"
                />
              ) : (
                <XCircle
                  size={18}
                  className="mt-0.5 shrink-0 text-red-500"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-semibold text-foreground">
                  {item.item}
                </p>
                <p className="mt-0.5 text-[13px] text-foreground-secondary">
                  {item.evidence}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 피드백 */}
      <section className="rounded-xl border border-border bg-surface p-5">
        <h3 className="mb-2 flex items-center gap-1.5 text-[15px] font-extrabold text-foreground">
          <span className="text-[#2449d8]">•</span> 피드백
        </h3>
        <p className="text-[14px] leading-[1.9] text-[#2f3644]">
          {evaluation.feedback}
        </p>
      </section>

      {/* 다음 포인트 (미달 시) */}
      {!evaluation.passed && evaluation.next_focus && (
        <div className="rounded-lg bg-amber-50 px-4 py-3">
          <p className="text-sm font-bold text-amber-700">다음 포인트</p>
          <p className="mt-1 text-[14px] text-amber-600">
            {evaluation.next_focus}
          </p>
        </div>
      )}

      {/* 이전 대비 변화 */}
      {evaluation.delta_vs_previous && (
        <div className="rounded-lg bg-blue-50 px-4 py-3">
          <p className="text-sm font-bold text-blue-700">이전 대비 변화</p>
          <p className="mt-1 text-[14px] text-blue-600">
            {evaluation.delta_vs_previous}
          </p>
        </div>
      )}

      {/* 격려 */}
      <p className="text-center text-[14px] text-foreground-secondary italic">
        &ldquo;{evaluation.encouragement}&rdquo;
      </p>

      {/* 버튼 */}
      <div className="flex gap-3">
        {canRetry && !evaluation.passed && (
          <button
            onClick={onRetry}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-3.5 text-sm font-bold text-foreground transition-all hover:bg-surface-secondary active:scale-[0.98]"
          >
            <RotateCcw size={18} />
            다시 시도
          </button>
        )}
        <button
          onClick={onNext}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-primary-700 active:scale-[0.98]"
        >
          {evaluation.passed || !canRetry ? "다음으로" : "다음으로 넘어가기"}
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// Screen 4: Recap — 세션 요약
// ═══════════════════════════════════════════════════

function ScreenRecap({
  drill,
  attempts,
  trainingPassed,
  passCount,
  isCompleting,
  onComplete,
  onBack,
}: {
  drill: DrillDefinition;
  attempts: TutoringAttemptV2[];
  trainingPassed: boolean;
  passCount: number;
  isCompleting: boolean;
  onComplete: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-6">
      {/* 결과 헤더 */}
      <div className="text-center">
        {trainingPassed ? (
          <>
            <div className="mb-3 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <Trophy size={40} className="text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-green-700">
              훈련 통과!
            </h2>
            <p className="mt-1 text-sm text-foreground-secondary">
              이 약점은 해결했어! 다음 처방으로 가자
            </p>
          </>
        ) : (
          <>
            <div className="mb-3 inline-flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
              <RotateCcw size={40} className="text-amber-600" />
            </div>
            <h2 className="text-xl font-bold text-amber-700">
              다음에 다시 도전!
            </h2>
            <p className="mt-1 text-sm text-foreground-secondary">
              아직 연습이 더 필요해. 나중에 다시 도전하자
            </p>
          </>
        )}
      </div>

      {/* 라운드 요약 */}
      <section className="rounded-xl border border-border bg-surface p-5">
        <h3 className="mb-3 flex items-center gap-1.5 text-[15px] font-extrabold text-foreground">
          <span className="text-[#2449d8]">•</span> 라운드 요약
        </h3>
        <div className="space-y-2">
          {attempts.map((attempt) => (
            <div
              key={attempt.id}
              className="flex items-center justify-between rounded-lg bg-surface-secondary px-4 py-3"
            >
              <span className="text-[14px] font-medium text-foreground">
                라운드 {attempt.round_number}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[13px] text-foreground-secondary">
                  {attempt.evaluation?.fulfillment_rate ?? 0}%
                </span>
                {attempt.passed ? (
                  <CheckCircle2 size={16} className="text-green-500" />
                ) : (
                  <XCircle size={16} className="text-red-500" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 통계 */}
        <div className="mt-4 flex items-center justify-center gap-6 rounded-lg bg-primary-50 px-4 py-3">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary-700">{passCount}</p>
            <p className="text-xs text-primary-500">통과</p>
          </div>
          <div className="h-8 w-px bg-primary-200" />
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground-secondary">
              {attempts.length - passCount}
            </p>
            <p className="text-xs text-foreground-muted">미달</p>
          </div>
          <div className="h-8 w-px bg-primary-200" />
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{attempts.length}</p>
            <p className="text-xs text-foreground-muted">총 라운드</p>
          </div>
        </div>
      </section>

      {/* 드릴 이름 */}
      <div className="text-center text-sm text-foreground-secondary">
        {drill.name_ko} · {APPROACH_LABEL[drill.approach as TrainingApproach]}
      </div>

      {/* 버튼 */}
      <div className="space-y-3">
        {trainingPassed ? (
          <button
            onClick={onComplete}
            disabled={isCompleting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-6 py-4 text-base font-bold text-white shadow-md transition-all hover:bg-primary-700 active:scale-[0.98] disabled:opacity-50"
          >
            {isCompleting ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                다음 처방으로
                <ChevronRight size={20} />
              </>
            )}
          </button>
        ) : (
          <button
            onClick={onComplete}
            disabled={isCompleting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-surface border border-border px-6 py-4 text-base font-bold text-foreground transition-all hover:bg-surface-secondary active:scale-[0.98] disabled:opacity-50"
          >
            {isCompleting ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              "돌아가기"
            )}
          </button>
        )}
      </div>
    </div>
  );
}
