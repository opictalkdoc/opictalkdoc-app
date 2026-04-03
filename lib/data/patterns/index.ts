// 만능패턴 데이터 통합 export
import type { PatternSet, PatternType } from "@/lib/types/patterns";
import { descriptionPatterns } from "./description";
import { routinePatterns } from "./routine";
import { comparisonPatterns } from "./comparison";
import { pastChildhoodPatterns } from "./past-childhood";
import { pastSpecialPatterns } from "./past-special";
import { pastRecentPatterns } from "./past-recent";
import { rp11Patterns } from "./rp-11";
import { rp12Patterns } from "./rp-12";
import { adv14Patterns } from "./adv-14";
import { adv15Patterns } from "./adv-15";

/** 전체 패턴 데이터 맵 */
export const ALL_PATTERNS: Record<PatternType, PatternSet> = {
  description: descriptionPatterns,
  routine: routinePatterns,
  comparison: comparisonPatterns,
  past_childhood: pastChildhoodPatterns,
  past_special: pastSpecialPatterns,
  past_recent: pastRecentPatterns,
  rp_11: rp11Patterns,
  rp_12: rp12Patterns,
  adv_14: adv14Patterns,
  adv_15: adv15Patterns,
};

/** 특정 유형의 패턴 가져오기 */
export function getPatternSet(type: PatternType): PatternSet {
  return ALL_PATTERNS[type];
}

/** 전체 패턴 수 계산 */
export function getTotalPatternCount(): number {
  return Object.values(ALL_PATTERNS).reduce(
    (total, set) =>
      total +
      set.phases.reduce((phaseTotal, phase) => phaseTotal + phase.patterns.length, 0),
    0
  );
}
