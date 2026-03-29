/**
 * Dynamic Time Warping (DTW) — 시간 정렬 알고리즘
 *
 * 두 시퀀스의 최적 정렬을 찾아 비교 가능하게 한다.
 * Sakoe-Chiba band 제약으로 메모리/성능 최적화.
 */

export interface DTWResult {
  cost: number;                    // 정규화된 총 비용 (작을수록 유사)
  path: [number, number][];        // 정렬 경로 [(i, j), ...]
  alignedA: number[];              // 정렬된 시퀀스 A
  alignedB: number[];              // 정렬된 시퀀스 B
  timingScore: number;             // 0-100 (대각선 이탈도 기반)
}

// 유/무성음 불일치 패널티 (센트 단위)
const VOICING_MISMATCH_PENALTY = 50;
// 최대 비용 상한 (1 옥타브 = 1200 센트)
const MAX_COST_CENTS = 1200;
// 최소 F0 값 (log2 계산 시 0 방지)
const MIN_F0_FLOOR = 1;

/**
 * DTW 실행 (Sakoe-Chiba band 제약)
 * @param a 시퀀스 A (원어민 F0[])
 * @param b 시퀀스 B (사용자 F0[])
 * @param bandRatio 밴드 비율 (기본: 0.25)
 */
export function dtw(
  a: number[],
  b: number[],
  bandRatio = 0.25,
): DTWResult {
  const n = a.length;
  const m = b.length;

  if (n === 0 || m === 0) {
    return { cost: Infinity, path: [], alignedA: [], alignedB: [], timingScore: 0 };
  }

  // 시퀀스가 너무 짧으면 간단 비교
  if (n === 1 && m === 1) {
    const d = dist(a[0], b[0]);
    return { cost: d, path: [[0, 0]], alignedA: [a[0]], alignedB: [b[0]], timingScore: 100 };
  }

  const band = Math.max(Math.ceil(Math.max(n, m) * bandRatio), Math.abs(n - m) + 1);

  const INF = Infinity;
  const cost = Array.from({ length: n }, () => new Float64Array(m).fill(INF));

  // 초기화
  cost[0][0] = dist(a[0], b[0]);

  // 첫 행
  for (let j = 1; j < m && j <= band; j++) {
    cost[0][j] = cost[0][j - 1] + dist(a[0], b[j]);
  }

  // 첫 열
  for (let i = 1; i < n && i <= band; i++) {
    cost[i][0] = cost[i - 1][0] + dist(a[i], b[0]);
  }

  // 나머지 채우기 (밴드 내만)
  for (let i = 1; i < n; i++) {
    const jCenter = Math.round((i * m) / n);
    const jStart = Math.max(1, jCenter - band);
    const jEnd = Math.min(m - 1, jCenter + band);

    for (let j = jStart; j <= jEnd; j++) {
      const d = dist(a[i], b[j]);
      const prev = Math.min(
        i > 0 ? cost[i - 1][j] : INF,
        j > 0 ? cost[i][j - 1] : INF,
        i > 0 && j > 0 ? cost[i - 1][j - 1] : INF,
      );
      if (prev < INF) {
        cost[i][j] = prev + d;
      }
    }
  }

  // 역추적 (backtrack)
  const path: [number, number][] = [];
  let i = n - 1;
  let j = m - 1;
  path.push([i, j]);

  while (i > 0 || j > 0) {
    if (i === 0) {
      j--;
    } else if (j === 0) {
      i--;
    } else {
      const diag = cost[i - 1][j - 1];
      const up = cost[i - 1][j];
      const left = cost[i][j - 1];
      const minVal = Math.min(diag, up, left);

      if (minVal === diag) { i--; j--; }
      else if (minVal === up) { i--; }
      else { j--; }
    }
    path.push([i, j]);
  }

  path.reverse();

  // 정렬된 시퀀스 생성
  const alignedA = path.map(([pi]) => a[pi]);
  const alignedB = path.map(([, pj]) => b[pj]);

  // 정규화된 비용
  const finalCost = cost[n - 1][m - 1];
  const normalizedCost = Number.isFinite(finalCost) ? finalCost / path.length : Infinity;

  // 타이밍 점수: 대각선 이탈도 (0-100)
  const idealRatio = m / n;
  let totalDeviation = 0;
  for (const [pi, pj] of path) {
    const idealJ = pi * idealRatio;
    totalDeviation += Math.abs(pj - idealJ) / m;
  }
  const avgDeviation = totalDeviation / path.length;
  const timingScore = Math.max(0, Math.min(100, Math.round((1 - avgDeviation * 2) * 100)));

  return {
    cost: normalizedCost,
    path,
    alignedA,
    alignedB,
    timingScore,
  };
}

/**
 * 거리 함수: F0 값 비교 (센트 단위)
 */
function dist(va: number, vb: number): number {
  // 둘 다 무성음이면 비용 0
  if (va === 0 && vb === 0) return 0;
  // 하나만 무성음이면 고정 패널티
  if (va === 0 || vb === 0) return VOICING_MISMATCH_PENALTY;
  // 둘 다 유성음이면 센트(cent) 단위 차이 (0 방지)
  const safeA = Math.max(va, MIN_F0_FLOOR);
  const safeB = Math.max(vb, MIN_F0_FLOOR);
  const cents = Math.abs(1200 * Math.log2(safeA / safeB));
  return Math.min(cents, MAX_COST_CENTS);
}
