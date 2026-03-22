"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import type { TutoringTier } from "@/lib/types/tutoring-v2";

// ═══════════════════════════════════════════════════
// 타입
// ═══════════════════════════════════════════════════

export interface AdminTutoringStats {
  totalSessions: number;
  completedSessions: number;
  activeSessions: number;
  pendingSessions: number;
  tierDistribution: Record<number, number>;
  topDrills: Array<{ drill_code: string; name_ko: string; count: number }>;
  avgCompletionRate: number; // 0~100
}

export interface AdminTutoringSession {
  id: string;
  user_id: string;
  user_email: string;
  current_tier: TutoringTier;
  current_grade: string;
  target_grade: string | null;
  status: string;
  created_at: string;
  completed_at: string | null;
  prescriptionCount: number;
  completedPrescriptions: number;
}

export interface AdminTutoringDetail {
  session: {
    id: string;
    user_id: string;
    user_email: string;
    current_tier: TutoringTier;
    current_grade: string;
    target_grade: string | null;
    status: string;
    bottleneck_results: unknown;
    diagnosis_text: unknown;
    created_at: string;
    completed_at: string | null;
  };
  prescriptions: Array<{
    id: string;
    priority: number;
    wp_code: string;
    drill_code: string;
    drill_name: string;
    drill_category: string;
    status: string;
    prescription_data: unknown;
    created_at: string;
    training: {
      id: string;
      approach: string;
      rounds_completed: number;
      max_rounds: number;
      passed: boolean;
      started_at: string;
      completed_at: string | null;
    } | null;
    attempts: Array<{
      id: string;
      round_number: number;
      transcript: string | null;
      duration_sec: number | null;
      word_count: number | null;
      wpm: number | null;
      passed: boolean;
      created_at: string;
    }>;
  }>;
}

// ═══════════════════════════════════════════════════
// 1. 통계
// ═══════════════════════════════════════════════════

