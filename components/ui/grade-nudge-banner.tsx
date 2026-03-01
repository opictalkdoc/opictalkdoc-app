"use client";

import { useState } from "react";
import { Target, X } from "lucide-react";
import { GradeSettingModal } from "./grade-setting-modal";

type Props = {
  currentGrade: string;
  targetGrade: string;
};

export function GradeNudgeBanner({ currentGrade, targetGrade }: Props) {
  const [dismissed, setDismissed] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // 이미 둘 다 설정되어 있으면 표시하지 않음
  if (currentGrade && targetGrade) return null;
  // 사용자가 이번 세션에서 닫았으면 표시하지 않음
  if (dismissed) return null;

  return (
    <>
      <div className="mx-auto w-full max-w-6xl px-4 pt-4 sm:px-6">
        <div className="flex items-center gap-3 rounded-xl border border-primary-200 bg-primary-50/60 px-4 py-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-100">
            <Target size={16} className="text-primary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">
              OPIc 등급을 설정해 주세요
            </p>
            <p className="mt-0.5 text-xs text-foreground-secondary">
              등급에 맞는 스크립트 생성, 모의고사 출제 등에 활용됩니다
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="shrink-0 rounded-lg bg-primary-500 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-600"
          >
            설정하기
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="shrink-0 p-1 text-foreground-muted transition-colors hover:text-foreground-secondary"
            aria-label="닫기"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {showModal && (
        <GradeSettingModal
          initialCurrentGrade={currentGrade}
          initialTargetGrade={targetGrade}
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false);
            // 페이지 새로고침으로 서버 데이터 반영
            window.location.reload();
          }}
        />
      )}
    </>
  );
}
