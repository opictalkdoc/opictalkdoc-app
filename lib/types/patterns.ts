// 만능패턴 타입 정의

/** 패턴 예시 항목 */
export interface PatternExample {
  topic: string; // "여행", "공연", "휴대폰"
  sentence: string; // "Thanks again for helping with my reservation."
  highlight: string; // "my reservation" (하이라이트할 변수 부분)
}

/** 개별 패턴 */
export interface UniversalPattern {
  id: string; // "desc_1_01" (유형_phase_순번)
  template: string; // "Thanks again for helping with [~]."
  translation: string; // "~을 도와주셔서 다시 한번 감사합니다."
  examples: PatternExample[];
}

/** Phase 정의 */
export interface PatternPhase {
  phase: number; // 1, 2, 3, 4
  title: string; // "도입부 패턴"
  description: string; // "자연스럽게 주제를 던지며..."
  color: string; // "green" | "blue" | "orange" | "red"
  emoji: string; // "🟢" | "🔵" | "🟠" | "🔴"
  patterns: UniversalPattern[];
}

/** question_type별 패턴 세트 */
export interface PatternSet {
  questionType: PatternType;
  label: string;
  phases: PatternPhase[];
}

/** 10개 question_type */
export const PATTERN_TYPES = [
  "description",
  "routine",
  "comparison",
  "past_childhood",
  "past_special",
  "past_recent",
  "rp_11",
  "rp_12",
  "adv_14",
  "adv_15",
] as const;

export type PatternType = (typeof PATTERN_TYPES)[number];

/** 만능패턴 전용 탭 라벨 */
export const PATTERN_TYPE_LABELS: Record<PatternType, string> = {
  description: "묘사",
  routine: "루틴",
  comparison: "비교",
  past_childhood: "경험·처음",
  past_special: "경험·특별",
  past_recent: "경험·최근",
  rp_11: "질문하기",
  rp_12: "대안제시",
  adv_14: "비교·변화",
  adv_15: "사회이슈",
};

/** Phase 색상 매핑 */
export const PHASE_CONFIG = {
  1: { color: "green", emoji: "🟢", title: "도입부 패턴" },
  2: { color: "blue", emoji: "🔵", title: "전개 패턴" },
  3: { color: "orange", emoji: "🟠", title: "감정/리액션 패턴" },
  4: { color: "red", emoji: "🔴", title: "마무리 패턴" },
} as const;
