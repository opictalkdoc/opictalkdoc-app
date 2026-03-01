// GPT-4.1 기반 질문 매칭 (토픽 없이 전체 DB에서 의미 기반 검색)
// 관리자가 입력한 질문 설명 텍스트 → DB question_id 자동 매칭

// ── 타입 ──

export interface DBQuestion {
  id: string;
  topic: string;
  category: string;
  question_short: string | null;
  question_english: string | null;
  question_korean: string;
  question_type_eng: string | null;
  question_type_kor: string | null;
  survey_type: string;
}

export interface QuestionMatch {
  index: number;           // Q2~Q15 (질문 번호)
  description: string;     // 관리자 입력 텍스트
  questionId: string | null;
  topic: string | null;    // AI가 찾은 토픽
  questionShort: string | null;
  questionEnglish: string | null;
  questionKorean: string | null;
  surveyType: string | null; // 선택형/공통형
  confidence: number;
}

// ── GPT-4.1 매칭 호출 ──

interface GPTMatchItem {
  index: number;
  question_id: string | null;
  confidence: number;
}

export async function matchQuestionsGlobal(
  descriptions: { index: number; text: string }[],
  dbQuestions: DBQuestion[]
): Promise<QuestionMatch[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY가 설정되지 않았습니다");

  // 자기소개·시스템 제외한 질문만 후보
  const candidates = dbQuestions.filter((q) => q.topic !== "자기소개" && q.category !== "시스템");

  // 카테고리별로 분리 후 토픽별 그룹핑
  const categories = ["일반", "롤플레이", "어드밴스"] as const;
  let candidateList = "";

  for (const cat of categories) {
    const catQuestions = candidates.filter((q) => q.category === cat);
    const topicMap = new Map<string, DBQuestion[]>();
    for (const q of catQuestions) {
      const list = topicMap.get(q.topic) || [];
      list.push(q);
      topicMap.set(q.topic, list);
    }

    candidateList += `\n== ${cat} ==\n`;
    for (const [topic, questions] of topicMap) {
      candidateList += `[${topic}]\n`;
      for (const q of questions) {
        candidateList += `  ${q.id}: "${q.question_short || q.question_korean}" (${q.question_type_kor || ""})\n`;
      }
    }
  }

  // 매칭 요청
  const requestList = descriptions
    .map((d) => `Q${d.index}. "${d.text}"`)
    .join("\n");

  const systemPrompt = `당신은 OPIc 시험 질문 매칭 전문가입니다.
관리자가 입력한 기출 질문 설명을 DB의 질문과 매칭합니다.

## OPIc 시험 구조 (절대 규칙)
- 시험은 5개 세트로 구성: 일반1(Q2-4), 일반2(Q5-7), 일반3(Q8-10), 롤플레이(Q11-13), 어드밴스(Q14-15)
- **[필수] 카테고리 제약**: Q2-Q10은 반드시 "일반" 카테고리의 질문만, Q11-Q13은 "롤플레이" 카테고리만, Q14-Q15는 "어드밴스" 카테고리만 매칭하세요. 같은 토픽이라도 카테고리가 다르면 매칭 대상이 아닙니다.
- **[필수] 1세트 = 1토픽**: 같은 세트의 모든 질문은 반드시 동일한 토픽에서 출제됩니다. 세트 내에서 토픽이 섞이는 것은 절대 불가능합니다.
- **[필수] 토픽 중복 금지**: 서로 다른 세트가 같은 토픽을 공유할 수 없습니다.

## 매칭 전략 (2단계)
1단계 - 토픽 결정: 각 세트의 질문 설명들을 종합적으로 분석하여 해당 세트의 토픽을 먼저 결정하세요.
2단계 - 질문 매칭: 결정된 토픽 내의 DB 질문에서만 개별 질문을 매칭하세요.

## 세트별 질문 유형 패턴 (참고)
- 일반 세트(Q2-4, Q5-7, Q8-10): 묘사/루틴 → 상세/비교 → 과거경험/변화
- 롤플레이 세트(Q11-13): 질문하기 → 문제상황/대안제시 → 과거경험
- 어드밴스 세트(Q14-15): 사회적이슈/비교변화 → 경험/의견

## 매칭 규칙
1. 의미가 같거나 매우 유사한 질문을 매칭하세요.
2. confidence 0.7 미만이면 question_id를 null로 반환하세요.
3. 반드시 DB에 존재하는 ID만 반환하세요.
4. 같은 세트 내 질문들의 question_id는 모두 같은 토픽의 ID여야 합니다.`;

  const userPrompt = `[DB 질문 목록 — 토픽별 정리]
${candidateList}

[매칭 요청]
${requestList}

각 질문에 가장 적합한 DB 질문을 JSON으로 반환하세요.
형식: { "matches": [{ "index": 2, "question_id": "ID" 또는 null, "confidence": 0.0~1.0 }, ...] }`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4.1",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API 오류: ${response.status} ${errorText}`);
  }

  const result = await response.json();

  // 응답 잘림 검증
  const finishReason = result.choices?.[0]?.finish_reason;
  if (finishReason === "length") {
    throw new Error("GPT 응답이 잘렸습니다 (max_tokens 초과). 질문 수를 줄여 재시도하세요.");
  }

  const content = result.choices?.[0]?.message?.content;
  if (!content) throw new Error("OpenAI 응답이 비어있습니다");

  let parsed: { matches: GPTMatchItem[] };
  try {
    parsed = JSON.parse(content);
  } catch {
    console.error("GPT 응답 파싱 실패. 원본:", content.slice(0, 500));
    throw new Error(`GPT 응답 JSON 파싱 실패: ${content.slice(0, 200)}...`);
  }

  // DB 질문 맵 (빠른 조회용)
  const dbMap = new Map(candidates.map((q) => [q.id, q]));

  // 결과 매핑
  return descriptions.map((desc) => {
    const match = parsed.matches.find((m) => m.index === desc.index);
    if (!match || !match.question_id || match.confidence < 0.7) {
      return {
        index: desc.index,
        description: desc.text,
        questionId: null,
        topic: null,
        questionShort: null,
        questionEnglish: null,
        questionKorean: null,
        surveyType: null,
        confidence: match?.confidence || 0,
      };
    }

    const dbQ = dbMap.get(match.question_id);
    if (!dbQ) {
      return {
        index: desc.index,
        description: desc.text,
        questionId: null,
        topic: null,
        questionShort: null,
        questionEnglish: null,
        questionKorean: null,
        surveyType: null,
        confidence: 0,
      };
    }

    return {
      index: desc.index,
      description: desc.text,
      questionId: match.question_id,
      topic: dbQ.topic,
      questionShort: dbQ.question_short,
      questionEnglish: dbQ.question_english,
      questionKorean: dbQ.question_korean,
      surveyType: dbQ.survey_type,
      confidence: match.confidence,
    };
  });
}
