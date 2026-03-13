"use server";

import { requireAdmin } from "@/lib/auth";
import type { AdminDashboardStats, RecentActivity } from "@/lib/types/admin";

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const { supabase } = await requireAdmin();

  const today = new Date().toISOString().split("T")[0];

  const [usersRes, dauRes, revenueRes, evalsRes] = await Promise.all([
    // 총 회원 수
    supabase.from("user_credits").select("*", { count: "exact", head: true }),
    // 오늘 로그인한 사용자 (DAU RPC)
    supabase.rpc("get_dau_count", { target_date: today }),
    // 총 매출 (성공 결제)
    supabase.from("orders").select("amount").eq("status", "paid"),
    // 평가 대기 중인 모의고사 답변
    supabase
      .from("mock_test_answers")
      .select("*", { count: "exact", head: true })
      .not("eval_status", "in", '("complete","skipped")'),
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dauCount = (dauRes.data as any)?.[0]?.count ?? 0;

  const totalRevenue = (revenueRes.data || []).reduce(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (sum: number, o: any) => sum + (o.amount || 0),
    0
  );

  return {
    totalUsers: usersRes.count || 0,
    dauToday: Number(dauCount),
    totalRevenue,
    pendingEvals: evalsRes.count || 0,
  };
}

export async function getRecentActivity(): Promise<RecentActivity[]> {
  const { supabase } = await requireAdmin();

  // 최근 활동 — 여러 소스에서 모아 시간순 정렬
  const [ordersRes, sessionsRes] = await Promise.all([
    supabase
      .from("orders")
      .select("id, product_name, amount, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("mock_test_sessions")
      .select("id, mode, status, started_at")
      .order("started_at", { ascending: false })
      .limit(5),
  ]);

  const activities: RecentActivity[] = [];

  for (const o of ordersRes.data || []) {
    activities.push({
      id: o.id,
      type: "order",
      description: `${o.product_name} — ${o.amount?.toLocaleString()}원 (${o.status})`,
      created_at: o.created_at,
    });
  }

  for (const s of sessionsRes.data || []) {
    activities.push({
      id: s.id,
      type: "mock_exam",
      description: `모의고사 ${s.mode === "test" ? "실전" : "훈련"} — ${s.status}`,
      created_at: s.started_at,
    });
  }

  // 시간순 정렬 (최신 먼저)
  activities.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return activities.slice(0, 10);
}
