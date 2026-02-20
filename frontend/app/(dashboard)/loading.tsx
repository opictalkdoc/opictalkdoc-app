// 대시보드 페이지 전환 시 즉시 표시되는 스켈레톤
export default function DashboardLoading() {
  return (
    <div className="pb-8 pt-2 lg:pt-0">
      {/* 제목 스켈레톤 */}
      <div className="mb-6">
        <div className="h-8 w-32 animate-pulse rounded bg-surface-secondary" />
        <div className="mt-2 h-4 w-64 animate-pulse rounded bg-surface-secondary" />
      </div>

      {/* 콘텐츠 스켈레톤 */}
      <div className="space-y-4">
        <div className="h-12 w-full animate-pulse rounded-[var(--radius-lg)] bg-surface-secondary" />
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-[var(--radius-xl)] border border-border bg-surface-secondary"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
