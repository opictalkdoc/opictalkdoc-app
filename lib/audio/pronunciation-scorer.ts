/**
 * 발음 비교 점수 계산기 v3
 *
 * 4축 평가: 발음(MFCC) + 억양(피치) + 타이밍(DTW) + 강세(에너지)
 *
 * v3 개선:
 * - 유성음 커버리지 페널티 (사용자가 무음이 많으면 감점)
 * - 피치 범위 차이 페널티 (원어민은 넓고 사용자는 좁으면 감점)
 * - DTW 정렬 과대평가 보정
 * - 점수 임계값 현실적으로 조정
 */

import type { PitchFrame } from "./pitch-extractor";
import type { DTWResult } from "./dtw";
import type { MFCCFrame } from "./mfcc";
import { mfccCosineSimilarity } from "./mfcc";

export interface PronunciationScore {
  pronunciationScore: number; // 0-100 — MFCC 기반 발음 유사도
  pitchScore: number;         // 0-100 — 피치(억양) 곡선 유사도
  timingScore: number;        // 0-100 — 발화 속도/타이밍 유사도
  energyScore: number;        // 0-100 — 에너지(강세) 패턴 유사도
  overallScore: number;       // 0-100 — 가중 평균
  feedback: string;           // 한국어 피드백 메시지
}

// ============ 유틸리티 ============

/**
 * 유성음(f0 > 0) 비율 계산
 */
function voicedRatio(frames: PitchFrame[]): number {
  if (frames.length === 0) return 0;
  return frames.filter((f) => f.f0 > 0).length / frames.length;
}

/**
 * 유성음 F0의 표준편차 (피치 변화 폭)
 */
function pitchStdDev(frames: PitchFrame[]): number {
  const voiced = frames.filter((f) => f.f0 > 0).map((f) => f.f0);
  if (voiced.length < 2) return 0;
  const mean = voiced.reduce((a, b) => a + b, 0) / voiced.length;
  const variance = voiced.reduce((a, v) => a + (v - mean) ** 2, 0) / voiced.length;
  return Math.sqrt(variance);
}

/**
 * 피어슨 상관계수 — DTW 정렬된 쌍 중 둘 다 유성음인 것만
 */
function pearsonCorrelation(a: number[], b: number[]): number | null {
  const pairs: [number, number][] = [];
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] > 0 && b[i] > 0) pairs.push([a[i], b[i]]);
  }
  if (pairs.length < 5) return null;

  const n = pairs.length;
  let sumA = 0, sumB = 0, sumAB = 0, sumA2 = 0, sumB2 = 0;
  for (const [va, vb] of pairs) {
    sumA += va; sumB += vb; sumAB += va * vb;
    sumA2 += va * va; sumB2 += vb * vb;
  }
  const varA = n * sumA2 - sumA * sumA;
  const varB = n * sumB2 - sumB * sumB;
  if (varA < 0.001 || varB < 0.001) return null;
  const denom = Math.sqrt(varA * varB);
  if (denom === 0) return null;
  return (n * sumAB - sumA * sumB) / denom;
}

/**
 * 센트 기반 MAE 점수 (상관계수 불가 시 폴백)
 */
function pitchMAEScore(a: number[], b: number[]): number {
  const pairs: [number, number][] = [];
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] > 0 && b[i] > 0) pairs.push([a[i], b[i]]);
  }
  if (pairs.length < 3) return 0;
  let total = 0;
  for (const [va, vb] of pairs) {
    total += Math.abs(1200 * Math.log2(Math.max(va, 1) / Math.max(vb, 1)));
  }
  const mae = total / pairs.length;
  // MAE 0 = 100점, 300센트 이상 = 0점
  return Math.max(0, Math.min(100, Math.round((1 - mae / 300) * 100)));
}

/**
 * 에너지 코사인 유사도
 */
function energySimilarity(a: number[], b: number[]): number {
  if (a.length === 0 || b.length === 0) return 0;
  let dot = 0, nA = 0, nB = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i]; nA += a[i] * a[i]; nB += b[i] * b[i];
  }
  const denom = Math.sqrt(nA) * Math.sqrt(nB);
  if (denom < 0.0001) return 0;
  return Math.max(0, Math.min(100, Math.round((dot / denom) * 100)));
}

// ============ 피드백 ============

