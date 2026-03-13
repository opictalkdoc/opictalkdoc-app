"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Coins } from "lucide-react";
import { getUsers, adjustCredit } from "@/lib/actions/admin/users";
import { AdminDataTable } from "@/components/admin/admin-data-table";
import { CreditAdjustModal } from "@/components/admin/credit-adjust-modal";
import type { AdminUser, CreditAdjustParams } from "@/lib/types/admin";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [creditTarget, setCreditTarget] = useState<AdminUser | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getUsers({ page, pageSize: 20, search });
      setUsers(result.data);
      setTotal(result.total);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleAdjust = async (params: CreditAdjustParams) => {
    const result = await adjustCredit(params);
    if (!result.success) {
      alert(result.error || "크레딧 조정 실패");
      return;
    }
    fetchUsers();
  };

  const columns = [
    {
      key: "email",
      label: "이메일",
      render: (row: AdminUser) => (
        <span className="font-medium text-foreground">{row.email}</span>
      ),
    },
    {
      key: "display_name",
      label: "이름",
      render: (row: AdminUser) => row.display_name || "-",
    },
    {
      key: "current_plan",
      label: "플랜",
      render: (row: AdminUser) => (
        <span
          className={`rounded-md px-2 py-0.5 text-xs font-medium ${
            row.current_plan === "free"
              ? "bg-gray-100 text-gray-600"
              : "bg-primary-50 text-primary-600"
          }`}
        >
          {row.current_plan}
        </span>
      ),
    },
    {
      key: "credits",
      label: "크레딧 (모/스)",
      render: (row: AdminUser) => (
        <span className="text-xs">
          {row.mock_exam_credits + row.plan_mock_exam_credits} / {row.script_credits + row.plan_script_credits}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "가입일",
      render: (row: AdminUser) =>
        new Date(row.created_at).toLocaleDateString("ko-KR"),
    },
    {
      key: "actions",
      label: "",
      className: "w-10",
      render: (row: AdminUser) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCreditTarget(row);
          }}
          title="크레딧 조정"
          className="rounded-md p-1 text-foreground-muted hover:bg-surface-secondary hover:text-primary-600"
        >
          <Coins size={16} />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">사용자 관리</h1>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="이메일 또는 이름 검색"
              className="rounded-lg border border-border bg-background py-1.5 pl-8 pr-3 text-sm text-foreground"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-primary-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-600"
          >
            검색
          </button>
        </form>
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
          data={users}
          total={total}
          page={page}
          pageSize={20}
          onPageChange={setPage}
          emptyMessage="사용자가 없습니다"
        />
      )}

      {creditTarget && (
        <CreditAdjustModal
          userId={creditTarget.id}
          userName={creditTarget.display_name || creditTarget.email}
          onSubmit={handleAdjust}
          onClose={() => setCreditTarget(null)}
        />
      )}
    </div>
  );
}
