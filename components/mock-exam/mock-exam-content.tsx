"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Play,
  BarChart3,
  History,
  ArrowRight,
  ClipboardList,
  Info,
} from "lucide-react";

/* ── 상수 ── */

const tabs = [
  { id: "start", label: "응시", icon: Play },
  { id: "results", label: "결과", icon: BarChart3 },
  { id: "history", label: "나의 이력", icon: History },
] as const;

type TabId = (typeof tabs)[number]["id"];

/* ── 메인 컴포넌트 ── */

export function MockExamContent() {
  const [activeTab, setActiveTab] = useState<TabId>("start");

  return (
    <div>
      {/* 탭 네비게이션 */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex min-w-max border-b border-border">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 border-b-2 px-3 py-3 text-sm font-medium transition-colors sm:gap-2 sm:px-4 ${
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
      {activeTab === "start" && <StartTab />}
      {activeTab === "results" && <ResultsTab />}
      {activeTab === "history" && <HistoryTab />}
    </div>
  );
}

/* ── 응시 탭 ── */

function StartTab() {
  return (
    <div className="space-y-6">
      {/* 안내 배너 */}
      <div className="flex items-start gap-3 rounded-[var(--radius-xl)] border border-primary-200 bg-primary-50/50 p-4">
        <Info size={18} className="mt-0.5 shrink-0 text-primary-500" />
        <div>
          <p className="text-sm font-medium text-foreground">
            실전 모의고사란?
          </p>
          <p className="mt-1 text-sm text-foreground-secondary">
            실제 OPIc 시험과 동일한 환경에서 15문제를 풀고, AI가 답변을
            분석하여 예상 등급과 상세 피드백을 제공합니다.
          </p>
        </div>
      </div>

      {/* 모의고사 시작 카드 */}
      <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-6">
        <h3 className="font-semibold text-foreground">모의고사 응시하기</h3>
        <p className="mt-1 text-sm text-foreground-secondary">
          약 40분 소요 · 마이크 사용 · 조용한 환경 권장
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            { label: "문항 수", value: "15문제" },
            { label: "소요 시간", value: "약 40분" },
            { label: "평가 방식", value: "AI 분석" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-[var(--radius-lg)] bg-surface-secondary p-4 text-center"
            >
              <p className="text-xs text-foreground-muted">{item.label}</p>
              <p className="mt-1 text-lg font-bold text-foreground">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-6 border-t border-border pt-4">
          <Link
            href="/mock-exam/session"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-[var(--radius-lg)] bg-primary-500 px-5 text-sm font-medium text-white transition-colors hover:bg-primary-600"
          >
            <Play size={16} />
            모의고사 시작
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── 결과 탭 ── */

function ResultsTab() {
  return (
    <div className="space-y-6">
      <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-6">
        <h3 className="font-semibold text-foreground">모의고사 결과</h3>
        <div className="mt-6 flex flex-col items-center py-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-secondary">
            <BarChart3 size={24} className="text-foreground-muted" />
          </div>
          <p className="mt-3 text-sm font-medium text-foreground-secondary">
            아직 응시한 모의고사가 없습니다
          </p>
          <p className="mt-1 text-xs text-foreground-muted">
            모의고사를 응시하면 AI 평가 결과가 여기에 표시됩니다
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── 나의 이력 탭 ── */

function HistoryTab() {
  return (
    <div className="space-y-6">
      <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-6">
        <h3 className="font-semibold text-foreground">나의 응시 이력</h3>
        <div className="mt-6 flex flex-col items-center py-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-secondary">
            <ClipboardList size={24} className="text-foreground-muted" />
          </div>
          <p className="mt-3 text-sm font-medium text-foreground-secondary">
            아직 응시 이력이 없습니다
          </p>
          <p className="mt-1 text-xs text-foreground-muted">
            모의고사를 응시하면 이력과 성장 그래프가 표시됩니다
          </p>
        </div>
      </div>
    </div>
  );
}
