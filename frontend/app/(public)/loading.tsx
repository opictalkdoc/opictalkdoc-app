// 공개 페이지 전환 시 즉시 표시되는 스켈레톤
export default function PublicLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="space-y-8">
        {/* 히어로 스켈레톤 */}
        <div className="flex flex-col items-center text-center">
          <div className="h-10 w-64 animate-pulse rounded bg-surface-secondary" />
          <div className="mt-4 h-5 w-96 animate-pulse rounded bg-surface-secondary" />
          <div className="mt-2 h-5 w-80 animate-pulse rounded bg-surface-secondary" />
        </div>

        {/* 콘텐츠 스켈레톤 */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-[var(--radius-xl)] border border-border bg-surface-secondary"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
