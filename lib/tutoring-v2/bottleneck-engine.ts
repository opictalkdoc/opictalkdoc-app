/**
 * 튜터링 V2 병목 판별 엔진
 *
 * 설계 문서: docs/설계/튜터링-v2.md §4 (Layer 2)
 * 5-Step 알고리즘:
 *   Step 1: 현재 티어 결정 (외부에서 전달)
 *   Step 2: 빈도 집계 — 15문항의 weak_points를 모두 펼쳐서 wp_code별 출현 집계
 *   Step 3: 심각도 가중 — severe×3.0, moderate×1.5, mild×0.5. 질문당 동일 코드 max 3.0 cap
 *   Step 3-1: fulfillment 보정 — fulfilled×1.0, partial×1.1, unfulfilled×1.25, skipped 제외
 *   Step 4: 티어 관련도 필터 — wp_tier_matrix에서 현재 티어의 relevance 적용
 *   Step 4-1: 게이트성 코드 보정 — gate_flag가 true면 +2.0 bonus
 *   Step 5: 스코어링 + Top 3 선택
 *
 * 공식: bottleneck_score = Σ( min(severity_weight, 3.0) × tier_relevance × fulfillment_multiplier )
 *        + gate_flag ? 2.0 : 0
 */

import type { TutoringTier, BottleneckResult } from '@/lib/types/tutoring-v2';
import { GRADE_TO_TIER } from '@/lib/types/tutoring-v2';

// ═══════════════════════════════════════════════════
// 입력 타입
// ═══════════════════════════════════════════════════

/** 모의고사 v2에서 넘어오는 약점 (문항 단위) */
export interface WeakPointInput {
  code: string;          // "WP_S03"
  severity: string;      // "severe" | "moderate" | "mild" (또는 "major" | "minor" — 정규화 필요)
  reason: string;
  evidence: string;
}

/** fulfillment 상태 */
export type FulfillmentStatus = 'fulfilled' | 'partial' | 'unfulfilled' | 'skipped';

/** 문항별 평가 결과 (병목 엔진 입력용) */
export interface QuestionEvalForBottleneck {
  question_number: number;
  fulfillment: FulfillmentStatus;
  weak_points: WeakPointInput[];
}

// ═══════════════════════════════════════════════════
// 상수
// ═══════════════════════════════════════════════════

/** 심각도별 가중치 */
const SEVERITY_WEIGHT: Record<string, number> = {
  severe: 3.0,
  major: 1.5,     // 정규화: major → moderate 취급
  moderate: 1.5,
  minor: 0.5,     // 정규화: minor → mild 취급
  mild: 0.5,
};

/** 질문당 동일 코드의 최대 기여치 */
const PER_QUESTION_CAP = 3.0;

/** fulfillment 보정 계수 (§4 Step 3-1) */
const FULFILLMENT_MULTIPLIER: Record<FulfillmentStatus, number> = {
  fulfilled: 1.0,
  partial: 1.1,
  unfulfilled: 1.25,
  skipped: 0,      // 제외
};

/** 승급 게이트 코드 (§4 Step 4-1) */
const GATE_CODES = new Set([
  'WP_T01', // task_unfulfilled
  'WP_T02', // subtask_omission
  'WP_S04', // paragraph_absent
  'WP_S05', // paragraph_unstable
  'WP_A08', // timeframe_control_failed
  'WP_T04', // complication_failed
  'WP_T08', // solution_absent
]);

/** 게이트 코드 보너스 점수 */
const GATE_BONUS = 2.0;

/**
 * 36개 WP 코드 × 4 Tier 가중치 매트릭스
 * 인덱스: [T1, T2, T3, T4]
 * 값: 0(무관), 0.2(참고), 0.5(중요 보조), 1.0(핵심 병목)
 */
