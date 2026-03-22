import { ImmersiveHeader } from "@/components/layout/immersive-header";
import { getTrainingForPrescriptionV2, startTrainingV2 } from "@/lib/actions/tutoring-v2";
import { TrainingSessionV2 } from "@/components/tutoring/training-session-v2";
import { redirect } from "next/navigation";

export const metadata = {
  title: "튜터링 훈련 | 오픽톡닥",
};

interface Props {
  searchParams: Promise<{
    prescription_id?: string;
  }>;
}

export default async function TutoringTrainingPage({ searchParams }: Props) {
  const params = await searchParams;
  const prescriptionId = params.prescription_id;

  if (!prescriptionId) {
    redirect("/tutoring");
  }

  // 1. 기존 훈련 조회
  const result = await getTrainingForPrescriptionV2(prescriptionId);

  if (result.error) {
    return (
      <>
        <ImmersiveHeader title="튜터링 훈련" backHref="/tutoring" />
        <main className="flex h-0 min-h-0 flex-grow flex-col items-center justify-center">
          <p className="text-foreground-secondary">{result.error}</p>
          <a href="/tutoring" className="mt-2 text-sm text-primary-500 hover:underline">
            튜터링 페이지로 돌아가기
          </a>
        </main>
      </>
    );
  }

  // 2. 훈련 세션이 없으면 생성 (startTrainingV2가 전체 데이터를 직접 반환)
  let trainingData = result.data!;

  if (!trainingData.training) {
    const startResult = await startTrainingV2(prescriptionId);
    if (startResult.error || !startResult.data) {
      return (
        <>
          <ImmersiveHeader title="튜터링 훈련" backHref="/tutoring" />
          <main className="flex h-0 min-h-0 flex-grow flex-col items-center justify-center">
            <p className="text-foreground-secondary">{startResult.error ?? "훈련 생성에 실패했습니다"}</p>
            <a href="/tutoring" className="mt-2 text-sm text-primary-500 hover:underline">
              튜터링 페이지로 돌아가기
            </a>
          </main>
        </>
      );
    }
    trainingData = startResult.data;
  }

  return (
    <>
      <ImmersiveHeader title="튜터링 훈련" backHref="/tutoring" />
      <main className="flex h-0 min-h-0 flex-grow flex-col md:h-auto md:flex-1">
        <TrainingSessionV2
          training={trainingData.training!}
          prescription={trainingData.prescription}
          drill={trainingData.drill}
          initialAttempts={trainingData.attempts}
          session={trainingData.session}
        />
      </main>
    </>
  );
}
