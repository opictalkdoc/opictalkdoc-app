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

/**
 * DTW 실행 (Sakoe-Chiba band 제약)
 * @param a 시퀀스 A (원어민)
 * @param b 시퀀스 B (사용자)
 * @param bandRatio 밴드 비율 (기본: 0.2 = 시퀀스 길이의 20%)
 */
export function dtw(
  a: number[],
  b: number[],
  bandRatio = 0.2,
): DTWResult {
  const n = a.length;
  const m = b.length;

  if (n === 0 || m === 0) {
    return { cost: Infinity, path: [], alignedA: [], alignedB: [], timingScore: 0 };
  }

  const band = Math.max(Math.ceil(Math.max(n, m) * bandRatio), Math.abs(n - m) + 1);

  // 비용 행렬 (밴드 내만 계산)
  const INF = Infinity;
  const cost = Array.from({ length: n }, () => new Float64Array(m).fill(INF));

  // 거리 함수: F0 값 비교 (둘 다 0이면 비용 0, 하나만 0이면 패널티)
  function dist(i: number, j: number): number {
    const va = a[i];
    const vb = b[j];
    // 둘 다 무성음이면 비용 0
    if (va === 0 && vb === 0) return 0;
    // 하나만 무성음이면 고정 패널티
    if (va === 0 || vb === 0) return 50;
    // 둘 다 유성음이면 센트(cent) 단위 차이
    const cents = Math.abs(1200 * Math.log2(va / vb));
    return cents;
  }

  // 초기화
  cost[0][0] = dist(0, 0);

  // 첫 행
  for (let j = 1; j < m && j <= band; j++) {
    cost[0][j] = cost[0][j - 1] + dist(0, j);
  }

  // 첫 열
  for (let i = 1; i < n && i <= band; i++) {
    cost[i][0] = cost[i - 1][0] + dist(i, 0);
  }

  // 나머지 채우기 (밴드 내만)
  for (let i = 1; i < n; i++) {
    const jStart = Math.max(1, Math.round((i * m) / n) - band);
    const jEnd = Math.min(m - 1, Math.round((i * m) / n) + band);

    for (let j = jStart; j <= jEnd; j++) {
      const d = dist(i, j);
      const prev = Math.min(
        cost[i - 1][j] ?? INF,       // 삽입
        cost[i][j - 1] ?? INF,       // 삭제
        cost[i - 1][j - 1] ?? INF,   // 매칭
      );
      cost[i][j] = prev + d;
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
      const candidates = [
        { ci: i - 1, cj: j - 1, val: cost[i - 1][j - 1] },
        { ci: i - 1, cj: j, val: cost[i - 1][j] },
        { ci: i, cj: j - 1, val: cost[i][j - 1] },
      ];
      const best = candidates.reduce((min, c) => (c.val < min.val ? c : min));
      i = best.ci;
      j = best.cj;
    }
    path.push([i, j]);
  }

  path.reverse();

  // 정렬된 시퀀스 생성
  const alignedA = path.map(([pi]) => a[pi]);
  const alignedB = path.map(([, pj]) => b[pj]);

  // 정규화된 비용
  const normalizedCost = cost[n - 1][m - 1] / path.length;

  // 타이밍 점수: 대각선 이탈도 (0-100)
  const idealRatio = m / n;
  let totalDeviation = 0;
  for (const [pi, pj] of path) {
    const idealJ = pi * idealRatio;
    totalDeviation += Math.abs(pj - idealJ) / m;
  }
  const avgDeviation = totalDeviation / path.length;
  // 이탈도가 0이면 100점, 0.5 이상이면 0점
  const timingScore = Math.max(0, Math.min(100, Math.round((1 - avgDeviation * 2) * 100)));

  return {
    cost: normalizedCost,
    path,
    alignedA,
    alignedB,
    timingScore,
  };
}