const TIER_RELEVANCE: Record<string, [number, number, number, number]> = {
  // Structure (구조) — S01~S09
  WP_S01: [1.0, 0.5, 0.2, 0  ],
  WP_S02: [1.0, 1.0, 0.5, 0  ],
  WP_S03: [0.2, 0.5, 1.0, 0.2],
  WP_S04: [0,   0.2, 1.0, 0.5],
  WP_S05: [0,   0.2, 0.5, 1.0],
  WP_S06: [0.2, 0.2, 0.5, 0.2],
  WP_S07: [0.5, 1.0, 0.5, 0.5],
  WP_S08: [0.2, 0.5, 1.0, 0.5],
  WP_S09: [0.2, 0.5, 1.0, 1.0],

  // Accuracy (정확성) — A01~A08
  WP_A01: [0,   0.2, 0.5, 1.0],
  WP_A02: [0,   0.2, 1.0, 1.0],
  WP_A03: [0.2, 0.2, 0.2, 0.2],
  WP_A04: [0,   0.2, 0.2, 0.2],
  WP_A05: [0.5, 0.5, 0.2, 0.5],
  WP_A06: [0.5, 0.2, 0.2, 0.5],
  WP_A07: [0.5, 0.5, 0.2, 0.5],
  WP_A08: [0,   0.2, 1.0, 1.0],

  // Content (내용) — C01~C07
  WP_C01: [0,   0.2, 1.0, 0.5],
  WP_C02: [0,   0.2, 0.5, 0.5],
  WP_C03: [0,   0.2, 0.5, 1.0],
  WP_C04: [0,   0,   0.2, 1.0],
  WP_C05: [0,   0.2, 0.5, 0.2],
  WP_C06: [0,   0.5, 0.5, 0.2],
  WP_C07: [0,   0.2, 0.5, 1.0],

  // Task (과제) — T01~T08
  WP_T01: [1.0, 1.0, 1.0, 1.0],
  WP_T02: [1.0, 1.0, 1.0, 1.0],
  WP_T03: [0,   0.2, 0.5, 1.0],
  WP_T04: [0,   0.2, 0.5, 1.0],
  WP_T05: [0,   0.2, 0.5, 1.0],
  WP_T06: [0,   0.2, 0.5, 0.2],
  WP_T07: [0,   0.2, 0.2, 0.5],
  WP_T08: [0,   0.2, 0.5, 1.0],

  // Delivery (전달) — D01~D04
  WP_D01: [1.0, 1.0, 0.5, 0.5],
  WP_D02: [0.2, 0.5, 0.2, 0.2],
  WP_D03: [0,   0.2, 0.2, 0.2],
  WP_D04: [0.5, 0.5, 0.2, 0  ],
};

/**
 * WP → drill 매핑 (Tier별 최적 드릴)
 * 키: "WP_XXX", 값: Record<TutoringTier, drill_code>
 */
