// 인증은 미들웨어에서 처리 — 레이아웃은 UI만 담당
export default function ImmersiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* 모바일: body 스크롤 차단 — 몰입형 레이아웃은 자체 스크롤 컨테이너 사용 */}
      <style>{`@media(max-width:767px){html,body{overflow:hidden;height:100dvh}}`}</style>
      <div className="flex h-dvh flex-col overflow-hidden bg-background md:h-auto md:min-h-screen md:overflow-visible">{children}</div>
    </>
  );
}
