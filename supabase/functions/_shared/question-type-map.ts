// question-type-map.ts — v3 question_type 매핑 + 과제충족 체크리스트
// DB question_type_eng 값 기준 (questions 테이블 실제 값)

// ============================================================
// 1. question_type → checkbox_type 매핑 (규칙엔진용)
// ============================================================

export type CheckboxType = "INT" | "ADV" | "AL";

export function getCheckboxType(questionType: string): CheckboxType {
  switch (questionType) {
    case "description":
    case "routine":
    case "rp_11":
      return "INT";
    case "comparison":
    case "past_childhood":
    case "past_special":
    case "past_recent":
    case "rp_12":
      return "ADV";
    case "adv_14":
    case "adv_15":
      return "AL";
    default:
      return "ADV";
  }
}

// ============================================================
// 2. v3 과제충족 체크리스트 정의 (🔴필수 / 🟡심화)
// ============================================================

export interface ChecklistItem {
  item: string;
  tier: "required" | "advanced"; // 🔴 / 🟡
}

export interface TypeChecklist {
  questionType: string;
  label: string;
  required: string[];   // 🔴 필수 항목
  advanced: string[];   // 🟡 심화 항목
  idealFlow: string;
  commonMistakes: string[];
  corePrescription: string;
  feedbackTone: string;
  startTemplate: string; // 무응답 구제용 시작틀
}