const WP_TO_DRILL: Record<string, Record<TutoringTier, string>> = {
  WP_S01: { 1: 'sentence_formation',   2: 'sentence_formation',   3: 'sentence_formation',   4: 'sentence_formation'   },
  WP_S02: { 1: 'frame_4line',          2: 'frame_4line',          3: 'skeleton_paragraph',    4: 'skeleton_paragraph'   },
  WP_S03: { 1: 'basic_connectors',     2: 'basic_connectors',     3: 'connector_diversity',   4: 'connector_diversity'  },
  WP_S04: { 1: 'skeleton_paragraph',   2: 'skeleton_paragraph',   3: 'skeleton_paragraph',    4: 'skeleton_paragraph'   },
  WP_S05: { 1: 'paragraph_sustain',    2: 'paragraph_sustain',    3: 'paragraph_sustain',     4: 'paragraph_sustain'    },
  WP_S06: { 1: 'paragraph_closure',    2: 'paragraph_closure',    3: 'paragraph_closure',     4: 'paragraph_closure'    },
  WP_S07: { 1: 'topic_maintenance',    2: 'topic_maintenance',    3: 'topic_maintenance',     4: 'topic_maintenance'    },
  WP_S08: { 1: 'past_narrative',       2: 'past_narrative',       3: 'past_narrative',        4: 'past_narrative'       },
  WP_S09: { 1: 'skeleton_paragraph',   2: 'skeleton_paragraph',   3: 'thought_progression',   4: 'paragraph_sustain'    },

  WP_A01: { 1: 'tense_accuracy',       2: 'tense_accuracy',       3: 'tense_accuracy',        4: 'tense_accuracy'       },
  WP_A02: { 1: 'tense_attempt',        2: 'tense_attempt',        3: 'tense_attempt',         4: 'tense_attempt'        },
  WP_A03: { 1: 'agreement_accuracy',   2: 'agreement_accuracy',   3: 'agreement_accuracy',    4: 'agreement_accuracy'   },
  WP_A04: { 1: 'preposition_accuracy', 2: 'preposition_accuracy', 3: 'preposition_accuracy',  4: 'preposition_accuracy' },
  WP_A05: { 1: 'sentence_completion',  2: 'sentence_completion',  3: 'sentence_completion',   4: 'sentence_completion'  },
  WP_A06: { 1: 'pronunciation_clarity',2: 'pronunciation_clarity',3: 'pronunciation_clarity',  4: 'pronunciation_clarity'},
  WP_A07: { 1: 'hesitation_reduction', 2: 'hesitation_reduction', 3: 'hesitation_reduction',  4: 'hesitation_reduction' },
  WP_A08: { 1: 'tense_accuracy',       2: 'tense_accuracy',       3: 'timeframe_sustain',     4: 'tense_accuracy'       },

  WP_C01: { 1: 'description_depth',    2: 'description_depth',    3: 'description_depth',     4: 'description_depth'    },
  WP_C02: { 1: 'vocabulary_upgrade',   2: 'vocabulary_upgrade',   3: 'vocabulary_upgrade',    4: 'vocabulary_upgrade'   },
  WP_C03: { 1: 'vocabulary_upgrade',   2: 'vocabulary_upgrade',   3: 'vocabulary_upgrade',    4: 'vocabulary_upgrade'   },
  WP_C04: { 1: 'social_perspective',   2: 'social_perspective',   3: 'social_perspective',    4: 'social_perspective'   },
  WP_C05: { 1: 'description_depth',    2: 'description_depth',    3: 'description_depth',     4: 'description_depth'    },
  WP_C06: { 1: 'description_depth',    2: 'description_depth',    3: 'description_depth',     4: 'description_depth'    },
  WP_C07: { 1: 'reason_chain',         2: 'reason_chain',         3: 'reason_chain',          4: 'social_perspective'   },

  WP_T01: { 1: 'basic_transaction',    2: 'question_response',    3: 'question_response',     4: 'question_response'    },
  WP_T02: { 1: 'question_response',    2: 'multi_part_checklist', 3: 'question_response',     4: 'question_response'    },
  WP_T03: { 1: 'comparison_frame',     2: 'comparison_frame',     3: 'comparison_frame',      4: 'comparison_frame'     },
  WP_T04: { 1: 'complication_handling', 2: 'complication_handling',3: 'complication_handling',  4: 'complication_handling' },
  WP_T05: { 1: 'negotiation_expressions',2: 'negotiation_expressions',3: 'negotiation_expressions',4: 'negotiation_expressions'},
  WP_T06: { 1: 'question_response',    2: 'question_response',    3: 'question_response',     4: 'question_response'    },
  WP_T07: { 1: 'negotiation_expressions',2: 'negotiation_expressions',3: 'negotiation_expressions',4: 'negotiation_expressions'},
  WP_T08: { 1: 'complication_handling', 2: 'complication_handling',3: 'complication_handling',  4: 'solution_proposal'    },

  WP_D01: { 1: 'speech_volume',        2: 'speech_volume',        3: 'speech_volume',         4: 'speech_volume'        },
  WP_D02: { 1: 'hesitation_reduction', 2: 'hesitation_reduction', 3: 'hesitation_reduction',  4: 'hesitation_reduction' },
  WP_D03: { 1: 'filler_reduction',     2: 'filler_reduction',     3: 'filler_reduction',      4: 'filler_reduction'     },
  WP_D04: { 1: 'speech_volume',        2: 'speech_volume',        3: 'speech_volume',         4: 'speech_volume'        },
};

