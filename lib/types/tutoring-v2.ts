/**
 * 튜터링 V2 타입 정의
 *
 * 설계 문서: docs/설계/튜터링-v2.md
 * 4-Tier 등급 갭 시스템 + 병목 판별 + 드릴 매칭
 */

// ═══════════════════════════════════════════════════
// 상수
// ═══════════════════════════════════════════════════

export const TUTORING_TIERS = [1, 2, 3, 4] as const;
export type TutoringTier = (typeof TUTORING_TIERS)[number];

export const DRILL_CATEGORIES = ['structure', 'accuracy', 'content', 'delivery', 'task'] as const;
export type DrillCategory = (typeof DRILL_CATEGORIES)[number];

export const TRAINING_APPROACHES = ['frame_install', 'swap_drill', 'self_correction', 'timed_pressure', 'pattern_drill'] as const;
export type TrainingApproach = (typeof TRAINING_APPROACHES)[number];

export const SESSION_STATUSES = ['pending', 'active', 'completed'] as const;
export type SessionStatus = (typeof SESSION_STATUSES)[number];

export const PRESCRIPTION_STATUSES = ['pending', 'in_progress', 'completed'] as const;
export type PrescriptionStatus = (typeof PRESCRIPTION_STATUSES)[number];

// ═══════════════════════════════════════════════════
// 등급 → 티어 매핑
// ═══════════════════════════════════════════════════

export const GRADE_TO_TIER: Record<string, TutoringTier> = {
  NL: 1, NM: 1, NH: 1,
  IL: 2,
  IM1: 3, IM2: 3,
  IM3: 4, IH: 4,
};

// ═══════════════════════════════════════════════════
// 티어 설정
// ═══════════════════════════════════════════════════

export interface TierConfig {
  tier: TutoringTier;
  targetRange: string;        // "→ IL"
  currentGrades: string[];    // ["NL", "NH"]
  scaffold: string;           // "Basic Frame"
  actflKey: string;           // "create with language"
  description: string;        // 한줄 설명
}

export const TIER_CONFIGS: TierConfig[] = [
  { tier: 1, targetRange: '→ IL', currentGrades: ['NL', 'NM', 'NH'], scaffold: 'Basic Frame', actflKey: 'create with language', description: '외운 문장 말고 자기 문장 만들기' },
  { tier: 2, targetRange: '→ IM1~IM2', currentGrades: ['IL'], scaffold: '4줄 만능 틀', actflKey: 'strings of sentences', description: '여러 문장을 이어서 말하기' },
  { tier: 3, targetRange: '→ IM3~IH', currentGrades: ['IM1', 'IM2'], scaffold: 'Skeleton Paragraph', actflKey: 'paragraph-length discourse', description: '문단형 connected discourse' },
  { tier: 4, targetRange: '→ AL', currentGrades: ['IM3', 'IH'], scaffold: 'Extended Paragraph', actflKey: 'sustained paragraph in all major time frames', description: '문단 지속 + time frame 통제 + complication handling' },
];

// ═══════════════════════════════════════════════════
// 병목 결과
// ═══════════════════════════════════════════════════

export interface BottleneckResult {
  rank: 1 | 2 | 3;
  wp_code: string;              // "WP_S03"
  drill_code: string;           // "connector_diversity"
  score: number;
  frequency: number;
  evidence_questions: number[];
  sample_evidence: string;
  tier_relevance: 'essential' | 'helpful' | 'luxury';
  current_tier: TutoringTier;
  gate_flag: boolean;
  confidence: number;           // 0.0 ~ 1.0
  delta_priority_reason: string;
  evidence_samples: string[];
}

// ═══════════════════════════════════════════════════
// 드릴 정의 (DB 매핑)
// ═══════════════════════════════════════════════════

export interface DrillDefinition {
  code: string;
  name_ko: string;
  category: DrillCategory;
  tier: TutoringTier;
  approach: TrainingApproach;
  training_method: {
    description: string;
    template?: string;
    target_expressions?: string[];
    rounds: number;
  };
  success_criteria: {
    metric: string;
    threshold: string;
    measurement: 'gpt_count' | 'keyword_match' | 'speech_meta' | 'transcript_analysis';
  };
}

// ═══════════════════════════════════════════════════
// DB 매핑 타입
// ═══════════════════════════════════════════════════

