/**
 * 피치(F0) 추출기 — pitchfinder 라이브러리 기반
 *
 * 기존 수동 YIN 구현 → npm pitchfinder로 교체
 * - 검증된 YIN + ACF2PLUS 구현
 * - 엣지 케이스 처리 완비
 * - 브라우저 호환성 보장
 */

import Pitchfinder from "pitchfinder";

export interface PitchFrame {
  time: number;       // 초 단위
  f0: number;         // Hz (0이면 무성음)
  confidence: number; // 0-1
  energy: number;     // RMS 에너지 (0-1 정규화)
}

// 설정
const HOP_MS = 10;           // 홉 크기 (ms)
const FRAME_MS = 100;        // 분석 윈도우 크기 (ms) — YIN은 2주기 이상 필요 (75Hz@16kHz=427샘플, 100ms=1600샘플)
const SILENCE_RATIO = 0.01;  // 최대 에너지 대비 1% 이하면 무음 (더 관대하게)

interface PitchExtractorOptions {
  hopMs?: number;
  frameMs?: number;
  minF0?: number;
  maxF0?: number;
}

/**
 * PCM 데이터에서 피치 프레임 배열을 추출
 */
export function extractPitch(
  pcm: Float32Array,
  sampleRate: number,
  options?: PitchExtractorOptions,
): PitchFrame[] {
  const hopMs = options?.hopMs ?? HOP_MS;
  const frameMs = options?.frameMs ?? FRAME_MS;
  const minF0 = options?.minF0 ?? 75;
  const maxF0 = options?.maxF0 ?? 500;

  const hopSamples = Math.round((hopMs / 1000) * sampleRate);
  const frameSamples = Math.round((frameMs / 1000) * sampleRate);

  // pitchfinder 디텍터 초기화 (YIN + ACF2PLUS 폴백)
  const detectYIN = Pitchfinder.YIN({
    sampleRate,
    threshold: 0.5,   // 마이크 녹음은 노이즈가 많으므로 관대하게
  });
  const detectACF = Pitchfinder.ACF2PLUS({ sampleRate });

  // 전체 오디오 피크 에너지 (정규화용)
  let maxAmp = 0;
  for (let i = 0; i < pcm.length; i++) {
    const v = Math.abs(pcm[i]);
    if (v > maxAmp) maxAmp = v;
  }
  if (maxAmp === 0) maxAmp = 1;

  const frames: PitchFrame[] = [];

  for (let start = 0; start + frameSamples <= pcm.length; start += hopSamples) {
    const time = start / sampleRate;

    // RMS 에너지 계산
    let sumSq = 0;
    for (let i = start; i < start + frameSamples; i++) {
      sumSq += pcm[i] * pcm[i];
    }
    const rms = Math.sqrt(sumSq / frameSamples);
    const normalizedEnergy = rms / maxAmp;

    // 무음 판정 (상대적)
    if (normalizedEnergy < SILENCE_RATIO) {
      frames.push({ time, f0: 0, confidence: 0, energy: normalizedEnergy });
      continue;
    }

    // 프레임 추출
    const frame = pcm.slice(start, start + frameSamples);

    // YIN으로 먼저 시도, 실패 시 ACF2PLUS 폴백
    let result = detectYIN(frame);
    let usedFallback = false;

    if (result === null || result <= 0 || result < minF0 || result > maxF0) {
      result = detectACF(frame);
      usedFallback = true;
    }

    if (result === null || result <= 0 || result < minF0 || result > maxF0) {
      frames.push({ time, f0: 0, confidence: 0.3, energy: normalizedEnergy });
      continue;
    }

    // confidence: YIN 성공이면 높게, 폴백이면 낮게
    const confidence = usedFallback
      ? Math.min(0.7, normalizedEnergy * 2)
      : Math.min(1, normalizedEnergy * 3);

    frames.push({ time, f0: result, confidence, energy: normalizedEnergy });
  }

  return frames;
}

/**
 * 피치 프레임에서 유성음(voiced) 구간만 추출
 */
export function getVoicedFrames(
  frames: PitchFrame[],
  minConfidence = 0.3,
): PitchFrame[] {
  return frames.filter((f) => f.f0 > 0 && f.confidence >= minConfidence);
}

/**
 * F0 값만 추출 (DTW 입력용)
 */
export function getF0Array(frames: PitchFrame[]): number[] {
  return frames.map((f) => f.f0);
}

/**
 * 에너지 값만 추출
 */
export function getEnergyArray(frames: PitchFrame[]): number[] {
  return frames.map((f) => f.energy);
}
