"use server";

import { requireAdmin } from "@/lib/auth";
import type {
  AdminUser,
  CreditAdjustParams,
  PaginatedResult,
} from "@/lib/types/admin";

export async function getUsers(params: {
  page?: number;
  pageSize?: number;
  search?: string;
}): Promise<PaginatedResult<AdminUser>> {
  const { supabase } = await requireAdmin();
  const page = params.page || 1;
  const pageSize = params.pageSize || 20;
  const offset = (page - 1) * pageSize;

  // auth.users에서 사용자 목록 조회 (service client — admin.listUsers)
  const { data: authData, error: authError } = await supabase.auth.admin.listUsers({
    page,
    perPage: pageSize,
  });

  if (authError || !authData) {
    return { data: [], total: 0, page, pageSize };
  }

  let users = authData.users;
  const total = authData.users.length < pageSize
    ? offset + authData.users.length
    : offset + pageSize + 1; // 다음 페이지 있음을 표시

  // 검색 필터 (서버 사이드 — email/display_name)
  if (params.search) {
    const q = params.search.toLowerCase();
    users = users.filter(
      (u) =>
        u.email?.toLowerCase().includes(q) ||
        (u.user_metadata?.display_name || "").toLowerCase().includes(q)
    );
  }

  // user_credits 조인
  const userIds = users.map((u) => u.id);
  const { data: credits } = await supabase
    .from("user_credits")
    .select("user_id, plan_mock_exam_credits, plan_script_credits, mock_exam_credits, script_credits, current_plan")
    .in("user_id", userIds);

  const creditMap = new Map(
    (credits || []).map((c) => [c.user_id, c])
  );

  const data: AdminUser[] = users.map((u) => {
    const c = creditMap.get(u.id);
    return {
      id: u.id,
      email: u.email || "",
      display_name: u.user_metadata?.display_name || u.user_metadata?.full_name || null,
      current_grade: u.user_metadata?.current_grade || null,
      target_grade: u.user_metadata?.target_grade || null,
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at || null,
      plan_mock_exam_credits: c?.plan_mock_exam_credits || 0,
      plan_script_credits: c?.plan_script_credits || 0,
      mock_exam_credits: c?.mock_exam_credits || 0,
      script_credits: c?.script_credits || 0,
      current_plan: c?.current_plan || "free",
    };
  });

  return { data, total, page, pageSize };
}

export async function getUserDetail(userId: string): Promise<AdminUser | null> {
  const { supabase } = await requireAdmin();

  const { data: authData, error } = await supabase.auth.admin.getUserById(userId);
  if (error || !authData?.user) return null;

  const u = authData.user;
  const { data: c } = await supabase
    .from("user_credits")
    .select("*")
    .eq("user_id", userId)
    .single();

  return {
    id: u.id,
    email: u.email || "",
    display_name: u.user_metadata?.display_name || u.user_metadata?.full_name || null,
    current_grade: u.user_metadata?.current_grade || null,
    target_grade: u.user_metadata?.target_grade || null,
    created_at: u.created_at,
    last_sign_in_at: u.last_sign_in_at || null,
    plan_mock_exam_credits: c?.plan_mock_exam_credits || 0,
    plan_script_credits: c?.plan_script_credits || 0,
    mock_exam_credits: c?.mock_exam_credits || 0,
    script_credits: c?.script_credits || 0,
    current_plan: c?.current_plan || "free",
  };
}

export async function adjustCredit(
  params: CreditAdjustParams
): Promise<{ success: boolean; error?: string }> {
  const { supabase, userId: adminId } = await requireAdmin();

  // 현재 크레딧 조회
  const { data: current, error: fetchError } = await supabase
    .from("user_credits")
    .select(params.creditType)
    .eq("user_id", params.userId)
    .single();

  if (fetchError || !current) {
    return { success: false, error: "사용자 크레딧 조회 실패" };
  }

  const oldValue = (current as Record<string, number>)[params.creditType] || 0;
  const newValue = Math.max(0, oldValue + params.amount);

  const { error: updateError } = await supabase
    .from("user_credits")
    .update({ [params.creditType]: newValue })
    .eq("user_id", params.userId);

  if (updateError) {
    return { success: false, error: `크레딧 수정 실패: ${updateError.message}` };
  }

  // 감사 로그
  await supabase.from("admin_audit_log").insert({
    admin_id: adminId,
    action: "credit_adjust",
    target_type: "user",
    target_id: params.userId,
    details: {
      credit_type: params.creditType,
      old_value: oldValue,
      new_value: newValue,
      amount: params.amount,
      reason: params.reason,
    },
  });

  return { success: true };
}
