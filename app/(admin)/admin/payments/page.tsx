"use client";

import { useState, useEffect, useCallback } from "react";
import { getOrders } from "@/lib/actions/admin/payments";
import { AdminDataTable } from "@/components/admin/admin-data-table";
import type { AdminOrder } from "@/lib/types/admin";

const STATUS_OPTIONS = [
  { value: "all", label: "전체" },
  { value: "paid", label: "결제 완료" },
  { value: "cancelled", label: "취소" },
  { value: "failed", label: "실패" },
];

const statusBadge: Record<string, string> = {
  paid: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  failed: "bg-gray-100 text-gray-600",
};

export default function AdminPaymentsPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getOrders({ page, pageSize: 20, status });
      setOrders(result.data);
      setTotal(result.total);
    } finally {
      setLoading(false);
    }
  }, [page, status]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const columns = [
    {
      key: "created_at",
      label: "일시",
      render: (row: AdminOrder) =>
        new Date(row.created_at).toLocaleString("ko-KR", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    {
      key: "user_email",
      label: "사용자",
      render: (row: AdminOrder) => (
        <div>
          <p className="text-sm font-medium text-foreground">{row.user_name || "-"}</p>
          <p className="text-xs text-foreground-muted">{row.user_email}</p>
        </div>
      ),
    },
    {
      key: "product_name",
      label: "상품",
    },
    {
      key: "amount",
      label: "금액",
      render: (row: AdminOrder) => `${row.amount.toLocaleString()}원`,
    },
    {
      key: "status",
      label: "상태",
      render: (row: AdminOrder) => (
        <span
          className={`rounded-md px-2 py-0.5 text-xs font-medium ${statusBadge[row.status] || "bg-gray-100 text-gray-600"}`}
        >
          {row.status === "paid" ? "완료" : row.status === "cancelled" ? "취소" : row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">결제 관리</h1>
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
          data={orders}
          total={total}
          page={page}
          pageSize={20}
          onPageChange={setPage}
          emptyMessage="결제 내역이 없습니다"
        />
      )}
    </div>
  );
}
