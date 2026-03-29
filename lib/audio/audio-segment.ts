/**
 * 오디오 구간 추출 및 PCM 변환 유틸리티
 *
 * - 원어민 오디오에서 문장 구간 추출 (캐시)
 * - 녹음 Blob → PCM 변환
 * - 모두 16kHz 모노로 리샘플링
 */

const TARGET_SAMPLE_RATE = 16000;

// 원어민 오디오 세그먼트 캐시 (문장 인덱스 → PCM)
const segmentCache = new Map<string, { pcm: Float32Array; sampleRate: number }>();
// 원본 AudioBuffer 캐시 (URL → AudioBuffer)
let cachedAudioBuffer: { url: string; buffer: AudioBuffer } | null = null;

/**
 * AudioBuffer를 16kHz 모노로 리샘플링
 */
async function resampleTo16kMono(buffer: AudioBuffer): Promise<Float32Array> {
  const duration = buffer.duration;
  const targetLength = Math.ceil(duration * TARGET_SAMPLE_RATE);

  const offlineCtx = new OfflineAudioContext(1, targetLength, TARGET_SAMPLE_RATE);
  const source = offlineCtx.createBufferSource();
  source.buffer = buffer;
  source.connect(offlineCtx.destination);
  source.start(0);

  const rendered = await offlineCtx.startRendering();
  return rendered.getChannelData(0);
}

/**
 * URL에서 AudioBuffer 로드 (캐시)
 */
async function loadAudioBuffer(url: string): Promise<AudioBuffer> {
  if (cachedAudioBuffer && cachedAudioBuffer.url === url) {
    return cachedAudioBuffer.buffer;
  }

  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const audioCtx = new AudioContext();
  const buffer = await audioCtx.decodeAudioData(arrayBuffer);
  await audioCtx.close();

  cachedAudioBuffer = { url, buffer };
  return buffer;
}

/**
 * 원어민 오디오에서 특정 문장 구간을 PCM으로 추출
 *
 * @param audioUrl 전체 오디오 URL
 * @param startTime 문장 시작 시간 (초)
 * @param endTime 문장 끝 시간 (초)
 * @param sentenceIndex 캐시 키로 사용할 문장 인덱스
 */
export async function extractSegment(
  audioUrl: string,
  startTime: number,
  endTime: number,
  sentenceIndex: number,
): Promise<{ pcm: Float32Array; sampleRate: number }> {
  const cacheKey = `${audioUrl}:${sentenceIndex}`;

  const cached = segmentCache.get(cacheKey);
  if (cached) return cached;

  // 전체 오디오 로드
  const fullBuffer = await loadAudioBuffer(audioUrl);

  // 구간 추출 (원본 샘플레이트)
  const sr = fullBuffer.sampleRate;
  const startSample = Math.floor(startTime * sr);
  const endSample = Math.ceil(endTime * sr);
  const length = endSample - startSample;

  // 구간만 담은 AudioBuffer 생성
  const audioCtx = new AudioContext();
  const segmentBuffer = audioCtx.createBuffer(1, length, sr);
  const channelData = fullBuffer.getChannelData(0);
  const segmentData = segmentBuffer.getChannelData(0);
  segmentData.set(channelData.subarray(startSample, endSample));
  await audioCtx.close();

  // 16kHz 리샘플링
  const pcm = await resampleTo16kMono(segmentBuffer);
  const result = { pcm, sampleRate: TARGET_SAMPLE_RATE };

  segmentCache.set(cacheKey, result);
  return result;
}

/**
 * 녹음 Blob을 PCM으로 변환 (16kHz 모노)
 */
export async function blobToPCM(
  blob: Blob,
): Promise<{ pcm: Float32Array; sampleRate: number }> {
  const arrayBuffer = await blob.arrayBuffer();
  const audioCtx = new AudioContext();
  const buffer = await audioCtx.decodeAudioData(arrayBuffer);
  await audioCtx.close();

  const pcm = await resampleTo16kMono(buffer);
  return { pcm, sampleRate: TARGET_SAMPLE_RATE };
}

/**
 * 캐시 초기화 (다른 스크립트로 전환 시)
 */
export function clearSegmentCache(): void {
  segmentCache.clear();
  cachedAudioBuffer = null;
}
