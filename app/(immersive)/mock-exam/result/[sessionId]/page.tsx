import { ImmersiveHeader } from "@/components/layout/immersive-header";
import { ResultPageContent } from "@/components/mock-exam/result-page/result-page-content";
import { getSession, getHistory } from "@/lib/actions/mock-exam";

export const metadata = {
  title: "나의 모의고사 | 오픽톡닥",
};

interface Props {
  params: Promise<{ sessionId: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export default async function MockExamResultPage({ params, searchParams }: Props) {
  const { sessionId } = await params;
  const { tab } = await searchParams;

  if (!sessionId) {
    return (
      <>
        <ImmersiveHeader title="나의 모의고사" backHref="/mock-exam?tab=history" />
        <main className="flex h-0 flex-grow flex-col items-center justify-center">
          <p className="text-foreground-secondary">잘못된 접근입니다</p>
          <a href="/mock-exam" className="mt-2 text-sm text-primary-500 hover:underline">
            모의고사 페이지로 돌아가기
          </a>
        </main>
      </>
    );
  }

  // 서버에서 병렬 데이터 조회 (에러 시 graceful 처리)
  const [sessionResult, historyResult] = await Promise.all([
    getSession({ session_id: sessionId }).catch(() => ({ data: undefined })),
    getHistory().catch(() => ({ data: undefined })),
  ]);

  // 이전 결과 (비교용) — 현재 세션 제외한 가장 최근 완료 세션
  const completed = (historyResult?.data || []).filter(
    (h) => h.status === "completed" && h.final_level && h.session_id !== sessionId,
  );
  const previousResult = completed[0] || null;

  return (
    <>
      <ImmersiveHeader title="나의 모의고사" backHref="/mock-exam?tab=history" />
      <main className="flex h-0 min-h-0 flex-grow flex-col md:h-auto md:flex-1">
        <ResultPageContent
          sessionId={sessionId}
          initialData={sessionResult?.data || undefined}
          previousResult={previousResult}
          initialTab={tab}
        />
      </main>
    </>
  );
}
