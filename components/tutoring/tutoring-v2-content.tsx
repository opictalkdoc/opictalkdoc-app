"use client";

import { useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Stethoscope, ClipboardCheck, Dumbbell, Loader2 } from "lucide-react";
import { TabDiagnosisV2 } from "./tab-diagnosis-v2";
import { TabPrescriptionV2 } from "./tab-prescription-v2";
import { TabTrainingV2 } from "./tab-training-v2";
import {
  getDiagnosisV2,
  checkTutoringCreditV2,
  startTutoringV2,
  getSessionV2,
  getPrescriptionsV2,
} from "@/lib/actions/tutoring-v2";
import type { DiagnosisV2Result } from "@/lib/actions/tutoring-v2";
import type { TutoringPrescriptionV2 } from "@/lib/types/tutoring-v2";

/* ── 탭 정의 ── */

const tabs = [
  { id: "diagnosis", label: "진단", icon: Stethoscope },
  { id: "prescription", label: "처방", icon: ClipboardCheck },
  { id: "training", label: "훈련", icon: Dumbbell },
] as const;

type TabId = (typeof tabs)[number]["id"];

/* ── Props ── */

interface TutoringV2ContentProps {
  initialDiagnosis: DiagnosisV2Result | null;
  initialError: string | null;
}

/* ── 메인 컴포넌트 ── */

export function TutoringV2Content({
  initialDiagnosis,
  initialError,
}: TutoringV2ContentProps) {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  // 탭 상태 + URL 동기화
  const tabParam = searchParams.get("tab") as TabId | null;
  const initialTab: TabId =
    tabParam && tabs.some((t) => t.id === tabParam) ? tabParam : "diagnosis";
  const [activeTab, setActiveTabState] = useState<TabId>(initialTab);

  // 활성 세션 ID (초기 로드 시 진단 데이터에서 가져오거나, 튜터링 시작 후 설정)
  const [activeSessionId, setActiveSessionId] = useState<string | null>(
    initialDiagnosis?.activeSessionId ?? null
  );

  const setActiveTab = useCallback((id: TabId) => {
    setActiveTabState(id);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", id);
    window.history.replaceState(null, "", url.toString());
  }, []);

  // 진단 데이터 (useQuery + initialData)
  const { data: diagnosisData, error: diagnosisError } = useQuery({
    queryKey: ["tutoring-diagnosis"],
    queryFn: async () => {
      const result = await getDiagnosisV2();
      if (result.error) throw new Error(result.error);
      return result.data!;
    },
    initialData: initialDiagnosis ?? undefined,
    staleTime: 5 * 60 * 1000,
  });

  // 크레딧 조회
  const { data: creditData } = useQuery({
    queryKey: ["tutoring-credit"],
    queryFn: async () => {
      const result = await checkTutoringCreditV2();
      if (result.error) throw new Error(result.error);
      return result.data!;
    },
    staleTime: 60 * 1000,
  });

  // 처방 조회 (세션 있을 때만)
  const { data: prescriptions, isLoading: prescriptionsLoading } = useQuery({
    queryKey: ["tutoring-prescriptions", activeSessionId],
    queryFn: async () => {
      if (!activeSessionId) return [];
      const result = await getPrescriptionsV2(activeSessionId);
      if (result.error) throw new Error(result.error);
      return result.data!;
    },
    enabled: !!activeSessionId,
    staleTime: 60 * 1000,
  });

  // 튜터링 시작 핸들러
  const [isStarting, setIsStarting] = useState(false);
  const handleStartTutoring = useCallback(async () => {
    if (!diagnosisData) return;
    setIsStarting(true);
    try {
      const result = await startTutoringV2(diagnosisData.latestSessionId);
      if (result.error) {
        alert(result.error);
        return;
      }
      if (result.data) {
        setActiveSessionId(result.data.sessionId);
        // 크레딧 갱신
        queryClient.invalidateQueries({ queryKey: ["tutoring-credit"] });
        // 처방 탭으로 이동
        setActiveTab("prescription");
      }
    } finally {
      setIsStarting(false);
    }
  }, [diagnosisData, queryClient, setActiveTab]);

  // 이미 활성 세션이 있는 경우 세션 ID 설정
  const handleResumeSession = useCallback(
    async (sessionId: string) => {
      setActiveSessionId(sessionId);
      setActiveTab("prescription");
    },
    [setActiveTab],
  );

  const errorMessage =
    initialError || (diagnosisError ? (diagnosisError as Error).message : null);

  return (
    <div>
      {/* 탭 네비게이션 */}
      <div className="mb-4 overflow-x-auto sm:mb-6">
        <div className="flex border-b border-border">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-1 items-center justify-center gap-1.5 border-b-2 px-3 py-3 text-sm font-medium transition-colors sm:min-w-[120px] sm:flex-none sm:gap-2 sm:px-4 ${
                  active
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-foreground-muted hover:border-border hover:text-foreground-secondary"
                }`}
              >
                <tab.icon size={16} className="hidden sm:block" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      {activeTab === "diagnosis" && (
        <TabDiagnosisV2
          diagnosisData={diagnosisData ?? null}
          errorMessage={errorMessage}
          creditData={creditData ?? null}
          isStarting={isStarting}
          onStartTutoring={handleStartTutoring}
          onResumeSession={handleResumeSession}
          hasActiveSession={diagnosisData?.hasActiveSession ?? false}
        />
      )}
      {activeTab === "prescription" && (
        <TabPrescriptionV2
          sessionId={activeSessionId}
          prescriptions={prescriptions ?? []}
          isLoading={prescriptionsLoading}
          diagnosisData={diagnosisData ?? null}
        />
      )}
      {activeTab === "training" && (
        <TabTrainingV2 sessionId={activeSessionId} />
      )}
    </div>
  );
}
