"use client";

import { useState, useEffect } from "react";
import { MessageSquare, ChevronDown, Loader2, Calendar, Award } from "lucide-react";
import { getPublicReviews } from "@/lib/actions/reviews";
import type { Submission, AchievedLevel } from "@/lib/types/reviews";
import {
  ACHIEVED_LEVELS,
  ACHIEVED_LEVEL_LABELS,
  EXAM_PURPOSE_LABELS,
  PREP_DURATION_LABELS,
  PERCEIVED_DIFFICULTY_LABELS,
  type ExamPurpose,
  type PrepDuration,
  type PerceivedDifficulty,
} from "@/lib/types/reviews";

export function ListTab() {
  const [reviews, setReviews] = useState<Submission[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [levelFilter, setLevelFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const limit = 10;

  const fetchReviews = async (p: number, append = false) => {
    if (append) setLoadingMore(true);
    else setLoading(true);

    const result = await getPublicReviews({
      level: levelFilter || undefined,
      page: p,
      limit,
    });

    if (result.data) {
      if (append) {
        setReviews((prev) => [...prev, ...result.data!.reviews]);
      } else {
        setReviews(result.data.reviews);
      }
      setTotal(result.data.total);
    }

    setLoading(false);
    setLoadingMore(false);
  };

  useEffect(() => {
    setPage(1);
    fetchReviews(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelFilter]);

  const hasMore = reviews.length < total;

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchReviews(nextPage, true);
  };

  return (
    <div className="space-y-6">
      {/* 필터 */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="flex h-9 rounded-[var(--radius-md)] border border-border bg-surface px-3 text-sm text-foreground focus:border-primary-500 focus:outline-none"
        >
          <option value="">전체 등급</option>
          {ACHIEVED_LEVELS.map((level) => (
            <option key={level} value={level}>
              {ACHIEVED_LEVEL_LABELS[level]}
            </option>
          ))}
        </select>
        <span className="text-xs text-foreground-muted">
          {total}개의 후기
        </span>
      </div>

      {/* 후기 목록 */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-[var(--radius-xl)] bg-surface-secondary"
            />
          ))}
        </div>
      ) : reviews.length === 0 ? (
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
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-[var(--radius-xl)] border border-border bg-surface p-5"
            >
              {/* 헤더 */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 text-xs text-foreground-secondary">
                  <Calendar size={12} />
                  {review.exam_date}
                </div>
                {review.achieved_level && (
                  <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700">
                    {ACHIEVED_LEVEL_LABELS[review.achieved_level as AchievedLevel]}
                  </span>
                )}
                <span className="rounded-full bg-surface-secondary px-2 py-0.5 text-xs text-foreground-muted">
                  {EXAM_PURPOSE_LABELS[review.exam_purpose as ExamPurpose]}
                </span>
                <span className="rounded-full bg-surface-secondary px-2 py-0.5 text-xs text-foreground-muted">
                  {PREP_DURATION_LABELS[review.prep_duration as PrepDuration]}
                </span>
                <span className="rounded-full bg-surface-secondary px-2 py-0.5 text-xs text-foreground-muted">
                  {PERCEIVED_DIFFICULTY_LABELS[review.perceived_difficulty as PerceivedDifficulty]}
                </span>
              </div>

              {/* 한줄 후기 */}
              {review.one_line_review && (
                <p className="mt-3 text-sm text-foreground">
                  &ldquo;{review.one_line_review}&rdquo;
                </p>
              )}

              {/* 팁 */}
              {review.tips && (
                <div className="mt-2 rounded-[var(--radius-md)] bg-surface-secondary p-3">
                  <p className="text-xs font-medium text-foreground-secondary">
                    💡 팁/조언
                  </p>
                  <p className="mt-1 text-xs text-foreground-secondary">
                    {review.tips}
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* 더 보기 */}
          {hasMore && (
            <div className="text-center">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="inline-flex items-center gap-2 rounded-[var(--radius-lg)] border border-border px-4 py-2 text-sm font-medium text-foreground-secondary transition-colors hover:bg-surface-secondary disabled:opacity-50"
              >
                {loadingMore ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <ChevronDown size={14} />
                )}
                더 보기
              </button>
            </div>
          )}
        </div>
      )}

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