export async function getAdminTutoringStats(): Promise<AdminTutoringStats> {
  const { supabase } = await requireAdmin();

  const [totalRes, completedRes, activeRes, pendingRes, sessionsRes, prescriptionsRes, drillRes] =
    await Promise.all([
      // 전체 세션 수
      supabase.from("tutoring_sessions_v2").select("*", { count: "exact", head: true }),
      // 완료 세션 수
      supabase.from("tutoring_sessions_v2").select("*", { count: "exact", head: true }).eq("status", "completed"),
      // 활성 세션 수
      supabase.from("tutoring_sessions_v2").select("*", { count: "exact", head: true }).eq("status", "active"),
      // 대기 세션 수
      supabase.from("tutoring_sessions_v2").select("*", { count: "exact", head: true }).eq("status", "pending"),
      // 티어 분포용
      supabase.from("tutoring_sessions_v2").select("current_tier"),
      // 처방 완료율 계산용
      supabase.from("tutoring_prescriptions_v2").select("status"),
      // 드릴별 사용 빈도
      supabase
        .from("tutoring_prescriptions_v2")
        .select("drill_code"),
    ]);

  // 티어별 분포
  const tierDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
  for (const s of sessionsRes.data || []) {
    const t = s.current_tier as number;
    if (t >= 1 && t <= 4) tierDistribution[t] = (tierDistribution[t] || 0) + 1;
  }

  // 평균 완료율
  const totalPrescriptions = (prescriptionsRes.data || []).length;
  const completedPrescriptions = (prescriptionsRes.data || []).filter((p) => p.status === "completed").length;
  const avgCompletionRate = totalPrescriptions > 0 ? Math.round((completedPrescriptions / totalPrescriptions) * 100) : 0;

  // 드릴별 사용 빈도 Top 5
  const drillCounts: Record<string, number> = {};
  for (const p of drillRes.data || []) {
    drillCounts[p.drill_code] = (drillCounts[p.drill_code] || 0) + 1;
  }
  const sortedDrills = Object.entries(drillCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // 드릴 이름 조회
  let topDrills: AdminTutoringStats["topDrills"] = [];
  if (sortedDrills.length > 0) {
    const drillCodes = sortedDrills.map(([code]) => code);
    const { data: drillNames } = await supabase
      .from("tutoring_drill_catalog")
      .select("code, name_ko")
      .in("code", drillCodes);

    const nameMap = new Map((drillNames || []).map((d) => [d.code, d.name_ko]));
    topDrills = sortedDrills.map(([code, count]) => ({
      drill_code: code,
      name_ko: nameMap.get(code) || code,
      count,
    }));
  }

  return {
    totalSessions: totalRes.count || 0,
    completedSessions: completedRes.count || 0,
    activeSessions: activeRes.count || 0,
    pendingSessions: pendingRes.count || 0,
    tierDistribution,
    topDrills,
    avgCompletionRate,
  };
}

// ═══════════════════════════════════════════════════
// 2. 세션 목록 (페이지네이션)
// ═══════════════════════════════════════════════════

export async function getAdminTutoringSessions(params: {
  page?: number;
  pageSize?: number;
  status?: string;
  tier?: string;
  search?: string;
}): Promise<{ data: AdminTutoringSession[]; total: number; page: number; pageSize: number }> {
  const { supabase } = await requireAdmin();
  const page = params.page || 1;
  const pageSize = params.pageSize || 20;

  // 세션 쿼리
  let query = supabase.from("tutoring_sessions_v2").select("*", { count: "exact" });

  if (params.status && params.status !== "all") {
    query = query.eq("status", params.status);
  }
  if (params.tier && params.tier !== "all") {
    query = query.eq("current_tier", Number(params.tier));
  }

  // 이메일 검색 시 넉넉히 가져옴
  const isSearching = !!params.search?.trim();
  const fetchSize = isSearching ? 200 : pageSize;
  const fetchOffset = isSearching ? 0 : (page - 1) * pageSize;

  const { data, count } = await query
    .order("created_at", { ascending: false })
    .range(fetchOffset, fetchOffset + fetchSize - 1);

  if (!data) return { data: [], total: 0, page, pageSize };

  // 사용자 이메일 조회
  const userIds = [...new Set(data.map((s) => s.user_id))];
  const emailResults = await Promise.all(
    userIds.map((uid) => supabase.auth.admin.getUserById(uid))
  );
  const emailMap = new Map<string, string>();
  emailResults.forEach((res, i) => {
    if (res.data?.user?.email) emailMap.set(userIds[i], res.data.user.email);
  });

  // 처방 수 집계
  const sessionIds = data.map((s) => s.id);
  const { data: prescriptions } = await supabase
    .from("tutoring_prescriptions_v2")
    .select("session_id, status")
    .in("session_id", sessionIds);

  const prescriptionCounts = new Map<string, { total: number; completed: number }>();
  for (const p of prescriptions || []) {
    const cur = prescriptionCounts.get(p.session_id) || { total: 0, completed: 0 };
    cur.total++;
    if (p.status === "completed") cur.completed++;
    prescriptionCounts.set(p.session_id, cur);
  }

  let sessions: AdminTutoringSession[] = data.map((s) => {
    const pc = prescriptionCounts.get(s.id) || { total: 0, completed: 0 };
    return {
      id: s.id,
      user_id: s.user_id,
      user_email: emailMap.get(s.user_id) || "-",
      current_tier: s.current_tier,
      current_grade: s.current_grade,
      target_grade: s.target_grade,
      status: s.status,
      created_at: s.created_at,
      completed_at: s.completed_at,
      prescriptionCount: pc.total,
      completedPrescriptions: pc.completed,
    };
  });

  // 이메일 검색 필터
  if (isSearching) {
    const term = params.search!.trim().toLowerCase();
    sessions = sessions.filter((s) => s.user_email.toLowerCase().includes(term));
  }

  if (isSearching) {
    const filteredTotal = sessions.length;
    const start = (page - 1) * pageSize;
    sessions = sessions.slice(start, start + pageSize);
    return { data: sessions, total: filteredTotal, page, pageSize };
  }

  return { data: sessions, total: count || 0, page, pageSize };
}

// ═══════════════════════════════════════════════════
// 3. 세션 상세
// ═══════════════════════════════════════════════════

export async function getAdminTutoringDetail(sessionId: string): Promise<{
  error?: string;
  data?: AdminTutoringDetail;
}> {
  const { supabase } = await requireAdmin();

  // 세션 조회
  const { data: session, error: sessErr } = await supabase
    .from("tutoring_sessions_v2")
    .select("*")
    .eq("id", sessionId)
    .single();

  if (sessErr || !session) {
    return { error: "세션을 찾을 수 없습니다" };
  }

  // 사용자 이메일
  const { data: userData } = await supabase.auth.admin.getUserById(session.user_id);
  const userEmail = userData?.user?.email || "-";

  // 처방 + 드릴 카탈로그 조회
  const { data: prescriptions } = await supabase
    .from("tutoring_prescriptions_v2")
    .select("*")
    .eq("session_id", sessionId)
    .order("priority");

  // 드릴 코드 목록으로 카탈로그 조회
  const drillCodes = [...new Set((prescriptions || []).map((p) => p.drill_code))];
  const { data: drills } = drillCodes.length > 0
    ? await supabase.from("tutoring_drill_catalog").select("code, name_ko, category").in("code", drillCodes)
    : { data: [] };
  const drillMap = new Map((drills || []).map((d) => [d.code, d]));

  // 처방 ID 목록으로 훈련 조회
  const prescriptionIds = (prescriptions || []).map((p) => p.id);
  const { data: trainings } = prescriptionIds.length > 0
    ? await supabase.from("tutoring_training_v2").select("*").in("prescription_id", prescriptionIds)
    : { data: [] };
  const trainingMap = new Map((trainings || []).map((t) => [t.prescription_id, t]));

  // 훈련 ID 목록으로 시도 조회
  const trainingIds = (trainings || []).map((t) => t.id);
  const { data: attempts } = trainingIds.length > 0
    ? await supabase.from("tutoring_attempts_v2").select("*").in("training_id", trainingIds).order("round_number")
    : { data: [] };
  const attemptsByTraining = new Map<string, typeof attempts>();
  for (const a of attempts || []) {
    const list = attemptsByTraining.get(a.training_id) || [];
    list.push(a);
    attemptsByTraining.set(a.training_id, list);
  }

  // 조합
  const prescriptionDetails = (prescriptions || []).map((p) => {
    const drill = drillMap.get(p.drill_code);
    const training = trainingMap.get(p.id);
    const trainingAttempts = training ? (attemptsByTraining.get(training.id) || []) : [];

    return {
      id: p.id,
      priority: p.priority,
      wp_code: p.wp_code,
      drill_code: p.drill_code,
      drill_name: drill?.name_ko || p.drill_code,
      drill_category: drill?.category || "-",
      status: p.status,
      prescription_data: p.prescription_data,
      created_at: p.created_at,
      training: training
        ? {
            id: training.id,
            approach: training.approach,
            rounds_completed: training.rounds_completed,
            max_rounds: training.max_rounds,
            passed: training.passed,
            started_at: training.started_at,
            completed_at: training.completed_at,
          }
        : null,
      attempts: trainingAttempts.map((a) => ({
        id: a.id,
        round_number: a.round_number,
        transcript: a.transcript,
        duration_sec: a.duration_sec ? Number(a.duration_sec) : null,
        word_count: a.word_count,
        wpm: a.wpm ? Number(a.wpm) : null,
        passed: a.passed,
        created_at: a.created_at,
      })),
    };
  });

  return {
    data: {
      session: {
        id: session.id,
        user_id: session.user_id,
        user_email: userEmail,
        current_tier: session.current_tier,
        current_grade: session.current_grade,
        target_grade: session.target_grade,
        status: session.status,
        bottleneck_results: session.bottleneck_results,
        diagnosis_text: session.diagnosis_text,
        created_at: session.created_at,
        completed_at: session.completed_at,
      },
      prescriptions: prescriptionDetails,
    },
  };
}

// ═══════════════════════════════════════════════════
// 4. 세션 삭제 (CASCADE)
// ═══════════════════════════════════════════════════

export async function deleteAdminTutoringSession(sessionId: string): Promise<{ error?: string }> {
  const { supabase, userId, userEmail } = await requireAdmin();

  // 세션 존재 확인
  const { data: session } = await supabase
    .from("tutoring_sessions_v2")
    .select("id, user_id, current_tier, status")
    .eq("id", sessionId)
    .single();

  if (!session) {
    return { error: "세션을 찾을 수 없습니다" };
  }

  // Storage 파일 삭제: attempts에서 audio_url 조회
  const { data: prescriptions } = await supabase
    .from("tutoring_prescriptions_v2")
    .select("id")
    .eq("session_id", sessionId);

  if (prescriptions?.length) {
    const prescriptionIds = prescriptions.map((p) => p.id);
    const { data: trainings } = await supabase
      .from("tutoring_training_v2")
      .select("id")
      .in("prescription_id", prescriptionIds);

    if (trainings?.length) {
      const trainingIds = trainings.map((t) => t.id);
      const { data: attempts } = await supabase
        .from("tutoring_attempts_v2")
        .select("audio_url")
        .in("training_id", trainingIds);

      if (attempts?.length) {
        const bucketSegment = "/tutoring-recordings/";
        const audioPaths = attempts
          .map((a) => {
            if (!a.audio_url) return null;
            const idx = a.audio_url.indexOf(bucketSegment);
            return idx !== -1 ? a.audio_url.slice(idx + bucketSegment.length) : null;
          })
          .filter(Boolean) as string[];

        if (audioPaths.length > 0) {
          await supabase.storage.from("tutoring-recordings").remove(audioPaths);
        }
      }
    }
  }

  // DB 삭제 (prescriptions, training, attempts는 CASCADE로 자동 삭제)
  const { error } = await supabase
    .from("tutoring_sessions_v2")
    .delete()
    .eq("id", sessionId);

  if (error) {
    return { error: "세션 삭제에 실패했습니다" };
  }

  // 감사 로그
  await supabase.from("admin_audit_log").insert({
    admin_id: userId,
    admin_email: userEmail,
    action: "delete_tutoring_session",
    target_type: "tutoring_session_v2",
    target_id: sessionId,
    details: {
      user_id: session.user_id,
      tier: session.current_tier,
      status: session.status,
    },
  });

  revalidatePath("/admin/tutoring");
  return {};
}
