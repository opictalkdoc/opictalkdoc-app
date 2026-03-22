/**
 * tutoring-v2-evaluate — 튜터링 V2 훈련 평가 Edge Function
 *
 * 역할: 훈련 라운드의 transcript를 받아 GPT-4.1로 성공 기준 충족 여부를 판정하고,
 *       피드백 + 격려 메시지를 생성한 뒤 DB에 attempt를 저장한다.
 *
 * 입력: { training_id, round_number, transcript, duration_sec, word_count, wpm, audio_url }
 * 처리: JWT 인증 → DB 로드 → 변수 치환 → GPT-4.1 호출 → attempt INSERT → 완료 판정
 * 프롬프트: evaluation_prompts (CO-STAR 구조, tutoring_evaluate / _user / _schema)
 * API: OpenAI Chat Completions API + response_format (Structured Outputs)
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")!;

const ALLOWED_ORIGINS = (
  Deno.env.get("ALLOWED_ORIGINS") ||
  "https://opictalkdoc.com,http://localhost:3001"
).split(",");

const corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGINS[0],
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// ── 유틸리티 ──

/** 재시도 래퍼 (2회 재시도 + 지수 백오프) */
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 2,
  label: string = "",
): Promise<T> {
  let lastError: Error | null = null;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000;
        console.error(
          `[${label}] 재시도 ${attempt + 1}/${maxRetries}, ${delay}ms 후...`,
        );
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }
  throw new Error(
    `${label} ${maxRetries + 1}회 시도 후 실패: ${lastError?.message}`,
  );
}

/** 변수 치환 */
function substituteVariables(
  template: string,
  variables: Record<string, string>,
): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replaceAll(`{${key}}`, value);
  }
  return result;
}

/** JWT 인증 */
async function authenticateUser(
  req: Request,
  supabase: ReturnType<typeof createClient>,
): Promise<string> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) throw new Error("Authorization 헤더 없음");

  const token = authHeader.replace("Bearer ", "");
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) throw new Error(`인증 실패: ${error?.message}`);
  return user.id;
}

// ── GPT Chat Completions API 호출 ──

interface EvaluationResult {
  criteria_check: Array<{
    item: string;
    pass: boolean;
    evidence: string;
  }>;
  fulfillment_rate: number;
  passed: boolean;
  feedback: string;
  next_focus: string | null;
  encouragement: string;
}

