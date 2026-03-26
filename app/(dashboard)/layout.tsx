import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getAuthClaims } from "@/lib/auth";
import { GradeNudgeBanner } from "@/components/ui/grade-nudge-banner";

// 비동기 서버 컴포넌트: getAuthClaims()로 로컬 JWT claims에서 등급 정보를 읽어 배너에 전달
// getAuthClaims()는 로컬 JWT 검증 (0ms, 네트워크 왕복 없음)
// ※ updateUser() 직후에는 JWT 갱신 전이라 이전 값이 나올 수 있으나,
//    마이페이지에서 updateUser 후 revalidatePath로 처리하므로 실사용에 영향 없음
async function GradeNudgeBannerLoader() {
  const claims = await getAuthClaims();
  const meta = (claims as Record<string, unknown>)?.user_metadata as Record<string, string> | undefined;
  const currentGrade = meta?.current_grade || "";
  const targetGrade = meta?.target_grade || "";
  return <GradeNudgeBanner currentGrade={currentGrade} targetGrade={targetGrade} />;
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // getAuthClaims(): 로컬 JWT 검증 (0ms) — Navbar 깜빡임 제거를 위해 서버에서 인증 정보 전달
  const claims = await getAuthClaims();
  const meta = (claims as Record<string, unknown>)?.user_metadata as Record<string, string> | undefined;
  const serverAuth = claims
    ? {
        isLoggedIn: true,
        userName: meta?.display_name || meta?.full_name || meta?.name || "",
        isAdmin: ((claims as Record<string, unknown>)?.app_metadata as Record<string, string> | undefined)?.role === "admin",
      }
    : { isLoggedIn: false, userName: "", isAdmin: false };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar serverAuth={serverAuth} />
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
