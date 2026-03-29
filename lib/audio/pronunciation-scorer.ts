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
 * 피어슨 상관계수 (유성음 쌍만 비교)
 * 상수 시퀀스(분산 0)일 때 NaN 방지
 */
function pearsonCorrelation(a: number[], b: number[]): number | null {
  // 둘 다 유성음(>0)인 쌍만 추출
  const pairs: [number, number][] = [];
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] > 0 && b[i] > 0) {
      pairs.push([a[i], b[i]]);
    }
  }

  // 유성음 쌍이 너무 적으면 비교 불가
  if (pairs.length < 5) return null;

  const n = pairs.length;
  let sumA = 0, sumB = 0, sumAB = 0, sumA2 = 0, sumB2 = 0;

  for (const [va, vb] of pairs) {
    sumA += va;
    sumB += vb;
    sumAB += va * vb;
    sumA2 += va * va;
    sumB2 += vb * vb;
  }

  const varA = n * sumA2 - sumA * sumA;
  const varB = n * sumB2 - sumB * sumB;

  // 분산이 0이면 (상수 시퀀스) 상관계수 계산 불가
  if (varA < 0.001 || varB < 0.001) return null;

  const denom = Math.sqrt(varA * varB);
  if (denom === 0) return null;

  return (n * sumAB - sumA * sumB) / denom;
}

/**
 * 평균 절대 오차 기반 피치 유사도 (상관계수 대안)
 * 상관계수가 불가능할 때 사용
 */
function pitchMAEScore(alignedA: number[], alignedB: number[]): number {
  const pairs: [number, number][] = [];
  for (let i = 0; i < Math.min(alignedA.length, alignedB.length); i++) {
    if (alignedA[i] > 0 && alignedB[i] > 0) {
      pairs.push([alignedA[i], alignedB[i]]);
    }
  }
  if (pairs.length < 3) return 0;

  // 센트 단위 평균 절대 오차
  let totalCents = 0;
  for (const [va, vb] of pairs) {
    totalCents += Math.abs(1200 * Math.log2(va / vb));
  }
  const mae = totalCents / pairs.length;

  // MAE 0 = 100점, MAE 200+ = 0점
  return Math.max(0, Math.min(100, Math.round((1 - mae / 200) * 100)));
}

/**
 * 에너지 패턴 유사도 (코사인 유사도 기반)
 */
function energySimilarity(nativeEnergy: number[], userEnergy: number[]): number {
  if (nativeEnergy.length === 0 || userEnergy.length === 0) return 0;

  let dotProduct = 0, normA = 0, normB = 0;
  const len = Math.min(nativeEnergy.length, userEnergy.length);

  for (let i = 0; i < len; i++) {
    dotProduct += nativeEnergy[i] * userEnergy[i];
    normA += nativeEnergy[i] * nativeEnergy[i];
    normB += userEnergy[i] * userEnergy[i];
  }

  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  if (denom < 0.0001) return 0; // 둘 다 에너지가 거의 없음

  const cosine = dotProduct / denom; // 0-1
  return Math.max(0, Math.min(100, Math.round(cosine * 100)));
}

/**
 * 피드백 메시지 생성
 */
function generateFeedback(
  pitchScore: number,
  timingScore: number,
  energyScore: number,
): string {
  if (pitchScore >= 85 && timingScore >= 85 && energyScore >= 70) {
    return "원어민과 매우 유사한 발음이에요!";
  }

  // 가장 낮은 점수에 대한 피드백
  const scores = [
    { score: pitchScore, low: "억양 패턴이 많이 달라요. 원어민의 높낮이 변화에 집중해보세요", mid: "억양이 비슷하지만 일부 구간에서 차이가 있어요" },
    { score: timingScore, low: "말하는 속도가 많이 달라요. 원어민의 리듬을 따라해보세요", mid: "속도는 비슷하지만 일부 단어에서 길이가 달라요" },
    { score: energyScore, low: "강세 패턴이 달라요. 어디를 강하게 말하는지 주의해보세요", mid: "강세가 비슷하지만 좀 더 강약을 살려보세요" },
  ];

  const worst = scores.reduce((min, s) => s.score < min.score ? s : min);

  if (worst.score < 50) return worst.low;
  if (worst.score < 75) return worst.mid;

  return "전반적으로 잘하고 있어요. 계속 연습하면 더 좋아질 거예요";
}

/**
 * 종합 발음 점수 계산
 */
export function scorePronunciation(
  nativePitch: PitchFrame[],
  userPitch: PitchFrame[],
  dtwResult: DTWResult,
): PronunciationScore {
  // 피치 점수: 먼저 상관계수 시도, 실패 시 MAE 기반
  const pitchCorr = pearsonCorrelation(dtwResult.alignedA, dtwResult.alignedB);
  let pitchScore: number;
  if (pitchCorr !== null) {
    // 상관계수 0.3 이하 → 0점, 0.9 이상 → 100점
    pitchScore = Math.max(0, Math.min(100, Math.round(((pitchCorr - 0.3) / 0.6) * 100)));
  } else {
    // 상관계수 계산 불가 → MAE 기반 대체
    pitchScore = pitchMAEScore(dtwResult.alignedA, dtwResult.alignedB);
  }

  // 타이밍 점수: DTW에서 계산됨
  const timingScore = dtwResult.timingScore;

  // 에너지 점수: 코사인 유사도 기반 (Pearson 대신 — 더 안정적)
  const alignedNativeEnergy = dtwResult.path.map(([i]) => nativePitch[i]?.energy ?? 0);
  const alignedUserEnergy = dtwResult.path.map(([, j]) => userPitch[j]?.energy ?? 0);
  const energyScore = energySimilarity(alignedNativeEnergy, alignedUserEnergy);

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
