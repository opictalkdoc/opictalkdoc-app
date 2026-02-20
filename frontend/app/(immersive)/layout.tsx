// 인증은 미들웨어에서 처리 — 레이아웃은 UI만 담당
export default function ImmersiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">{children}</div>
  );
}
