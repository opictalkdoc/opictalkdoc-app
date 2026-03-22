/**
 * 튜터링 V2 드릴 매처
 *
 * 설계 문서: docs/설계/튜터링-v2.md §5 (Layer 3)
 *
 * 역할: BottleneckResult[]에 대해 최적 드릴을 매칭
 * - 병목 엔진이 이미 drill_code를 할당하지만, DB 카탈로그 기반 검증/폴백 담당
 * - DB에서 드릴 카탈로그를 조회하여 실제 존재하는 드릴인지 확인
 * - 해당 tier에 매핑이 없으면 가장 가까운 tier의 드릴로 폴백
 */

import type { TutoringTier, BottleneckResult, DrillDefinition, WpDrillMapping } from '@/lib/types/tutoring-v2';

// ═══════════════════════════════════════════════════
// WP→Drill 매핑 (인메모리 폴백용 — DB 우선)
// ═══════════════════════════════════════════════════

/**
 * WP→Drill 기본 매핑 (§12.5)
 * DB tutoring_wp_drill_mapping 테이블이 없을 때 폴백으로 사용
 */
const DEFAULT_WP_DRILL_MAP: WpDrillMapping[] = [
  // Structure
  { wp_code: 'WP_S01', tier: 1, drill_code: 'sentence_formation' },
  { wp_code: 'WP_S02', tier: 2, drill_code: 'frame_4line' },
  { wp_code: 'WP_S02', tier: 3, drill_code: 'skeleton_paragraph' },
  { wp_code: 'WP_S03', tier: 2, drill_code: 'basic_connectors' },
  { wp_code: 'WP_S03', tier: 3, drill_code: 'connector_diversity' },
  { wp_code: 'WP_S04', tier: 3, drill_code: 'skeleton_paragraph' },
  { wp_code: 'WP_S05', tier: 4, drill_code: 'paragraph_sustain' },
  { wp_code: 'WP_S06', tier: 3, drill_code: 'paragraph_closure' },
  { wp_code: 'WP_S07', tier: 2, drill_code: 'topic_maintenance' },
  { wp_code: 'WP_S08', tier: 3, drill_code: 'past_narrative' },
  { wp_code: 'WP_S09', tier: 3, drill_code: 'thought_progression' },
  { wp_code: 'WP_S09', tier: 4, drill_code: 'paragraph_sustain' },

  // Accuracy
  { wp_code: 'WP_A01', tier: 4, drill_code: 'tense_accuracy' },
  { wp_code: 'WP_A02', tier: 3, drill_code: 'tense_attempt' },
  { wp_code: 'WP_A03', tier: 4, drill_code: 'agreement_accuracy' },
  { wp_code: 'WP_A04', tier: 4, drill_code: 'preposition_accuracy' },
  { wp_code: 'WP_A05', tier: 1, drill_code: 'sentence_completion' },
  { wp_code: 'WP_A06', tier: 1, drill_code: 'pronunciation_clarity' },
  { wp_code: 'WP_A07', tier: 2, drill_code: 'hesitation_reduction' },
  { wp_code: 'WP_A08', tier: 3, drill_code: 'timeframe_sustain' },
  { wp_code: 'WP_A08', tier: 4, drill_code: 'tense_accuracy' },

  // Content
  { wp_code: 'WP_C01', tier: 3, drill_code: 'description_depth' },
  { wp_code: 'WP_C02', tier: 4, drill_code: 'vocabulary_upgrade' },
  { wp_code: 'WP_C03', tier: 4, drill_code: 'vocabulary_upgrade' },
  { wp_code: 'WP_C04', tier: 4, drill_code: 'social_perspective' },
  { wp_code: 'WP_C05', tier: 3, drill_code: 'description_depth' },
  { wp_code: 'WP_C06', tier: 2, drill_code: 'description_depth' },
  { wp_code: 'WP_C07', tier: 3, drill_code: 'reason_chain' },
  { wp_code: 'WP_C07', tier: 4, drill_code: 'social_perspective' },

  // Task
  { wp_code: 'WP_T01', tier: 1, drill_code: 'basic_transaction' },
  { wp_code: 'WP_T01', tier: 2, drill_code: 'question_response' },
  { wp_code: 'WP_T02', tier: 2, drill_code: 'multi_part_checklist' },
  { wp_code: 'WP_T03', tier: 4, drill_code: 'comparison_frame' },
  { wp_code: 'WP_T04', tier: 4, drill_code: 'complication_handling' },
  { wp_code: 'WP_T05', tier: 4, drill_code: 'negotiation_expressions' },
  { wp_code: 'WP_T06', tier: 2, drill_code: 'question_response' },
  { wp_code: 'WP_T07', tier: 4, drill_code: 'negotiation_expressions' },
  { wp_code: 'WP_T08', tier: 4, drill_code: 'solution_proposal' },

  // Delivery
  { wp_code: 'WP_D01', tier: 2, drill_code: 'speech_volume' },
  { wp_code: 'WP_D02', tier: 2, drill_code: 'hesitation_reduction' },
  { wp_code: 'WP_D03', tier: 4, drill_code: 'filler_reduction' },
  { wp_code: 'WP_D04', tier: 1, drill_code: 'speech_volume' },
];