function generateFeedback(
  pron: number, pitch: number, timing: number, energy: number,
): string {
  if (pron >= 80 && pitch >= 80 && timing >= 80) return "원어민과 매우 유사한 발음이에요!";

  const items = [
    { s: pron, lo: "발음이 원어민과 많이 달라요. 각 단어의 소리를 하나씩 따라해보세요", mid: "발음이 비슷하지만 일부 소리가 달라요" },
    { s: pitch, lo: "억양이 많이 달라요. 원어민의 높낮이 변화에 집중해보세요", mid: "억양이 비슷하지만 일부 구간에서 차이가 있어요" },
    { s: timing, lo: "말하는 속도가 많이 달라요. 원어민의 리듬을 따라해보세요", mid: "속도는 비슷하지만 일부 단어에서 길이가 달라요" },
    { s: energy, lo: "강세 패턴이 달라요. 어디를 강하게 말하는지 주의해보세요", mid: "강세가 비슷하지만 좀 더 강약을 살려보세요" },
  ];
  const worst = items.reduce((m, x) => x.s < m.s ? x : m);
  if (worst.s < 40) return worst.lo;
  if (worst.s < 65) return worst.mid;
  return "전반적으로 잘하고 있어요. 계속 연습하면 더 좋아질 거예요";
}

// ============ 메인 점수 계산 ============

export function scorePronunciation(
  nativePitch: PitchFrame[],
  userPitch: PitchFrame[],
  dtwResult: DTWResult,
  nativeMFCC?: MFCCFrame[],
  userMFCC?: MFCCFrame[],
): PronunciationScore {

  // === 커버리지 페널티 ===
  // 사용자가 유성음이 적으면 (많이 침묵했으면) 전체 점수 감점
  const nativeVoicedRatio = voicedRatio(nativePitch);
  const userVoicedRatio = voicedRatio(userPitch);
  // 원어민 대비 사용자의 유성음 비율 (0-1)
  const coveragePenalty = nativeVoicedRatio > 0
    ? Math.min(1, userVoicedRatio / nativeVoicedRatio)
    : 1;

  // === 피치 범위 페널티 ===
  // 원어민이 넓은 피치 범위를 갖는데 사용자가 평평하면 감점
  const nativeStd = pitchStdDev(nativePitch);
  const userStd = pitchStdDev(userPitch);
  // 원어민 대비 사용자의 피치 변화 비율 (0-1, 1 이상이면 1)
  const pitchRangePenalty = nativeStd > 5
    ? Math.min(1, userStd / nativeStd)
    : 1;

  // === 1. 발음 유사도 (MFCC) ===
  let pronunciationScore = 0;
  if (nativeMFCC && userMFCC && nativeMFCC.length > 0 && userMFCC.length > 0) {
    const similarity = mfccCosineSimilarity(nativeMFCC, userMFCC, dtwResult.path);
    // 코사인 유사도 0.6 이하 → 0점, 0.98 이상 → 100점 (더 엄격)
    const raw = Math.max(0, Math.min(100, Math.round(((similarity - 0.6) / 0.38) * 100)));
    pronunciationScore = Math.round(raw * coveragePenalty);
  }

  // === 2. 억양 유사도 (피치) ===
  const pitchCorr = pearsonCorrelation(dtwResult.alignedA, dtwResult.alignedB);
  let rawPitchScore: number;
  if (pitchCorr !== null) {
    // 상관계수 0.5 이하 → 0점, 0.95 이상 → 100점 (더 엄격)
    rawPitchScore = Math.max(0, Math.min(100, Math.round(((pitchCorr - 0.5) / 0.45) * 100)));
  } else {
    rawPitchScore = pitchMAEScore(dtwResult.alignedA, dtwResult.alignedB);
  }
  // 피치 범위 페널티 적용 (평탄하면 감점)
  const pitchScore = Math.round(rawPitchScore * pitchRangePenalty * coveragePenalty);

  // === 3. 타이밍 유사도 ===
  const timingScore = Math.round(dtwResult.timingScore * coveragePenalty);

  // === 4. 강세 유사도 (에너지) ===
  const alignedNativeE = dtwResult.path.map(([i]) => nativePitch[i]?.energy ?? 0);
  const alignedUserE = dtwResult.path.map(([, j]) => userPitch[j]?.energy ?? 0);
  const rawEnergyScore = energySimilarity(alignedNativeE, alignedUserE);
  const energyScore = Math.round(rawEnergyScore * coveragePenalty);

  // === 종합 점수 ===
  let overallScore: number;
  if (nativeMFCC && userMFCC && nativeMFCC.length > 0) {
    overallScore = Math.round(
      pronunciationScore * 0.35 + pitchScore * 0.25 + timingScore * 0.25 + energyScore * 0.15,
    );
  } else {
    overallScore = Math.round(
      pitchScore * 0.45 + timingScore * 0.35 + energyScore * 0.20,
    );
  }

  return {
    pronunciationScore,
    pitchScore,
    timingScore,
    energyScore,
    overallScore,
    feedback: generateFeedback(pronunciationScore, pitchScore, timingScore, energyScore),
  };
}
