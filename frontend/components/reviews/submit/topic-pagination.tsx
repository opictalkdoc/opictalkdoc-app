"use client";

import { useState, useEffect } from "react";
import { HelpCircle, PenLine, ChevronLeft, ChevronRight } from "lucide-react";
import { getTopicsByCategory } from "@/lib/queries/master-questions";

// 주제별 이모지 매핑
const TOPIC_EMOJI: Record<string, string> = {
  집: "🏠", TV: "📺", 가구: "🪑", 가전제품: "🔌", "가전/전자제품": "🔌",
  "가족/친구": "👨‍👩‍👧‍👦", 건강: "💪", 공원: "🌳", 교통: "🚌", 국내여행: "🗺️",
  기술: "💻", 날씨: "☀️", 모임: "🤝", 미용실: "💇", 병원: "🏥",
  산업: "🏭", 선호회사: "🏢", 쇼핑: "🛍️", 약국: "💊", 약속: "📅",
  여가시간: "🎮", 영화: "🎬", 은행: "🏦", 음식: "🍽️", 음식점: "🍜",
  음악: "🎵", 인터넷: "🌐", 재활용: "♻️", 전화기: "📱", 지형: "🗻",
  "지형(인접국가)": "🗻", 직장: "💼", "집에서 보내는 휴가": "🏖️",
  치과: "🦷", 카페: "☕", 패션: "👗", 하이킹: "🥾", 해외여행: "✈️",
  호텔: "🏨", "휴일/명절 (Holiday)": "🎉", 명절: "🎊", 휴대폰: "📱",
  "외식/배달 문화": "🛵", "지역 축제/행사": "🎪",
  // 롤플레이 주제
  "MP3 Player 구매": "🎧", "가구 구매": "🪑", "가족 집 돌봐주기": "🏡",
  "건강식품 구매": "🥗", "공연 예매": "🎭", "공원 방문": "🌳",
  "공항 (비행 지연)": "✈️", "기술 산업 정보 조사": "🔍", "기차표 예매": "🚄",
  "병원 예약": "🏥", "부동산 (새 집 찾기)": "🏘️", "세일 상품 구매": "🏷️",
  "쇼핑 정보 문의": "🛒", "식당 방문": "🍴", "식료품점 이용": "🛒",
  "여행 계획": "🗺️", "영양 상담 예약": "🥗", "영화 관람 계획": "🎥",
  "옷 구매": "👕", "외국인의 방문 지원": "🌍", "웹사이트 정보": "🌐",
  "은행 계좌 개설": "🏦", "자동차 고장": "🚗", "자전거 대여": "🚲",
  "재활용 규정": "♻️", "차량 렌트": "🚙", "취업 면접": "👔",
  "친구 만남 계획": "🤝", "친구 초대 행사": "🎈", "친구들과 영화 관람 준비": "🍿",
  "친구의 미국 여행": "🇺🇸", "카페 이용": "☕", "파티 초대 및 준비": "🎉",
  "해외 친구 방문 / 지리": "🌏", "해외여행 날씨": "🌤️", "헬스장 이용": "🏋️",
  "호텔 이용": "🏨", "휴대폰 구매": "📱", "휴일 식사초대": "🍽️",
};

interface TopicPaginationProps {
  category: "일반" | "롤플레이" | "어드밴스";
  selectedTopic: string | null;
  onSelectTopic: (topic: string) => void;
  onNotRemembered: () => void;
  onCustomInput: () => void;
}

export function TopicPagination({
  category,
  selectedTopic,
  onSelectTopic,
  onNotRemembered,
  onCustomInput,
}: TopicPaginationProps) {
  const [topics, setTopics] = useState<{ topic: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  // PC 3열 × 3행 = 9개, 모바일 2열 × 4행 = 8개 → 페이지당 8개 (호환)
  const itemsPerPage = 8;

  useEffect(() => {
    setLoading(true);
    setPage(0);
    getTopicsByCategory(category).then((data) => {
      setTopics(data);
      setLoading(false);
    });
  }, [category]);

  const totalPages = Math.ceil(topics.length / itemsPerPage);
  const currentTopics = topics.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  );

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-16 animate-pulse rounded-[var(--radius-lg)] bg-surface-secondary"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* 주제 그리드 */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
        {currentTopics.map(({ topic, count }) => (
          <button
            key={topic}
            onClick={() => onSelectTopic(topic)}
            className={`flex flex-col items-center gap-1 rounded-[var(--radius-lg)] border p-3 text-center transition-all ${
              selectedTopic === topic
                ? "border-primary-500 bg-primary-50 text-primary-700"
                : "border-border bg-surface text-foreground hover:border-primary-300 hover:bg-primary-50/30"
            }`}
          >
            <span className="text-lg">{TOPIC_EMOJI[topic] || "📋"}</span>
            <span className="text-xs font-medium leading-tight">{topic}</span>
            <span className="text-[10px] text-foreground-muted">{count}문항</span>
          </button>
        ))}

        {/* 특수 옵션: 기억 안남 */}
        <button
          onClick={onNotRemembered}
          className="flex flex-col items-center gap-1 rounded-[var(--radius-lg)] border border-dashed border-foreground-muted/30 p-3 text-center text-foreground-muted transition-all hover:border-foreground-muted hover:bg-surface-secondary"
        >
          <HelpCircle size={18} />
          <span className="text-xs font-medium">기억 안남</span>
        </button>

        {/* 특수 옵션: 직접 입력 */}
        <button
          onClick={onCustomInput}
          className="flex flex-col items-center gap-1 rounded-[var(--radius-lg)] border border-dashed border-foreground-muted/30 p-3 text-center text-foreground-muted transition-all hover:border-foreground-muted hover:bg-surface-secondary"
        >
          <PenLine size={18} />
          <span className="text-xs font-medium">직접 입력</span>
        </button>
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] border border-border text-foreground-secondary transition-colors hover:bg-surface-secondary disabled:opacity-30"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs text-foreground-muted">
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] border border-border text-foreground-secondary transition-colors hover:bg-surface-secondary disabled:opacity-30"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
