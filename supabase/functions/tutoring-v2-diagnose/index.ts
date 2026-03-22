/**
 * tutoring-v2-diagnose — 튜터링 V2 진단 Edge Function
 *
 * 역할: 모의고사 15문항 consult 결과(병목 분석)를 기반으로
 *       일타 강사 톤의 한줄 진단 + 티어 설명 + 다음 단계 제안 생성.
 *
 * 입력: { session_id: "ts_xxxxxxxx" }
 * 처리: DB 병렬 로드 → 변수 치환 → GPT-4.1 호출 → diagnosis_text UPSERT
 * 프롬프트: evaluation_prompts (CO-STAR 구조)
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

// 티어 설명 매핑 (TIER_CONFIGS와 동일)
const TIER_DESCRIPTIONS: Record<number, string> = {
  1: "외운 문장 말고 자기 문장 만들기 — SVO 기본 문장 형성",
  2: "여러 문장을 이어서 말하기 — 시간순/나열 구조",
  3: "Skeleton Paragraph 기반 문단형 connected discourse 형성",
  4: "문단 지속 + time frame 통제 + complication handling",
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

interface DiagnosisResult {
  headline: string;
  diagnosis: string;
  key_task: string;
  motivation: string;
}

async function callGptDiagnosis(
  systemPrompt: string,
  userPrompt: string,
  responseFormat: Record<string, unknown>,
  model: string,
): Promise<{ result: DiagnosisResult; tokensUsed: number }> {
  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
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

  return { result: JSON.parse(content) as DiagnosisResult, tokensUsed };
}

// ── 병목 요약 텍스트 생성 ──

interface BottleneckEntry {
  wp_code: string;
  wp_description?: string;
  frequency: number;
  avg_severity_weight: number;
  evidence_questions: number[];
  sample_evidence?: string;
  tier_relevance?: string;
  gate_flag?: boolean;
  confidence?: number;
}

function buildBottleneckSummary(bottlenecks: BottleneckEntry[]): string {
  if (!bottlenecks || bottlenecks.length === 0) return "병목 데이터 없음";

  return bottlenecks
    .slice(0, 5)
    .map((b, i) => {
      const severity =
        b.avg_severity_weight >= 2.5
          ? "심각"
          : b.avg_severity_weight >= 1.5
            ? "중간"
            : "경미";
      return (
        `${i + 1}. ${b.wp_description || b.wp_code} (${severity}, ${b.frequency}개 문항)\n` +
        `   증거: ${b.sample_evidence || "없음"}\n` +
        `   관련 문항: Q${b.evidence_questions?.join(", Q") || "?"}`
      );
    })
    .join("\n\n");
}

function buildEvidenceSamples(
  bottlenecks: BottleneckEntry[],
  consults: Array<{
    question_number: number;
    weak_points: Array<{
      code: string;
      evidence?: string;
      reason?: string;
    }>;
  }>,
): string {
  // 상위 3개 병목의 증거 수집
  const topWpCodes = bottlenecks.slice(0, 3).map((b) => b.wp_code);
  const samples: string[] = [];

  for (const wpCode of topWpCodes) {
    for (const consult of consults) {
      const wp = consult.weak_points?.find(
        (w: { code: string }) => w.code === wpCode,
      );
      if (wp?.evidence) {
        samples.push(
          `- Q${consult.question_number} [${wpCode}]: "${wp.evidence}"`,
        );
        if (samples.length >= 6) break;
      }
    }
    if (samples.length >= 6) break;
  }

  return samples.length > 0 ? samples.join("\n") : "증거 샘플 없음";
}

function buildWeakPointStats(
  consults: Array<{
    question_number: number;
    weak_points: Array<{ code: string; severity?: string }>;
  }>,
): string {
  // 15문항에서 WP 코드별 빈도 집계
  const wpFreq: Record<string, number> = {};
  for (const c of consults) {
    if (!c.weak_points) continue;
    for (const wp of c.weak_points) {
      wpFreq[wp.code] = (wpFreq[wp.code] || 0) + 1;
    }
  }

  const sorted = Object.entries(wpFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  if (sorted.length === 0) return "약점 통계 없음";

  return sorted
    .map(([code, freq]) => `- ${code}: ${freq}개 문항에서 발견`)
    .join("\n");
}

// ── 메인 핸들러 ──

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const body = await req.json();
    const { session_id, model = "gpt-4.1" } = body as {
      session_id: string;
      model?: string;
    };

    if (!session_id) {
      return new Response(
        JSON.stringify({ error: "session_id 필수" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    console.log(`[diagnose] 시작: session=${session_id}`);

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // JWT 인증
    const userId = await authenticateUser(req, supabase);

    // ── 1. DB 병렬 로드 ──

    const [sessionRes, promptsRes, profileRes] = await Promise.all([
      // 튜터링 세션 (user_id 검증)
      supabase
        .from("tutoring_sessions_v2")
        .select(
          "id, user_id, mock_session_id, current_tier, current_grade, target_grade, bottleneck_results",
        )
        .eq("id", session_id)
        .single(),
      // 프롬프트 3행
      supabase
        .from("evaluation_prompts")
        .select("key, prompt_text")
        .in("key", [
          "tutoring_diagnosis",
          "tutoring_diagnosis_user",
          "tutoring_diagnosis_schema",
        ]),
      // 프로필 (target_grade)
      supabase.from("profiles").select("target_grade").eq("id", userId).single(),
    ]);

    if (sessionRes.error || !sessionRes.data) {
      throw new Error(`세션 조회 실패: ${sessionRes.error?.message}`);
    }

    const session = sessionRes.data;

    // user_id 검증
    if (session.user_id !== userId) {
      return new Response(
        JSON.stringify({ error: "본인 세션만 접근 가능" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (promptsRes.error || !promptsRes.data || promptsRes.data.length < 3) {
      throw new Error(
        `프롬프트 로드 실패: ${promptsRes.error?.message || "3행 미만"}`,
      );
    }

    const promptMap: Record<string, string> = {};
    for (const row of promptsRes.data) {
      promptMap[row.key] = row.prompt_text;
    }

    const targetGrade =
      session.target_grade ||
      profileRes.data?.target_grade ||
      "IH";

    // mock_session_id로 consults 로드 (순차 — session 데이터 필요)
    const mockSessionId = session.mock_session_id;
    if (!mockSessionId) {
      throw new Error("mock_session_id가 없습니다. 모의고사 연결 필요.");
    }

    const [consultsRes, reportRes] = await Promise.all([
      // 15문항 consult 데이터
      supabase
        .from("mock_test_consults")
        .select(
          "question_number, question_id, question_type, fulfillment, weak_points",
        )
        .eq("session_id", mockSessionId)
        .order("question_number"),
      // 종합 리포트 (등급 확인)
      supabase
        .from("mock_test_reports")
        .select("final_level")
        .eq("session_id", mockSessionId)
        .single(),
    ]);

    const consults = consultsRes.data || [];
    const currentGrade =
      session.current_grade ||
      reportRes.data?.final_level ||
      "IM2";
    const currentTier = session.current_tier || 3;
    const tierDescription =
      TIER_DESCRIPTIONS[currentTier] || TIER_DESCRIPTIONS[3];

    // 병목 결과 (이미 세션에 저장되어 있음)
    const bottlenecks: BottleneckEntry[] =
      session.bottleneck_results?.top_bottlenecks ||
      session.bottleneck_results ||
      [];

    // ── 2. 변수 치환 ──

    const variables: Record<string, string> = {
      current_grade: currentGrade,
      target_grade: targetGrade,
      tier: String(currentTier),
      tier_description: tierDescription,
      bottleneck_results: buildBottleneckSummary(bottlenecks),
      evidence_samples: buildEvidenceSamples(bottlenecks, consults),
      weak_point_stats: buildWeakPointStats(consults),
    };

    const systemPrompt = promptMap["tutoring_diagnosis"];
    const userPrompt = substituteVariables(
      promptMap["tutoring_diagnosis_user"],
      variables,
    );
    const responseFormat = JSON.parse(promptMap["tutoring_diagnosis_schema"]);

    // ── 3. GPT-4.1 호출 ──

    const { result, tokensUsed } = await withRetry(
      () => callGptDiagnosis(systemPrompt, userPrompt, responseFormat, model),
      2,
      "diagnose",
    );

    const processingTimeMs = Date.now() - startTime;

    console.log(
      `[diagnose] 완료: headline="${result.headline}", ` +
        `${tokensUsed} tokens, ${processingTimeMs}ms`,
    );

    // ── 4. tutoring_sessions_v2.diagnosis_text UPSERT ──

    const { error: updateError } = await supabase
      .from("tutoring_sessions_v2")
      .update({
        diagnosis_text: {
          ...result,
          model,
          tokens_used: tokensUsed,
          processing_time_ms: processingTimeMs,
          generated_at: new Date().toISOString(),
        },
      })
      .eq("id", session_id);

    if (updateError) {
      console.error(`[diagnose] DB 저장 실패:`, updateError.message);
      throw new Error(`DB 저장 실패: ${updateError.message}`);
    }

    // ── 5. 응답 ──

    return new Response(
      JSON.stringify({
        status: "completed",
        session_id,
        diagnosis: result,
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
    console.error("[diagnose] 오류:", message);
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
