"use client";

// 성장 탭: 성장리포트 래퍼 (2회차부터 활성)
import { TrendingUp } from "lucide-react";
import type { MockTestReport } from "@/lib/types/mock-exam";
import { GrowthReport } from "../result/growth-report";

interface GrowthTabProps {
  report: MockTestReport;
}

export function GrowthTab({ report }: GrowthTabProps) {
  // 성장 데이터가 있는지 확인
  const hasGrowth = report.growth_summary || report.growth_comparison || report.growth_analysis;

  if (!hasGrowth) {
    return (
      <div className="rounded-xl border border-border bg-surface p-6 sm:p-8">
        <div className="flex flex-col items-center text-center py-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-secondary">
            <TrendingUp size={24} className="text-foreground-muted" />
          </div>
          <p className="mt-3 text-sm font-medium text-foreground-secondary">
            아직 성장 리포트를 볼 수 없습니다
          </p>
          <p className="mt-1 text-xs text-foreground-muted">
            2회 이상 모의고사를 응시하면 이전과 비교한 성장 분석이 여기에 표시됩니다.
          </p>
        </div>
      </div>
    );
  }

  return <GrowthReport report={report} />;
}
