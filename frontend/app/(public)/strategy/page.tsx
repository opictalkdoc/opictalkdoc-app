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

const questionTypes = [
  {
    group: "기본",
    num: "1번",
    type: "묘사",
    content: "장소나 종류를 현재시제로 묘사",
    example: "좋아하는 공원을 묘사해주세요",
  },
  {
    group: "기본",
    num: "2번",
    type: "루틴",
    content: "활동, 루틴, 단계를 묘사",
    example: "공원에서 보통 뭘 하나요",
  },
  {
    group: "기본",
    num: "3번",
    type: "경험",
    content: "최초 혹은 최근 경험",
    example: "최근에 공원 간 적 있나요",
  },
  {
    group: "기본",
    num: "4번",
    type: "인상",
    content: "인상적인 경험",
    example: "공원에서 인상깊은 일이 있나요",
  },
  {
    group: "기본",
    num: "5번",
    type: "질문",
    content: "상대방에게 간단한 질문",
    example: "상대방에게 공원에 대해 질문하기",
  },
  {
    group: "롤플레이",
    num: "6번",
    type: "정보요청",
    content: "상황 속 정보 요청",
    example: "영화 티켓 구매에 필요한 정보요청",
  },
  {
    group: "롤플레이",
    num: "7번",
    type: "문제해결",
    content: "문제 상황 대안 제시",
    example: "영화관에서 생긴 티켓 문제 해결",
  },
  {
    group: "롤플레이",
    num: "8번",
    type: "경험연결",
    content: "유사한 문제 경험",
    example: "예약이 잘못되었던 경험",
  },
  {
    group: "고급",
    num: "9번",
    type: "비교/대조",
    content: "과거와 현재 비교",
    example: "10년 전과 지금의 여행 문화 비교",
  },
  {
    group: "고급",
    num: "10번",
    type: "사회이슈",
    content: "사회적 관심사 설명",
    example: "환경 문제에 대해 예를 들어 설명",
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

const commonTopicFrequency = [
  { rank: 1, topic: "지형", count: "22건", cumRate: "9.3%", highlight: true },
  {
    rank: 2,
    topic: "미용실",
    count: "19건",
    cumRate: "17.4%",
    highlight: true,
  },
  {
    rank: 3,
    topic: "재활용",
    count: "19건",
    cumRate: "25.4%",
    highlight: true,
  },
  { rank: 4, topic: "은행", count: "18건", cumRate: "33.1%", highlight: true },
  { rank: 5, topic: "날씨", count: "16건", cumRate: "39.8%", highlight: true },
  { rank: 6, topic: "산업", count: "11건", cumRate: "44.5%", highlight: true },
  { rank: 7, topic: "패션", count: "11건", cumRate: "49.2%", highlight: false },
  { rank: 8, topic: "호텔", count: "10건", cumRate: "53.4%", highlight: false },
  { rank: 9, topic: "기술", count: "10건", cumRate: "57.6%", highlight: false },
  {
    rank: 10,
    topic: "음식점",
    count: "9건",
    cumRate: "61.4%",
    highlight: false,
  },
];

const difficultyComparison = [
  { grade: "AL", average: "6%", fiveFive: "20%", multiplier: "3.3배 ↑", up: true },
  { grade: "IH", average: "22%", fiveFive: "41%", multiplier: "1.9배 ↑", up: true },
  { grade: "IM3", average: "4%", fiveFive: "26%", multiplier: "6.5배 ↑", up: true },
  { grade: "IM2", average: "29%", fiveFive: "6%", multiplier: "80% ↓", up: false },
  { grade: "IL", average: "15%", fiveFive: "2%", multiplier: "87% ↓", up: false },
];

const gradeStrategies = [
  {
    grade: "IL",
    samsung: "4급",
    difficulty: "3단계",
    focus: "묘사, 인상, 정보요청, 문제해결",
    length: "30~40초",
    key: "단문 위주, 짧게 답변",
  },
  {
    grade: "IM1/IM2",
    samsung: "3급",
    difficulty: "4단계",
    focus: "경험, 인상, 정보요청, 문제해결",
    length: "60~70초",
    key: "자기 생각을 덧붙이기",
  },
  {
    grade: "IM3/IH",
    samsung: "2급",
    difficulty: "5-5",
    focus: "경험, 인상, 문제해결, 경험연결",
    length: "80~100초",
    key: "복문 구조, 관계사 활용",
  },
  {
    grade: "AL",
    samsung: "1급",
    difficulty: "5-5",
    focus: "문제해결, 경험연결, 비교/대조, 사회이슈",
    length: "100~120초",
    key: "디테일한 묘사, 정확한 문법",
  },
];

const flywheelScaleEffects = [
  {
    scale: "230건",
    precision: "3:2 비율 확인, 빈출 주제 파악",
    effect: "핵심 10개 주제 집중",
    current: true,
  },
  {
    scale: "500건",
    precision: "±3% 수준의 정밀 빈도",
    effect: "주제별 우선순위 확정",
    current: false,
  },
  {
    scale: "2,000건",
    precision: "난이도별·시기별 패턴 분석",
    effect: "시기에 따른 맞춤 전략",
    current: false,
  },
  {
    scale: "10,000건+",
    precision: "출제 패턴 거의 완벽 예측",
    effect: "준비한 것이 그대로 시험에 출제",
    current: false,
  },
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
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-[15px] font-semibold text-[#64748B]">
                    {item.rough}
                  </p>
                  <p className="mt-0.5 text-sm text-[#94A3B8]">
                    {item.question}
                  </p>
                </div>
                <span className="text-lg text-[#CBD5E1]">→</span>
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

      {/* ━━━ Section 3: 콤보 시스템 (NEW) ━━━ */}
      <section className="border-b border-[#F4F4F5] bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <SectionNum num="3" label="콤보 시스템" />
          <h2 className="mt-6 text-center font-serif text-[28px] font-semibold italic leading-[1.3] tracking-tight text-[#1f1e30] sm:text-[36px]">
            15문제는 무작위가 아닙니다
            <br />
            5개 콤보로 구성됩니다
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-center text-base leading-relaxed text-[#71717A]">
            OPIc의 모든 문제는 10가지 유형 중 하나이며, 한 콤보 안의 3문제는
            같은 주제에서 연속으로 출제됩니다.
          </p>

          {/* 10가지 문제유형 테이블 */}
          <div className="mt-12 overflow-hidden rounded-2xl border border-[#F4F4F5] bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#F4F4F5] bg-[#FAFAFA]">
                  <th className="px-4 py-3 text-center font-semibold text-[#1f1e30] sm:px-5">
                    그룹
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-[#1f1e30] sm:px-5">
                    유형
                  </th>
                  <th className="hidden px-4 py-3 text-left font-semibold text-[#1f1e30] sm:table-cell sm:px-5">
                    내용
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-[#1f1e30] sm:px-5">
                    예시
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4F4F5]">
                {questionTypes.map((qt) => (
                  <tr
                    key={qt.num}
                    className={
                      qt.group === "롤플레이"
                        ? "bg-amber-50/50"
                        : qt.group === "고급"
                          ? "bg-purple-50/50"
                          : ""
                    }
                  >
                    <td className="px-4 py-3 text-center sm:px-5">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                          qt.group === "기본"
                            ? "bg-primary-50 text-primary-600"
                            : qt.group === "롤플레이"
                              ? "bg-amber-50 text-amber-600"
                              : "bg-purple-50 text-purple-600"
                        }`}
                      >
                        {qt.group}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-[#1f1e30] sm:px-5">
                      {qt.num} {qt.type}
                    </td>
                    <td className="hidden px-4 py-3 text-[#71717A] sm:table-cell sm:px-5">
                      {qt.content}
                    </td>
                    <td className="px-4 py-3 text-xs text-[#94A3B8] sm:px-5 sm:text-sm">
                      &ldquo;{qt.example}&rdquo;
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 5콤보 구조 시각화 */}
          <div className="mt-10 rounded-2xl bg-[#1f1e30] p-6 sm:p-8">
            <p className="text-center text-sm font-medium text-[#94A3B8]">
              난이도 5-5 기준 · 15문제 구조
            </p>
            <div className="mt-6 space-y-3 text-sm">
              {[
                {
                  q: "Q1",
                  label: "자기소개",
                  desc: "채점 안함 / Skip 가능",
                  color: "bg-[#374151]",
                },
                {
                  q: "Q2~Q4",
                  label: "일반콤보 1",
                  desc: "설명/묘사 → 행동습관 → 과거경험",
                  color: "bg-primary-500/80",
                },
                {
                  q: "Q5~Q7",
                  label: "일반콤보 2",
                  desc: "설명/묘사 → 행동습관 → 과거경험",
                  color: "bg-primary-500/80",
                },
                {
                  q: "Q8~Q10",
                  label: "일반콤보 3",
                  desc: "설명/묘사 → 행동습관 → 과거경험",
                  color: "bg-primary-500/80",
                },
                {
                  q: "Q11~Q13",
                  label: "롤플레이",
                  desc: "정보요청 → 대안제시 → 과거경험",
                  color: "bg-amber-500/80",
                },
                {
                  q: "Q14~Q15",
                  label: "어드밴스",
                  desc: "Q14=IH판별(비교) · Q15=AL판별(사회이슈)",
                  color: "bg-purple-500/80",
                },
              ].map((row) => (
                <div
                  key={row.q}
                  className={`flex flex-col gap-1 rounded-lg ${row.color} px-4 py-3 sm:flex-row sm:items-center sm:gap-4`}
                >
                  <span className="min-w-[80px] font-mono text-xs font-bold text-white/70">
                    {row.q}
                  </span>
                  <span className="font-semibold text-white">{row.label}</span>
                  <span className="text-xs text-white/60">{row.desc}</span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-center text-xs leading-relaxed text-[#71717A]">
              선택형 3개 + 공통형 2개가 위 5개 콤보에 배분됩니다. 위치는 고정되지 않습니다.
            </p>
          </div>

          {/* 핵심 포인트 */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              {
                num: "3개",
                label: "선택형 콤보",
                desc: "내가 서베이에서 선택한 항목",
              },
              {
                num: "2개",
                label: "공통형 콤보",
                desc: "서베이 무관, 누구에게나 출제",
              },
              {
                num: "15문제",
                label: "총 문항 수",
                desc: "5콤보 × 3문항씩",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-[#F4F4F5] bg-[#FAFAFA] p-5 text-center"
              >
                <p className="text-2xl font-black text-[#1f1e30]">
                  {item.num}
                </p>
                <p className="mt-1 text-sm font-semibold text-[#64748B]">
                  {item.label}
                </p>
                <p className="mt-0.5 text-xs text-[#94A3B8]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ Section 4: 서베이 전략 ━━━ */}
      <section className="border-b border-[#F4F4F5] bg-[#FCFBF8] py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <SectionNum num="4" label="서베이 전략" />
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
                className="flex flex-col gap-3 rounded-xl border border-[#F4F4F5] bg-white p-4 sm:flex-row sm:items-center sm:gap-4"
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

      {/* ━━━ Section 5: 선택형 빈도 분석 ━━━ */}
      <section className="border-b border-[#F4F4F5] bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <SectionNum num="5" label="선택형 빈도" />
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

      {/* ━━━ Section 6: 공통형 빈도 분석 (NEW) ━━━ */}
      <section className="border-b border-[#F4F4F5] bg-[#FCFBF8] py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <SectionNum num="6" label="공통형 빈도" />
          <h2 className="mt-6 text-center font-serif text-[28px] font-semibold italic leading-[1.3] tracking-tight text-[#1f1e30] sm:text-[36px]">
            공통형 2개도
            <br />
            데이터로 대비합니다
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-center text-base leading-relaxed text-[#71717A]">
            공통형은 서베이로 범위를 줄일 수 없습니다.
            <br />
            <strong>빈도 분석만으로</strong> 우선순위를 정해야 합니다.
          </p>

          {/* 공통형 빈도 테이블 */}
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
                    출현 건수
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-[#1f1e30] sm:px-6">
                    누적 커버리지
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4F4F5]">
                {commonTopicFrequency.map((item) => (
                  <tr
                    key={item.rank}
                    className={item.highlight ? "bg-primary-50/50" : ""}
                  >
                    <td className="px-4 py-3 text-center font-bold text-[#94A3B8] sm:px-6">
                      {item.rank}
                    </td>
                    <td className="px-4 py-3 sm:px-6">
                      <span
                        className={`font-semibold ${item.highlight ? "text-[#1f1e30]" : "text-[#71717A]"}`}
                      >
                        {item.topic}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-[#71717A] sm:px-6">
                      {item.count}
                    </td>
                    <td className="px-4 py-3 text-center font-bold sm:px-6">
                      <span
                        className={
                          item.highlight
                            ? "text-primary-600"
                            : "text-[#94A3B8]"
                        }
                      >
                        {item.cumRate}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="border-t border-[#F4F4F5] bg-[#FAFAFA] px-6 py-3 text-center text-xs text-[#94A3B8]">
              일반 공통형 220건, 236콤보 기준 분석
            </div>
          </div>

          {/* 핵심 인사이트 */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-[#F4F4F5] bg-white p-6 text-center">
              <p className="text-sm font-medium text-[#94A3B8]">
                상위 6개 주제만 학습하면
              </p>
              <p className="mt-2 font-serif text-[40px] font-bold italic text-primary-600">
                44.5%
              </p>
              <p className="mt-1 text-sm text-[#71717A]">
                공통형 출현의 거의 절반을 커버
              </p>
            </div>
            <div className="rounded-xl border border-[#F4F4F5] bg-white p-6 text-center">
              <p className="text-sm font-medium text-[#94A3B8]">
                상위 10개로 확장하면
              </p>
              <p className="mt-2 font-serif text-[40px] font-bold italic text-[#1f1e30]">
                61.4%
              </p>
              <p className="mt-1 text-sm text-[#71717A]">
                38%의 주제로 61%를 커버하는 효율
              </p>
            </div>
          </div>

          {/* 전체 시험 커버리지 결합 */}
          <div className="mt-10 rounded-2xl bg-[#1f1e30] p-6 sm:p-8">
            <p className="text-center text-sm font-medium text-[#94A3B8]">
              선택형 + 공통형 결합 커버리지
            </p>
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-4 rounded-lg bg-primary-500/20 px-4 py-3">
                <span className="min-w-[80px] text-sm font-bold text-primary-300">
                  선택형 3개
                </span>
                <div className="flex-1">
                  <div className="h-3 rounded-full bg-[#2d2c3e]">
                    <div
                      className="h-3 rounded-full bg-primary-400"
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>
                <span className="text-sm font-bold text-primary-300">
                  60% 커버
                </span>
              </div>
              <div className="flex items-center gap-4 rounded-lg bg-purple-500/20 px-4 py-3">
                <span className="min-w-[80px] text-sm font-bold text-purple-300">
                  공통형 2개
                </span>
                <div className="flex-1">
                  <div className="h-3 rounded-full bg-[#2d2c3e]">
                    <div
                      className="h-3 rounded-full bg-purple-400"
                      style={{ width: "45%" }}
                    />
                  </div>
                </div>
                <span className="text-sm font-bold text-purple-300">
                  18% 추가
                </span>
              </div>
            </div>
            <p className="mt-6 text-center text-xs text-[#71717A]">
              공통형 40% × 빈출 6개 커버율 45% = 18% 추가 → 총 약 78% 대비
            </p>
          </div>
        </div>
      </section>

      {/* ━━━ Section 7: 5-5 전략 (NEW) ━━━ */}
      <section className="border-b border-[#F4F4F5] bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <SectionNum num="7" label="5-5 전략" />
          <h2 className="mt-6 text-center font-serif text-[28px] font-semibold italic leading-[1.3] tracking-tight text-[#1f1e30] sm:text-[36px]">
            난이도 5-5를 선택하면
            <br />
            상위등급 확률이 뛴다
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-center text-base leading-relaxed text-[#71717A]">
            서베이(변수 1)로 &ldquo;무엇이&rdquo; 나오는지를 결정했으면,
            난이도(변수 2)로 &ldquo;어떻게&rdquo; 나오는지를 결정합니다.
          </p>

          {/* 난이도별 차이 */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#F4F4F5] bg-[#FAFAFA] p-6">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F1F3F5] text-sm font-bold text-[#94A3B8]">
                  3-4
                </span>
                <h3 className="font-bold text-[#71717A]">난이도 3~4</h3>
              </div>
              <div className="mt-4 space-y-2 text-sm text-[#71717A]">
                <p>
                  롤플레이(질문) <strong className="text-red-500">2번</strong>{" "}
                  출제
                </p>
                <p>한국 수험자의 약점 유형에 2회 노출</p>
                <p>IM 문제: 묘사 + 질문</p>
              </div>
            </div>
            <div className="rounded-2xl border-2 border-primary-200 bg-primary-50/50 p-6">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 text-sm font-bold text-white">
                  5-5
                </span>
                <h3 className="font-bold text-primary-700">난이도 5-5 추천</h3>
              </div>
              <div className="mt-4 space-y-2 text-sm text-primary-700">
                <p>
                  롤플레이(질문){" "}
                  <strong className="text-primary-600">1번만</strong> 출제
                </p>
                <p>약점 유형 노출 최소화</p>
                <p>AL 문제: 비교 + 사회이슈 (건너뛰어도 IH 가능)</p>
              </div>
            </div>
          </div>

          {/* 5-5 vs 전체 평균 비교 테이블 */}
          <div className="mt-10 overflow-hidden rounded-2xl border border-[#F4F4F5] bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#F4F4F5] bg-[#FAFAFA]">
                  <th className="px-4 py-3 text-center font-semibold text-[#1f1e30] sm:px-6">
                    등급
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-[#1f1e30] sm:px-6">
                    전체 평균
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-[#1f1e30] sm:px-6">
                    5-5 선택자
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-[#1f1e30] sm:px-6">
                    배율
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4F4F5]">
                {difficultyComparison.map((item) => (
                  <tr
                    key={item.grade}
                    className={item.up ? "bg-primary-50/50" : ""}
                  >
                    <td className="px-4 py-3 text-center font-bold text-[#1f1e30] sm:px-6">
                      {item.grade}
                    </td>
                    <td className="px-4 py-3 text-center text-[#71717A] sm:px-6">
                      {item.average}
                    </td>
                    <td className="px-4 py-3 text-center font-bold sm:px-6">
                      <span
                        className={
                          item.up ? "text-primary-600" : "text-[#94A3B8]"
                        }
                      >
                        {item.fiveFive}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center sm:px-6">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          item.up
                            ? "bg-primary-50 text-primary-600"
                            : "bg-gray-100 text-[#94A3B8]"
                        }`}
                      >
                        {item.multiplier}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 핵심 수치 */}
          <div className="mt-10 rounded-2xl bg-[#1f1e30] p-8 text-center sm:p-10">
            <p className="text-sm font-medium text-[#94A3B8]">
              5-5 선택자의 상위 3등급 (AL+IH+IM3) 달성률
            </p>
            <p className="mt-3 font-serif text-[56px] font-bold italic text-white">
              87%
            </p>
            <p className="mt-2 text-base text-[#71717A]">
              전체 평균 32% 대비{" "}
              <span className="font-bold text-primary-400">2.7배</span>
            </p>
            <p className="mt-4 text-sm text-[#94A3B8]">
              같은 실력이라도 5-5를 선택하는 것만으로 상위등급 확률이 급상승
            </p>
          </div>

          {/* 왜 6-6이 아닌 5-5인가 */}
          <div className="mt-10 rounded-2xl border border-[#F4F4F5] bg-[#FAFAFA] p-6 sm:p-8">
            <h3 className="text-center text-lg font-bold text-[#1f1e30]">
              왜 6-6이 아닌 5-5인가?
            </h3>
            <div className="mt-6 space-y-3">
              {[
                {
                  label: "비교 문제",
                  five: "1개",
                  six: "2개",
                  risk: "같은 패턴 반복 위험",
                },
                {
                  label: "채점자 인식",
                  five: "다양한 답변",
                  six: "같은 패턴으로만 답변",
                  risk: "감점 요인",
                },
                {
                  label: "Q14~Q15 스킵해도 IH?",
                  five: "가능",
                  six: "불가능",
                  risk: "비교 2개 모두 잘해야",
                },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex flex-col gap-2 rounded-lg bg-white p-4 sm:flex-row sm:items-center sm:gap-4"
                >
                  <span className="min-w-[140px] text-sm font-semibold text-[#1f1e30]">
                    {row.label}
                  </span>
                  <span className="rounded-md bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-600">
                    5-5: {row.five}
                  </span>
                  <span className="rounded-md bg-red-50 px-3 py-1 text-xs font-semibold text-red-500">
                    6-6: {row.six}
                  </span>
                  <span className="text-xs text-[#94A3B8]">→ {row.risk}</span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-center text-sm font-semibold text-primary-600">
              결론: 어떤 등급을 목표로 하든 5-5가 최적입니다.
            </p>
          </div>
        </div>
      </section>

      {/* ━━━ Section 8: 등급별 학습 전략 (NEW) ━━━ */}
      <section className="border-b border-[#F4F4F5] bg-[#FCFBF8] py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <SectionNum num="8" label="등급별 학습" />
          <h2 className="mt-6 text-center font-serif text-[28px] font-semibold italic leading-[1.3] tracking-tight text-[#1f1e30] sm:text-[36px]">
            목표 등급에 따라
            <br />
            학습 전략이 달라집니다
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-center text-base leading-relaxed text-[#71717A]">
            등급이 올라갈수록 난이도, 집중 유형, 답변 길이가 달라집니다.
            <br />
            공통점: 모든 등급에서 쉐도잉으로 영어다운 톤과 억양 만들기가
            기본입니다.
          </p>

          {/* 등급별 전략 카드 */}
          <div className="mt-12 space-y-4">
            {gradeStrategies.map((gs) => (
              <div
                key={gs.grade}
                className="flex flex-col gap-4 rounded-2xl border border-[#F4F4F5] bg-white p-5 sm:flex-row sm:items-center sm:gap-6"
              >
                {/* 등급 뱃지 */}
                <div className="flex items-center gap-3 sm:min-w-[140px]">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-xl text-sm font-black text-white ${
                      gs.grade === "AL"
                        ? "bg-purple-500"
                        : gs.grade === "IM3/IH"
                          ? "bg-primary-500"
                          : gs.grade === "IM1/IM2"
                            ? "bg-amber-500"
                            : "bg-gray-400"
                    }`}
                  >
                    {gs.grade}
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-[#94A3B8]">
                      삼성 {gs.samsung}
                    </p>
                    <p className="text-sm font-bold text-[#1f1e30]">
                      난이도 {gs.difficulty}
                    </p>
                  </div>
                </div>

                {/* 상세 정보 */}
                <div className="flex-1 space-y-1.5">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-md bg-[#F1F3F5] px-2.5 py-1 text-xs font-medium text-[#64748B]">
                      집중: {gs.focus}
                    </span>
                    <span className="rounded-md bg-[#F1F3F5] px-2.5 py-1 text-xs font-medium text-[#64748B]">
                      답변 {gs.length}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-[#1f1e30]">
                    {gs.key}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* 패턴 요약 */}
          <div className="mt-10 rounded-2xl bg-[#1f1e30] p-6 sm:p-8">
            <p className="text-center text-sm font-medium text-[#94A3B8]">
              등급이 올라갈수록
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-6">
              {[
                { label: "난이도", value: "↑ 높게" },
                { label: "롤플레이 비중", value: "↑ 증가" },
                { label: "답변 길이", value: "30초 → 120초" },
                { label: "문장 구조", value: "단문 → 복문" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg bg-white/10 px-4 py-2 text-center"
                >
                  <p className="text-xs text-[#94A3B8]">{item.label}</p>
                  <p className="mt-0.5 text-sm font-bold text-white">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ Section 9: 오픽톡닥이 하는 일 ━━━ */}
      <section className="border-b border-[#F4F4F5] bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <SectionNum num="9" label="오픽톡닥" />
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

      {/* ━━━ Section 10: 데이터 플라이휠 (NEW) ━━━ */}
      <section className="border-b border-[#F4F4F5] bg-[#FCFBF8] py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <SectionNum num="10" label="데이터 플라이휠" />
          <h2 className="mt-6 text-center font-serif text-[28px] font-semibold italic leading-[1.3] tracking-tight text-[#1f1e30] sm:text-[36px]">
            사용자가 쌓을수록
            <br />
            전략이 정밀해집니다
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-center text-base leading-relaxed text-[#71717A]">
            오픽톡닥의 전략은 데이터가 쌓일수록 강해지는 구조입니다.
            <br />
            같은 서베이로 모인 데이터는 분산 없이 한 곳에 축적됩니다.
          </p>

          {/* 선순환 플라이휠 시각화 */}
          <div className="mt-12 rounded-2xl bg-[#1f1e30] p-6 sm:p-8">
            <p className="text-center text-sm font-medium text-[#94A3B8]">
              데이터 선순환 구조
            </p>
            <div className="mt-6 space-y-0">
              {[
                {
                  step: "1",
                  text: "추천 서베이로 시험 응시",
                  icon: "📋",
                },
                {
                  step: "2",
                  text: "데이터랩에 시험 후기 제출",
                  icon: "📊",
                },
                {
                  step: "3",
                  text: "같은 서베이 기준의 데이터 축적",
                  icon: "📦",
                },
                {
                  step: "4",
                  text: "통계 분석 정밀도 향상",
                  icon: "🎯",
                },
                {
                  step: "5",
                  text: "학습 범위 더 정밀하게 축소",
                  icon: "🔬",
                },
                {
                  step: "6",
                  text: "더 효율적인 학습 → 더 좋은 성적",
                  icon: "🏆",
                },
                {
                  step: "7",
                  text: "더 많은 사용자 → 더 많은 데이터",
                  icon: "🔄",
                },
              ].map((item, i) => (
                <div key={item.step} className="flex items-stretch gap-4">
                  {/* 연결선 */}
                  <div className="flex w-10 flex-col items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-lg ${
                        i === 6
                          ? "bg-primary-500"
                          : "bg-white/10"
                      }`}
                    >
                      {item.icon}
                    </div>
                    {i < 6 && (
                      <div className="h-4 w-px bg-white/20" />
                    )}
                  </div>
                  <div className="flex items-center pb-4">
                    <p
                      className={`text-sm ${i === 6 ? "font-bold text-primary-300" : "text-white/80"}`}
                    >
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 서베이 고정이 전제 조건인 이유 */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-red-200 bg-red-50/50 p-5">
              <p className="text-sm font-bold text-red-600">
                서베이가 다를 때
              </p>
              <ul className="mt-3 space-y-1.5 text-sm text-red-500/80">
                <li>수십 가지 조합으로 데이터 분산</li>
                <li>조합별 표본 5~10건씩 파편화</li>
                <li>통계 신뢰도 낮음</li>
                <li>분석 가치 제한적</li>
              </ul>
            </div>
            <div className="rounded-xl border border-primary-200 bg-primary-50/50 p-5">
              <p className="text-sm font-bold text-primary-600">
                서베이를 고정할 때
              </p>
              <ul className="mt-3 space-y-1.5 text-sm text-primary-600/80">
                <li>데이터가 한 곳에 집중</li>
                <li>전체가 같은 조합 → 대규모 표본</li>
                <li>통계 신뢰도 높음</li>
                <li>정밀한 예측 가능</li>
              </ul>
            </div>
          </div>

          {/* 데이터 규모별 효과 */}
          <div className="mt-10 overflow-hidden rounded-2xl border border-[#F4F4F5] bg-white">
            <div className="border-b border-[#F4F4F5] bg-[#FAFAFA] px-6 py-3">
              <p className="text-center text-sm font-semibold text-[#1f1e30]">
                데이터 규모별 예상 효과
              </p>
            </div>
            <div className="divide-y divide-[#F4F4F5]">
              {flywheelScaleEffects.map((item) => (
                <div
                  key={item.scale}
                  className={`flex flex-col gap-2 px-6 py-4 sm:flex-row sm:items-center sm:gap-6 ${
                    item.current ? "bg-primary-50/50" : ""
                  }`}
                >
                  <div className="flex items-center gap-2 sm:min-w-[100px]">
                    <span
                      className={`text-lg font-black ${item.current ? "text-primary-600" : "text-[#1f1e30]"}`}
                    >
                      {item.scale}
                    </span>
                    {item.current && (
                      <span className="rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-semibold text-primary-600">
                        현재
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-[#71717A]">{item.precision}</p>
                  </div>
                  <p className="text-sm font-semibold text-[#1f1e30]">
                    {item.effect}
                  </p>
                </div>
              ))}
            </div>
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
