"use client";

// 모의고사 평가 파이프라인 7단계 시각화

const STAGES = [
  { key: "pending", label: "대기" },
  { key: "processing", label: "STT" },
  { key: "stt_done", label: "STT완료" },
  { key: "judging", label: "채점" },
  { key: "judge_done", label: "채점완료" },
  { key: "coaching", label: "코칭" },
  { key: "complete", label: "완료" },
];

const stageColor: Record<string, string> = {
  pending: "bg-gray-200 text-gray-600",
  processing: "bg-blue-100 text-blue-700",
  stt_done: "bg-blue-200 text-blue-800",
  judging: "bg-amber-100 text-amber-700",
  judge_done: "bg-amber-200 text-amber-800",
  coaching: "bg-purple-100 text-purple-700",
  complete: "bg-green-100 text-green-700",
  error: "bg-red-100 text-red-700",
  skipped: "bg-gray-100 text-gray-500",
};

export function EvalPipelineBadge({ status }: { status: string }) {
  const color = stageColor[status] || stageColor.pending;
  const stage = STAGES.find((s) => s.key === status);

  return (
    <span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${color}`}>
      {stage?.label || status}
    </span>
  );
}

interface EvalPipelineViewProps {
  stats: {
    totalSessions: number;
    completedSessions: number;
    pendingEvals: number;
    failedEvals: number;
    avgGrade: string | null;
  };
}

export function EvalPipelineView({ stats }: EvalPipelineViewProps) {
  const completionRate = stats.totalSessions > 0
    ? Math.round((stats.completedSessions / stats.totalSessions) * 100)
    : 0;

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      <StatBox label="전체 세션" value={stats.totalSessions} />
      <StatBox label="완료" value={stats.completedSessions} sub={`${completionRate}%`} />
      <StatBox label="평가 대기" value={stats.pendingEvals} warn={stats.pendingEvals > 0} />
      <StatBox label="에러" value={stats.failedEvals} warn={stats.failedEvals > 0} />
      <StatBox label="최다 등급" value={stats.avgGrade || "-"} />
    </div>
  );
}

function StatBox({
  label,
  value,
  sub,
  warn,
}: {
  label: string;
  value: string | number;
  sub?: string;
  warn?: boolean;
}) {
  return (
    <div className={`rounded-lg border p-3 ${warn ? "border-red-200 bg-red-50" : "border-border bg-surface"}`}>
      <p className="text-xs text-foreground-secondary">{label}</p>
      <p className={`text-lg font-bold ${warn ? "text-red-600" : "text-foreground"}`}>
        {value}
        {sub && <span className="ml-1 text-xs font-normal text-foreground-muted">{sub}</span>}
      </p>
    </div>
  );
}
