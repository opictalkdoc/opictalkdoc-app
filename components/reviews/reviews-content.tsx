"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { BarChart3, Send, MessageSquare } from "lucide-react";
import { FrequencyTab } from "./frequency/frequency-tab";
import { SubmitTab } from "./submit/submit-tab";
import { ListTab } from "./list/list-tab";
import type { ReviewStats, FrequencyItem, Submission, SubmissionWithQuestions } from "@/lib/types/reviews";

/* ── 상수 ── */

const tabs = [
  { id: "frequency", label: "빈도 분석", icon: BarChart3 },
  { id: "submit", label: "후기 제출", icon: Send },
  { id: "list", label: "시험 후기", icon: MessageSquare },
] as const;

type TabId = (typeof tabs)[number]["id"];

/* ── 메인 컴포넌트 ── */

interface ReviewsContentProps {
  initialStats: ReviewStats;
  initialFrequency: FrequencyItem[];
  initialSubmissions: Submission[];
  initialPublicReviews: { reviews: Submission[]; total: number };
  initialSubmissionDetails: Record<number, SubmissionWithQuestions>;
  isPaidUser?: boolean;
}

export function ReviewsContent({ initialStats, initialFrequency, initialSubmissions, initialPublicReviews, initialSubmissionDetails, isPaidUser = false }: ReviewsContentProps) {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  // useState로 즉시 탭 전환 + history.replaceState로 URL만 동기화 (Next.js 네비게이션 미발생)
  const tabParam = searchParams.get("tab") as TabId | null;
  const fromCompleted = searchParams.get("completed") === "true";
  const initialTab: TabId = tabParam && tabs.some((t) => t.id === tabParam) ? tabParam : fromCompleted ? "submit" : "frequency";
  const [activeTab, setActiveTabState] = useState<TabId>(initialTab);

  const setActiveTab = useCallback((id: TabId) => {
    setActiveTabState(id);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", id);
    url.searchParams.delete("completed");
    window.history.replaceState(null, "", url.toString());
  }, []);

  // 서버에서 조회한 완료 후기 상세를 캐시에 즉시 세팅 (클라이언트 RTT 0회)
  useEffect(() => {
    for (const [id, detail] of Object.entries(initialSubmissionDetails)) {
      queryClient.setQueryData(["submission-detail", Number(id)], detail);
    }
  }, [initialSubmissionDetails, queryClient]);

  return (
    <div>
      {/* 탭 네비게이션 — 카드형 */}
      <div className="mb-4 flex gap-1 rounded-xl bg-surface-secondary p-1 sm:mb-6">
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-xs font-medium transition-all sm:gap-2 sm:px-3 sm:text-sm ${
                active
                  ? "bg-surface text-foreground shadow-sm"
                  : "text-foreground-secondary hover:text-foreground"
              }`}
            >
              <tab.icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 탭 콘텐츠 */}
      {activeTab === "frequency" && (
        <FrequencyTab initialStats={initialStats} initialFrequency={initialFrequency} isPaidUser={isPaidUser} />
      )}
      {activeTab === "submit" && <SubmitTab initialSubmissions={initialSubmissions} />}
      {activeTab === "list" && <ListTab initialData={initialPublicReviews} />}
    </div>
  );
}