export const TYPE_CHECKLISTS: Record<string, TypeChecklist> = {
  description: {
    questionType: "description",
    label: "묘사",
    required: [
      "묘사 대상이 분명함 (무엇/어디/누구)",
      "핵심 특징 2개 이상",
      "현재시제 중심으로 안정적",
    ],
    advanced: [
      "예시·감각·개인화 1개 이상 (단순 형용사 나열 아님)",
      "개인 반응/선호 이유 있음",
    ],
    idealFlow: "대상 소개 → 전체 인상 → 세부 특징 2~3개 → 예시/경험 1개 → 짧은 마무리",
    commonMistakes: [
      "형용사만 나열 (big, nice, beautiful 반복)",
      "구체성 없음 (색, 분위기, 사용 방식 빠짐)",
      "묘사 중 이야기로 새거나 너무 단답",
    ],
    corePrescription: '"특징 1개 + 예시 1개" 묶음으로 선명하게',
    feedbackTone: "격려형 코칭 (4~5문장)",
    startTemplate: "One place I can describe is…",
  },

  routine: {
    questionType: "routine",
    label: "루틴/습관",
    required: [
      "어떤 루틴인지 분명함",
      "빈도 표현 있음 (usually, every day, on weekends)",
      "현재시제로 안정적",
    ],
    advanced: [
      "순서 연결어 사용 (first, then, after that)",
      "이유/느낌/예외 상황 짧게 있음",
    ],
    idealFlow: "루틴 소개 → 빈도 제시 → 순서대로 3단계 설명 → 보통/예외 구분 → 짧은 느낌",
    commonMistakes: [
      "빈도 없이 행동만 나열",
      "순서가 흐려짐",
      "현재 습관인데 과거시제로 흔들림",
    ],
    corePrescription: "빈도 + 순서 연결어를 먼저 고정",
    feedbackTone: "직설적 코칭 (4~5문장)",
    startTemplate: "I usually… First,…",
  },

  comparison: {
    questionType: "comparison",
    label: "비교/변화",
    required: [
      "비교의 두 축이 분명함 (예전 vs 지금)",
      "비교 포인트 최소 2개",
      "대비 표현 사용 (compared to, unlike, these days)",
    ],
    advanced: [
      "변화의 원인/배경이 있음",
      "변화에 대한 본인 의견 있음",
    ],
    idealFlow: "비교 기준 제시 → 과거 상태 → 현재 상태 → 왜 바뀌었는지 → 개인적 평가",
    commonMistakes: [
      "한쪽만 말함 (지금만 길게, 과거 없음)",
      "원인 없이 차이만 말함",
      "비교 표현 없이 나열식 설명",
    ],
    corePrescription: '첫 문장에서 비교축 세우기 — "In the past…, but these days…"',
    feedbackTone: "분석형 코칭 (5문장 전후)",
    startTemplate: "In the past…, but these days…",
  },

  past_childhood: {
    questionType: "past_childhood",
    label: "어릴 때 경험",
    required: [
      '"어릴 때"라는 시간 앵커 분명 (when I was a child)',
      "배경 정보 있음 (어디서, 누구와, 어떤 상황)",
      "실제 사건/행동이 과거시제로 나옴",
    ],
    advanced: [
      "감정/반응 있음",
      "지금 돌아보는 의미 또는 지금과 어떻게 연결되는지",
    ],
    idealFlow: "어린 시절 시점 → 배경 → 무슨 일이 있었는지 → 그때 반응 → 지금 돌아보는 의미",
    commonMistakes: [
      "childhood 앵커 없이 그냥 과거 경험처럼 말함",
      "과거시제가 약함",
      "사건보다 배경 설명만 길어짐",
    ],
    corePrescription: "첫 문장에 childhood marker, 마지막에 지금 의미 붙이기",
    feedbackTone: "스토리 코칭형 (5~6문장)",
    startTemplate: "When I was a child,…",
  },

  past_special: {
    questionType: "past_special",
    label: "기억에 남는 경험",
    required: [
      "어떤 경험이 기억에 남는지 명확",
      "배경 있음 (시간/장소/함께한 사람)",
      "핵심 사건이 분명함",
    ],
    advanced: [
      "감정이나 반응 있음",
      "왜 기억에 남는지 이유 분명",
    ],
    idealFlow: "기억에 남는 경험 소개 → 배경 → 핵심 사건 → 감정/반응 → 왜 기억나는지",
    commonMistakes: [
      '"재밌었다"만 있고 사건이 없음',
      "시간순 전개가 불분명",
      "왜 memorable인지 설명이 약함",
    ],
    corePrescription: '사건 1개를 중심으로 서사화 — "무슨 일이 있었는지"가 핵심',
    feedbackTone: "격려 + 구조 교정 (5~6문장)",
    startTemplate: "One memorable experience I had was…",
  },

  past_recent: {
    questionType: "past_recent",
    label: "과거 습관",
    required: [
      "과거의 반복 습관/패턴이 분명함",
      "빈도 표현 있음 (every weekend, often, used to)",
      "과거 습관에 맞는 시제 안정적",
    ],
    advanced: [
      "전형적인 루틴/행동 순서 설명",
      "지금과의 차이 또는 중단 이유 있음",
    ],
    idealFlow: "과거 습관 소개 → 얼마나 자주 → 보통 어떻게 → 왜 했는지 → 지금은 어떤지",
    commonMistakes: [
      "단발성 사건처럼 말함",
      "현재 루틴과 섞임",
      "지금과의 대비가 없음",
    ],
    corePrescription: "used to + frequency + now — 이 3점 세트",
    feedbackTone: "직설형 교정 (4~5문장)",
    startTemplate: "I used to…",
  },

  rp_11: {
    questionType: "rp_11",
    label: "정보 요청 롤플레이",
    required: [
      "목적/상황이 드러남",
      "질문 개수 3개 이상",
      "질문이 WH-질문 중심 (단순 yes/no 아님)",
    ],
    advanced: [
      "정중 표현 사용 (Could you~, Would you~)",
      "상대 답변을 지어내지 않음",
    ],
    idealFlow: "인사/상황 제시 → 질문 1 → 질문 2 → 질문 3 → 짧은 마무리",
    commonMistakes: [
      "질문이 아니라 진술문으로 말함",
      "질문 수가 부족함",
      "혼자 질문하고 혼자 답까지 함",
    ],
    corePrescription: "문장 품질보다 질문 개수 확보가 먼저",
    feedbackTone: "체크리스트형, 직설적 (3~4문장)",
    startTemplate: "Hi, I'd like some information. First,…",
  },

  rp_12: {
    questionType: "rp_12",
    label: "상황 대응 롤플레이",
    required: [
      "사과 또는 상황 인정",
      "이유/원인 설명",
      "해결 옵션 2개 이상 제시",
    ],
    advanced: [
      "현재 상태 설명",
      "상대의 선택/확인 유도",
    ],
    idealFlow: "사과 → 이유 설명 → 현재 상황 → 옵션 A / 옵션 B → 어떤 게 괜찮은지 묻기",
    commonMistakes: [
      "사과만 하고 끝남",
      "옵션이 1개뿐이거나 없음",
      "상대 선택 유도 없이 독백으로 끝남",
    ],
    corePrescription: "사과 + 이유 + 옵션 2개 — 이 3개가 필수",
    feedbackTone: "문제 해결 코칭형 (4~5문장)",
    startTemplate: "I'm sorry, but… Would you prefer A or B?",
  },

  adv_14: {
    questionType: "adv_14",
    label: "사회 비교/변화",
    required: [
      "사회적 주제가 분명함",
      "과거 vs 현재 또는 집단 간 비교 있음",
      "이유/배경 최소 2개",
    ],
    advanced: [
      "개인 경험만이 아닌 사회적 관점",
      "예시 또는 관찰 사례 있음",
    ],
    idealFlow: "주제 제시 → 사회적 비교/변화 → 원인 1 → 원인 2 → 예시/시사점",
    commonMistakes: [
      "개인 이야기만 하고 사회적 관점 없음",
      "비교는 있는데 이유가 약함",
      "추상적 주장만 있고 예시가 없음",
    ],
    corePrescription: "개인 경험을 사회 현상으로 끌어올리기",
    feedbackTone: "논리 코칭형 (5~6문장)",
    startTemplate: "Compared to the past, these days…",
  },

  adv_15: {
    questionType: "adv_15",
    label: "의견 제시/주장",
    required: [
      "입장이 명확함",
      "이유 최소 2개",
      "논리 연결어 사용 (because, therefore, for example)",
    ],
    advanced: [
      "예시 1개 이상 (구체적)",
      "결론/재진술 있음",
    ],
    idealFlow: "입장 제시 → 이유 1 + 예시 → 이유 2 + 예시/설명 → 결론",
    commonMistakes: [
      "입장이 모호함",
      "같은 이유를 반복",
      "예시 없이 추상적으로만 말함",
    ],
    corePrescription: "첫 문장에 입장 + 이유 2개 분리하여 말하기",
    feedbackTone: "명확하고 코칭적 (5~6문장)",
    startTemplate: "I think … for two reasons.",
  },
};