// ═══════════════════════════════════════════════════
// 유틸리티
// ═══════════════════════════════════════════════════

/** severity 문자열 정규화: major→moderate, minor→mild */
function normalizeSeverity(raw: string): string {
  if (raw === 'major') return 'moderate';
  if (raw === 'minor') return 'mild';
  return raw;
}

/** 가중치 → tier_relevance 라벨 변환 */
function relevanceLabel(weight: number): 'essential' | 'helpful' | 'luxury' {
  if (weight >= 1.0) return 'essential';
  if (weight >= 0.5) return 'helpful';
  return 'luxury';
}

/** 등급 문자열 → Tier 변환 (기본값 Tier 3) */
export function gradeToTier(grade: string): TutoringTier {
  return GRADE_TO_TIER[grade.toUpperCase()] ?? 3;
}

// ═══════════════════════════════════════════════════
// 내부 집계 구조
// ═══════════════════════════════════════════════════

interface CodeAggregation {
  score: number;
  frequency: number;
  questions: Set<number>;
  evidenceSamples: string[];     // 최대 3개 보관
  bestEvidence: string;
  bestSeverityWeight: number;
  isGate: boolean;
}

// ═══════════════════════════════════════════════════
// 핵심 엔진
// ═══════════════════════════════════════════════════

/**
 * v2.1 병목 분석 엔진
 *
 * @param evaluations 문항별 평가 결과 배열 (최대 15문항)
 * @param currentGrade 현재 등급 (예: "IM3")
 * @returns 상위 3개 병목 결과 (점수 내림차순)
 */
