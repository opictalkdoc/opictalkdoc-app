"use server";

import { requireAdmin } from "@/lib/auth";
import type { AuditLogEntry, PaginatedResult } from "@/lib/types/admin";

export async function getAuditLogs(params: {
  page?: number;
  pageSize?: number;
  action?: string;
}): Promise<PaginatedResult<AuditLogEntry>> {
  const { supabase } = await requireAdmin();
  const page = params.page || 1;
  const pageSize = params.pageSize || 30;
  const offset = (page - 1) * pageSize;

  let query = supabase
    .from("admin_audit_log")
    .select("*", { count: "exact" });

  if (params.action && params.action !== "all") {
    query = query.eq("action", params.action);
  }

  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (error || !data) {
    return { data: [], total: 0, page, pageSize };
  }

  // admin 이메일 조회
  const adminIds = [...new Set(data.map((d) => d.admin_id))];
  const emailMap = new Map<string, string>();
  for (const id of adminIds) {
    const { data: u } = await supabase.auth.admin.getUserById(id);
    if (u?.user?.email) emailMap.set(id, u.user.email);
  }

  const entries: AuditLogEntry[] = data.map((d) => ({
    id: d.id,
    admin_id: d.admin_id,
    admin_email: emailMap.get(d.admin_id),
    action: d.action,
    target_type: d.target_type,
    target_id: d.target_id,
    details: d.details || {},
    ip_address: d.ip_address,
    created_at: d.created_at,
  }));

  return { data: entries, total: count || 0, page, pageSize };
}
