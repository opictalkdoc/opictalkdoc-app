import { Suspense } from "react";
import { TutoringContent } from "@/components/tutoring/tutoring-content";
import {
  checkTutoringEligibility,
  checkTutoringCredit,
  getDiagnosisData,
  getActiveSession,
} from "@/lib/actions/tutoring";
import { getAuthClaims } from "@/lib/auth";

export const metadata = {
  title: "튜터링 | 오픽톡닥",
};

// 서버에서 사전 병렬 조회
async function TutoringLoader() {
  const [eligibilityResult, creditResult, diagnosisResult, activeResult, claims] =
    await Promise.all([
      checkTutoringEligibility().catch((e) => { console.error("[tutoring] eligibility error:", e); return { data: undefined }; }),
      checkTutoringCredit().catch((e) => { console.error("[tutoring] credit error:", e); return { data: undefined }; }),
      getDiagnosisData().catch((e) => { console.error("[tutoring] diagnosis error:", e); return { data: undefined }; }),
      getActiveSession().catch((e) => { console.error("[tutoring] active error:", e); return { data: undefined }; }),
      getAuthClaims(),
    ]);

  console.log("[tutoring] eligibility:", JSON.stringify(eligibilityResult));

  const targetGrade = (claims?.user_metadata?.target_grade as string) || "";

  return (
    <TutoringContent
      initialEligibility={eligibilityResult?.data ?? undefined}
      initialCredit={creditResult?.data ?? undefined}
      initialDiagnosis={diagnosisResult?.data ?? undefined}
      initialActive={activeResult?.data ?? undefined}
      targetGrade={targetGrade}
    />
  );
}

export default function TutoringPage() {
  return (
    <div className="pb-8 pt-1 sm:pt-2 lg:pt-0">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">튜터링</h1>
        <p className="mt-0.5 text-sm text-foreground-secondary sm:mt-1 sm:text-base">
          모의고사 결과를 분석하여 목표 등급 달성을 위한 맞춤 훈련을 제공합니다.
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
