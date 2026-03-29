/**
 * YIN 기반 피치(F0) 추출기
 *
 * 입력: Float32Array PCM + sampleRate
 * 출력: PitchFrame[] (시간, F0 Hz, confidence, 에너지)
 *
 * YIN 알고리즘 — de Cheveigné & Kawahara (2002)
 * 1. 차분 함수 (difference function)
 * 2. 누적 평균 정규화 (CMNDF)
 * 3. 절대 임계값 검출
 * 4. 파라볼릭 보간
 */

export interface PitchFrame {
  time: number;       // 초 단위
  f0: number;         // Hz (0이면 무성음)
  confidence: number; // 0-1
  energy: number;     // RMS 에너지 (0-1 정규화)
}

// 튜닝 상수
const RMS_SILENCE_THRESHOLD = 0.005; // 무음 판정 임계값 (TTS는 에너지가 낮을 수 있음)
const DEFAULT_YIN_THRESHOLD = 0.3;   // YIN 임계값 (0.15는 너무 엄격 → TTS에서 대부분 무성음 판정)
const UNVOICED_FALLBACK_THRESHOLD = 0.6; // 임계값 이하 못 찾았을 때 폴백 허용 범위

interface PitchExtractorOptions {
  frameMs?: number;     // 프레임 크기 (기본: 30ms — 더 넓어야 저주파 검출 가능)
  hopMs?: number;       // 홉 크기 (기본: 10ms)
  minF0?: number;       // 최소 F0 Hz (기본: 75)
  maxF0?: number;       // 최대 F0 Hz (기본: 500)
  threshold?: number;   // YIN 임계값 (기본: 0.3)
}

const DEFAULTS: Required<PitchExtractorOptions> = {
  frameMs: 30,
  hopMs: 10,
  minF0: 75,
  maxF0: 500,
  threshold: DEFAULT_YIN_THRESHOLD,
};

/**
 * PCM 데이터에서 피치 프레임 배열을 추출
 */
export function extractPitch(
  pcm: Float32Array,
  sampleRate: number,
  options?: PitchExtractorOptions,
): PitchFrame[] {
  const opts = { ...DEFAULTS, ...options };
  const frameSamples = Math.round((opts.frameMs / 1000) * sampleRate);
  const hopSamples = Math.round((opts.hopMs / 1000) * sampleRate);
  const minLag = Math.floor(sampleRate / opts.maxF0);
  const maxLag = Math.ceil(sampleRate / opts.minF0);

  // W = 분석 윈도우 크기 (프레임 + 최대 래그)
  const W = frameSamples + maxLag;

  // 전체 오디오의 최대 에너지 (정규화용)
  let maxEnergy = 0;
  for (let i = 0; i < pcm.length; i++) {
    const v = Math.abs(pcm[i]);
    if (v > maxEnergy) maxEnergy = v;
  }
  if (maxEnergy === 0) maxEnergy = 1; // 무음 방지

  const frames: PitchFrame[] = [];

  for (let start = 0; start + W <= pcm.length; start += hopSamples) {
    const time = start / sampleRate;

    // RMS 에너지 계산 (0-1 정규화)
    let sumSq = 0;
    for (let i = start; i < start + frameSamples && i < pcm.length; i++) {
      sumSq += pcm[i] * pcm[i];
    }
    const rms = Math.sqrt(sumSq / frameSamples);
    const normalizedEnergy = rms / maxEnergy;

    // 에너지가 너무 낮으면 무성음 처리
    if (rms < RMS_SILENCE_THRESHOLD) {
      frames.push({ time, f0: 0, confidence: 0, energy: normalizedEnergy });
      continue;
    }

    // 1. 차분 함수 (difference function) — 범위 체크 포함
    const diff = new Float32Array(maxLag + 1);
    for (let tau = 0; tau <= maxLag; tau++) {
      let sum = 0;
      for (let j = 0; j < frameSamples; j++) {
        const idx = start + j + tau;
        if (idx >= pcm.length) break;
        const d = pcm[start + j] - pcm[idx];
        sum += d * d;
      }
      diff[tau] = sum;
    }

    // 2. 누적 평균 정규화 (CMNDF)
    const cmndf = new Float32Array(maxLag + 1);
    cmndf[0] = 1;
    let runningSum = 0;
    for (let tau = 1; tau <= maxLag; tau++) {
      runningSum += diff[tau];
      cmndf[tau] = runningSum > 0 ? (diff[tau] * tau) / runningSum : 1;
    }

    // 3. 절대 임계값 검출 — minLag부터 시작
    let bestTau = -1;
    let bestVal = 1;

    for (let tau = minLag; tau <= maxLag; tau++) {
      if (cmndf[tau] < opts.threshold) {
        // 로컬 최솟값 탐색
        while (tau + 1 <= maxLag && cmndf[tau + 1] < cmndf[tau]) {
          tau++;
        }
        bestTau = tau;
        bestVal = cmndf[tau];
        break;
      }
    }

    // 임계값 이하를 못 찾으면 전체 최솟값 사용 (폴백 범위 내에서)
    if (bestTau < 0) {
      for (let tau = minLag; tau <= maxLag; tau++) {
        if (cmndf[tau] < bestVal) {
          bestVal = cmndf[tau];
          bestTau = tau;
        }
      }
    }

    // 폴백 임계값도 넘으면 무성음
    if (bestTau < 0 || bestVal > UNVOICED_FALLBACK_THRESHOLD) {
      frames.push({ time, f0: 0, confidence: 1 - bestVal, energy: normalizedEnergy });
      continue;
    }

    // 4. 파라볼릭 보간 (정밀도 향상)
    let refinedTau = bestTau;
    if (bestTau > 0 && bestTau < maxLag) {
      const s0 = cmndf[bestTau - 1];
      const s1 = cmndf[bestTau];
      const s2 = cmndf[bestTau + 1];
      const denom = 2 * s1 - s2 - s0;
      if (denom !== 0) {
        refinedTau = bestTau + (s0 - s2) / (2 * denom);
      }
    }

    const f0 = sampleRate / refinedTau;
    const confidence = 1 - bestVal;

    frames.push({ time, f0, confidence, energy: normalizedEnergy });
  }

  return frames;
}

/**
 * 피치 프레임에서 유성음(voiced) 구간만 추출
 */
export function getVoicedFrames(
  frames: PitchFrame[],
  minConfidence = 0.5,
): PitchFrame[] {
  return frames.filter((f) => f.f0 > 0 && f.confidence >= minConfidence);
}

/**
 * F0 값만 추출 (DTW 입력용)
 * 무성음은 0으로 유지
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
