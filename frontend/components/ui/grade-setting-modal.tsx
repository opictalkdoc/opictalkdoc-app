"use client";

import { useState, useTransition } from "react";
import { Target, X, Check } from "lucide-react";
import { updateGoals } from "@/lib/actions/auth";

const currentGradeOptions = [
  { value: "", label: "선택해 주세요" },
  { value: "none", label: "아직 미응시" },
  { value: "NH", label: "NH (Novice High)" },
  { value: "IL", label: "IL (Intermediate Low)" },
  { value: "IM1", label: "IM1 (Intermediate Mid 1)" },
  { value: "IM2", label: "IM2 (Intermediate Mid 2)" },
  { value: "IM3", label: "IM3 (Intermediate Mid 3)" },
  { value: "IH", label: "IH (Intermediate High)" },
  { value: "AL", label: "AL (Advanced Low)" },
];

const targetGradeOptions = [
  { value: "", label: "선택해 주세요" },
  { value: "IL", label: "IL (Intermediate Low)" },
  { value: "IM1", label: "IM1 (Intermediate Mid 1)" },
  { value: "IM2", label: "IM2 (Intermediate Mid 2)" },
  { value: "IM3", label: "IM3 (Intermediate Mid 3)" },
  { value: "IH", label: "IH (Intermediate High)" },
  { value: "AL", label: "AL (Advanced Low)" },
];

type Props = {
  initialCurrentGrade: string;
  initialTargetGrade: string;
  onClose: () => void;
  onSaved: () => void;
};

export function GradeSettingModal({
  initialCurrentGrade,
  initialTargetGrade,
  onClose,
  onSaved,
}: Props) {
  const [currentGrade, setCurrentGrade] = useState(initialCurrentGrade);
  const [targetGrade, setTargetGrade] = useState(initialTargetGrade);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const canSave = currentGrade !== "" && targetGrade !== "";

  const handleSave = () => {
    if (!canSave) return;
    setError(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.append("currentGrade", currentGrade);
      fd.append("targetGrade", targetGrade);
      // 기존 값 유지를 위해 빈 문자열로 전달 (서버에서 null 처리)
      fd.append("examDate", "");
      fd.append("weeklyGoal", "");
      const result = await updateGoals(fd);
      if (result?.error) {
        setError(result.error);
      } else {
        onSaved();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* 오버레이 */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 모달 카드 */}
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-xl">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50">
              <Target size={18} className="text-primary-500" />
            </div>
            <h2 className="text-lg font-bold text-foreground">등급 설정</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-foreground-muted transition-colors hover:text-foreground-secondary"
          >
            <X size={20} />
          </button>
        </div>

        <p className="mt-3 text-sm text-foreground-secondary">
          등급에 맞는 스크립트 생성, 모의고사 출제 등에 활용됩니다.
        </p>

        {/* 폼 */}
        <div className="mt-6 space-y-5">
          {/* 현재 등급 */}
          <div>
            <label
              htmlFor="modal-current-grade"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              현재 OPIc 등급 <span className="text-accent-500">*</span>
            </label>
            <select
              id="modal-current-grade"
              value={currentGrade}
              onChange={(e) => setCurrentGrade(e.target.value)}
              className="flex h-10 w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            >
              {currentGradeOptions.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>

          {/* 목표 등급 */}
          <div>
            <label
              htmlFor="modal-target-grade"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              목표 OPIc 등급 <span className="text-accent-500">*</span>
            </label>
            <select
              id="modal-target-grade"
              value={targetGrade}
              onChange={(e) => setTargetGrade(e.target.value)}
              className="flex h-10 w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            >
              {targetGradeOptions.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <p className="mt-3 text-xs text-accent-500">{error}</p>
        )}

        {/* 버튼 */}
        <div className="mt-6 flex gap-2">
          <button
            onClick={handleSave}
            disabled={!canSave || isPending}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? (
              "저장 중..."
            ) : (
              <>
                <Check size={16} />
                저장하기
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-secondary"
          >
            나중에
          </button>
        </div>
      </div>
    </div>
  );
}
