import { Suspense } from "react";
import { ImmersiveHeader } from "@/components/layout/immersive-header";
import { TrainingSessionWrapper } from "./training-wrapper";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "AI 튜터링 훈련 | 오픽톡닥",
};

function LoadingFallback() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3">
      <Loader2 size={32} className="animate-spin text-primary-500" />
      <p className="text-sm text-foreground-secondary">로딩 중...</p>
    </div>
  );
}

export default function TutoringTrainingPage({
  searchParams,
}: {
  searchParams: Promise<{ prescription_id?: string }>;
}) {
  return (
    <>
      <ImmersiveHeader title="AI 튜터링" backHref="/tutoring" />
      <Suspense fallback={<LoadingFallback />}>
        <TrainingSessionWrapper searchParamsPromise={searchParams} />
      </Suspense>
    </>
  );
}