async function callGptEvaluation(
  systemPrompt: string,
  userPrompt: string,
  responseFormat: Record<string, unknown>,
  model: string,
): Promise<{ result: EvaluationResult; tokensUsed: number }> {
  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      max_tokens: 2000,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: responseFormat,
    }),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Chat Completions API 실패 (${resp.status}): ${errText}`);
  }

  const json = await resp.json();
  const content = json.choices?.[0]?.message?.content || "{}";
  const tokensUsed = json.usage?.total_tokens || 0;

  return { result: JSON.parse(content) as EvaluationResult, tokensUsed };
}

// ── 이전 시도 요약 텍스트 생성 ──

interface PreviousAttempt {
  round_number: number;
  passed: boolean;
  evaluation: {
    fulfillment_rate?: number;
    feedback?: string;
    next_focus?: string;
  } | null;
}

function buildPreviousAttemptsText(attempts: PreviousAttempt[]): string {
  if (!attempts || attempts.length === 0) return "없음 (첫 번째 라운드)";

  return attempts
    .map((a) => {
      const rate = a.evaluation?.fulfillment_rate ?? 0;
      const result = a.passed ? "통과" : "미달";
      const feedback = a.evaluation?.feedback ?? "";
      return (
        `- 라운드 ${a.round_number}: ${result} (충족률 ${rate}%)\n` +
        `  피드백: ${feedback}`
      );
    })
    .join("\n\n");
}

// ── ID 생성 ──

function generateAttemptId(): string {
  const uuid = crypto.randomUUID().substring(0, 8);
  return `ta_${uuid}`;
}

// ── 메인 핸들러 ──

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const body = await req.json();
    const {
      training_id,
      round_number,
      transcript,
      duration_sec,
      word_count,
      wpm,
      audio_url,
      model = "gpt-4.1",
    } = body as {
      training_id: string;
      round_number: number;
      transcript: string;
      duration_sec: number;
      word_count: number;
      wpm: number;
      audio_url: string | null;
      model?: string;
    };

    if (!training_id || !round_number || !transcript) {
      return new Response(
        JSON.stringify({ error: "training_id, round_number, transcript 필수" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    console.log(
      `[evaluate] 시작: training=${training_id}, round=${round_number}`,
    );

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // JWT 인증
    const userId = await authenticateUser(req, supabase);

    // ── 1. DB 병렬 로드 ──

    const [trainingRes, promptsRes] = await Promise.all([
      // 훈련 세션
      supabase
        .from("tutoring_training_v2")
        .select("id, prescription_id, approach, max_rounds, rounds_completed, passed")
        .eq("id", training_id)
        .single(),
      // 프롬프트 3행
      supabase
        .from("evaluation_prompts")
        .select("key, prompt_text")
        .in("key", [
          "tutoring_evaluate",
          "tutoring_evaluate_user",
          "tutoring_evaluate_schema",
        ]),
    ]);

    if (trainingRes.error || !trainingRes.data) {
      throw new Error(`훈련 세션 조회 실패: ${trainingRes.error?.message}`);
    }

    const training = trainingRes.data;

    if (promptsRes.error || !promptsRes.data || promptsRes.data.length < 3) {
      throw new Error(
        `프롬프트 로드 실패: ${promptsRes.error?.message || "3행 미만"}`,
      );
    }

    const promptMap: Record<string, string> = {};
    for (const row of promptsRes.data) {
      promptMap[row.key] = row.prompt_text;
    }

    // ── 2. 순차 로드 (training 데이터 의존) ──

    const prescriptionId = training.prescription_id;

    const [prescriptionRes, drillRes, prevAttemptsRes] = await Promise.all([
      // 처방 (drill_code, wp_code)
      supabase
        .from("tutoring_prescriptions_v2")
        .select("id, session_id, drill_code, wp_code, prescription_data")
        .eq("id", prescriptionId)
        .single(),
      // 이전 시도들
      supabase
        .from("tutoring_attempts_v2")
        .select("round_number, passed, evaluation")
        .eq("training_id", training_id)
        .lt("round_number", round_number)
        .order("round_number", { ascending: true }),
      // 세션 소유권 확인용 (prescription → session)
      Promise.resolve(null), // placeholder
    ]);

    if (prescriptionRes.error || !prescriptionRes.data) {
      throw new Error(`처방 조회 실패: ${prescriptionRes.error?.message}`);
    }

    const prescription = prescriptionRes.data;

    // 세션 소유권 검증
    const { data: sessionData, error: sessionErr } = await supabase
      .from("tutoring_sessions_v2")
      .select("id, user_id")
      .eq("id", prescription.session_id)
      .single();

    if (sessionErr || !sessionData || sessionData.user_id !== userId) {
      return new Response(
        JSON.stringify({ error: "본인 세션만 접근 가능" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // 드릴 카탈로그 조회
    const { data: drillData, error: drillErr } = await supabase
      .from("tutoring_drill_catalog")
      .select("code, name_ko, category, approach, training_method, success_criteria")
      .eq("code", prescription.drill_code)
      .single();

    if (drillErr || !drillData) {
      throw new Error(`드릴 카탈로그 조회 실패: ${drillErr?.message}`);
    }

    const previousAttempts = (prevAttemptsRes.data || []) as PreviousAttempt[];

    // ── 3. 이전 라운드 대비 변화 텍스트 ──

    const lastAttempt = previousAttempts.length > 0
      ? previousAttempts[previousAttempts.length - 1]
      : null;
    const deltaVsPrevious = lastAttempt?.evaluation
      ? `이전 라운드(${lastAttempt.round_number}) 충족률: ${lastAttempt.evaluation.fulfillment_rate ?? 0}%, 피드백: ${lastAttempt.evaluation.feedback ?? ""}`
      : "";

    // ── 4. 변수 치환 ──

    const successCriteria = drillData.success_criteria
      ? `${drillData.success_criteria.metric}: ${drillData.success_criteria.threshold}`
      : "기본 성공 기준";

    const variables: Record<string, string> = {
      drill_name: drillData.name_ko || prescription.drill_code,
      approach: drillData.approach || training.approach,
      success_criteria: successCriteria,
      round_number: String(round_number),
      max_rounds: String(training.max_rounds),
      question_topic: "연습 주제",
      transcript,
      duration: String(duration_sec || 0),
      word_count: String(word_count || 0),
      wpm: String(wpm || 0),
      previous_attempts: buildPreviousAttemptsText(previousAttempts),
    };

    const systemPrompt = promptMap["tutoring_evaluate"];
    const userPrompt = substituteVariables(
      promptMap["tutoring_evaluate_user"],
      variables,
    );
    const responseFormat = JSON.parse(promptMap["tutoring_evaluate_schema"]);

    // ── 5. GPT-4.1 호출 ──

    const { result, tokensUsed } = await withRetry(
      () => callGptEvaluation(systemPrompt, userPrompt, responseFormat, model),
      2,
      "evaluate",
    );

    const processingTimeMs = Date.now() - startTime;

    console.log(
      `[evaluate] GPT 완료: passed=${result.passed}, rate=${result.fulfillment_rate}%, ` +
        `${tokensUsed} tokens, ${processingTimeMs}ms`,
    );

    // ── 6. tutoring_attempts_v2 INSERT ──

    const attemptId = generateAttemptId();

    const evaluationData = {
      ...result,
      confidence: 0.85, // 기본값
      delta_vs_previous: deltaVsPrevious || null,
      evidence_spans: [], // GPT가 제공하지 않으면 빈 배열
      retry_mode: result.passed ? null : "same_prompt",
      model,
      tokens_used: tokensUsed,
      processing_time_ms: processingTimeMs,
    };

    const { error: insertErr } = await supabase
      .from("tutoring_attempts_v2")
      .insert({
        id: attemptId,
        training_id,
        round_number,
        transcript,
        audio_url: audio_url || null,
        duration_sec: duration_sec || null,
        word_count: word_count || null,
        wpm: wpm || null,
        evaluation: evaluationData,
        passed: result.passed,
      });

    if (insertErr) {
      console.error(`[evaluate] attempt INSERT 실패:`, insertErr.message);
      throw new Error(`attempt 저장 실패: ${insertErr.message}`);
    }

    // ── 7. 완료 판정: "max_rounds 중 2회 pass" → training.passed = true ──

    // 모든 시도 조회 (현재 시도 포함)
    const { data: allAttempts } = await supabase
      .from("tutoring_attempts_v2")
      .select("round_number, passed")
      .eq("training_id", training_id)
      .order("round_number", { ascending: true });

    const passCount = (allAttempts || []).filter((a) => a.passed).length;
    const totalAttempts = (allAttempts || []).length;
    const trainingPassed = passCount >= 2;
    const isLastRound = totalAttempts >= training.max_rounds;

    if (trainingPassed || isLastRound) {
      // 훈련 완료 처리
      const { error: updateTrainingErr } = await supabase
        .from("tutoring_training_v2")
        .update({
          passed: trainingPassed,
          rounds_completed: totalAttempts,
          completed_at: new Date().toISOString(),
        })
        .eq("id", training_id);

      if (updateTrainingErr) {
        console.error(
          `[evaluate] training 업데이트 실패:`,
          updateTrainingErr.message,
        );
      }

      // ── 8. 처방 완료 체크 ──
      if (trainingPassed) {
        const { error: prescUpdateErr } = await supabase
          .from("tutoring_prescriptions_v2")
          .update({ status: "completed" })
          .eq("id", prescriptionId);

        if (prescUpdateErr) {
          console.error(
            `[evaluate] 처방 완료 업데이트 실패:`,
            prescUpdateErr.message,
          );
        }

        // 세션의 모든 처방 완료 체크
        const { data: remainingPrescriptions } = await supabase
          .from("tutoring_prescriptions_v2")
          .select("id, status")
          .eq("session_id", prescription.session_id)
          .neq("status", "completed");

        if (!remainingPrescriptions || remainingPrescriptions.length === 0) {
          // 세션 완료
          await supabase
            .from("tutoring_sessions_v2")
            .update({
              status: "completed",
              completed_at: new Date().toISOString(),
            })
            .eq("id", prescription.session_id);

          console.log(
            `[evaluate] 세션 완료: ${prescription.session_id}`,
          );
        }
      }
    }

    // ── 9. 응답 ──

    return new Response(
      JSON.stringify({
        status: "completed",
        attempt_id: attemptId,
        training_id,
        round_number,
        evaluation: evaluationData,
        training_passed: trainingPassed,
        is_last_round: isLastRound,
        pass_count: passCount,
        total_attempts: totalAttempts,
        tokens_used: tokensUsed,
        processing_time_ms: processingTimeMs,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[evaluate] 오류:", message);
    return new Response(
      JSON.stringify({
        error: message,
        processing_time_ms: Date.now() - startTime,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
