"use client";

import { useState, useEffect, useCallback } from "react";
import { getAuditLogs } from "@/lib/actions/admin/logs";
import { AdminDataTable } from "@/components/admin/admin-data-table";
import { AuditLogDetail } from "@/components/admin/audit-log-detail";
import type { AuditLogEntry } from "@/lib/types/admin";

const ACTION_OPTIONS = [
  { value: "all", label: "전체" },
  { value: "credit_adjust", label: "크레딧 조정" },
  { value: "import_review", label: "기출 입력" },
  { value: "prompt_update", label: "프롬프트 수정" },
  { value: "eval_retrigger", label: "평가 재실행" },
];

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [action, setAction] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAuditLogs({ page, pageSize: 30, action });
      setLogs(result.data);
      setTotal(result.total);
    } finally {
      setLoading(false);
    }
  }, [page, action]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const columns = [
    {
      key: "created_at",
      label: "일시",
      render: (row: AuditLogEntry) =>
        new Date(row.created_at).toLocaleString("ko-KR", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
    },
    {
      key: "action",
      label: "액션",
      render: (row: AuditLogEntry) => (
        <span className="rounded-md bg-surface-secondary px-2 py-0.5 text-xs font-medium text-foreground">
          {row.action}
        </span>
      ),
    },
    {
      key: "admin_email",
      label: "관리자",
      render: (row: AuditLogEntry) => (
        <span className="text-xs">{row.admin_email || row.admin_id.slice(0, 8)}</span>
      ),
    },
    {
      key: "target",
      label: "대상",
      render: (row: AuditLogEntry) =>
        row.target_type
          ? `${row.target_type}:${row.target_id?.slice(0, 8) || "-"}`
          : "-",
    },
    {
      key: "details",
      label: "상세",
      render: (row: AuditLogEntry) => <AuditLogDetail details={row.details} />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">감사 로그</h1>
        <div className="flex gap-1">
          {ACTION_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setAction(opt.value);
                setPage(1);
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                action === opt.value
                  ? "bg-primary-500 text-white"
                  : "text-foreground-secondary hover:bg-surface-secondary"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-lg border border-border bg-surface-secondary" />
          ))}
        </div>
      ) : (
        <AdminDataTable
          columns={columns}
          data={logs}
          total={total}
          page={page}
          pageSize={30}
          onPageChange={setPage}
          emptyMessage="감사 로그가 없습니다"
        />
      )}
    </div>
  );
}
