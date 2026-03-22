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
    training_id?: string;
  }>;
}

export default async function TutoringTrainingPage({ searchParams }: Props) {
  const params = await searchParams;
  const prescriptionId = params.prescription_id;
  const trainingId = params.training_id;

  // prescription_id도 training_id도 없으면 잘못된 접근
  if (!prescriptionId && !trainingId) {
    redirect("/tutoring");
  }

  // training_id가 있으면 기존 훈련 세션 로드
  // prescription_id만 있으면 새 훈련 세션 시작
  let trainingData;
  let error: string | null = null;

  if (prescriptionId) {
    // 처방 ID로 훈련 데이터 로드 (기존 훈련이 있으면 재사용)
    const result = await getTrainingForPrescriptionV2(prescriptionId);
    if (result.error) {
      error = result.error;
    } else if (result.data) {
      // 훈련 세션이 없으면 새로 생성
      if (!result.data.training) {
        const startResult = await startTrainingV2(prescriptionId);
        if (startResult.error) {
          error = startResult.error;
        } else if (startResult.data) {
          // 훈련 세션 생성 후 다시 로드
          const reloadResult = await getTrainingForPrescriptionV2(prescriptionId);
          if (reloadResult.error) {
            error = reloadResult.error;
          } else {
            trainingData = reloadResult.data;
          }
        }
      } else {
        trainingData = result.data;
      }
    }
  }

  return (
    <>
      <ImmersiveHeader title="튜터링 훈련" backHref="/tutoring" />
      <main className="flex h-0 min-h-0 flex-grow flex-col md:h-auto md:flex-1">
        {error ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <p className="text-foreground-secondary">{error}</p>
              <a
                href="/tutoring"
                className="mt-2 inline-block text-sm text-primary-500 hover:underline"
              >
                튜터링 페이지로 돌아가기
              </a>
            </div>
          </div>
        ) : trainingData ? (
          <TrainingSessionV2
            training={trainingData.training!}
            prescription={trainingData.prescription}
            drill={trainingData.drill}
            initialAttempts={trainingData.attempts}
            session={trainingData.session}
          />
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-foreground-secondary">로딩 중...</p>
          </div>
        )}
      </main>
    </>
  );
}
