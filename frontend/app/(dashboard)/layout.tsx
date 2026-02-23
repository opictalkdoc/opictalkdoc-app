import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getAuthClaims } from "@/lib/auth";
import { GradeNudgeBanner } from "@/components/ui/grade-nudge-banner";

// 비동기 서버 컴포넌트: JWT 클레임에서 등급 정보를 읽어 배너에 전달
// getClaims()는 로컬 JWT 검증 (JWKS 캐시 후 0ms, 서버 왕복 없음)
async function GradeNudgeBannerLoader() {
  const claims = await getAuthClaims();
  const currentGrade = claims?.user_metadata?.current_grade || "";
  const targetGrade = claims?.user_metadata?.target_grade || "";
  return <GradeNudgeBanner currentGrade={currentGrade} targetGrade={targetGrade} />;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      {/* 배너는 넛지 UI이므로 fallback=null — 데이터 준비되면 자연스럽게 나타남 */}
      <Suspense fallback={null}>
        <GradeNudgeBannerLoader />
      </Suspense>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>
      <Footer />
    </div>
  );
}
