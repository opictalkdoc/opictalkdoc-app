"use client";

import { useState } from "react";
import Link from "next/link";
import {
  PenTool,
  FolderOpen,
  Headphones,
  ArrowRight,
  FileText,
  Info,
} from "lucide-react";

/* ── 상수 ── */

const tabs = [
  { id: "create", label: "스크립트 생성", icon: PenTool },
  { id: "my", label: "내 스크립트", icon: FolderOpen },
  { id: "shadowing", label: "쉐도잉 훈련", icon: Headphones },
] as const;

type TabId = (typeof tabs)[number]["id"];

/* ── 메인 컴포넌트 ── */

export function ScriptsContent() {
  const [activeTab, setActiveTab] = useState<TabId>("create");

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
      {activeTab === "create" && <CreateTab />}
      {activeTab === "my" && <MyScriptsTab />}
      {activeTab === "shadowing" && <ShadowingTab />}
    </div>
  );
}

/* ── 스크립트 생성 탭 ── */

function CreateTab() {
  return (
    <div className="space-y-6">
      {/* 안내 배너 */}
      <div className="flex items-start gap-3 rounded-[var(--radius-xl)] border border-primary-200 bg-primary-50/50 p-4">
        <Info size={18} className="mt-0.5 shrink-0 text-primary-500" />
        <div>
          <p className="text-sm font-medium text-foreground">
            AI 맞춤 스크립트란?
          </p>
          <p className="mt-1 text-sm text-foreground-secondary">
            시험 빈출 주제와 내 경험을 조합하여, 자연스럽고 외우기 쉬운 영어
            답변 스크립트를 AI가 생성해 줍니다.
          </p>
        </div>
      </div>

      {/* 생성 과정 안내 */}
      <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-6">
        <h3 className="font-semibold text-foreground">스크립트 생성 과정</h3>
        <p className="mt-1 text-sm text-foreground-secondary">
          3단계로 나만의 맞춤 스크립트를 완성합니다
        </p>

        <div className="mt-6 space-y-4">
          {[
            {
              step: 1,
              title: "주제 선택",
              desc: "빈출 주제 목록에서 준비할 주제를 선택합니다",
            },
            {
              step: 2,
              title: "내 경험 입력",
              desc: "한국어로 내 경험과 키워드를 간단히 입력합니다",
            },
            {
              step: 3,
              title: "AI 스크립트 생성",
              desc: "AI가 자연스러운 영어 답변을 생성합니다",
            },
          ].map((s, i) => (
            <div key={s.step} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-border bg-surface-secondary text-sm font-bold text-foreground-muted">
                  {s.step}
                </div>
                {i < 2 && <div className="mt-1 h-6 w-px bg-border" />}
              </div>
              <div className="pb-1">
                <p className="font-semibold text-foreground">{s.title}</p>
                <p className="text-sm text-foreground-secondary">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-6 border-t border-border pt-4">
          <Link
            href="/scripts/create"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-[var(--radius-lg)] bg-primary-500 px-5 text-sm font-medium text-white transition-colors hover:bg-primary-600"
          >
            <PenTool size={16} />
            스크립트 만들기
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── 내 스크립트 탭 ── */

function MyScriptsTab() {
  return (
    <div className="space-y-6">
      <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-6">
        <h3 className="font-semibold text-foreground">내 스크립트 목록</h3>
        <div className="mt-6 flex flex-col items-center py-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-secondary">
            <FileText size={24} className="text-foreground-muted" />
          </div>
          <p className="mt-3 text-sm font-medium text-foreground-secondary">
            아직 생성한 스크립트가 없습니다
          </p>
          <p className="mt-1 text-xs text-foreground-muted">
            스크립트를 생성하면 여기에서 관리할 수 있습니다
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── 쉐도잉 훈련 탭 ── */

function ShadowingTab() {
  return (
    <div className="space-y-6">
      {/* 안내 */}
      <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-6">
        <h3 className="font-semibold text-foreground">쉐도잉 훈련</h3>
        <p className="mt-1 text-sm text-foreground-secondary">
          생성한 스크립트를 원어민 음성으로 듣고, 따라 읽으며 입에 붙입니다.
        </p>

        <div className="mt-6 flex flex-col items-center py-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-secondary">
            <Headphones size={24} className="text-foreground-muted" />
          </div>
          <p className="mt-3 text-sm font-medium text-foreground-secondary">
            먼저 스크립트를 생성해 주세요
          </p>
          <p className="mt-1 text-xs text-foreground-muted">
            스크립트가 있으면 쉐도잉 훈련을 시작할 수 있습니다
          </p>
          <Link
            href="/scripts/shadowing"
            className="mt-4 inline-flex h-9 items-center gap-2 rounded-[var(--radius-lg)] bg-primary-500 px-4 text-sm font-medium text-white transition-colors hover:bg-primary-600"
          >
            <Headphones size={14} />
            쉐도잉 시작하기
          </Link>
        </div>
      </div>
    </div>
  );
}
