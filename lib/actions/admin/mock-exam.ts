"use server";

import { requireAdmin } from "@/lib/auth";
import type { AdminMockSession, MockExamStats, PaginatedResult } from "@/lib/types/admin";

export async function getMockExamStats(): Promise<MockExamStats> {
  const { supabase } = await requireAdmin();

  const [totalRes, completedRes, pendingRes, failedRes, gradesRes] = await Promise.all([
    supabase.from("mock_test_sessions").select("*", { count: "exact", head: true }),
    supabase.from("mock_test_sessions").select("*", { count: "exact", head: true }).eq("status", "completed"),
    supabase
      .from("mock_test_answers")
      .select("*", { count: "exact", head: true })
      .not("eval_status", "in", '("complete","skipped")'),
    supabase
      .from("mock_test_answers")
      .select("*", { count: "exact", head: true })
      .eq("eval_status", "error"),
    supabase
      .from("mock_test_reports")
      .select("predicted_grade")
      .not("predicted_grade", "is", null)
      .limit(100),
  ]);

  // 가장 빈번한 등급
  const gradeCounts = new Map<string, number>();
  for (const r of gradesRes.data || []) {
    const g = r.predicted_grade;
    if (g) gradeCounts.set(g, (gradeCounts.get(g) || 0) + 1);
  }
  const avgGrade = gradeCounts.size > 0
    ? [...gradeCounts.entries()].sort((a, b) => b[1] - a[1])[0][0]
    : null;

  return {
    totalSessions: totalRes.count || 0,
    completedSessions: completedRes.count || 0,
    pendingEvals: pendingRes.count || 0,
    failedEvals: failedRes.count || 0,
    avgGrade,
  };
}

export async function getMockExamSessions(params: {
  page?: number;
  pageSize?: number;
  status?: string;
}): Promise<PaginatedResult<AdminMockSession>> {
  const { supabase } = await requireAdmin();
  const page = params.page || 1;
  const pageSize = params.pageSize || 20;
  const offset = (page - 1) * pageSize;

  let query = supabase
    .from("mock_test_sessions")
    .select("*", { count: "exact" });

  if (params.status && params.status !== "all") {
    query = query.eq("status", params.status);
  }

  const { data, count } = await query
    .order("started_at", { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (!data) return { data: [], total: 0, page, pageSize };

  // 사용자 이메일 + 리포트 조인
  const userIds = [...new Set(data.map((s) => s.user_id))];
  const sessionIds = data.map((s) => s.id);

  const [emailMap, reportsRes] = await Promise.all([
    (async () => {
      const m = new Map<string, string>();
      for (const uid of userIds) {
        const { data: u } = await supabase.auth.admin.getUserById(uid);
        if (u?.user?.email) m.set(uid, u.user.email);
      }
      return m;
    })(),
    supabase
      .from("mock_test_reports")
      .select("session_id, predicted_grade")
      .in("session_id", sessionIds),
  ]);

  const gradeMap = new Map(
    (reportsRes.data || []).map((r) => [r.session_id, r.predicted_grade])
  );

  const sessions: AdminMockSession[] = data.map((s) => ({
    id: s.id,
    user_id: s.user_id,
    user_email: emailMap.get(s.user_id) || "-",
    mode: s.mode,
    status: s.status,
    started_at: s.started_at,
    completed_at: s.completed_at,
    eval_progress: s.status === "completed" ? "complete" : s.status,
    predicted_grade: gradeMap.get(s.id) || null,
  }));

  return { data: sessions, total: count || 0, page, pageSize };
}

export async function retriggerEvaluation(sessionId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const { supabase, userId } = await requireAdmin();

  // admin-trigger-eval Edge Function 호출
  const { error } = await supabase.functions.invoke("admin-trigger-eval", {
    body: {
      session_id: sessionId,
      admin_key: "opictalk-eval-2026",
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  // 감사 로그
  await supabase.from("admin_audit_log").insert({
    admin_id: userId,
    action: "eval_retrigger",
    target_type: "mock_session",
    target_id: sessionId,
    details: {},
  });

  return { success: true };
}