// ═══════════════════════════════════════════════════
// 드릴 매칭 로직
// ═══════════════════════════════════════════════════

/**
 * 병목 결과에 대해 드릴을 매칭/검증한다.
 *
 * @param bottlenecks 병목 엔진 출력 (이미 drill_code 할당됨)
 * @param drillCatalog DB에서 조회한 드릴 카탈로그 (없으면 검증 스킵)
 * @param wpDrillMappings DB에서 조회한 WP→Drill 매핑 (없으면 기본 매핑 사용)
 * @returns drill_code가 검증/교정된 BottleneckResult[]
 */
export function matchDrills(
  bottlenecks: BottleneckResult[],
  drillCatalog?: DrillDefinition[],
  wpDrillMappings?: WpDrillMapping[],
): BottleneckResult[] {
  // DB 매핑이 없으면 기본 매핑 사용
  const mappings = wpDrillMappings ?? DEFAULT_WP_DRILL_MAP;

  // 드릴 카탈로그 코드 Set (존재 여부 확인용)
  const catalogCodes = drillCatalog
    ? new Set(drillCatalog.map(d => d.code))
    : null;

  return bottlenecks.map(bn => {
    // 1. 현재 tier에서 정확히 매핑되는 드릴 찾기
    let matchedDrill = findDrillForWpAndTier(
      bn.wp_code, bn.current_tier, mappings,
    );

    // 2. 매핑이 없으면 가장 가까운 tier의 드릴 사용
    if (!matchedDrill) {
      matchedDrill = findClosestTierDrill(
        bn.wp_code, bn.current_tier, mappings,
      );
    }

    // 3. 그래도 없으면 병목 엔진이 할당한 것 유지
    const finalDrillCode = matchedDrill ?? bn.drill_code;

    // 4. 카탈로그 존재 여부 검증 (있으면)
    if (catalogCodes && !catalogCodes.has(finalDrillCode)) {
      // 카탈로그에 없는 드릴이면 병목 엔진 원본 유지
      return bn;
    }

    return {
      ...bn,
      drill_code: finalDrillCode,
    };
  });
}

/**
 * 특정 WP 코드 + 티어에 매핑된 드릴 조회
 */
function findDrillForWpAndTier(
  wpCode: string,
  tier: TutoringTier,
  mappings: WpDrillMapping[],
): string | null {
  const match = mappings.find(m => m.wp_code === wpCode && m.tier === tier);
  return match?.drill_code ?? null;
}

/**
 * 정확한 티어 매핑이 없을 때 가장 가까운 티어의 드릴 사용
 * 탐색 순서: 현재 tier → tier-1 → tier+1 → tier-2 → tier+2 → ...
 */
function findClosestTierDrill(
  wpCode: string,
  currentTier: TutoringTier,
  mappings: WpDrillMapping[],
): string | null {
  // 해당 WP의 모든 매핑 추출
  const wpMappings = mappings.filter(m => m.wp_code === wpCode);
  if (wpMappings.length === 0) return null;

  // 현재 tier와의 거리순 정렬 후 첫 번째 선택
  const sorted = wpMappings
    .map(m => ({ ...m, distance: Math.abs(m.tier - currentTier) }))
    .sort((a, b) => a.distance - b.distance);

  return sorted[0]?.drill_code ?? null;
}

/**
 * 드릴 카탈로그에서 특정 드릴 조회
 */
export function findDrillInCatalog(
  drillCode: string,
  catalog: DrillDefinition[],
): DrillDefinition | null {
  return catalog.find(d => d.code === drillCode) ?? null;
}

/**
 * 특정 카테고리의 드릴 목록 조회
 */
export function getDrillsByCategory(
  category: string,
  catalog: DrillDefinition[],
): DrillDefinition[] {
  return catalog.filter(d => d.category === category);
}

/**
 * 특정 tier의 드릴 목록 조회
 */
export function getDrillsByTier(
  tier: TutoringTier,
  catalog: DrillDefinition[],
): DrillDefinition[] {
  return catalog.filter(d => d.tier === tier);
}
