import { Suspense } from "react";
import { TutoringV2Content } from "@/components/tutoring/tutoring-v2-content";
import { getDiagnosisV2 } from "@/lib/actions/tutoring-v2";

export const metadata = {
  title: "튜터링 | 오픽톡닥",
};

// 서버에서 사전 조회 — 진단 데이터 초기 로드
async function TutoringLoader() {
  const diagnosisResult = await getDiagnosisV2().catch(() => ({
    data: undefined,
    error: undefined,
  }));

  return (
    <TutoringV2Content
      initialDiagnosis={diagnosisResult?.data ?? null}
      initialError={diagnosisResult?.error ?? null}
    />
  );
}

// 인증은 미들웨어에서 처리
export default function TutoringPage() {
  return (
    <div className="pb-8 pt-1 sm:pt-2 lg:pt-0">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">
          튜터링
        </h1>
        <p className="mt-0.5 text-sm text-foreground-secondary sm:mt-1 sm:text-base">
          모의고사 결과를 바탕으로 약점을 진단하고 맞춤 훈련을 받으세요.
        </p>
      </div>
      <Suspense
        fallback={
          <div className="flex justify-center py-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
          </div>
        }
      >
        <TutoringLoader />
      </Suspense>
    </div>
  );
}
