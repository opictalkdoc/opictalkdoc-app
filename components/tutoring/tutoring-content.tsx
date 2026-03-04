"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Stethoscope,
  ClipboardCheck,
  Dumbbell,
  ArrowRight,
  Info,
  ChevronDown,
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
      {activeTab === "diagnosis" && <DiagnosisTab />}
      {activeTab === "prescription" && <PrescriptionTab />}
      {activeTab === "training" && <TrainingTab />}
    </div>
  );
}

/* ── 진단 탭 ── */

function DiagnosisTab() {
  const [bannerOpen, setBannerOpen] = useState(false);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 안내 배너 (접이식) */}
      <button
        onClick={() => setBannerOpen(!bannerOpen)}
        className="flex w-full items-start gap-2.5 rounded-[var(--radius-xl)] border border-primary-200 bg-primary-50/50 p-3 text-left sm:gap-3 sm:p-4"
      >
        <Info size={18} className="shrink-0 text-primary-500" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">자동 진단이란?</p>
          {bannerOpen && (
            <p className="mt-0.5 text-xs text-foreground-secondary sm:mt-1 sm:text-sm">
              모의고사 결과를 기반으로 발음, 유창성, 문법, 어휘, 답변 구조
              등을 종합 진단하여 약점을 정확히 파악합니다.
            </p>
          )}
        </div>
        <ChevronDown
          size={16}
          className={`shrink-0 text-primary-400 transition-transform ${bannerOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* 플레이스홀더 */}
      <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-4 sm:p-6">
        <h3 className="text-sm font-semibold text-foreground sm:text-base">나의 진단 결과</h3>
        <div className="mt-4 flex flex-col items-center py-6 text-center sm:mt-6 sm:py-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-secondary">
            <Stethoscope size={24} className="text-foreground-muted" />
          </div>
          <p className="mt-3 text-sm font-medium text-foreground-secondary">
            아직 진단 결과가 없습니다
          </p>
          <p className="mt-1 text-xs text-foreground-muted">
            모의고사를 응시하면 자동으로 진단이 시작됩니다
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── 처방 탭 ── */

function PrescriptionTab() {
  const [bannerOpen, setBannerOpen] = useState(false);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 안내 배너 (접이식) */}
      <button
        onClick={() => setBannerOpen(!bannerOpen)}
        className="flex w-full items-start gap-2.5 rounded-[var(--radius-xl)] border border-primary-200 bg-primary-50/50 p-3 text-left sm:gap-3 sm:p-4"
      >
        <Info size={18} className="shrink-0 text-primary-500" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">맞춤 처방이란?</p>
          {bannerOpen && (
            <p className="mt-0.5 text-xs text-foreground-secondary sm:mt-1 sm:text-sm">
              진단 결과를 기반으로 약점 영역에 맞는 학습 처방이 자동으로 생성됩니다.
            </p>
          )}
        </div>
        <ChevronDown
          size={16}
          className={`shrink-0 text-primary-400 transition-transform ${bannerOpen ? "rotate-180" : ""}`}
        />
      </button>

      <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-4 sm:p-6">
        <h3 className="text-sm font-semibold text-foreground sm:text-base">맞춤 처방</h3>
        <p className="mt-0.5 text-xs text-foreground-secondary sm:mt-1 sm:text-sm">
          진단 결과를 기반으로 맞춤 학습 처방을 제공합니다.
        </p>
        <div className="mt-4 flex flex-col items-center py-6 text-center sm:mt-6 sm:py-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-secondary">
            <ClipboardCheck size={24} className="text-foreground-muted" />
          </div>
          <p className="mt-3 text-sm font-medium text-foreground-secondary">
            아직 처방 내역이 없습니다
          </p>
          <p className="mt-1 text-xs text-foreground-muted">
            진단이 완료되면 맞춤 처방이 자동 생성됩니다
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── 훈련 탭 ── */

function TrainingTab() {
  const [bannerOpen, setBannerOpen] = useState(false);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 안내 배너 (접이식) */}
      <button
        onClick={() => setBannerOpen(!bannerOpen)}
        className="flex w-full items-start gap-2.5 rounded-[var(--radius-xl)] border border-primary-200 bg-primary-50/50 p-3 text-left sm:gap-3 sm:p-4"
      >
        <Info size={18} className="shrink-0 text-primary-500" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">집중 훈련이란?</p>
          {bannerOpen && (
            <p className="mt-0.5 text-xs text-foreground-secondary sm:mt-1 sm:text-sm">
              처방에 따라 약점을 집중 훈련합니다. 실시간 피드백으로 효과적으로 개선합니다.
            </p>
          )}
        </div>
        <ChevronDown
          size={16}
          className={`shrink-0 text-primary-400 transition-transform ${bannerOpen ? "rotate-180" : ""}`}
        />
      </button>

      <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-4 sm:p-6">
        <h3 className="text-sm font-semibold text-foreground sm:text-base">튜터링 훈련</h3>
        <p className="mt-0.5 text-xs text-foreground-secondary sm:mt-1 sm:text-sm">
          처방에 따라 약점을 집중 훈련합니다. 실시간 피드백으로 효과적으로 개선합니다.
        </p>

        <div className="mt-4 flex flex-col items-center py-6 text-center sm:mt-6 sm:py-8">
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
            className="mt-4 flex h-9 w-full items-center justify-center gap-2 rounded-[var(--radius-lg)] bg-primary-500 px-4 text-sm font-medium text-white transition-colors hover:bg-primary-600 sm:inline-flex sm:w-auto"
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
