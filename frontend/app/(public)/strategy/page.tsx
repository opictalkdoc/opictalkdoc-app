import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, X } from "lucide-react";

export const metadata: Metadata = {
  title: "OPIc 전략 가이드 | 오픽톡닥",
  description:
    "OPIc 시험의 60%는 서베이가 결정합니다. 데이터 기반 전략으로 시험의 90% 이상을 커버하는 방법.",
};

/* ── 데이터 ── */

const misconceptions = [
  {
    rough: '"서베이가 중요하다더라"',
    question: "그런데 얼마나?",
    precise: "서베이가 시험의 60%를 결정한다",
    proof: "84건 실제 시험 데이터 증명",
  },
  {
    rough: '"말할 수 있는 주제를 골라라"',
    question: "그런데 어떤 기준으로?",
    precise: "선택해도 안 나오는 항목이 있다",
    proof: "필러 전략: 항목 수만 채우고 출제 0건",
  },
  {
    rough: '"난이도는 5-5가 좋다더라"',
    question: "그런데 왜?",
    precise: "5-5면 상위등급 확률 2~6.5배 증가",
    proof: "롤플레이 1회로 감소, 불리한 유형 회피",
  },
  {
    rough: '"스크립트 외우면 안 된다더라"',
    question: "그런데 대안이 뭔데?",
    precise: "AI가 내 경험으로 스크립트를 만든다",
    proof: "남의 스크립트 암기 → 최고 NM등급 (ACTFL 공식)",
  },
];

const surveyCategories = [
  {
    cat: "1. 직업",
    choice: "일 경험 없음",
    strategy: "출제 차단",
    color: "text-red-500",
    bg: "bg-red-50",
    reason: "직장 콤보가 시험에 안 나옴",
  },
  {
    cat: "2. 학생 여부",
    choice: "아니오",
    strategy: "출제 차단",
    color: "text-red-500",
    bg: "bg-red-50",
    reason: "학교/수업 콤보가 시험에 안 나옴",
  },
  {
    cat: "3. 수강",
    choice: "5년 이상",
    strategy: "출제 차단",
    color: "text-red-500",
    bg: "bg-red-50",
    reason: "수강 관련 꼬리 질문이 안 나옴",
  },
  {
    cat: "4. 거주지",
    choice: "홀로 거주",
    strategy: "범위 축소",
    color: "text-amber-600",
    bg: "bg-amber-50",
    reason: "가족 묘사 문제 제거",
  },
  {
    cat: "5. 여가 활동",
    choice: "영화, 쇼핑, TV, 공연, 콘서트",
    strategy: "핵심 주제",
    color: "text-primary-600",
    bg: "bg-primary-50",
    reason: "항목 수 채우면서 출제 주제 통제",
  },
  {
    cat: "6. 취미/관심사",
    choice: "음악 감상 (단독)",
    strategy: "핵심 주제",
    color: "text-primary-600",
    bg: "bg-primary-50",
    reason: "하나만 고르면 100% 출제",
  },
  {
    cat: "7. 운동",
    choice: "조깅, 걷기, 운동안함",
    strategy: "무해 필러",
    color: "text-gray-500",
    bg: "bg-gray-50",
    reason: "선택해도 시험에 관련 문제 0건",
  },
  {
    cat: "8. 휴가/여행",
    choice: "집휴가, 국내여행, 해외여행",
    strategy: "핵심 주제",
    color: "text-primary-600",
    bg: "bg-primary-50",
    reason: "핵심 학습 주제",
  },
];

const topicFrequency = [
  { rank: 1, topic: "집", rate: "51.7%", tier: "핵심" },
  { rank: 2, topic: "음악", rate: "48.7%", tier: "핵심" },
  { rank: 3, topic: "집에서 보내는 휴가", rate: "20.9%", tier: "핵심" },
  { rank: 4, topic: "국내여행", rate: "20.0%", tier: "핵심" },
  { rank: 5, topic: "MP3 Player 구매", rate: "14.3%", tier: "우선" },
  { rank: 6, topic: "영화", rate: "12.6%", tier: "우선" },
  { rank: 7, topic: "해외여행", rate: "10.4%", tier: "우선" },
  { rank: 8, topic: "여행 계획", rate: "10.4%", tier: "우선" },
  { rank: 9, topic: "쇼핑", rate: "8.3%", tier: "우선" },
  { rank: 10, topic: "공연 예매", rate: "6.5%", tier: "우선" },
];

