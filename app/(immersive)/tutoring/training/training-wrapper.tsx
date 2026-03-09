"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { TrainingSession } from "@/components/tutoring/training-session";
import { AlertTriangle } from "lucide-react";

export function TrainingSessionWrapper({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<{ prescription_id?: string }>;
}) {
  const searchParams = use(searchParamsPromise);
  const router = useRouter();
  const prescriptionId = searchParams.prescription_id;

  if (!prescriptionId) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4">
        <AlertTriangle size={32} className="text-amber-400" />
        <p className="text-sm text-foreground-secondary">
          처방 과제 정보가 없습니다
        </p>
        <button
          onClick={() => router.push("/tutoring")}
          className="mt-2 rounded-[var(--radius-lg)] border border-border px-4 py-2 text-sm"
        >
          돌아가기
        </button>
      </div>
    );
  }

  return <TrainingSession prescriptionId={prescriptionId} />;
}
