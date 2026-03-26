import { Suspense } from "react";
import { ImmersiveHeader } from "@/components/layout/immersive-header";
import { ReviewWizard } from "@/components/reviews/submit/review-wizard";
import { getTopicsByCategory } from "@/lib/queries/master-questions";

export const metadata = {
  title: "후기 제출 | 하루오픽",
};

export default async function ReviewSubmitPage() {
  // 서버에서 3개 카테고리 주제 목록을 병렬 사전 조회
  // → 미들웨어가 이미 세션을 갱신한 상태이므로 실패하지 않음
  // → initialData로 전달하면 클라이언트에서 Server Action 재호출 불필요
  const [topicsGeneral, topicsRoleplay, topicsAdvance] = await Promise.all([
    getTopicsByCategory("일반"),
    getTopicsByCategory("롤플레이"),
    getTopicsByCategory("어드밴스"),
  ]);

  const initialTopics = {
    "일반": topicsGeneral,
    "롤플레이": topicsRoleplay,
    "어드밴스": topicsAdvance,
  };

  return (
    <>
      <ImmersiveHeader title="후기 제출" backHref="/reviews" />

      <main className="flex h-0 min-h-0 flex-grow flex-col md:h-auto md:flex-1">
        <Suspense
          fallback={
            <div className="flex flex-1 items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
            </div>
          }
        >
          <ReviewWizard initialTopics={initialTopics} />
        </Suspense>
      </main>
    </>
  );
}
