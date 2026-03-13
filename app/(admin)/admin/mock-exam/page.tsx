"use client";

import { useState, useEffect, useCallback } from "react";
import { RefreshCw } from "lucide-react";
import {
  getMockExamStats,
  getMockExamSessions,
  retriggerEvaluation,
} from "@/lib/actions/admin/mock-exam";
import { AdminDataTable } from "@/components/admin/admin-data-table";
import { EvalPipelineView, EvalPipelineBadge } from "@/components/admin/eval-pipeline-view";
import type { AdminMockSession, MockExamStats } from "@/lib/types/admin";

const STATUS_OPTIONS = [
  { value: "all", label: "전체" },
  { value: "in_progress", label: "진행 중" },
  { value: "completed", label: "완료" },
  { value: "expired", label: "만료" },
];

export default function AdminMockExamPage() {
  const [stats, setStats] = useState<MockExamStats | null>(null);
  const [sessions, setSessions] = useState<AdminMockSession[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [retriggering, setRetriggering] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, sessionsRes] = await Promise.all([
        getMockExamStats(),
        getMockExamSessions({ page, pageSize: 20, status }),
      ]);
      setStats(statsRes);
      setSessions(sessionsRes.data);
      setTotal(sessionsRes.total);
    } finally {
      setLoading(false);
    }
  }, [page, status]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRetrigger = async (sessionId: string) => {
    if (!confirm("이 세션의 평가를 재실행하시겠습니까?")) return;
    setRetriggering(sessionId);
    try {
      const result = await retriggerEvaluation(sessionId);
      if (!result.success) {
        alert(result.error || "재실행 실패");
      } else {
        alert("평가 재실행이 시작되었습니다");
        fetchData();
      }
    } finally {
      setRetriggering(null);
    }
  };

  const columns = [
    {
      key: "started_at",
      label: "시작일",
      render: (row: AdminMockSession) =>
        new Date(row.started_at).toLocaleString("ko-KR", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    {
      key: "user_email",
      label: "사용자",
      render: (row: AdminMockSession) => (
        <span className="text-xs">{row.user_email}</span>
      ),
    },
    {
      key: "mode",
      label: "모드",
      render: (row: AdminMockSession) => (
        <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${
          row.mode === "test" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
        }`}>
          {row.mode === "test" ? "실전" : "훈련"}
        </span>
      ),
    },
    {
      key: "status",
      label: "상태",
      render: (row: AdminMockSession) => <EvalPipelineBadge status={row.status} />,
    },
    {
      key: "predicted_grade",
      label: "등급",
      render: (row: AdminMockSession) => row.predicted_grade || "-",
    },
    {
      key: "actions",
      label: "",
      className: "w-10",
      render: (row: AdminMockSession) => (
        row.status === "completed" ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRetrigger(row.id);
            }}
            disabled={retriggering === row.id}
            title="평가 재실행"
            className="rounded-md p-1 text-foreground-muted hover:bg-surface-secondary hover:text-primary-600 disabled:opacity-50"
          >
            <RefreshCw size={14} className={retriggering === row.id ? "animate-spin" : ""} />
          </button>
        ) : null
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-foreground">모의고사 모니터링</h1>

      {/* 파이프라인 통계 */}
      {stats && <EvalPipelineView stats={stats} />}

      {/* 필터 */}
      <div className="flex gap-1">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => {
              setStatus(opt.value);
              setPage(1);
            }}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              status === opt.value
                ? "bg-primary-500 text-white"
                : "text-foreground-secondary hover:bg-surface-secondary"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* 세션 목록 */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-lg border border-border bg-surface-secondary" />
          ))}
        </div>
      ) : (
        <AdminDataTable
          columns={columns}
          data={sessions}
          total={total}
          page={page}
          pageSize={20}
          onPageChange={setPage}
          emptyMessage="모의고사 세션이 없습니다"
        />
      )}
    </div>
  );
}
