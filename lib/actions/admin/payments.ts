"use server";

import { requireAdmin } from "@/lib/auth";
import type { AdminOrder, PaginatedResult } from "@/lib/types/admin";

export async function getOrders(params: {
  page?: number;
  pageSize?: number;
  status?: string;
}): Promise<PaginatedResult<AdminOrder>> {
  const { supabase } = await requireAdmin();
  const page = params.page || 1;
  const pageSize = params.pageSize || 20;
  const offset = (page - 1) * pageSize;

  let query = supabase
    .from("orders")
    .select("*", { count: "exact" });

  if (params.status && params.status !== "all") {
    query = query.eq("status", params.status);
  }

  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (error || !data) {
    return { data: [], total: 0, page, pageSize };
  }

  // 사용자 정보 조인
  const userIds = [...new Set(data.map((o) => o.user_id))];
  const userMap = new Map<string, { email: string; name: string | null }>();

  if (userIds.length > 0) {
    // service client의 auth admin으로 사용자 정보 가져오기
    for (const uid of userIds) {
      const { data: u } = await supabase.auth.admin.getUserById(uid);
      if (u?.user) {
        userMap.set(uid, {
          email: u.user.email || "",
          name: u.user.user_metadata?.display_name || null,
        });
      }
    }
  }

  const orders: AdminOrder[] = data.map((o) => ({
    id: o.id,
    user_id: o.user_id,
    user_email: userMap.get(o.user_id)?.email || "-",
    user_name: userMap.get(o.user_id)?.name || null,
    product_name: o.product_name || "-",
    amount: o.amount || 0,
    status: o.status || "unknown",
    payment_id: o.payment_id || null,
    created_at: o.created_at,
  }));

  return { data: orders, total: count || 0, page, pageSize };
}
