"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Stethoscope,
  ClipboardCheck,
  Dumbbell,
  ArrowRight,
  Info,
} from "lucide-react";

/* ── 상수 ── */

const tabs = [
  { id: "diagnosis", label: "진단", icon: Stethoscope },
  { id: "prescription", label: "처방", icon: ClipboardCheck },
  { id: "training", label: "훈련", icon: Dumbbell },
] as const;

type TabId = (typeof tabs)[number]["id"];

/* ── 메인 컴포넌트 ── */

export function TutoringContent() {
  const [activeTab, setActiveTab] = useState<TabId>("diagnosis");

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
      {activeTab === "diagnosis" && <DiagnosisTab />}
      {activeTab === "prescription" && <PrescriptionTab />}
      {activeTab === "training" && <TrainingTab />}
    </div>
  );
}

/* ── 진단 탭 ── */

function DiagnosisTab() {
  return (
    <div className="space-y-6">
      {/* 안내 배너 */}
      <div className="flex items-start gap-3 rounded-[var(--radius-xl)] border border-primary-200 bg-primary-50/50 p-4">
        <Info size={18} className="mt-0.5 shrink-0 text-primary-500" />
        <div>
          <p className="text-sm font-medium text-foreground">AI 진단이란?</p>
          <p className="mt-1 text-sm text-foreground-secondary">
            모의고사 결과를 기반으로 AI가 발음, 유창성, 문법, 어휘, 답변 구조
            등을 종합 진단하여 약점을 정확히 파악합니다.
          </p>
        </div>
      </div>

      {/* 플레이스홀더 */}
      <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-6">
        <h3 className="font-semibold text-foreground">나의 진단 결과</h3>
        <div className="mt-6 flex flex-col items-center py-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-secondary">
            <Stethoscope size={24} className="text-foreground-muted" />
          </div>
          <p className="mt-3 text-sm font-medium text-foreground-secondary">
            아직 진단 결과가 없습니다
          </p>
          <p className="mt-1 text-xs text-foreground-muted">
            모의고사를 응시하면 AI가 자동으로 진단합니다
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── 처방 탭 ── */

function PrescriptionTab() {
  return (
    <div className="space-y-6">
      <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-6">
        <h3 className="font-semibold text-foreground">맞춤 처방</h3>
        <p className="mt-1 text-sm text-foreground-secondary">
          진단 결과를 기반으로 AI가 맞춤 학습 처방을 제공합니다.
        </p>
        <div className="mt-6 flex flex-col items-center py-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-secondary">
            <ClipboardCheck size={24} className="text-foreground-muted" />
          </div>
          <p className="mt-3 text-sm font-medium text-foreground-secondary">
            아직 처방 내역이 없습니다
          </p>
          <p className="mt-1 text-xs text-foreground-muted">
            진단이 완료되면 AI가 맞춤 처방을 생성합니다
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── 훈련 탭 ── */

function TrainingTab() {
  return (
    <div className="space-y-6">
      <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-6">
        <h3 className="font-semibold text-foreground">AI 튜터링 훈련</h3>
        <p className="mt-1 text-sm text-foreground-secondary">
          처방에 따라 약점을 집중 훈련합니다. AI 튜터가 실시간으로 피드백합니다.
        </p>

        <div className="mt-6 flex flex-col items-center py-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-secondary">
            <Dumbbell size={24} className="text-foreground-muted" />
          </div>
          <p className="mt-3 text-sm font-medium text-foreground-secondary">
            먼저 진단과 처방을 받아 주세요
          </p>
          <p className="mt-1 text-xs text-foreground-muted">
            처방이 완료되면 훈련을 시작할 수 있습니다
          </p>
          <Link
            href="/tutoring/training"
            className="mt-4 inline-flex h-9 items-center gap-2 rounded-[var(--radius-lg)] bg-primary-500 px-4 text-sm font-medium text-white transition-colors hover:bg-primary-600"
          >
            <Dumbbell size={14} />
            훈련 시작하기
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
