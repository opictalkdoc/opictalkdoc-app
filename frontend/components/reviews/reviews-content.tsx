"use client";

import { useState } from "react";
import {
  BarChart3,
  Send,
  MessageSquare,
  TrendingUp,
  FileText,
  Users,
  ChevronRight,
  Info,
} from "lucide-react";

/* ── 상수 ── */

const tabs = [
  { id: "frequency", label: "빈도 분석", icon: BarChart3 },
  { id: "submit", label: "후기 제출", icon: Send },
  { id: "list", label: "시험 후기", icon: MessageSquare },
] as const;

type TabId = (typeof tabs)[number]["id"];

/* ── 메인 컴포넌트 ── */

export function ReviewsContent() {
  const [activeTab, setActiveTab] = useState<TabId>("frequency");

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
      {activeTab === "frequency" && <FrequencyTab />}
      {activeTab === "submit" && <SubmitTab />}
      {activeTab === "list" && <ListTab />}
    </div>
  );
}

/* ── 빈도 분석 탭 ── */

function FrequencyTab() {
  return (
    <div className="space-y-6">
      {/* 안내 배너 */}
      <div className="flex items-start gap-3 rounded-[var(--radius-xl)] border border-primary-200 bg-primary-50/50 p-4">
        <Info size={18} className="mt-0.5 shrink-0 text-primary-500" />
        <div>
          <p className="text-sm font-medium text-foreground">
            출제 빈도 분석이란?
          </p>
          <p className="mt-1 text-sm text-foreground-secondary">
            실제 시험 응시자들의 후기를 분석하여, 어떤 주제가 자주 출제되는지
            빈도순으로 보여줍니다. 높은 빈도의 주제부터 준비하면 효율적입니다.
          </p>
        </div>
      </div>

      {/* 통계 요약 카드 */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-5">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-lg)] bg-primary-50 text-primary-500">
              <FileText size={18} />
            </div>
            <p className="text-sm text-foreground-secondary">총 후기 수</p>
          </div>
          <p className="mt-3 text-2xl font-bold text-foreground">—</p>
          <p className="mt-0.5 text-xs text-foreground-muted">데이터 수집 중</p>
        </div>
        <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-5">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-lg)] bg-secondary-50 text-secondary-600">
              <TrendingUp size={18} />
            </div>
            <p className="text-sm text-foreground-secondary">분석 주제 수</p>
          </div>
          <p className="mt-3 text-2xl font-bold text-foreground">—</p>
          <p className="mt-0.5 text-xs text-foreground-muted">데이터 수집 중</p>
        </div>
        <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-5">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-lg)] bg-accent-50 text-accent-500">
              <Users size={18} />
            </div>
            <p className="text-sm text-foreground-secondary">참여 응시자</p>
          </div>
          <p className="mt-3 text-2xl font-bold text-foreground">—</p>
          <p className="mt-0.5 text-xs text-foreground-muted">데이터 수집 중</p>
        </div>
      </div>

      {/* 빈도 분석 결과 플레이스홀더 */}
      <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-6">
        <h3 className="font-semibold text-foreground">카테고리별 출제 빈도</h3>
        <p className="mt-1 text-sm text-foreground-secondary">
          일반 질문 / 롤플레이 / 어드밴스 카테고리별 출제 빈도를 분석합니다
        </p>
        <div className="mt-8 flex flex-col items-center py-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-secondary">
            <BarChart3 size={24} className="text-foreground-muted" />
          </div>
          <p className="mt-3 text-sm font-medium text-foreground-secondary">
            아직 분석 데이터가 없습니다
          </p>
          <p className="mt-1 text-xs text-foreground-muted">
            시험 후기가 제출되면 빈도 분석 결과가 표시됩니다
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── 후기 제출 탭 ── */

function SubmitTab() {
  return (
    <div className="space-y-6">
      {/* 제출 가이드 */}
      <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-6">
        <h3 className="font-semibold text-foreground">시험 후기 제출하기</h3>
        <p className="mt-1 text-sm text-foreground-secondary">
          OPIc 시험을 본 후 어떤 질문이 나왔는지 공유해 주세요.
          모두의 데이터가 더 정확한 빈도 분석을 만듭니다.
        </p>

        {/* 3단계 안내 */}
        <div className="mt-6 space-y-4">
          {[
            {
              step: 1,
              title: "기본 정보",
              desc: "시험 날짜, 난이도, 서베이 선택 항목을 입력합니다",
            },
            {
              step: 2,
              title: "출제 질문 입력",
              desc: "2~15번 문항에 어떤 질문이 나왔는지 선택합니다",
            },
            {
              step: 3,
              title: "후기 작성",
              desc: "시험 후기와 체감 난이도를 남깁니다",
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
          <button
            disabled
            className="inline-flex h-10 items-center justify-center gap-2 rounded-[var(--radius-lg)] bg-primary-500 px-5 text-sm font-medium text-white opacity-50"
          >
            <Send size={16} />
            후기 제출 시작하기
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px]">
              준비 중
            </span>
          </button>
        </div>
      </div>

      {/* 내 제출 이력 */}
      <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-6">
        <h3 className="font-semibold text-foreground">내 제출 이력</h3>
        <div className="mt-6 flex flex-col items-center py-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-secondary">
            <Send size={24} className="text-foreground-muted" />
          </div>
          <p className="mt-3 text-sm font-medium text-foreground-secondary">
            아직 제출한 후기가 없습니다
          </p>
          <p className="mt-1 text-xs text-foreground-muted">
            시험 후기를 제출하면 여기에 이력이 표시됩니다
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── 시험 후기 탭 ── */

function ListTab() {
  return (
    <div className="space-y-6">
      {/* 필터 영역 */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          disabled
          className="flex h-9 rounded-[var(--radius-md)] border border-border bg-surface px-3 text-sm text-foreground-muted"
        >
          <option>전체 연도</option>
        </select>
        <select
          disabled
          className="flex h-9 rounded-[var(--radius-md)] border border-border bg-surface px-3 text-sm text-foreground-muted"
        >
          <option>전체 난이도</option>
        </select>
        <select
          disabled
          className="flex h-9 rounded-[var(--radius-md)] border border-border bg-surface px-3 text-sm text-foreground-muted"
        >
          <option>최신순</option>
        </select>
      </div>

      {/* 후기 목록 플레이스홀더 */}
      <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-6">
        <div className="flex flex-col items-center py-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-secondary">
            <MessageSquare size={24} className="text-foreground-muted" />
          </div>
          <p className="mt-3 text-sm font-medium text-foreground-secondary">
            아직 등록된 시험 후기가 없습니다
          </p>
          <p className="mt-1 text-xs text-foreground-muted">
            후기가 등록되면 여기에서 확인할 수 있습니다
          </p>
        </div>
      </div>

      {/* 후기 작성 유도 */}
      <div className="rounded-[var(--radius-xl)] border border-primary-200 bg-gradient-to-br from-primary-50 to-primary-100/50 p-5">
        <p className="text-sm font-semibold text-primary-700">
          시험을 보셨나요?
        </p>
        <p className="mt-1 text-sm text-primary-600/80">
          후기를 공유하면 모두의 빈도 분석 정확도가 올라갑니다.
          &quot;후기 제출&quot; 탭에서 간단하게 제출해 보세요.
        </p>
      </div>
    </div>
  );
}
