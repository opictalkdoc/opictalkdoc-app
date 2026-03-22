"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  Search,
  Trash2,
  X,
  Loader2,
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Clock,
  Circle,
} from "lucide-react";
import {
  getAdminTutoringStats,
  getAdminTutoringSessions,
  getAdminTutoringDetail,
  deleteAdminTutoringSession,
} from "@/lib/actions/admin/tutoring";
import type { AdminTutoringSession, AdminTutoringDetail } from "@/lib/actions/admin/tutoring";
import { TIER_LABELS, APPROACH_LABELS, CATEGORY_LABELS } from "@/lib/types/tutoring-v2";
import type { TutoringTier, DrillCategory, TrainingApproach } from "@/lib/types/tutoring-v2";

// ── 상수 ──

const STATUS_OPTIONS = [
  { value: "all", label: "전체" },
  { value: "pending", label: "대기" },
  { value: "active", label: "활성" },
  { value: "completed", label: "완료" },
];

const TIER_OPTIONS = [
  { value: "all", label: "전체 티어" },
  { value: "1", label: "T1 (→IL)" },
  { value: "2", label: "T2 (→IM)" },
  { value: "3", label: "T3 (→IH)" },
  { value: "4", label: "T4 (→AL)" },
];

// ── 뱃지 컴포넌트 ──

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; bg: string; text: string }> = {
    completed: { label: "완료", bg: "bg-green-50", text: "text-green-700" },
    active: { label: "활성", bg: "bg-blue-50", text: "text-blue-700" },
    pending: { label: "대기", bg: "bg-amber-50", text: "text-amber-700" },
    in_progress: { label: "진행 중", bg: "bg-blue-50", text: "text-blue-700" },
  };
  const c = config[status] || { label: status, bg: "bg-gray-100", text: "text-gray-500" };
  return (
    <span className={`inline-flex rounded px-1.5 py-0.5 text-xs font-medium ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}

function TierBadge({ tier }: { tier: TutoringTier }) {
  const colors: Record<number, string> = {
    1: "bg-orange-100 text-orange-800",
    2: "bg-amber-100 text-amber-800",
    3: "bg-sky-100 text-sky-800",
    4: "bg-purple-100 text-purple-800",
  };
  return (
    <span className={`inline-flex rounded px-1.5 py-0.5 text-xs font-bold ${colors[tier] || "bg-gray-100 text-gray-700"}`}>
      T{tier}
    </span>
  );
}

function GradeBadge({ grade }: { grade: string | null }) {
  if (!grade) return <span className="text-xs text-foreground-muted">-</span>;
  const gradeColor: Record<string, string> = {
    AL: "bg-purple-100 text-purple-800",
    IH: "bg-blue-100 text-blue-800",
    IM3: "bg-sky-100 text-sky-800",
    IM2: "bg-teal-100 text-teal-700",
    IM1: "bg-emerald-100 text-emerald-700",
    IL: "bg-amber-100 text-amber-800",
    NH: "bg-orange-100 text-orange-700",
    NM: "bg-red-100 text-red-700",
    NL: "bg-red-100 text-red-700",
  };
  const color = gradeColor[grade] || "bg-gray-100 text-gray-700";
  return (
    <span className={`inline-flex rounded px-1.5 py-0.5 text-xs font-bold ${color}`}>
      {grade}
    </span>
  );
}

function CategoryBadge({ category }: { category: string }) {
  const colors: Record<string, string> = {
    structure: "bg-blue-50 text-blue-700",
    accuracy: "bg-green-50 text-green-700",
    content: "bg-purple-50 text-purple-700",
    delivery: "bg-amber-50 text-amber-700",
    task: "bg-rose-50 text-rose-700",
  };
  return (
    <span className={`inline-flex rounded px-1.5 py-0.5 text-[11px] font-medium ${colors[category] || "bg-gray-50 text-gray-600"}`}>
      {CATEGORY_LABELS[category as DrillCategory] || category}
    </span>
  );
}

// ── 삭제 확인 모달 ──

function ConfirmDialog({
  open,
  title,
  message,
  loading,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={() => { if (!loading) onCancel(); }}
    >
      <div className="mx-4 w-full max-w-sm rounded-xl bg-surface p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <p className="mt-2 text-sm text-foreground-secondary">{message}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg px-4 py-2 text-sm font-medium text-foreground-secondary hover:bg-surface-secondary"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}

// ── 통계 카드 ──

function StatsSection({ stats }: { stats: ReturnType<typeof getAdminTutoringStats> extends Promise<infer T> ? T : never }) {
  return (
    <div className="space-y-4">
      {/* 상단 카드 */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="text-xs text-foreground-muted">총 세션</div>
          <div className="mt-1 text-2xl font-bold text-foreground">{stats.totalSessions}</div>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="text-xs text-foreground-muted">완료</div>
          <div className="mt-1 text-2xl font-bold text-green-600">{stats.completedSessions}</div>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="text-xs text-foreground-muted">활성</div>
          <div className="mt-1 text-2xl font-bold text-blue-600">{stats.activeSessions}</div>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="text-xs text-foreground-muted">처방 완료율</div>
          <div className="mt-1 text-2xl font-bold text-foreground">{stats.avgCompletionRate}%</div>
        </div>
      </div>

      {/* 하단: 티어 분포 + 인기 드릴 */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {/* 티어 분포 */}
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="mb-3 text-xs font-medium text-foreground-muted">티어별 분포</div>
          <div className="flex items-end gap-4">
            {([1, 2, 3, 4] as const).map((tier) => {
              const count = stats.tierDistribution[tier] || 0;
              const maxCount = Math.max(...Object.values(stats.tierDistribution), 1);
              const height = Math.max((count / maxCount) * 48, 4);
              const colors = { 1: "bg-orange-400", 2: "bg-amber-400", 3: "bg-sky-400", 4: "bg-purple-400" };
              return (
                <div key={tier} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-xs font-semibold text-foreground">{count}</span>
                  <div className={`w-full rounded-t ${colors[tier]}`} style={{ height: `${height}px` }} />
                  <span className="text-[11px] text-foreground-muted">T{tier}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 인기 드릴 Top 5 */}
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="mb-3 text-xs font-medium text-foreground-muted">인기 드릴 Top 5</div>
          {stats.topDrills.length === 0 ? (
            <p className="text-xs text-foreground-muted">데이터 없음</p>
          ) : (
            <div className="space-y-1.5">
              {stats.topDrills.map((drill, idx) => (
                <div key={drill.drill_code} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-4 text-right text-xs font-medium text-foreground-muted">{idx + 1}</span>
                    <span className="text-sm text-foreground">{drill.name_ko}</span>
                  </div>
                  <span className="text-xs font-medium tabular-nums text-foreground-secondary">{drill.count}회</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── 세션 상세 뷰 ──

function SessionDetailView({
  sessionId,
  onBack,
}: {
  sessionId: string;
  onBack: () => void;
}) {
  const [expandedPrescription, setExpandedPrescription] = useState<string | null>(null);

  const { data: result, isLoading } = useQuery({
    queryKey: ["admin-tutoring-detail", sessionId],
    queryFn: () => getAdminTutoringDetail(sessionId),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-primary-400" />
      </div>
    );
  }

  if (!result?.data || result?.error) {
    return (
      <div className="py-10 text-center text-sm text-foreground-secondary">
        세션 데이터를 불러올 수 없습니다.
      </div>
    );
  }

  const { session, prescriptions } = result.data;

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-foreground-secondary transition-colors hover:bg-surface-secondary hover:text-foreground"
        >
          <ArrowLeft size={14} />
          목록
        </button>
        <div className="flex items-center gap-2 text-sm text-foreground-muted">
          <span>{session.user_email}</span>
          <span className="text-border">·</span>
          <span className="font-mono text-xs">{session.id}</span>
        </div>
      </div>

      {/* 세션 정보 */}
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="flex flex-wrap items-center gap-3">
          <TierBadge tier={session.current_tier} />
          <GradeBadge grade={session.current_grade} />
          {session.target_grade && (
            <>
              <span className="text-xs text-foreground-muted">→</span>
              <GradeBadge grade={session.target_grade} />
            </>
          )}
          <StatusBadge status={session.status} />
          <span className="text-xs text-foreground-muted">
            {new Date(session.created_at).toLocaleString("ko-KR")}
          </span>
        </div>

        {/* 진단 텍스트 */}
        {session.diagnosis_text && typeof session.diagnosis_text === "object" ? (
          <div className="mt-4 rounded-lg bg-surface-secondary p-3">
            <div className="text-xs font-medium text-foreground-muted">진단</div>
            <p className="mt-1 text-sm text-foreground">
              {(session.diagnosis_text as Record<string, string>).one_liner || "-"}
            </p>
          </div>
        ) : null}
      </div>

      {/* 처방 목록 */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">처방 ({prescriptions.length}개)</h3>

        {prescriptions.length === 0 ? (
          <p className="py-6 text-center text-sm text-foreground-muted">처방 없음</p>
        ) : (
          prescriptions.map((p) => {
            const isExpanded = expandedPrescription === p.id;
            return (
              <div key={p.id} className="rounded-xl border border-border bg-surface">
                {/* 처방 헤더 */}
                <button
                  onClick={() => setExpandedPrescription(isExpanded ? null : p.id)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-secondary/50"
                >
                  {isExpanded ? <ChevronDown size={14} className="shrink-0 text-foreground-muted" /> : <ChevronRight size={14} className="shrink-0 text-foreground-muted" />}
                  <span className="w-6 text-center text-xs font-bold text-foreground-muted">#{p.priority}</span>
                  <CategoryBadge category={p.drill_category} />
                  <span className="flex-1 text-sm font-medium text-foreground">{p.drill_name}</span>
                  <span className="text-xs text-foreground-muted">{p.wp_code}</span>
                  <StatusBadge status={p.status} />
                </button>

                {/* 확장 내용 */}
                {isExpanded && (
                  <div className="border-t border-border/50 px-4 py-3 space-y-3">
                    {/* 처방 데이터 */}
                    {p.prescription_data && typeof p.prescription_data === "object" ? (
                      <div className="rounded-lg bg-surface-secondary p-3 space-y-2">
                        {Object.entries(p.prescription_data as Record<string, string>).map(([key, val]) => (
                          <div key={key}>
                            <span className="text-[11px] font-medium text-foreground-muted">{key}</span>
                            <p className="text-sm text-foreground">{val}</p>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    {/* 훈련 정보 */}
                    {p.training ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-xs text-foreground-muted">
                            접근법: {APPROACH_LABELS[p.training.approach as TrainingApproach] || p.training.approach}
                          </span>
                          <span className="text-xs text-foreground-muted">
                            라운드: {p.training.rounds_completed}/{p.training.max_rounds}
                          </span>
                          {p.training.passed ? (
                            <span className="flex items-center gap-1 text-xs text-green-600">
                              <CheckCircle2 size={12} /> 통과
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs text-foreground-muted">
                              <Clock size={12} /> 미완
                            </span>
                          )}
                        </div>

                        {/* 시도 목록 */}
                        {p.attempts.length > 0 && (
                          <div className="space-y-1">
                            <div className="text-[11px] font-medium text-foreground-muted">시도 ({p.attempts.length}회)</div>
                            {p.attempts.map((a) => (
                              <div
                                key={a.id}
                                className="flex items-center gap-3 rounded-lg bg-surface-secondary px-3 py-2"
                              >
                                <span className="w-8 text-xs font-medium text-foreground-muted">R{a.round_number}</span>
                                {a.passed ? (
                                  <CheckCircle2 size={12} className="text-green-500" />
                                ) : (
                                  <Circle size={12} className="text-foreground-muted/50" />
                                )}
                                {a.duration_sec != null && (
                                  <span className="text-xs tabular-nums text-foreground-secondary">{a.duration_sec}초</span>
                                )}
                                {a.word_count != null && (
                                  <span className="text-xs tabular-nums text-foreground-secondary">{a.word_count}단어</span>
                                )}
                                {a.wpm != null && (
                                  <span className="text-xs tabular-nums text-foreground-secondary">{a.wpm}wpm</span>
                                )}
                                {a.transcript && (
                                  <span className="flex-1 truncate text-xs text-foreground-muted" title={a.transcript}>
                                    {a.transcript.slice(0, 80)}{a.transcript.length > 80 ? "…" : ""}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-foreground-muted">훈련 기록 없음</p>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// 메인 페이지
// ═══════════════════════════════════════════════════

export default function AdminTutoringPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [tier, setTier] = useState("all");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  // 삭제 모달
  const [deleteTarget, setDeleteTarget] = useState<AdminTutoringSession | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 통계
  const { data: stats } = useQuery({
    queryKey: ["admin-tutoring-stats"],
    queryFn: () => getAdminTutoringStats(),
    staleTime: 60_000,
  });

  // 세션 목록
  const { data: sessionsResult, isLoading } = useQuery({
    queryKey: ["admin-tutoring-sessions", page, status, tier, search],
    queryFn: () => getAdminTutoringSessions({ page, pageSize: 20, status, tier, search }),
    staleTime: 30_000,
  });

  const sessions = sessionsResult?.data || [];
  const total = sessionsResult?.total || 0;
  const totalPages = Math.ceil(total / 20);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setErrorMsg(null);
    const result = await deleteAdminTutoringSession(deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);
    if (result.error) {
      setErrorMsg(result.error);
    } else {
      queryClient.invalidateQueries({ queryKey: ["admin-tutoring-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["admin-tutoring-stats"] });
    }
  };

  // 상세 뷰
  if (selectedSession) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold text-foreground">튜터링 관리</h1>
        <SessionDetailView
          sessionId={selectedSession}
          onBack={() => setSelectedSession(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* 헤더 + 검색 */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">튜터링 관리</h1>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="사용자 이메일 검색"
              className="rounded-lg border border-border bg-background py-1.5 pl-8 pr-3 text-sm text-foreground placeholder:text-foreground-muted/60"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-primary-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-600"
          >
            검색
          </button>
          {search && (
            <button
              type="button"
              onClick={() => { setSearchInput(""); setSearch(""); setPage(1); }}
              className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-foreground-secondary hover:bg-surface-secondary"
            >
              <X size={12} />
              초기화
            </button>
          )}
        </form>
      </div>

      {/* 에러 */}
      {errorMsg && (
        <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="ml-2 text-red-400 hover:text-red-600">
            <X size={14} />
          </button>
        </div>
      )}

      {/* 통계 */}
      {stats && <StatsSection stats={stats} />}

      {/* 필터 */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-1">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { setStatus(opt.value); setPage(1); }}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                status === opt.value
                  ? "bg-primary-500 text-white"
                  : "bg-surface-secondary text-foreground-secondary hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <span className="text-border">|</span>

        <select
          value={tier}
          onChange={(e) => { setTier(e.target.value); setPage(1); }}
          className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground"
        >
          {TIER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {stats && (
          <span className="ml-auto text-sm text-foreground-muted">
            총 <span className="font-semibold text-foreground">{total}</span>건
          </span>
        )}
      </div>

      {/* 세션 목록 */}
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 size={20} className="animate-spin text-primary-400" />
          </div>
        ) : sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16">
            <BookOpen size={32} className="text-foreground-muted/50" />
            <span className="text-sm text-foreground-muted">튜터링 세션이 없습니다.</span>
          </div>
        ) : (
          sessions.map((row, idx) => (
            <div
              key={row.id}
              className={`group flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-surface-secondary ${
                idx < sessions.length - 1 ? "border-b border-border/50" : ""
              }`}
            >
              {/* 왼쪽: 사용자 정보 */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-medium text-foreground">
                    {row.user_email}
                  </span>
                  <TierBadge tier={row.current_tier} />
                  <GradeBadge grade={row.current_grade} />
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-foreground-muted">
                  <span>
                    {new Date(row.created_at).toLocaleString("ko-KR", {
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {row.prescriptionCount > 0 && (
                    <>
                      <span className="text-border">·</span>
                      <span>
                        처방 {row.completedPrescriptions}/{row.prescriptionCount}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* 중앙: 상태 */}
              <StatusBadge status={row.status} />

              {/* 오른쪽: 액션 */}
              <div className="flex shrink-0 items-center gap-1">
                <button
                  onClick={() => setSelectedSession(row.id)}
                  className="whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium text-primary-600 transition-colors hover:bg-primary-50"
                >
                  상세 보기
                </button>
                <button
                  onClick={() => setDeleteTarget(row)}
                  className="rounded-md p-1 text-foreground-muted/50 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                  title="삭제"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-foreground-secondary transition-colors hover:bg-surface-secondary disabled:opacity-40"
          >
            이전
          </button>
          <span className="text-xs tabular-nums text-foreground-muted">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-foreground-secondary transition-colors hover:bg-surface-secondary disabled:opacity-40"
          >
            다음
          </button>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="튜터링 세션 삭제"
        message={`${deleteTarget?.user_email || ""} 사용자의 세션을 삭제하시겠습니까? 처방, 훈련, 시도, 녹음 파일이 모두 삭제됩니다.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
