/**
 * tutoring-v2-prescribe — 튜터링 V2 처방 Edge Function
 *
 * 역할: 진단된 병목 1~3개에 대해 드릴 카탈로그 기반 맞춤 처방 생성.
 *       학생 실제 발화 인용 + Before/After 예시 + 격려 메시지 포함.
 *
 * 입력: { session_id: "ts_xxxxxxxx" }
 * 처리: DB 병렬 로드 → 병목별 순차 GPT-4.1 호출 → prescriptions_v2 INSERT
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

interface PrescriptionResult {
  prescription_reason: string;
  what_to_fix: string;
  how_to_fix: string;
  example_sentences: Array<{
    before: string;
    after: string;
    explanation: string;
  }>;
  encouragement: string;
}

async function callGptPrescription(
  systemPrompt: string,
  userPrompt: string,
  responseFormat: Record<string, unknown>,
  model: string,
): Promise<{ result: PrescriptionResult; tokensUsed: number }> {
  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      max_tokens: 3000,
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

  return { result: JSON.parse(content) as PrescriptionResult, tokensUsed };
}

// ── 헬퍼: 병목별 증거 수집 ──

interface BottleneckEntry {
  wp_code: string;
  wp_description?: string;
  frequency: number;
  avg_severity_weight: number;
  evidence_questions: number[];
  sample_evidence?: string;
}

function collectEvidenceForWp(
  wpCode: string,
  consults: Array<{
    question_number: number;
    question_id: string;
    weak_points: Array<{ code: string; evidence?: string; reason?: string }>;
  }>,
  answers: Array<{
    question_number: number;
    question_id: string;
    transcript: string | null;
  }>,
): string {
  const evidenceLines: string[] = [];

  for (const consult of consults) {
    const wp = consult.weak_points?.find(
      (w: { code: string }) => w.code === wpCode,
    );
    if (!wp) continue;

    // consult의 evidence 사용
    if (wp.evidence) {
      evidenceLines.push(
        `Q${consult.question_number}: "${wp.evidence}"`,
      );
    } else {
      // 없으면 answer transcript에서 발췌
      const answer = answers.find(
        (a) => a.question_number === consult.question_number,
      );
      if (answer?.transcript) {
        evidenceLines.push(
          `Q${consult.question_number}: "${answer.transcript.slice(0, 150)}..."`,
        );
      }
    }

    if (evidenceLines.length >= 3) break;
  }

  return evidenceLines.length > 0
    ? evidenceLines.join("\n")
    : "발화 증거 없음";
}

function collectQuestionTopics(
  wpCode: string,
  consults: Array<{
    question_number: number;
    question_id: string;
    question_type: string;
    weak_points: Array<{ code: string }>;
  }>,
): string {
  const topics: string[] = [];

  for (const consult of consults) {
    const hasWp = consult.weak_points?.some(
      (w: { code: string }) => w.code === wpCode,
    );
    if (hasWp) {
      topics.push(`Q${consult.question_number} (${consult.question_type})`);
    }
    if (topics.length >= 5) break;
  }

  return topics.length > 0 ? topics.join(", ") : "질문 정보 없음";
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

    console.log(`[prescribe] 시작: session=${session_id}`);

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // ── 1. 세션 조회 (user_id 획득) ──

    const { data: session, error: sessionErr } = await supabase
      .from("tutoring_sessions_v2")
      .select(
        "id, user_id, mock_session_id, current_tier, current_grade, target_grade, bottleneck_results",
      )
      .eq("id", session_id)
      .single();

    if (sessionErr || !session) {
      throw new Error(`세션 조회 실패: ${sessionErr?.message}`);
    }

    const userId = session.user_id;

    // 프롬프트 + 프로필 병렬 로드
    const [promptsRes, profileRes] = await Promise.all([
      supabase
        .from("evaluation_prompts")
        .select("key, prompt_text")
        .in("key", [
          "tutoring_prescription",
          "tutoring_prescription_user",
          "tutoring_prescription_schema",
        ]),
      supabase.from("profiles").select("target_grade").eq("id", userId).single(),
    ]);

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
    const currentGrade = session.current_grade || "IM2";
    const currentTier = session.current_tier || 3;

    const mockSessionId = session.mock_session_id;
    if (!mockSessionId) {
      throw new Error("mock_session_id가 없습니다. 모의고사 연결 필요.");
    }

    // 병목 결과 (세션에 저장됨)
    const bottlenecks: BottleneckEntry[] =
      session.bottleneck_results?.top_bottlenecks ||
      session.bottleneck_results ||
      [];

    if (bottlenecks.length === 0) {
      throw new Error("병목 결과가 없습니다. 먼저 병목 분석을 실행하세요.");
    }

    // 병목의 wp_code 목록 → 드릴 매핑 + consults + answers 로드
    const topBottlenecks = bottlenecks.slice(0, 3);
    const wpCodes = topBottlenecks.map((b) => b.wp_code);

    const [drillMappingRes, consultsRes, answersRes] = await Promise.all([
      // wp_code → drill_code 매핑 (현재 티어 기준)
      supabase
        .from("tutoring_wp_drill_mapping")
        .select("wp_code, drill_code")
        .in("wp_code", wpCodes)
        .eq("tier", currentTier),
      // 모의고사 consult 데이터 (증거용)
      supabase
        .from("mock_test_consults")
        .select(
          "question_number, question_id, question_type, weak_points",
        )
        .eq("session_id", mockSessionId)
        .order("question_number"),
      // 모의고사 답변 (transcript 증거용)
      supabase
        .from("mock_test_answers")
        .select("question_number, question_id, transcript")
        .eq("session_id", mockSessionId)
        .order("question_number"),
    ]);

    const drillMappings = drillMappingRes.data || [];
    const consults = consultsRes.data || [];
    const answers = answersRes.data || [];

    // 매핑된 drill_code 목록으로 카탈로그 로드
    const drillCodes = [
      ...new Set(drillMappings.map((m) => m.drill_code)),
    ];

    let drillCatalog: Array<{
      code: string;
      name_ko: string;
      approach: string;
      training_method: Record<string, unknown>;
      success_criteria: Record<string, unknown>;
    }> = [];

    if (drillCodes.length > 0) {
      const { data } = await supabase
        .from("tutoring_drill_catalog")
        .select("code, name_ko, approach, training_method, success_criteria")
        .in("code", drillCodes);
      drillCatalog = data || [];
    }

    const drillMap = new Map(drillCatalog.map((d) => [d.code, d]));

    // ── 2. 병목별 순차 GPT 호출 ──

    const systemPrompt = promptMap["tutoring_prescription"];
    const responseFormat = JSON.parse(
      promptMap["tutoring_prescription_schema"],
    );

    const prescriptions: Array<{
      priority: number;
      wp_code: string;
      drill_code: string;
      prescription_data: PrescriptionResult & {
        model: string;
        tokens_used: number;
      };
    }> = [];

    let totalTokens = 0;

    for (let i = 0; i < topBottlenecks.length; i++) {
      const bottleneck = topBottlenecks[i];
      const wpCode = bottleneck.wp_code;

      // drill 매핑 찾기
      const mapping = drillMappings.find((m) => m.wp_code === wpCode);
      if (!mapping) {
        console.warn(
          `[prescribe] wp_code=${wpCode}: 드릴 매핑 없음 (tier=${currentTier}), 스킵`,
        );
        continue;
      }

      const drill = drillMap.get(mapping.drill_code);
      if (!drill) {
        console.warn(
          `[prescribe] drill_code=${mapping.drill_code}: 카탈로그 없음, 스킵`,
        );
        continue;
      }

      // 증거 수집
      const evidenceList = collectEvidenceForWp(wpCode, consults, answers);
      const questionTopics = collectQuestionTopics(wpCode, consults);

      // 변수 치환
      const variables: Record<string, string> = {
        wp_code: wpCode,
        wp_description: bottleneck.wp_description || wpCode,
        severity:
          bottleneck.avg_severity_weight >= 2.5
            ? "심각"
            : bottleneck.avg_severity_weight >= 1.5
              ? "중간"
              : "경미",
        frequency: String(bottleneck.frequency),
        evidence_list: evidenceList,
        drill_id: drill.code,
        drill_name: drill.name_ko,
        approach: drill.approach,
        success_criteria: JSON.stringify(drill.success_criteria, null, 2),
        training_method: JSON.stringify(drill.training_method, null, 2),
        question_topics: questionTopics,
        target_grade: targetGrade,
        current_grade: currentGrade,
      };

      const userPrompt = substituteVariables(
        promptMap["tutoring_prescription_user"],
        variables,
      );

      console.log(
        `[prescribe] GPT 호출 ${i + 1}/${topBottlenecks.length}: wp=${wpCode}, drill=${drill.code}`,
      );

      const { result, tokensUsed } = await withRetry(
        () =>
          callGptPrescription(systemPrompt, userPrompt, responseFormat, model),
        2,
        `prescribe-${wpCode}`,
      );

      totalTokens += tokensUsed;

      prescriptions.push({
        priority: i + 1,
        wp_code: wpCode,
        drill_code: drill.code,
        prescription_data: {
          ...result,
          model,
          tokens_used: tokensUsed,
        },
      });
    }

    if (prescriptions.length === 0) {
      throw new Error(
        "처방 생성 실패: 병목에 매핑되는 드릴이 없습니다.",
      );
    }

    // ── 3. tutoring_prescriptions_v2 UPDATE (SA에서 이미 INSERT 완료) ──

    for (const p of prescriptions) {
      const { error: updateError } = await supabase
        .from("tutoring_prescriptions_v2")
        .update({ prescription_data: p.prescription_data })
        .eq("session_id", session_id)
        .eq("wp_code", p.wp_code);

      if (updateError) {
        console.error(`[prescribe] ${p.wp_code} UPDATE 실패:`, updateError.message);
      }
    }

    // ── 4. 세션 상태 업데이트 → 'active' ──

    const { error: statusError } = await supabase
      .from("tutoring_sessions_v2")
      .update({ status: "active" })
      .eq("id", session_id);

    if (statusError) {
      console.error(`[prescribe] 상태 업데이트 실패:`, statusError.message);
    }

    const processingTimeMs = Date.now() - startTime;

    console.log(
      `[prescribe] 완료: ${prescriptions.length}개 처방, ` +
        `${totalTokens} tokens, ${processingTimeMs}ms`,
    );

    // ── 5. 응답 ──

    return new Response(
      JSON.stringify({
        status: "completed",
        session_id,
        prescription_count: prescriptions.length,
        prescriptions: prescriptions.map((p) => ({
          priority: p.priority,
          wp_code: p.wp_code,
          drill_code: p.drill_code,
          what_to_fix: p.prescription_data.what_to_fix,
        })),
        total_tokens_used: totalTokens,
        processing_time_ms: processingTimeMs,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[prescribe] 오류:", message);
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