export function analyzeBottlenecks(
  evaluations: QuestionEvalForBottleneck[],
  currentGrade: string,
): BottleneckResult[] {
  const tier = gradeToTier(currentGrade);
  const tierIdx = tier - 1; // 배열 인덱스 (0-based)

  // Step 1: 티어 결정 (외부에서 전달됨)

  // Step 2~3: 빈도 집계 + 심각도 가중 + fulfillment 보정
  const codeMap = new Map<string, CodeAggregation>();

  for (const evalItem of evaluations) {
    // skipped 문항은 제외 (Step 3-1)
    if (evalItem.fulfillment === 'skipped') continue;

    // fulfillment 보정 계수 (Step 3-1)
    const fulfillmentMult = FULFILLMENT_MULTIPLIER[evalItem.fulfillment] ?? 1.0;

    // 질문 내 동일 코드별 기여치 추적 (per-question cap 적용용)
    const perQuestionContrib = new Map<string, number>();

    for (const wp of evalItem.weak_points) {
      const code = wp.code;
      const relevanceArr = TIER_RELEVANCE[code];
      if (!relevanceArr) continue; // 알 수 없는 코드 무시

      // Step 4: 티어 관련도 필터
      const relevance = relevanceArr[tierIdx];
      if (relevance === 0) continue; // 현재 Tier에서 무관한 코드 제외

      // Step 3: 심각도 가중 (정규화 후)
      const normalizedSev = normalizeSeverity(wp.severity);
      const sevWeight = SEVERITY_WEIGHT[normalizedSev] ?? 0.5;

      // 질문당 동일 코드 max 3.0 cap (Step 3)
      const currentContrib = perQuestionContrib.get(code) ?? 0;
      const cappedSevWeight = Math.min(sevWeight, PER_QUESTION_CAP - currentContrib);
      if (cappedSevWeight <= 0) continue; // cap 초과 시 스킵

      perQuestionContrib.set(code, currentContrib + cappedSevWeight);

      // 최종 기여치: severity × fulfillment × tier_relevance
      const contribution = cappedSevWeight * fulfillmentMult * relevance;

      const existing = codeMap.get(code);
      if (existing) {
        existing.score += contribution;
        existing.frequency += 1;
        existing.questions.add(evalItem.question_number);
        // evidence 샘플 수집 (최대 3개)
        if (existing.evidenceSamples.length < 3 && wp.evidence) {
          existing.evidenceSamples.push(wp.evidence);
        }
        // 더 심각한 evidence로 대표 교체
        if (sevWeight > existing.bestSeverityWeight) {
          existing.bestEvidence = wp.evidence;
          existing.bestSeverityWeight = sevWeight;
        }
      } else {
        codeMap.set(code, {
          score: contribution,
          frequency: 1,
          questions: new Set([evalItem.question_number]),
          evidenceSamples: wp.evidence ? [wp.evidence] : [],
          bestEvidence: wp.evidence,
          bestSeverityWeight: sevWeight,
          isGate: GATE_CODES.has(code),
        });
      }
    }
  }

  // Step 4-1: 게이트성 코드 보정
  for (const [, agg] of codeMap) {
    if (agg.isGate) {
      agg.score += GATE_BONUS;
    }
  }

  // Step 5: 점수 내림차순 정렬 → 상위 3개 추출
  const sorted = [...codeMap.entries()]
    .sort((a, b) => b[1].score - a[1].score)
    .slice(0, 3);

  // 최대 점수 (confidence 계산용)
  const maxPossibleScore = sorted[0]?.[1].score ?? 0;

  // BottleneckResult[] 생성
  return sorted.map(([code, agg], idx) => {
    const relevance = TIER_RELEVANCE[code]?.[tierIdx] ?? 0;
    const drillCode = WP_TO_DRILL[code]?.[tier] ?? 'question_response';
    const questionsArr = [...agg.questions].sort((a, b) => a - b);

    // confidence: 빈도와 점수 기반 (빈도 3+면 0.7 이상, 점수가 높을수록 높음)
    const freqFactor = Math.min(agg.frequency / 5, 1.0); // 5문항 이상이면 1.0
    const scoreFactor = maxPossibleScore > 0
      ? Math.min(agg.score / maxPossibleScore, 1.0)
      : 0;
    const confidence = Math.round((freqFactor * 0.5 + scoreFactor * 0.5) * 100) / 100;

    // delta_priority_reason 결정
    let priorityReason = '고빈도 반복';
    if (agg.isGate) {
      priorityReason = '승급 게이트 코드';
    } else if (agg.frequency >= 5) {
      priorityReason = '고빈도 습관성 약점';
    } else if (relevance >= 1.0 && agg.frequency >= 3) {
      priorityReason = '티어 핵심 + 다빈도';
    }

    return {
      rank: (idx + 1) as 1 | 2 | 3,
      wp_code: code,
      drill_code: drillCode,
      score: Math.round(agg.score * 100) / 100,
      frequency: agg.frequency,
      evidence_questions: questionsArr,
      sample_evidence: agg.bestEvidence,
      tier_relevance: relevanceLabel(relevance),
      current_tier: tier,
      gate_flag: agg.isGate,
      confidence,
      delta_priority_reason: priorityReason,
      evidence_samples: agg.evidenceSamples.slice(0, 3),
    };
  });
}

// ═══════════════════════════════════════════════════
// 편의 함수 (export)
// ═══════════════════════════════════════════════════

/** 코드 → 한글 카테고리명 */
export function wpCategoryLabel(code: string): string {
  const prefix = code.split('_')[1]?.[0];
  const labels: Record<string, string> = {
    S: '구조', A: '정확성', C: '내용', T: '과제', D: '전달',
  };
  return labels[prefix ?? ''] ?? '기타';
}

/** 코드의 현재 Tier relevance 가중치 조회 */
export function getTierRelevance(code: string, tier: TutoringTier): number {
  return TIER_RELEVANCE[code]?.[tier - 1] ?? 0;
}

/** 코드 → Tier별 추천 드릴 조회 */
export function getDrillForCode(code: string, tier: TutoringTier): string | null {
  return WP_TO_DRILL[code]?.[tier] ?? null;
}

/** 게이트 코드 여부 확인 */
export function isGateCode(code: string): boolean {
  return GATE_CODES.has(code);
}