export interface TutoringSessionV2 {
  id: string;
  user_id: string;
  mock_session_id: string | null;
  current_tier: TutoringTier;
  current_grade: string;
  target_grade: string | null;
  bottleneck_results: BottleneckResult[] | null;
  diagnosis_text: DiagnosisGptResult | null;
  status: SessionStatus;
  created_at: string;
  completed_at: string | null;
}

export interface TutoringPrescriptionV2 {
  id: string;
  session_id: string;
  priority: number;
  wp_code: string;
  drill_code: string;
  prescription_data: PrescriptionGptResult | null;
  status: PrescriptionStatus;
  created_at: string;
}

export interface TrainingQuestion {
  id: string;
  text: string;
  topic: string;
}

export interface TutoringTrainingV2 {
  id: string;
  prescription_id: string;
  approach: TrainingApproach;
  current_screen: number;
  rounds_completed: number;
  max_rounds: number;
  passed: boolean;
  started_at: string;
  completed_at: string | null;
  question_ids?: TrainingQuestion[];
}

export interface TutoringAttemptV2 {
  id: string;
  training_id: string;
  round_number: number;
  transcript: string | null;
  audio_url: string | null;
  duration_sec: number | null;
  word_count: number | null;
  wpm: number | null;
  evaluation: EvaluationGptResult | null;
  passed: boolean;
  created_at: string;
}

// ═══════════════════════════════════════════════════
// GPT 출력 타입
// ═══════════════════════════════════════════════════

export interface DiagnosisGptResult {
  one_liner: string;             // 한줄 진단 (일타 강사 톤)
  tier_explanation: string;      // 현재 티어 설명
  bottleneck_summary: string;    // 병목 요약
  next_step: string;             // 다음 행동 제안
}

export interface PrescriptionGptResult {
  prescription_reason: string;   // 왜 이 드릴인지
  what_to_fix: string;           // 뭘 고칠지
  how_to_fix: string;            // 어떻게 고칠지
  before_example: string;        // Before 예시
  after_example: string;         // After 예시
  encouragement: string;         // 격려
}

export interface EvaluationGptResult {
  criteria_check: Array<{
    item: string;
    pass: boolean;
    evidence: string;
  }>;
  fulfillment_rate: number;      // 0~100
  passed: boolean;
  feedback: string;
  next_focus: string | null;
  encouragement: string;
  confidence: number;
  delta_vs_previous: string | null;
  evidence_spans: string[];
  retry_mode: 'same_prompt' | 'same_skill_new_topic' | 'shortened_retry' | 'timed_retry' | null;
}

// ═══════════════════════════════════════════════════
// WP-Tier 매트릭스
// ═══════════════════════════════════════════════════

export interface WpTierEntry {
  wp_code: string;
  tier: TutoringTier;
  relevance: number;
  gate_flag: boolean;
}

// ═══════════════════════════════════════════════════
// WP-Drill 매핑
// ═══════════════════════════════════════════════════

export interface WpDrillMapping {
  wp_code: string;
  tier: TutoringTier;
  drill_code: string;
}

// ═══════════════════════════════════════════════════
// UI용 라벨
// ═══════════════════════════════════════════════════

export const TIER_LABELS: Record<TutoringTier, string> = {
  1: 'Tier 1 (→ IL)',
  2: 'Tier 2 (→ IM)',
  3: 'Tier 3 (→ IH)',
  4: 'Tier 4 (→ AL)',
};

export const APPROACH_LABELS: Record<TrainingApproach, string> = {
  frame_install: '틀 장착',
  swap_drill: '바꿔 끼기',
  self_correction: '자기 교정',
  timed_pressure: '시간 압박',
  pattern_drill: '패턴 반복',
};

export const CATEGORY_LABELS: Record<DrillCategory, string> = {
  structure: '구조',
  accuracy: '정확성',
  content: '내용',
  delivery: '전달',
  task: '과제 수행',
};

// ═══════════════════════════════════════════════════
// ID 생성 유틸
// ═══════════════════════════════════════════════════

export function generateTutoringId(prefix: 'ts' | 'tp' | 'tt' | 'ta'): string {
  return `${prefix}_${crypto.randomUUID().substring(0, 8)}`;
}
