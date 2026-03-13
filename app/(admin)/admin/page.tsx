import { Suspense } from "react";
import { Users, CreditCard, GraduationCap, Clock } from "lucide-react";
import { getAdminDashboardStats, getRecentActivity } from "@/lib/actions/admin/stats";
import { AdminStatCard } from "@/components/admin/admin-stat-card";

async function DashboardStats() {
  const stats = await getAdminDashboardStats();

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <AdminStatCard
        icon={Users}
        label="총 회원"
        value={stats.totalUsers.toLocaleString()}
      />
      <AdminStatCard
        icon={Clock}
        label="오늘 DAU"
        value={stats.dauToday.toLocaleString()}
      />
      <AdminStatCard
        icon={CreditCard}
        label="총 매출"
        value={`${(stats.totalRevenue / 10000).toFixed(1)}만원`}
      />
      <AdminStatCard
        icon={GraduationCap}
        label="평가 대기"
        value={stats.pendingEvals}
      />
    </div>
  );
}

async function RecentActivityList() {
  const activities = await getRecentActivity();

  if (activities.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-foreground-muted">
        최근 활동이 없습니다
      </p>
    );
  }

  const typeLabel: Record<string, string> = {
    signup: "가입",
    order: "결제",
    mock_exam: "모의고사",
    review: "후기",
  };

  const typeColor: Record<string, string> = {
    signup: "bg-green-100 text-green-700",
    order: "bg-blue-100 text-blue-700",
    mock_exam: "bg-purple-100 text-purple-700",
    review: "bg-amber-100 text-amber-700",
  };

  return (
    <div className="space-y-2">
      {activities.map((a) => (
        <div
          key={`${a.type}-${a.id}`}
          className="flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3"
        >
          <span
            className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-medium ${typeColor[a.type] || "bg-gray-100 text-gray-700"}`}
          >
            {typeLabel[a.type] || a.type}
          </span>
          <span className="min-w-0 flex-1 truncate text-sm text-foreground">
            {a.description}
          </span>
          <span className="shrink-0 text-xs text-foreground-muted">
            {new Date(a.created_at).toLocaleString("ko-KR", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      ))}
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-20 animate-pulse rounded-xl border border-border bg-surface-secondary" />
      ))}
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-xl font-bold text-foreground">관리자 대시보드</h1>

      <Suspense fallback={<StatsSkeleton />}>
        <DashboardStats />
      </Suspense>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-foreground-secondary">최근 활동</h2>
        <Suspense
          fallback={
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 animate-pulse rounded-lg border border-border bg-surface-secondary" />
              ))}
            </div>
          }
        >
          <RecentActivityList />
        </Suspense>
      </div>
    </div>
  );
}