// ============================================================
// 3. v3 프롬프트 키 매핑
// ============================================================

// eval-judge 프롬프트 키 (공유 — 체크박스/체크리스트는 코드에서 동적 주입)
export function getJudgePromptKey(_questionType: string): string {
  return "eval_judge";
}

// 과제충족 체크리스트 텍스트 생성 (프롬프트 주입용)
export function buildTaskChecklistText(questionType: string, targetLevel: string): string {
  const config = TYPE_CHECKLISTS[questionType];
  if (!config) return "";

  const lines: string[] = [];
  lines.push(`## TASK FULFILLMENT CHECKLIST — ${config.label} (${questionType})`);
  lines.push("");
  lines.push("### 🔴 Required (전 등급 필수):");
  for (const item of config.required) {
    lines.push(`- [ ] ${item}`);
  }
  lines.push("");
  lines.push("### 🟡 Advanced (IH/AL 추가 요구):");
  for (const item of config.advanced) {
    lines.push(`- [ ] ${item}`);
  }
  lines.push("");
  lines.push(`### Fulfillment Threshold (Target: ${targetLevel})`);
  lines.push("- IM 이하: Required 전부 충족 → fulfilled");
  lines.push("- IH: Required 전부 + Advanced 1개 → fulfilled");
  lines.push("- AL: Required 전부 + Advanced 전부 → fulfilled");
  lines.push("- Required 미충족 → partial 또는 failed");
  lines.push("");
  lines.push(`### Ideal Answer Flow`);
  lines.push(config.idealFlow);
  lines.push("");
  lines.push(`### Common Mistakes (이 유형에서 자주 발생)`);
  for (const m of config.commonMistakes) {
    lines.push(`- ${m}`);
  }

  return lines.join("\n");
}

