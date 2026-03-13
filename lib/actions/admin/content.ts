"use server";

import { requireAdmin } from "@/lib/auth";
import type { PaginatedResult } from "@/lib/types/admin";

// ── 질문 DB 목록 ──

export async function getAdminQuestions(params: {
  page?: number;
  pageSize?: number;
  topic?: string;
  category?: string;
}) {
  const { supabase } = await requireAdmin();
  const page = params.page || 1;
  const pageSize = params.pageSize || 30;
  const offset = (page - 1) * pageSize;

  let query = supabase
    .from("questions")
    .select("id, topic, category, question_short, question_type_kor, survey_type", { count: "exact" });

  if (params.topic) query = query.eq("topic", params.topic);
  if (params.category) query = query.eq("category", params.category);

  const { data, count } = await query
    .order("topic")
    .order("id")
    .range(offset, offset + pageSize - 1);

  return { data: data || [], total: count || 0, page, pageSize };
}

// ── 프롬프트 템플릿 CRUD ──

export async function getPromptTemplates() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("ai_prompt_templates")
    .select("*")
    .order("name");
  return data || [];
}

export async function updatePromptTemplate(id: string, content: string) {
  const { supabase, userId } = await requireAdmin();

  // 변경 전 값 저장
  const { data: before } = await supabase
    .from("ai_prompt_templates")
    .select("content")
    .eq("id", id)
    .single();

  const { error } = await supabase
    .from("ai_prompt_templates")
    .update({ content, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  // 감사 로그
  await supabase.from("admin_audit_log").insert({
    admin_id: userId,
    action: "prompt_update",
    target_type: "prompt_template",
    target_id: id,
    details: {
      content_length_before: before?.content?.length || 0,
      content_length_after: content.length,
    },
  });

  return { success: true };
}

// ── 학습 팁 CRUD ──

export async function getOpicTips(params: {
  page?: number;
  pageSize?: number;
}) {
  const { supabase } = await requireAdmin();
  const page = params.page || 1;
  const pageSize = params.pageSize || 30;
  const offset = (page - 1) * pageSize;

  const { data, count } = await supabase
    .from("opic_tips")
    .select("*", { count: "exact" })
    .order("target_level")
    .order("answer_type")
    .range(offset, offset + pageSize - 1);

  return { data: data || [], total: count || 0, page, pageSize };
}

export async function updateOpicTip(id: string, updates: { title?: string; content?: string }) {
  const { supabase, userId } = await requireAdmin();

  const { error } = await supabase
    .from("opic_tips")
    .update(updates)
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  await supabase.from("admin_audit_log").insert({
    admin_id: userId,
    action: "tip_update",
    target_type: "opic_tip",
    target_id: id,
    details: updates,
  });

  return { success: true };
}

// ── 평가 프롬프트 ──

export async function getEvalPrompts() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("evaluation_prompts")
    .select("*")
    .order("name");
  return data || [];
}

export async function updateEvalPrompt(id: string, content: string) {
  const { supabase, userId } = await requireAdmin();

  const { error } = await supabase
    .from("evaluation_prompts")
    .update({ content, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  await supabase.from("admin_audit_log").insert({
    admin_id: userId,
    action: "eval_prompt_update",
    target_type: "evaluation_prompt",
    target_id: id,
    details: { content_length: content.length },
  });

  return { success: true };
}

// ── 스크립트 규격서 ──

export async function getScriptSpecs(params: {
  page?: number;
  pageSize?: number;
}) {
  const { supabase } = await requireAdmin();
  const page = params.page || 1;
  const pageSize = params.pageSize || 30;
  const offset = (page - 1) * pageSize;

  const { data, count } = await supabase
    .from("script_specs")
    .select("*", { count: "exact" })
    .order("target_level")
    .order("question_type")
    .range(offset, offset + pageSize - 1);

  return { data: data || [], total: count || 0, page, pageSize };
}

// ── 모의고사 평가 설정 ──

export async function getEvalSettings() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("mock_test_eval_settings")
    .select("*")
    .limit(1)
    .single();
  return data;
}

export async function updateEvalSettings(updates: Record<string, unknown>) {
  const { supabase, userId } = await requireAdmin();

  const { data: current } = await supabase
    .from("mock_test_eval_settings")
    .select("*")
    .limit(1)
    .single();

  if (!current) return { success: false, error: "설정 레코드 없음" };

  const { error } = await supabase
    .from("mock_test_eval_settings")
    .update(updates)
    .eq("id", current.id);

  if (error) return { success: false, error: error.message };

  await supabase.from("admin_audit_log").insert({
    admin_id: userId,
    action: "eval_settings_update",
    target_type: "eval_settings",
    target_id: current.id,
    details: updates,
  });

  return { success: true };
}