const modules = [
  {
    emoji: "📊",
    name: "데이터랩",
    desc: "실제 시험 후기를 수집·분석하여 출제 빈도를 파악합니다. 230건+ 데이터로 증명된 전략.",
  },
  {
    emoji: "🤖",
    name: "AI 훈련소",
    desc: "빈도 순으로 정렬된 주제에서, 내 경험 기반 스크립트를 AI가 생성합니다.",
  },
  {
    emoji: "📝",
    name: "모의고사",
    desc: "실제 OPIc과 동일한 5콤보 15문제 구조. 빈출 모드로 실전 출제 경향을 재현합니다.",
  },
  {
    emoji: "🎧",
    name: "쉐도잉",
    desc: "내 스크립트로 발음·억양·유창성을 훈련합니다. 목표 등급에 맞는 발화량 달성.",
  },
];

/* ── 섹션 번호 컴포넌트 ── */
function SectionNum({
  num,
  label,
}: {
  num: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1f1e30] text-sm font-bold text-white">
        {num}
      </span>
      <span className="mt-2 text-xs font-semibold tracking-wider text-[#94A3B8] uppercase">
        {label}
      </span>
    </div>
  );
}

/* ── 페이지 ── */
export default function StrategyPage() {
  return (
    <>
      {/* ━━━ Hero ━━━ */}
      <section className="hero-gradient">
        <div className="mx-auto flex max-w-3xl flex-col items-center px-4 pt-20 pb-16 text-center sm:px-6 sm:pt-28 sm:pb-20">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/50 px-4 py-1.5 text-[13px] font-semibold text-[#1f1e30] backdrop-blur-sm">
            📊 오픽톡닥 데이터 전략
          </span>
          <h1 className="mt-8 font-serif text-3xl font-semibold italic leading-[1.2] tracking-tight text-[#1f1e30] sm:text-5xl">
            OPIc, 정말 알고 계신가요?
          </h1>
          <p className="mt-6 max-w-[520px] text-[17px] leading-[1.7] text-[#52525B]">
            사람들이 OPIc을 어려워하는 근본 원인은 영어 실력이 아닙니다.
            <br className="hidden sm:block" />
            <strong>시험 구조 자체를 모르는 것</strong>입니다.
          </p>
        </div>
      </section>

      {/* ━━━ Section 1: "대충 안다" vs "정확히 안다" ━━━ */}
      <section className="border-b border-[#F4F4F5] bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <SectionNum num="1" label="현실 직시" />
          <h2 className="mt-6 text-center font-serif text-[28px] font-semibold italic leading-[1.3] tracking-tight text-[#1f1e30] sm:text-[36px]">
            &ldquo;대충 안다&rdquo;는
            <br />
            &ldquo;정확히 모른다&rdquo;와 같습니다
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-center text-base leading-relaxed text-[#71717A]">
            유튜브, 블로그, 인강 덕분에 대부분의 응시자가 OPIc에 대해
            &ldquo;대충은&rdquo; 압니다. 하지만 대충 아는 것과 정확히 아는
            것의 차이는 결과를 바꿉니다.
          </p>

          {/* 비교 카드 */}
          <div className="mt-12 space-y-4">
            {misconceptions.map((item) => (
              <div
                key={item.rough}
                className="flex flex-col items-center gap-3 rounded-2xl border border-[#F4F4F5] bg-[#FAFAFA] p-5 sm:flex-row sm:gap-5"
              >
                {/* 대충 아는 것 */}
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-[15px] font-semibold text-[#64748B]">
                    {item.rough}
                  </p>
                  <p className="mt-0.5 text-sm text-[#94A3B8]">
                    {item.question}
                  </p>
                </div>

                <span className="text-lg text-[#CBD5E1]">→</span>

                {/* 정확히 아는 것 */}
                <div className="flex-1 rounded-xl bg-primary-50 p-4 text-center sm:text-left">
                  <p className="text-[15px] font-bold text-primary-700">
                    {item.precise}
                  </p>
                  <p className="mt-0.5 text-sm text-primary-500">
                    {item.proof}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* 등급 분포 */}
          <div className="mt-16 rounded-2xl bg-[#1f1e30] p-8 text-center sm:p-10">
            <p className="text-sm font-medium text-[#94A3B8]">
              실제 OPIc 등급 분포
            </p>
            <p className="mt-3 font-serif text-[48px] font-bold italic text-white sm:text-[56px]">
              68%
            </p>
            <p className="mt-1 text-base text-[#94A3B8]">
              의 응시자가 IM2 이하에 머뭅니다
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[#71717A]">
              대기업 인문계 커트라인 IH 이상은 28%만 달성.
              <br />
              원인은 영어 실력이 아니라, 시험 전략의 부재입니다.
            </p>
          </div>
        </div>
      </section>

      {/* ━━━ Section 2: OPIc 구조 ━━━ */}
      <section className="border-b border-[#F4F4F5] bg-[#FCFBF8] py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <SectionNum num="2" label="시험 구조" />
          <h2 className="mt-6 text-center font-serif text-[28px] font-semibold italic leading-[1.3] tracking-tight text-[#1f1e30] sm:text-[36px]">
            OPIc은 내가 시험 범위를
            <br />
            직접 정하는 시험입니다
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-center text-base leading-relaxed text-[#71717A]">
            OPIc 문제를 결정하는 변수는 딱 두 가지.
            두 변수 모두 수험자 본인이 직접 선택합니다.
          </p>

          {/* 두 변수 */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#F4F4F5] bg-white p-8">
              <span className="text-3xl">📋</span>
              <h3 className="mt-4 text-lg font-bold text-[#1f1e30]">
                변수 1: Background Survey
              </h3>
              <p className="mt-1 text-sm font-semibold text-primary-500">
                &ldquo;무엇이&rdquo; 나오는가 (출제 주제)
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[#71717A]">
                시험 전에 관심사/경험을 선택하는 메뉴판. 선택한 항목에서 3개
                콤보가, 선택하지 않은 항목에서 2개 콤보가 출제됩니다.
              </p>
              <div className="mt-4 rounded-lg bg-primary-50 px-4 py-3">
                <p className="text-center text-2xl font-black text-primary-600">
                  시험의 60%
                </p>
                <p className="mt-1 text-center text-xs text-primary-500">
                  84건 시험 데이터로 증명
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-[#F4F4F5] bg-white p-8">
              <span className="text-3xl">⚡</span>
              <h3 className="mt-4 text-lg font-bold text-[#1f1e30]">
                변수 2: Self-Assessment
              </h3>
              <p className="mt-1 text-sm font-semibold text-amber-600">
                &ldquo;어떻게&rdquo; 나오는가 (문제 유형)
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[#71717A]">
                난이도를 선택하면 문제 유형이 결정됩니다. 5-5를 선택하면
                롤플레이가 1회로 줄고 상위등급 확률이 급상승합니다.
              </p>
              <div className="mt-4 rounded-lg bg-amber-50 px-4 py-3">
                <p className="text-center text-2xl font-black text-amber-600">
                  5-5 추천
                </p>
                <p className="mt-1 text-center text-xs text-amber-500">
                  상위등급 확률 2~6.5배 증가
                </p>
              </div>
            </div>
          </div>

          {/* 다른 시험과 비교 */}
          <div className="mt-10 overflow-hidden rounded-2xl border border-[#F4F4F5] bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#F4F4F5] bg-[#FAFAFA]">
                  <th className="px-6 py-3 text-left font-semibold text-[#1f1e30]">
                    시험
                  </th>
                  <th className="px-6 py-3 text-center font-semibold text-[#1f1e30]">
                    출제 범위 예측
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4F4F5]">
                {["토익", "토플", "아이엘츠"].map((exam) => (
                  <tr key={exam}>
                    <td className="px-6 py-3 text-[#71717A]">{exam}</td>
                    <td className="px-6 py-3 text-center">
                      <span className="inline-flex items-center gap-1 text-red-400">
                        <X className="h-4 w-4" /> 예측 불가
                      </span>
                    </td>
                  </tr>
                ))}
                <tr className="bg-primary-50">
                  <td className="px-6 py-3 font-bold text-primary-700">
                    OPIc
                  </td>
                  <td className="px-6 py-3 text-center">
                    <span className="inline-flex items-center gap-1 font-bold text-primary-600">
                      <Check className="h-4 w-4" /> 60%를 내가 직접 결정
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ━━━ Section 3: 서베이 전략 ━━━ */}
      <section className="border-b border-[#F4F4F5] bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <SectionNum num="3" label="서베이 전략" />
          <h2 className="mt-6 text-center font-serif text-[28px] font-semibold italic leading-[1.3] tracking-tight text-[#1f1e30] sm:text-[36px]">
            서베이를 어떻게 해야 하는가
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-center text-base leading-relaxed text-[#71717A]">
            3가지 원칙: 불필요한 출제를 <strong>차단</strong>하고, 무해한
            항목으로 빈칸을 <strong>채우고</strong>, 핵심 주제에{" "}
            <strong>집중</strong>합니다.
          </p>

          {/* 카테고리별 전략 */}
          <div className="mt-12 space-y-3">
            {surveyCategories.map((item) => (
              <div
                key={item.cat}
                className="flex flex-col gap-3 rounded-xl border border-[#F4F4F5] bg-[#FAFAFA] p-4 sm:flex-row sm:items-center sm:gap-4"
              >
                <div className="min-w-[120px]">
                  <p className="text-sm font-bold text-[#1f1e30]">
                    {item.cat}
                  </p>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#1f1e30]">
                    {item.choice}
                  </p>
                  <p className="mt-0.5 text-xs text-[#94A3B8]">
                    {item.reason}
                  </p>
                </div>
                <span
                  className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${item.bg} ${item.color}`}
                >
                  {item.strategy}
                </span>
              </div>
            ))}
          </div>

          {/* 결과 요약 */}
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
            <div className="rounded-xl bg-[#F1F3F5] px-6 py-4 text-center">
              <p className="text-2xl font-black text-[#64748B]">16개</p>
              <p className="mt-1 text-xs text-[#94A3B8]">선택한 항목</p>
            </div>
            <span className="text-xl text-[#CBD5E1]">→</span>
            <div className="rounded-xl bg-[#F1F3F5] px-6 py-4 text-center">
              <p className="text-2xl font-black text-[#64748B]">6개</p>
              <p className="mt-1 text-xs text-[#94A3B8]">필러 (출제 0건)</p>
            </div>
            <span className="text-xl text-[#CBD5E1]">→</span>
            <div className="rounded-xl bg-primary-50 px-6 py-4 text-center">
              <p className="text-2xl font-black text-primary-600">10개</p>
              <p className="mt-1 text-xs text-primary-500">
                실제 공부할 주제
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ Section 4: 빈도 분석 ━━━ */}
      <section className="border-b border-[#F4F4F5] bg-[#FCFBF8] py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <SectionNum num="4" label="데이터 전략" />
          <h2 className="mt-6 text-center font-serif text-[28px] font-semibold italic leading-[1.3] tracking-tight text-[#1f1e30] sm:text-[36px]">
            230건 데이터가 증명하는
            <br />
            진짜 나오는 주제
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-center text-base leading-relaxed text-[#71717A]">
            서베이로 범위를 줄인 뒤, 빈도 분석으로 학습 순서를 결정합니다.
            <br />
            핵심 주제 4개만 완벽히 하면 선택형 콤보의 절반 이상이 대비됩니다.
          </p>

          {/* 빈도 테이블 */}
          <div className="mt-12 overflow-hidden rounded-2xl border border-[#F4F4F5] bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#F4F4F5] bg-[#FAFAFA]">
                  <th className="px-4 py-3 text-center font-semibold text-[#1f1e30] sm:px-6">
                    순위
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-[#1f1e30] sm:px-6">
                    주제
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-[#1f1e30] sm:px-6">
                    출현율
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-[#1f1e30] sm:px-6">
                    분류
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4F4F5]">
                {topicFrequency.map((item) => (
                  <tr
                    key={item.rank}
                    className={
                      item.tier === "핵심" ? "bg-primary-50/50" : ""
                    }
                  >
                    <td className="px-4 py-3 text-center font-bold text-[#94A3B8] sm:px-6">
                      {item.rank}
                    </td>
                    <td className="px-4 py-3 font-semibold text-[#1f1e30] sm:px-6">
                      {item.topic}
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-[#1f1e30] sm:px-6">
                      {item.rate}
                    </td>
                    <td className="px-4 py-3 text-center sm:px-6">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          item.tier === "핵심"
                            ? "bg-red-50 text-red-500"
                            : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {item.tier}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="border-t border-[#F4F4F5] bg-[#FAFAFA] px-6 py-3 text-center text-xs text-[#94A3B8]">
              실제 OPIc 시험 후기 230건 (3,343개 문항) 기준 분석
            </div>
          </div>

          {/* 커버리지 시각화 */}
          <div className="mt-12 rounded-2xl bg-[#1f1e30] p-8 sm:p-10">
            <p className="text-center text-sm font-medium text-[#94A3B8]">
              최종 시험 커버리지
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
              <div className="text-center">
                <p className="font-serif text-[48px] font-bold italic text-primary-400">
                  60%
                </p>
                <p className="mt-1 text-sm text-[#71717A]">
                  서베이+난이도로 결정
                </p>
              </div>
              <span className="text-2xl text-[#4A5568]">+</span>
              <div className="text-center">
                <p className="font-serif text-[48px] font-bold italic text-purple-400">
                  30%
                </p>
                <p className="mt-1 text-sm text-[#71717A]">
                  빈도 분석으로 추가 커버
                </p>
              </div>
              <span className="text-2xl text-[#4A5568]">=</span>
              <div className="text-center">
                <p className="font-serif text-[56px] font-bold italic text-white">
                  90%+
                </p>
                <p className="mt-1 text-sm text-[#94A3B8]">
                  시험 범위 커버리지
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ Section 5: 오픽톡닥이 하는 일 ━━━ */}
      <section className="border-b border-[#F4F4F5] bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <SectionNum num="5" label="오픽톡닥" />
          <h2 className="mt-6 text-center font-serif text-[28px] font-semibold italic leading-[1.3] tracking-tight text-[#1f1e30] sm:text-[36px]">
            그래서 오픽톡닥은
            <br />
            이렇게 학습시킵니다
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-center text-base leading-relaxed text-[#71717A]">
            데이터가 전략을 만들고, 전략이 학습을 안내하고, 학습이 실전을
            시뮬레이션합니다.
          </p>

          {/* 모듈 카드 */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {modules.map((m) => (
              <div
                key={m.name}
                className="rounded-2xl border border-[#F4F4F5] bg-[#FAFAFA] p-6"
              >
                <span className="text-3xl">{m.emoji}</span>
                <h3 className="mt-3 text-lg font-bold text-[#1f1e30]">
                  {m.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#71717A]">
                  {m.desc}
                </p>
              </div>
            ))}
          </div>

          {/* 파이프라인 시각화 */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2 text-sm sm:gap-3">
            {[
              "데이터 수집",
              "→",
              "빈도 분석",
              "→",
              "맞춤 학습",
              "→",
              "실전 시뮬레이션",
            ].map((item, i) =>
              item === "→" ? (
                <span key={i} className="text-[#CBD5E1]">
                  →
                </span>
              ) : (
                <span
                  key={i}
                  className="rounded-lg bg-primary-50 px-4 py-2 font-semibold text-primary-700"
                >
                  {item}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* ━━━ Final CTA ━━━ */}
      <section
        className="py-24 sm:py-32"
        style={{
          background:
            "linear-gradient(180deg, #FCFBF8 0%, #E0F7F3 30%, #C4EDE6 60%, #E0F7F3 100%)",
        }}
      >
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h2 className="font-serif text-3xl font-semibold italic tracking-tight text-[#1f1e30] sm:text-[44px] sm:leading-[1.2]">
            &ldquo;대충&rdquo;에서
            <br />
            &ldquo;정확히&rdquo;로.
          </h2>
          <p className="mt-5 text-[17px] leading-relaxed text-[#52525B]">
            데이터 기반 전략으로, 시험의 90% 이상을 대비한 상태로 응시하세요.
          </p>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-[#1f1e30] px-8 text-base font-semibold text-white shadow-[0_4px_16px_rgba(31,30,48,0.12)] transition-colors hover:bg-[#2d2c3e]"
            >
              무료로 시작하기
              <ArrowRight className="h-[18px] w-[18px]" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex h-[52px] items-center justify-center rounded-full border border-[#E4E4E7] bg-white px-8 text-base font-medium text-[#1f1e30] transition-colors hover:bg-gray-50"
            >
              요금제 보기
            </Link>
          </div>
          <p className="mt-6 text-[13px] text-[#A1A1AA]">
            카드 등록 없이 무료로 시작 · 언제든 해지 가능
          </p>
        </div>
      </section>
    </>
  );
}
