"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  Timer,
  AlertCircle,
  Loader2,
  Upload,
  Coins,
} from "lucide-react";
import { ShadowingRecorder } from "./shadowing-recorder";
import { EvaluationResult } from "./evaluation-result";
import { useShadowingStore } from "@/lib/stores/shadowing";
import { startShadowingSession, checkScriptCredit } from "@/lib/actions/scripts";
import { useQueryClient } from "@tanstack/react-query";

export function StepSpeak() {
  const queryClient = useQueryClient();
  const {
    packageId,
    scriptId,
    questionText,
    questionKorean,
    speakTimer,
    setSpeakTimer,
    speakResult,
    setSpeakResult,
    isRecording,
    setRecording,
    setRecordingDuration,
  } = useShadowingStore();

  const [timerActive, setTimerActive] = useState(false);
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [creditCheck, setCreditCheck] = useState<{
    checked: boolean;
    hasCredit: boolean;
    total: number;
  }>({ checked: false, hasCredit: false, total: 0 });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerCountRef = useRef(0);

  // 최초 진입 시 크레딧 확인
  useEffect(() => {
    checkScriptCredit().then((result) => {
      if (result.data) {
        setCreditCheck({
          checked: true,
          hasCredit: result.data.hasCredit,
          total: result.data.totalCredits,
        });
      }
    });
  }, []);

  // 타이머 정리
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleRecordingComplete = useCallback(
    (blob: Blob, duration: number) => {
      setRecordingBlob(blob);
      setRecordingDuration(duration);
      setTimerActive(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    },
    [setRecordingDuration]
  );

  // 녹음 제출 (EF 호출)
  const handleSubmit = useCallback(async () => {
    if (!recordingBlob || !packageId || !scriptId) return;
    setIsSubmitting(true);
    setSubmitError("");

    try {
      // 1. 세션 생성
      const sessionResult = await startShadowingSession({
        package_id: packageId,
        script_id: scriptId,
      });

      if (sessionResult.error) {
        setSubmitError(sessionResult.error);
        setIsSubmitting(false);
        return;
      }

      const sessionId = sessionResult.data?.sessionId;
      if (!sessionId) {
        setSubmitError("세션 생성에 실패했습니다");
        setIsSubmitting(false);
        return;
      }

      // 2. 녹음 파일을 Base64로 변환 → EF 호출 (청크 분할로 stack overflow 방지)
      const arrayBuffer = await recordingBlob.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      let binary = "";
      const chunkSize = 8192;
      for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
      }
      const base64 = btoa(binary);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/scripts/evaluate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            session_id: sessionId,
            audio_base64: base64,
            audio_duration: speakTimer,
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "평가 실패" }));
        setSubmitError(err.error || "AI 평가에 실패했습니다");
        setIsSubmitting(false);
        return;
      }

      const evalResult = await res.json();
      setSpeakResult(evalResult);

      // 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["shadowing-history"] });
      queryClient.invalidateQueries({ queryKey: ["script-credit"] });
      queryClient.invalidateQueries({ queryKey: ["user-credits"] });
    } catch {
      setSubmitError("평가 요청 중 오류가 발생했습니다");
    } finally {
      setIsSubmitting(false);
    }
  }, [
    recordingBlob,
    packageId,
    scriptId,
    speakTimer,
    setSpeakResult,
    queryClient,
  ]);

  function formatTime(sec: number): string {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  const isOver2Min = speakTimer >= 120;

  // 평가 결과가 있으면 결과 화면
  if (speakResult) {
    return <EvaluationResult evaluation={speakResult} />;
  }

  return (
    <div className="space-y-5">
      {/* 안내 */}
      <div className="text-center">
        <p className="text-sm text-foreground-secondary">
          실전처럼 <span className="font-medium text-primary-600">텍스트 없이</span> 답변하세요.
          AI가 발화를 분석하여 등급을 평가합니다.
        </p>
      </div>

      {/* 크레딧 안내 */}
      <div className="flex items-center justify-center gap-2 rounded-lg border border-amber-200 bg-amber-50/50 p-2.5 text-xs">
        <Coins size={14} className="text-amber-600" />
        <span className="text-amber-700">
          실전 평가는 <span className="font-semibold">스크립트 생성권 1개</span>를 사용합니다
          {creditCheck.checked && (
            <span className="ml-1">
              (현재 {creditCheck.total}개 보유)
            </span>
          )}
        </span>
      </div>

      {!creditCheck.hasCredit && creditCheck.checked && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          <AlertCircle size={16} />
          스크립트 생성권이 없습니다. 스토어에서 구매해주세요.
        </div>
      )}

      {/* 질문 표시 */}
      <div className="rounded-[var(--radius-xl)] border border-primary-200 bg-primary-50/30 p-4 text-center">
        <p className="text-xs font-medium text-primary-600">질문</p>
        <p className="mt-1 text-sm font-medium text-foreground">
          {questionText || "질문 없음"}
        </p>
        {questionKorean && (
          <p className="mt-1 text-xs text-foreground-muted">{questionKorean}</p>
        )}
      </div>

      {/* 타이머 */}
      <div className="flex items-center justify-center gap-2">
        <Timer
          size={18}
          className={isOver2Min ? "text-red-500" : "text-foreground-secondary"}
        />
        <span
          className={`text-2xl font-bold tabular-nums ${
            isOver2Min ? "text-red-500" : "text-foreground"
          }`}
        >
          {formatTime(speakTimer)}
        </span>
      </div>

      {/* 녹음 */}
      <ShadowingRecorder
        isRecording={isRecording}
        onRecordingChange={(recording) => {
          setRecording(recording);
          if (recording) {
            setTimerActive(true);
            timerCountRef.current = 0;
            setSpeakTimer(0);
            // 타이머 시작 (ref 기반으로 stale closure 방지)
            timerRef.current = setInterval(() => {
              timerCountRef.current += 1;
              setSpeakTimer(timerCountRef.current);
            }, 1000);
          }
        }}
        onRecordingComplete={handleRecordingComplete}
        showPlayback
        maxDuration={180}
      />

      {/* 제출 버튼 */}
      {recordingBlob && !isSubmitting && (
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={!creditCheck.hasCredit}
            className="inline-flex items-center gap-2 rounded-[var(--radius-lg)] bg-primary-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-600 disabled:opacity-50"
          >
            <Upload size={16} />
            AI 평가 받기 (1크레딧)
          </button>
        </div>
      )}

      {/* 제출 중 */}
      {isSubmitting && (
        <div className="flex flex-col items-center gap-2 py-4">
          <Loader2 size={24} className="animate-spin text-primary-500" />
          <p className="text-sm text-foreground-secondary">
            AI가 발화를 분석하고 있습니다...
          </p>
        </div>
      )}

      {/* 에러 */}
      {submitError && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          <AlertCircle size={16} />
          {submitError}
        </div>
      )}
    </div>
  );
}
