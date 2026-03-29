/**
 * 발음 비교 점수 계산기
 *
 * 원어민/사용자 피치 데이터 + DTW 결과로 종합 점수 산출
 */

import type { PitchFrame } from "./pitch-extractor";
import type { DTWResult } from "./dtw";

export interface PronunciationScore {
  pitchScore: number;      // 0-100 — 피치(억양) 곡선 유사도
  timingScore: number;     // 0-100 — 발화 속도/타이밍 유사도
  energyScore: number;     // 0-100 — 에너지(강세) 패턴 유사도
  overallScore: number;    // 0-100 — 가중 평균
  feedback: string;        // 한국어 피드백 메시지
}

/**
 * 피어슨 상관계수 (0이 아닌 값만 비교)
 */
function pearsonCorrelation(a: number[], b: number[]): number {
  // 둘 다 유성음인 쌍만 추출
  const pairs: [number, number][] = [];
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] > 0 && b[i] > 0) {
      pairs.push([a[i], b[i]]);
    }
  }

  if (pairs.length < 3) return 0;

  const n = pairs.length;
  let sumA = 0, sumB = 0, sumAB = 0, sumA2 = 0, sumB2 = 0;

  for (const [va, vb] of pairs) {
    sumA += va;
    sumB += vb;
    sumAB += va * vb;
    sumA2 += va * va;
    sumB2 += vb * vb;
  }

  const denom = Math.sqrt((n * sumA2 - sumA * sumA) * (n * sumB2 - sumB * sumB));
  if (denom === 0) return 0;

  return (n * sumAB - sumA * sumB) / denom;
}

/**
 * 피드백 메시지 생성
 */
function generateFeedback(
  pitchScore: number,
  timingScore: number,
  energyScore: number,
): string {
  const issues: string[] = [];

  if (pitchScore < 50) {
    issues.push("억양 패턴이 많이 달라요. 원어민의 높낮이 변화에 집중해보세요");
  } else if (pitchScore < 70) {
    issues.push("억양이 비슷하지만 일부 구간에서 차이가 있어요");
  }

  if (timingScore < 50) {
    issues.push("말하는 속도가 많이 달라요. 원어민의 리듬을 따라해보세요");
  } else if (timingScore < 70) {
    issues.push("속도는 비슷하지만 일부 단어에서 길이가 달라요");
  }

  if (energyScore < 50) {
    issues.push("강세 패턴이 달라요. 어디를 강하게 말하는지 주의해보세요");
  }

  if (issues.length === 0) {
    if (pitchScore >= 90 && timingScore >= 90) {
      return "원어민과 거의 동일한 발음이에요!";
    }
    return "전반적으로 잘하고 있어요. 계속 연습하면 더 좋아질 거예요";
  }

  return issues[0]; // 가장 중요한 피드백 1개만
}

/**
 * 종합 발음 점수 계산
 */
export function scorePronunciation(
  nativePitch: PitchFrame[],
  userPitch: PitchFrame[],
  dtwResult: DTWResult,
): PronunciationScore {
  // 피치 점수: DTW 정렬된 F0의 상관계수
  const pitchCorr = pearsonCorrelation(dtwResult.alignedA, dtwResult.alignedB);
  // 상관계수 -1~1 → 0~100 점수 (0.3 이하는 0점, 0.9 이상은 100점)
  const pitchScore = Math.max(0, Math.min(100, Math.round(((pitchCorr - 0.3) / 0.6) * 100)));

  // 타이밍 점수: DTW에서 이미 계산됨
  const timingScore = dtwResult.timingScore;

  // 에너지 점수: 에너지 곡선 상관계수
  const nativeEnergy = nativePitch.map((f) => f.energy);
  const userEnergy = userPitch.map((f) => f.energy);
  // 길이가 다를 수 있으므로 DTW 정렬된 인덱스 사용
  const alignedNativeEnergy = dtwResult.path.map(([i]) => nativeEnergy[i] ?? 0);
  const alignedUserEnergy = dtwResult.path.map(([, j]) => userEnergy[j] ?? 0);
  const energyCorr = pearsonCorrelation(
    alignedNativeEnergy.map((v) => v || 0.001), // 0 방지
    alignedUserEnergy.map((v) => v || 0.001),
  );
  const energyScore = Math.max(0, Math.min(100, Math.round(((energyCorr - 0.1) / 0.7) * 100)));

  // 종합 점수: pitch 50% + timing 30% + energy 20%
  const overallScore = Math.round(
    pitchScore * 0.5 + timingScore * 0.3 + energyScore * 0.2,
  );

  const feedback = generateFeedback(pitchScore, timingScore, energyScore);

  return {
    pitchScore,
    timingScore,
    energyScore,
    overallScore,
    feedback,
  };
}
