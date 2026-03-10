// 결과 페이지 공통 헬퍼 — 매핑, 색상, 유틸
import type { OpicLevel } from "@/lib/types/mock-exam";
import { OPIC_LEVEL_ORDER } from "@/lib/types/mock-exam";

// question_type 한글 (DB question_type_kor 기준)
export const QT_KO: Record<string, string> = {
  description: "묘사",
  routine: "루틴",
  comparison: "비교",
  past_childhood: "경험 | 어릴적/처음",
  past_special: "경험 | 특별한",
  past_recent: "경험 | 최근",
  past_habitual: "경험 | 과거습관",
  rp_11: "질문하기",
  rp_12: "대안제시",
  adv_14: "비교/변화",
  adv_15: "사회적이슈",
  // v2 호환
  asking_questions: "질문하기",
  experience_specific: "경험 | 특별한",
  experience_habitual: "경험 | 과거습관",
  experience_past: "경험 | 최근",
  suggest_alternatives: "대안제시",
  comparison_change: "비교/변화",
  social_issue: "사회적이슈",
};

// GPT 유형맵 키 → 한글
export const TYPE_MAP_KO: Record<string, string> = {
  description_detail: "구체적 묘사",
  routine_sequence: "일상 순서",
  comparison_frame: "비교 구조",
  past_narrative: "과거 경험",
  roleplay_questions: "질문하기",
  roleplay_recovery: "대안·회복",
  opinion_support: "의견 근거",
  social_perspective: "사회적 관점",
  detail_expansion: "세부 확장",
  filler_reduction: "필러 줄이기",
};

// 반복 오류 카테고리 → 한글
export const CATEGORY_KO: Record<string, string> = {
  structure: "구조",
  task_performance: "과제수행",
  delivery_habit: "전달습관",
  expression: "표현",
  grammar: "문법",
  vocabulary: "어휘",
};

// 영역 매핑
export const AREA_KO: Record<string, string> = {
  task_performance: "과제수행",
  content_structure: "내용구조",
  delivery: "전달",
};

export const AREA_COLOR: Record<string, string> = {
  task_performance: "bg-blue-50 text-blue-700 border-blue-200",
  content_structure: "bg-purple-50 text-purple-700 border-purple-200",
  delivery: "bg-orange-50 text-orange-700 border-orange-200",
};

// 상태 매핑
export const STATUS_KO: Record<string, string> = {
  strong: "강함",
  stable: "안정",
  weak: "약함",
  very_weak: "매우 약함",
};

// checkbox_type 한글
export const CB_KO: Record<string, string> = {
  INT: "기초",
  ADV: "심화",
  AL: "고급",
};

// 색상 함수
export function getStatusColor(status: string): string {
  switch (status) {
    case "strong": return "bg-green-100 text-green-700";
    case "stable": return "bg-blue-100 text-blue-700";
    case "weak": return "bg-yellow-100 text-yellow-700";
    case "very_weak": return "bg-red-100 text-red-600";
    default: return "bg-surface-secondary text-foreground-muted";
  }
}

export function getSeverityColor(severity: string): string {
  if (severity === "high") return "bg-red-500";
  if (severity === "medium") return "bg-yellow-500";
  return "bg-surface-secondary";
}

export function getSkillColor(score: number): string {
  if (score >= 4) return "text-green-600 bg-green-50";
  if (score >= 3) return "text-yellow-600 bg-yellow-50";
  return "text-red-500 bg-red-50";
}

// 등급 비교
export function getLevelDiff(
  current: OpicLevel | null,
  previous: OpicLevel | null,
): { direction: "up" | "down" | "same"; diff: number } | null {
  if (!current || !previous) return null;
  const curr = OPIC_LEVEL_ORDER[current] ?? 0;
  const prev = OPIC_LEVEL_ORDER[previous] ?? 0;
  return {
    direction: curr > prev ? "up" : curr < prev ? "down" : "same",
    diff: curr - prev,
  };
}
