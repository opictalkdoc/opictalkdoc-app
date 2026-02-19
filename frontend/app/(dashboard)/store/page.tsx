import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import {
  Check,
  Crown,
  Zap,
  ClipboardList,
  FileText,
  ArrowRight,
  ShoppingCart,
  Package,
} from "lucide-react";

export const metadata = {
  title: "Store | 오픽톡닥",
  description: "오픽톡닥 플랜 구매 및 횟수권 스토어",
};

/* ── 데이터 ── */

const plans = [
  {
    name: "체험",
    price: "0",
    period: "",
    description: "OPIc이 어떤 시험인지 경험해 보세요",
    sub: "",
    features: [
      "샘플 모의고사 1회 (고정문제)",
      "AI 진단 · 튜터링 무료",
      "체화 · 쉐도잉 훈련 무제한",
    ],
    cta: "현재 이용 중",
    current: true,
    highlight: false,
  },
  {
    name: "베이직",
    price: "19,900",
    period: " / 3회권",
    description: "본격적인 실전 감각을 키우세요",
    sub: "1개월 이용",
    features: [
      "실전 모의고사 3회",
      "스크립트 패키지 생성 30회",
      "AI 진단 · 튜터링 무료",
      "체화 · 쉐도잉 훈련 무제한",
      "성적 진단 리포트",
    ],
    cta: "구매하기",
    current: false,
    highlight: true,
  },
  {
    name: "프리미엄",
    price: "49,900",
    period: " / 10회권",
    description: "목표 등급 달성을 위한 완벽 준비",
    sub: "2개월 이용",
    features: [
      "실전 모의고사 10회",
      "스크립트 패키지 생성 100회",
      "AI 진단 · 튜터링 무료",
      "체화 · 쉐도잉 훈련 무제한",
      "성장 데이터 리포트",
    ],
    cta: "구매하기",
    current: false,
    highlight: false,
  },
];

const addons = [
  {
    icon: ClipboardList,
    iconBg: "bg-secondary-50 text-secondary-600",
    name: "모의고사 횟수권",
    description: "실전 모의고사 1회 단위로 구매",
    price: "7,900",
    unit: "1회",
  },
  {
    icon: FileText,
    iconBg: "bg-primary-50 text-primary-500",
    name: "스크립트 패키지 횟수권",
    description: "스크립트 패키지 생성 10회 단위로 구매",
    price: "3,900",
    unit: "10회",
  },
];

/* ── 페이지 ── */

export default async function StorePage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="pb-8 pt-2 lg:pt-0">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Store</h1>
        <p className="mt-1 text-foreground-secondary">
          플랜을 업그레이드하거나 필요한 만큼 횟수권을 구매하세요.
        </p>
      </div>

      {/* 현재 플랜 */}
      <div className="mb-8 flex items-center gap-3 rounded-[var(--radius-xl)] border border-primary-200 bg-primary-50/50 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)] bg-primary-100">
          <Crown size={20} className="text-primary-600" />
        </div>
        <div>
          <p className="text-sm text-foreground-secondary">현재 플랜</p>
          <p className="font-semibold text-foreground">
            체험 <span className="text-sm font-normal text-foreground-muted">무료</span>
          </p>
        </div>
      </div>

      {/* 플랜 카드 */}
      <div className="mb-12">
        <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-foreground">
          <Package size={20} className="text-primary-500" />
          플랜
        </h2>
        <div className="grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-[var(--radius-xl)] border p-5 transition-shadow hover:shadow-lg ${
                plan.highlight
                  ? "border-primary-500 shadow-md"
                  : plan.current
                    ? "border-primary-200 bg-primary-50/30"
                    : "border-border bg-surface"
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-[var(--radius-full)] bg-primary-500 px-3 py-0.5 text-xs font-semibold text-white">
                  인기
                </span>
              )}

              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">{plan.name}</h3>
                {plan.current && (
                  <span className="rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-semibold text-primary-600">
                    이용 중
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-foreground-secondary">
                {plan.description}
              </p>
              {plan.sub && (
                <span className="mt-2 inline-flex w-fit rounded-full bg-surface-secondary px-2.5 py-0.5 text-xs font-medium text-foreground-secondary">
                  {plan.sub}
                </span>
              )}

              <div className="mt-4 flex items-baseline gap-1">
                {plan.price === "0" ? (
                  <span className="text-3xl font-bold">무료</span>
                ) : (
                  <>
                    <span className="text-sm text-foreground-secondary">₩</span>
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-sm text-foreground-secondary">
                      {plan.period}
                    </span>
                  </>
                )}
              </div>

              <ul className="mt-4 flex-1 space-y-2">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-sm text-foreground-secondary"
                  >
                    <Check
                      size={16}
                      className="mt-0.5 shrink-0 text-primary-500"
                      strokeWidth={2.5}
                    />
                    {f}
                  </li>
                ))}
              </ul>

              {plan.current ? (
                <span className="mt-5 inline-flex h-10 items-center justify-center rounded-[var(--radius-lg)] border border-primary-200 text-sm font-medium text-primary-600">
                  현재 이용 중
                </span>
              ) : (
                <button
                  disabled
                  className="mt-5 inline-flex h-10 cursor-not-allowed items-center justify-center gap-1.5 rounded-[var(--radius-lg)] bg-primary-500 text-sm font-medium text-white opacity-50"
                >
                  <ShoppingCart size={15} />
                  {plan.cta}
                  <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]">
                    곧 오픈
                  </span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 횟수권 스토어 */}
      <div className="mb-12">
        <h2 className="mb-2 flex items-center gap-2 text-lg font-bold text-foreground">
          <Zap size={20} className="text-secondary-600" />
          횟수권
        </h2>
        <p className="mb-5 text-sm text-foreground-secondary">
          플랜과 별도로 필요한 만큼만 개별 구매할 수 있습니다.
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          {addons.map((addon) => (
            <div
              key={addon.name}
              className="flex flex-col rounded-[var(--radius-xl)] border border-border bg-surface p-5"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)] ${addon.iconBg}`}
                >
                  <addon.icon size={20} />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{addon.name}</p>
                  <p className="text-sm text-foreground-secondary">
                    {addon.description}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-sm text-foreground-secondary">₩</span>
                <span className="text-2xl font-bold">{addon.price}</span>
                <span className="text-sm text-foreground-secondary">
                  {" "}
                  / {addon.unit}
                </span>
              </div>
              <button
                disabled
                className="mt-4 inline-flex h-10 cursor-not-allowed items-center justify-center gap-1.5 rounded-[var(--radius-lg)] border border-border text-sm font-medium text-foreground-muted"
              >
                <ShoppingCart size={15} />
                구매하기
                <span className="rounded-full bg-surface-secondary px-1.5 py-0.5 text-[10px]">
                  곧 오픈
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 안내 */}
      <div className="rounded-[var(--radius-xl)] border border-border bg-surface-secondary p-5 text-center text-sm text-foreground-secondary">
        <p>
          결제 시스템은 현재 준비 중입니다. 플랜 상세 비교는{" "}
          <Link href="/pricing" className="font-medium text-primary-500 hover:underline">
            요금제 안내
          </Link>
          에서 확인하세요.
        </p>
        <p className="mt-1">
          <Link href="/refund" className="text-primary-500 hover:underline">
            환불 규정
          </Link>
          {" · "}
          <Link href="/terms" className="text-primary-500 hover:underline">
            이용약관
          </Link>
        </p>
      </div>
    </div>
  );
}
