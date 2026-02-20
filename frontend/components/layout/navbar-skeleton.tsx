// Navbar 로딩 중 표시할 스켈레톤 (Suspense fallback용)
export function NavbarSkeleton() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* 로고 */}
        <div className="h-6 w-20 animate-pulse rounded bg-surface-secondary" />

        {/* 데스크톱 네비게이션 스켈레톤 */}
        <div className="hidden items-center gap-3 md:flex">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-4 w-14 animate-pulse rounded bg-surface-secondary"
            />
          ))}
        </div>

        {/* 우측 버튼 스켈레톤 */}
        <div className="h-8 w-20 animate-pulse rounded-[var(--radius-md)] bg-surface-secondary" />
      </nav>
    </header>
  );
}
