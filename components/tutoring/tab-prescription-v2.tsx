"use client";

import { useRouter } from "next/navigation";
import {
  ClipboardCheck,
  ChevronRight,
  Play,
  Check,
  Lock,
  AlertCircle,
  ArrowRight,
  Loader2,
  MessageCircle,
  Lightbulb,
} from "lucide-react";
import {
  APPROACH_LABELS,
  CATEGORY_LABELS,
  type TutoringPrescriptionV2,
  type PrescriptionStatus,
} from "@/lib/types/tutoring-v2";
import type { DiagnosisV2Result } from "@/lib/actions/tutoring-v2";

/* ── Props ── */

interface TabPrescriptionV2Props {
  sessionId: string | null;
  prescriptions: TutoringPrescriptionV2[];
  isLoading: boolean;
  diagnosisData: DiagnosisV2Result | null;
}

/* ── 진단서 스타일 공통 ── */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[15px] font-extrabold text-[#2f3644]">
      <span className="mr-1.5 text-[#2449d8]">&bull;</span>
      {children}
    </h3>
  );
}

function SectionDivider() {
  return <div className="border-b border-[#d0d7e2]" />;
}

/* ── 상태 배지 ── */

function StatusBadge({ status }: { status: PrescriptionStatus }) {
  const config: Record<
    PrescriptionStatus,
    { label: string; className: string }
  > = {
    pending: {
      label: "대기",
      className: "bg-[#f0f2f5] text-[#5f6976]",
    },
    in_progress: {
      label: "진행 중",
      className: "bg-primary-50 text-primary-700",
    },
    completed: {
      label: "완료",
      className: "bg-green-50 text-green-700",
    },
  };

  const { label, className } = config[status];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-bold ${className}`}
    >
      {status === "completed" && <Check size={10} />}
      {status === "in_progress" && (
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary-500" />
      )}
      {label}
    </span>
  );
}

/* ── 처방 카드 ── */

function PrescriptionCard({
  prescription,
  bottleneck,
  isLocked,
  onStart,
}: {
  prescription: TutoringPrescriptionV2;
  bottleneck: {
    drill_code: string;
    category?: string;
    approach?: string;
  } | null;
  isLocked: boolean;
  onStart: () => void;
}) {
  const prescData = prescription.prescription_data;

  // 드릴 코드에서 카테고리/접근법 추출 (병목 데이터 또는 기본값)
  const categoryLabel = bottleneck?.category
    ? CATEGORY_LABELS[bottleneck.category as keyof typeof CATEGORY_LABELS] ?? bottleneck.category
    : "일반";
  const approachLabel = bottleneck?.approach
    ? APPROACH_LABELS[bottleneck.approach as keyof typeof APPROACH_LABELS] ?? bottleneck.approach
    : "";

  // 순위별 컬러
  const priorityColors: Record<number, string> = {
    1: "bg-primary-500 text-white",
    2: "bg-secondary-500 text-white",
    3: "bg-accent-500 text-white",
  };
  const badgeColor =
    priorityColors[prescription.priority] ?? priorityColors[3];

  return (
    <div
      className={`rounded-xl border bg-white transition-all ${
        isLocked
          ? "border-[#e8ecf0] opacity-60"
          : "border-[#d0d7e2] shadow-[0_4px_12px_rgba(20,28,38,0.04)]"
      }`}
    >
      <div className="px-5 py-5 sm:px-6">
        {/* 헤더: 순위 + 드릴 이름 + 상태 */}
        <div className="mb-4 flex items-center gap-2.5">
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${badgeColor}`}
          >
            {prescription.priority}
          </span>
          <div className="flex-1">
            <span className="text-[15px] font-bold text-[#2f3644]">
              {prescription.drill_code.replace(/_/g, " ")}
            </span>
            <div className="mt-0.5 flex flex-wrap gap-1.5">
              <span className="rounded bg-[#f0f2f5] px-1.5 py-0.5 text-[11px] font-medium text-[#5f6976]">
                {categoryLabel}
              </span>
              {approachLabel && (
                <span className="rounded bg-[#eef0ff] px-1.5 py-0.5 text-[11px] font-medium text-[#2449d8]">
                  {approachLabel}
                </span>
              )}
            </div>
          </div>
          <StatusBadge status={prescription.status} />
        </div>

        {/* GPT 처방 데이터가 있을 때 상세 표시 */}
        {prescData && (
          <div className="space-y-3">
            {/* 왜 이게 먼저? */}
            {prescData.prescription_reason && (
              <div>
                <p className="mb-1 text-[13px] font-semibold text-[#2f3644]">
                  왜 이게 {prescription.priority === 1 ? "먼저" : "다음"}?
                </p>
                <div className="rounded-lg bg-[#f5f7fa] px-3 py-2">
                  <p className="text-[13px] leading-[1.8] text-[#5f6976]">
                    {prescData.prescription_reason}
                  </p>
                </div>
              </div>
            )}

            {/* 뭘 고칠까 */}
            {prescData.what_to_fix && (
              <div>
                <p className="mb-1 text-[13px] font-semibold text-[#2f3644]">
                  뭘 고칠까?
                </p>
                <p className="text-[13px] leading-[1.8] text-[#5f6976]">
                  {prescData.what_to_fix}
                </p>
              </div>
            )}

            {/* 어떻게 */}
            {prescData.how_to_fix && (
              <div>
                <p className="mb-1 text-[13px] font-semibold text-[#2f3644]">
                  어떻게?
                </p>
                <p className="text-[13px] leading-[1.8] text-[#5f6976]">
                  {prescData.how_to_fix}
                </p>
              </div>
            )}

            {/* Before / After 예시 */}
            {(prescData.before_example || prescData.after_example) && (
              <div className="grid gap-2 sm:grid-cols-2">
                {prescData.before_example && (
                  <div className="rounded-lg border border-red-100 bg-red-50/50 px-3 py-2">
                    <p className="mb-1 text-[11px] font-bold text-red-500">
                      BEFORE
                    </p>
                    <p className="text-[13px] leading-[1.7] text-red-700">
                      {prescData.before_example}
                    </p>
                  </div>
                )}
                {prescData.after_example && (
                  <div className="rounded-lg border border-green-100 bg-green-50/50 px-3 py-2">
                    <p className="mb-1 text-[11px] font-bold text-green-600">
                      AFTER
                    </p>
                    <p className="text-[13px] leading-[1.7] text-green-700">
                      {prescData.after_example}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 격려 */}
            {prescData.encouragement && (
              <div className="flex items-start gap-2 rounded-lg bg-primary-50/50 px-3 py-2">
                <Lightbulb
                  size={14}
                  className="mt-0.5 shrink-0 text-primary-500"
                />
                <p className="text-[13px] leading-[1.7] text-primary-700">
                  {prescData.encouragement}
                </p>
              </div>
            )}
          </div>
        )}

        {/* 훈련 시작 버튼 */}
        <div className="mt-4">
          {prescription.status === "completed" ? (
            <div className="flex items-center justify-center gap-1.5 rounded-lg bg-green-50 px-4 py-2.5 text-sm font-medium text-green-700">
              <Check size={16} />
              완료됨
            </div>
          ) : isLocked ? (
            <div className="flex items-center justify-center gap-1.5 rounded-lg bg-[#f0f2f5] px-4 py-2.5 text-sm font-medium text-[#8a93a1]">
              <Lock size={14} />
              처방 {prescription.priority - 1} 완료 후 시작
            </div>
          ) : (
            <button
              onClick={onStart}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-600"
            >
              <Play size={14} />
              훈련 시작하기
              <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── 메인 컴포넌트 ── */

export function TabPrescriptionV2({
  sessionId,
  prescriptions,
  isLoading,
  diagnosisData,
}: TabPrescriptionV2Props) {
  const router = useRouter();

  // 세션 없을 때
  if (!sessionId) {
    return (
      <div className="mx-auto w-full max-w-[860px]">
        <div className="rounded-xl border border-[#d0d7e2] bg-white p-6 text-center shadow-[0_12px_36px_rgba(20,28,38,0.06)] sm:p-10">
          <ClipboardCheck
            size={48}
            className="mx-auto mb-4 text-foreground-muted"
          />
          <h3 className="mb-2 text-lg font-bold text-foreground">
            처방이 아직 없습니다
          </h3>
          <p className="text-sm text-foreground-secondary">
            진단 탭에서 튜터링을 시작하면 맞춤 처방을 받을 수 있습니다.
          </p>
        </div>
      </div>
    );
  }

  // 로딩
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 size={24} className="animate-spin text-primary-500" />
      </div>
    );
  }

  // 병목 데이터 매핑 (처방 → 병목 정보 연결)
  const bottleneckMap = new Map<
    string,
    { drill_code: string; category?: string; approach?: string }
  >();
  if (diagnosisData?.bottlenecks) {
    for (const bn of diagnosisData.bottlenecks) {
      bottleneckMap.set(bn.wp_code, {
        drill_code: bn.drill_code,
      });
    }
  }

  // 처방 잠금 판정: 이전 처방이 completed가 아니면 잠금
  const isLocked = (priority: number) => {
    if (priority <= 1) return false;
    const prev = prescriptions.find((p) => p.priority === priority - 1);
    return prev ? prev.status !== "completed" : false;
  };

  return (
    <div className="mx-auto w-full max-w-[860px] px-0 sm:px-4">
      <div className="overflow-hidden rounded-xl border border-[#d0d7e2] bg-white shadow-[0_12px_36px_rgba(20,28,38,0.06)]">
        {/* GPT 처방 요약 */}
        <div className="px-5 py-5 sm:px-10 sm:py-6">
          <SectionTitle>맞춤 처방</SectionTitle>

          <div className="mt-4 rounded-lg bg-[#f5f7fa] px-4 py-3">
            <p className="text-[14px] leading-[1.9] text-[#2f3644]">
              총{" "}
              <strong className="text-[#2449d8]">
                {prescriptions.length}
              </strong>
              개의 맞춤 처방이 준비되었습니다. 순서대로 하나씩 완료해주세요.
            </p>
          </div>

          {/* 진행 상태 요약 */}
          <div className="mt-3 flex items-center gap-3 text-xs text-[#5f6976]">
            <span>
              완료:{" "}
              <strong className="text-green-600">
                {prescriptions.filter((p) => p.status === "completed").length}
              </strong>
            </span>
            <span className="text-[#d0d7e2]">|</span>
            <span>
              진행 중:{" "}
              <strong className="text-primary-600">
                {
                  prescriptions.filter((p) => p.status === "in_progress")
                    .length
                }
              </strong>
            </span>
            <span className="text-[#d0d7e2]">|</span>
            <span>
              대기:{" "}
              <strong>
                {prescriptions.filter((p) => p.status === "pending").length}
              </strong>
            </span>
          </div>
        </div>

        <SectionDivider />

        {/* 처방 카드 목록 */}
        <div className="space-y-0">
          {prescriptions.map((prescription, idx) => (
            <div key={prescription.id}>
              <div className="px-5 py-4 sm:px-10">
                <PrescriptionCard
                  prescription={prescription}
                  bottleneck={bottleneckMap.get(prescription.wp_code) ?? null}
                  isLocked={isLocked(prescription.priority)}
                  onStart={() => {
                    router.push(`/tutoring/training?prescription_id=${prescription.id}`);
                  }}
                />
              </div>
              {idx < prescriptions.length - 1 && <SectionDivider />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
