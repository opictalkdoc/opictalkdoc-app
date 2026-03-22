"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Dumbbell,
  Check,
  X,
  Calendar,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { getSessionV2 } from "@/lib/actions/tutoring-v2";

/* ── Props ── */

interface TabTrainingV2Props {
  sessionId: string | null;
}

/* ── 메인 컴포넌트 ── */

export function TabTrainingV2({ sessionId }: TabTrainingV2Props) {
  // 세션 상세 조회 (처방 + 훈련 이력 파악용)
  const { data: sessionDetail, isLoading } = useQuery({
    queryKey: ["tutoring-session", sessionId],
    queryFn: async () => {
      if (!sessionId) return null;
      const result = await getSessionV2(sessionId);
      if (result.error) throw new Error(result.error);
      return result.data!;
    },
    enabled: !!sessionId,
    staleTime: 30 * 1000,
  });

  // 세션 없을 때
  if (!sessionId) {
    return (
      <div className="mx-auto w-full max-w-[860px]">
        <div className="rounded-xl border border-[#d0d7e2] bg-white p-6 text-center shadow-[0_12px_36px_rgba(20,28,38,0.06)] sm:p-10">
          <Dumbbell
            size={48}
            className="mx-auto mb-4 text-foreground-muted"
          />
          <h3 className="mb-2 text-lg font-bold text-foreground">
            훈련 이력이 없습니다
          </h3>
          <p className="text-sm text-foreground-secondary">
            처방 탭에서 훈련을 시작하면 이곳에서 진행 상황을 확인할 수 있습니다.
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

  // 데이터 없음
  if (!sessionDetail) {
    return (
      <div className="mx-auto w-full max-w-[860px]">
        <div className="rounded-xl border border-[#d0d7e2] bg-white p-6 text-center shadow-[0_12px_36px_rgba(20,28,38,0.06)] sm:p-10">
          <Dumbbell
            size={48}
            className="mx-auto mb-4 text-foreground-muted"
          />
          <h3 className="mb-2 text-lg font-bold text-foreground">
            훈련 이력이 없습니다
          </h3>
          <p className="text-sm text-foreground-secondary">
            처방 탭에서 훈련을 시작하면 이곳에서 진행 상황을 확인할 수 있습니다.
          </p>
        </div>
      </div>
    );
  }

  const { prescriptions } = sessionDetail;
  const completedPrescriptions = prescriptions.filter(
    (p) => p.status === "completed",
  );

  // 완료된 훈련이 없을 때
  if (completedPrescriptions.length === 0) {
    return (
      <div className="mx-auto w-full max-w-[860px]">
        <div className="overflow-hidden rounded-xl border border-[#d0d7e2] bg-white shadow-[0_12px_36px_rgba(20,28,38,0.06)]">
          <div className="px-5 py-5 sm:px-10 sm:py-6">
            <h3 className="text-[15px] font-extrabold text-[#2f3644]">
              <span className="mr-1.5 text-[#2449d8]">&bull;</span>
              훈련 현황
            </h3>

            <div className="mt-4 rounded-lg bg-[#f5f7fa] px-4 py-3 text-center">
              <p className="text-[14px] text-[#5f6976]">
                아직 완료된 훈련이 없습니다. 처방 탭에서 첫 번째 훈련을
                시작해보세요.
              </p>
            </div>

            {/* 처방 진행 상태 요약 */}
            <div className="mt-4 space-y-2">
              {prescriptions.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 rounded-lg border border-[#e8ecf0] px-4 py-3"
                >
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${
                      p.status === "completed"
                        ? "bg-green-100 text-green-600"
                        : p.status === "in_progress"
                          ? "bg-primary-100 text-primary-600"
                          : "bg-[#f0f2f5] text-[#8a93a1]"
                    }`}
                  >
                    {p.status === "completed" ? (
                      <Check size={12} />
                    ) : (
                      p.priority
                    )}
                  </div>
                  <span className="flex-1 text-[13px] text-[#2f3644]">
                    {p.drill_code.replace(/_/g, " ")}
                  </span>
                  <span
                    className={`text-[11px] font-bold ${
                      p.status === "completed"
                        ? "text-green-600"
                        : p.status === "in_progress"
                          ? "text-primary-600"
                          : "text-[#8a93a1]"
                    }`}
                  >
                    {p.status === "completed"
                      ? "완료"
                      : p.status === "in_progress"
                        ? "진행 중"
                        : "대기"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 완료된 훈련 이력 카드
  return (
    <div className="mx-auto w-full max-w-[860px] px-0 sm:px-4">
      <div className="overflow-hidden rounded-xl border border-[#d0d7e2] bg-white shadow-[0_12px_36px_rgba(20,28,38,0.06)]">
        <div className="px-5 py-5 sm:px-10 sm:py-6">
          <h3 className="text-[15px] font-extrabold text-[#2f3644]">
            <span className="mr-1.5 text-[#2449d8]">&bull;</span>
            훈련 이력
          </h3>

          <div className="mt-4 space-y-3">
            {prescriptions.map((p) => (
              <div
                key={p.id}
                className={`rounded-xl border p-4 ${
                  p.status === "completed"
                    ? "border-green-200 bg-green-50/30"
                    : p.status === "in_progress"
                      ? "border-primary-200 bg-primary-50/30"
                      : "border-[#e8ecf0] bg-[#fafbfc]"
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* 상태 아이콘 */}
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      p.status === "completed"
                        ? "bg-green-100 text-green-600"
                        : p.status === "in_progress"
                          ? "bg-primary-100 text-primary-600"
                          : "bg-[#f0f2f5] text-[#8a93a1]"
                    }`}
                  >
                    {p.status === "completed" ? (
                      <Check size={16} />
                    ) : p.status === "in_progress" ? (
                      <Dumbbell size={16} />
                    ) : (
                      <span className="text-xs font-bold">{p.priority}</span>
                    )}
                  </div>

                  {/* 드릴 정보 */}
                  <div className="flex-1">
                    <p className="text-[14px] font-bold text-[#2f3644]">
                      {p.drill_code.replace(/_/g, " ")}
                    </p>
                    <p className="text-[12px] text-[#8a93a1]">
                      처방 {p.priority} &middot;{" "}
                      {p.status === "completed"
                        ? "완료"
                        : p.status === "in_progress"
                          ? "진행 중"
                          : "대기"}
                    </p>
                  </div>

                  {/* 날짜 */}
                  <div className="text-right">
                    <p className="text-[12px] text-[#8a93a1]">
                      {new Date(p.created_at).toLocaleDateString("ko-KR", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