// DB에서 로드한 체크리스트 데이터로 텍스트 빌드 (buildTaskChecklistText의 DB 오버라이드 버전)
export function buildTaskChecklistTextFromConfig(config: TypeChecklist, targetLevel: string): string {
  const lines: string[] = [];
  lines.push(`## TASK FULFILLMENT CHECKLIST — ${config.label} (${config.questionType})`);
  lines.push("");
  lines.push("### 🔴 Required (전 등급 필수):");
  for (const item of config.required) {
    lines.push(`- [ ] ${item}`);
  }
  lines.push("");
  lines.push("### 🟡 Advanced (IH/AL 추가 요구):");
  for (const item of config.advanced) {
    lines.push(`- [ ] ${item}`);
  }
  lines.push("");
  lines.push(`### Fulfillment Threshold (Target: ${targetLevel})`);
  lines.push("- IM 이하: Required 전부 충족 → fulfilled");
  lines.push("- IH: Required 전부 + Advanced 1개 → fulfilled");
  lines.push("- AL: Required 전부 + Advanced 전부 → fulfilled");
  lines.push("- Required 미충족 → partial 또는 failed");
  lines.push("");
  lines.push(`### Ideal Answer Flow`);
  lines.push(config.idealFlow);
  lines.push("");
  lines.push(`### Common Mistakes (이 유형에서 자주 발생)`);
  for (const m of config.commonMistakes) {
    lines.push(`- ${m}`);
  }
  return lines.join("\n");
}

// eval-coach 프롬프트 키 (분기별)
export function getCoachPromptKey(feedbackBranch: string): string {
  if (feedbackBranch === "partial") return "eval_coach_partial";
  return "eval_coach_standard"; // fulfilled
  // failed는 GPT 호출 없음 (룰 기반)
}

// ============================================================
// 5. 무응답 구제 메시지 룰 기반 생성
// ============================================================

export function buildRescueMessage(questionType: string): {
  coaching_feedback: Record<string, unknown>;
  priority_prescription: Array<Record<string, string>>;
} {
  const config = TYPE_CHECKLISTS[questionType];
  if (!config) {
    return {
      coaching_feedback: {
        one_line_insight: "답변이 충분하지 않아 상세 분석이 어렵습니다.",
      },
      priority_prescription: [],
    };
  }

  return {
    coaching_feedback: {
      one_line_insight: `긴 멈춤으로 인해 과제 수행이 중단된 상태입니다.`,
      structure_comment: `이 유형(${config.label})은 완벽한 답보다 첫 문장 진입이 더 중요합니다.`,
      key_corrections: [],
      better_version: null,
      delivery_insight: "긴 침묵으로 수치 해석이 제한됩니다.",
      strength: null,
      rescue: {
        start_template: config.startTemplate,
        recovery_tip: `"${config.startTemplate}"로 시작해보세요. ${config.corePrescription}`,
        tone: "이번 답변은 영어 지식 부족이라기보다 시작 진입이 막힌 경우에 가깝습니다.",
      },
    },
    priority_prescription: [
      {
        action: `"${config.startTemplate}"로 시작하여 첫 문장 진입 연습`,
        why: "시작 문장을 잡으면 나머지는 자연스럽게 이어집니다.",
        example: config.startTemplate,
      },
    ],
  };
}

// ============================================================
// 6. drill_tag 닫힌 택소노미 검증
// ============================================================

export const VALID_DRILL_TAGS = new Set([
  "description_detail", "routine_sequence", "comparison_frame",
  "past_narrative", "tense_consistency", "roleplay_questions",
  "roleplay_recovery", "opinion_support", "social_perspective",
  "detail_expansion", "example_insertion", "transition_words",
  "vocabulary_variety", "polite_expression", "opening_entry",
  "closing_wrap", "pause_control", "filler_reduction", "sentence_completion",
]);

export function isValidDrillTag(tag: string): boolean {
  return VALID_DRILL_TAGS.has(tag);
}
