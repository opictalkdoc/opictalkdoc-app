// 몰입형 페이지 전환 시 즉시 표시되는 스켈레톤
export default function ImmersiveLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-surface-secondary border-t-primary-500" />
        <p className="text-sm text-foreground-secondary">로딩 중...</p>
      </div>
    </div>
  );
}
