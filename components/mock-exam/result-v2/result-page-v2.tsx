"use client";

import { useState } from "react";
import { BarChart3, ClipboardCheck, FileText, TrendingUp } from "lucide-react";
import { TabOverviewV2 } from "./tab-overview-v2";
import { TabDiagnosisV2 } from "./tab-diagnosis-v2";
import { TabQuestionsV2 } from "./tab-questions-v2";
import { TabGrowthV2 } from "./tab-growth-v2";

// ── v2 결과 페이지 메인 래퍼 ──

const TABS = [
  { key: "overview", label: "종합 진단", icon: FileText },
  { key: "diagnosis", label: "세부진단", icon: ClipboardCheck },
  { key: "questions", label: "문항별", icon: BarChart3 },
  { key: "growth", label: "성장", icon: TrendingUp },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export function ResultPageV2({ sessionId }: { sessionId: string }) {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* ── 탭 네비게이션 (v1 동일) ── */}
      <div className="shrink-0 border-b border-border bg-surface/80 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl">
          <div className="flex">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex flex-1 items-center justify-center gap-1.5 border-b-2 px-2 py-3 text-xs font-medium transition-colors sm:gap-2 sm:px-4 sm:text-sm ${
                    isActive
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-foreground-muted hover:border-border hover:text-foreground-secondary"
                  }`}
                >
                  <Icon size={14} className="sm:hidden md:block" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 탭 콘텐츠 (스크롤 영역 — relative+absolute 패턴) ── */}
      <div className="relative min-h-0 flex-1">
        <div className="absolute inset-0 overflow-y-auto max-md:[scrollbar-width:none] max-md:[&::-webkit-scrollbar]:hidden">
          {activeTab === "overview" && <TabOverviewV2 />}
          {activeTab === "diagnosis" && <TabDiagnosisV2 />}
          {activeTab === "questions" && <TabQuestionsV2 />}
          {activeTab === "growth" && <TabGrowthV2 />}
        </div>
      </div>
    </div>
  );
}