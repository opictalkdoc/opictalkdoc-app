"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Loader2, Send, Gift } from "lucide-react";
import { step3Schema, type Step3Input } from "@/lib/validations/reviews";
import { completeSubmission } from "@/lib/actions/reviews";

interface WizardStep3Props {
  submissionId: number;
  onComplete: () => void;
  onBack: () => void;
}

export function WizardStep3({ submissionId, onComplete, onBack }: WizardStep3Props) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Step3Input>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      submission_id: submissionId,
      one_line_review: "",
      tips: "",
    },
  });

  const reviewLength = watch("one_line_review")?.length || 0;
  const tipsLength = watch("tips")?.length || 0;

  const onSubmit = async (data: Step3Input) => {
    setSubmitting(true);
    setError(null);

    const result = await completeSubmission({
      submission_id: submissionId,
      one_line_review: data.one_line_review,
      tips: data.tips || "",
    });

    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    onComplete();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 크레딧 보상 안내 */}
      <div className="flex items-start gap-3 rounded-[var(--radius-xl)] border border-secondary-200 bg-secondary-50/50 p-4">
        <Gift size={18} className="mt-0.5 shrink-0 text-secondary-600" />
        <div>
          <p className="text-sm font-medium text-foreground">
            후기를 완료하면 스크립트 크레딧 2개를 드려요!
          </p>
          <p className="mt-0.5 text-xs text-foreground-secondary">
            매월 2건까지 보상이 제공됩니다
          </p>
        </div>
      </div>

      {/* 한줄 후기 */}
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          한줄 후기 <span className="text-accent-500">*</span>
        </label>
        <p className="mb-2 text-xs text-foreground-muted">
          이번 시험에 대한 한줄 감상을 남겨주세요
        </p>
        <div className="relative">
          <input
            type="text"
            maxLength={100}
            {...register("one_line_review")}
            placeholder="예: 롤플레이가 생각보다 어려웠어요"
            className="w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 py-2.5 text-sm text-foreground placeholder:text-foreground-muted focus:border-primary-500 focus:outline-none"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-foreground-muted">
            {reviewLength}/100
          </span>
        </div>
        {errors.one_line_review && (
          <p className="mt-1 text-xs text-accent-500">{errors.one_line_review.message}</p>
        )}
      </div>

      {/* 팁/조언 */}
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          팁/조언 <span className="text-foreground-muted">(선택)</span>
        </label>
        <p className="mb-2 text-xs text-foreground-muted">
          다음 응시자에게 도움이 될 팁이 있다면 공유해주세요
        </p>
        <div className="relative">
          <textarea
            maxLength={300}
            rows={3}
            {...register("tips")}
            placeholder="예: 서베이를 잘 선택하면 원하는 주제를 유도할 수 있어요"
            className="w-full resize-none rounded-[var(--radius-md)] border border-border bg-surface px-3 py-2.5 text-sm text-foreground placeholder:text-foreground-muted focus:border-primary-500 focus:outline-none"
          />
          <span className="absolute bottom-2 right-3 text-xs text-foreground-muted">
            {tipsLength}/300
          </span>
        </div>
        {errors.tips && (
          <p className="mt-1 text-xs text-accent-500">{errors.tips.message}</p>
        )}
      </div>

      {/* 에러 */}
      {error && (
        <div className="rounded-[var(--radius-md)] bg-accent-50 p-3 text-sm text-accent-600">
          {error}
        </div>
      )}

      {/* 버튼 */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 rounded-[var(--radius-lg)] border border-border px-4 py-2.5 text-sm font-medium text-foreground-secondary transition-colors hover:bg-surface-secondary"
        >
          <ChevronLeft size={16} />
          이전 단계
        </button>

        <div className="flex-1" />

        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 rounded-[var(--radius-lg)] bg-primary-500 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-600 disabled:opacity-50"
        >
          {submitting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}
          후기 완료하기
        </button>
      </div>
    </form>
  );
}
