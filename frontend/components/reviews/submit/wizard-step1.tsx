"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { step1Schema, type Step1Input } from "@/lib/validations/reviews";
import { createDraft } from "@/lib/actions/reviews";
import {
  ACHIEVED_LEVELS,
  ACHIEVED_LEVEL_LABELS,
  EXAM_PURPOSES,
  EXAM_PURPOSE_LABELS,
  STUDY_METHODS,
  STUDY_METHOD_LABELS,
  PREP_DURATIONS,
  PREP_DURATION_LABELS,
  ATTEMPT_COUNTS,
  ATTEMPT_COUNT_LABELS,
  PERCEIVED_DIFFICULTIES,
  PERCEIVED_DIFFICULTY_LABELS,
  TIME_SUFFICIENCIES,
  TIME_SUFFICIENCY_LABELS,
  ACTUAL_DURATIONS,
  ACTUAL_DURATION_LABELS,
  type StudyMethod,
} from "@/lib/types/reviews";

interface WizardStep1Props {
  onComplete: (submissionId: number) => void;
}

export function WizardStep1({ onComplete }: WizardStep1Props) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Step1Input>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      exam_date: "",
      achieved_level: "",
      exam_purpose: undefined,
      study_methods: [],
      prep_duration: undefined,
      attempt_count: undefined,
      perceived_difficulty: undefined,
      time_sufficiency: undefined,
      actual_duration: undefined,
    },
  });

  const onSubmit = async (data: Step1Input) => {
    setSubmitting(true);
    setError(null);

    const result = await createDraft(data);
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.data) {
      onComplete(result.data.id);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 시험 기본 정보 */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-foreground">시험 기본 정보</h4>

        {/* 시험 날짜 */}
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            시험 날짜 <span className="text-accent-500">*</span>
          </label>
          <input
            type="date"
            {...register("exam_date")}
            className="w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary-500 focus:outline-none"
          />
          {errors.exam_date && (
            <p className="mt-1 text-xs text-accent-500">{errors.exam_date.message}</p>
          )}
        </div>

        {/* 받은 등급 */}
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            받은 등급 <span className="text-foreground-muted">(선택)</span>
          </label>
          <select
            {...register("achieved_level")}
            className="w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary-500 focus:outline-none"
          >
            <option value="">아직 모름 / 미선택</option>
            {ACHIEVED_LEVELS.map((level) => (
              <option key={level} value={level}>
                {ACHIEVED_LEVEL_LABELS[level]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 설문 — 시험 배경 */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-foreground">시험 배경</h4>

        {/* 시험 목적 */}
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-foreground">
            시험 목적 <span className="text-accent-500">*</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {EXAM_PURPOSES.map((purpose) => (
              <label key={purpose} className="cursor-pointer">
                <input
                  type="radio"
                  value={purpose}
                  {...register("exam_purpose")}
                  className="peer sr-only"
                />
                <span className="inline-block rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground-secondary transition-colors peer-checked:border-primary-500 peer-checked:bg-primary-50 peer-checked:text-primary-700">
                  {EXAM_PURPOSE_LABELS[purpose]}
                </span>
              </label>
            ))}
          </div>
          {errors.exam_purpose && (
            <p className="mt-1 text-xs text-accent-500">{errors.exam_purpose.message}</p>
          )}
        </fieldset>

        {/* 공부 방법 (복수선택) */}
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-foreground">
            공부 방법 <span className="text-accent-500">*</span>
            <span className="ml-1 text-xs text-foreground-muted">(복수선택 가능)</span>
          </legend>
          <Controller
            name="study_methods"
            control={control}
            render={({ field }) => (
              <div className="flex flex-wrap gap-2">
                {STUDY_METHODS.map((method) => {
                  const isChecked = field.value?.includes(method);
                  return (
                    <label key={method} className="cursor-pointer">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={isChecked}
                        onChange={() => {
                          const next = isChecked
                            ? field.value.filter((v: StudyMethod) => v !== method)
                            : [...(field.value || []), method];
                          field.onChange(next);
                        }}
                      />
                      <span className="inline-block rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground-secondary transition-colors peer-checked:border-primary-500 peer-checked:bg-primary-50 peer-checked:text-primary-700">
                        {STUDY_METHOD_LABELS[method]}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          />
          {errors.study_methods && (
            <p className="mt-1 text-xs text-accent-500">{errors.study_methods.message}</p>
          )}
        </fieldset>

        {/* 준비 기간 */}
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-foreground">
            준비 기간 <span className="text-accent-500">*</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {PREP_DURATIONS.map((dur) => (
              <label key={dur} className="cursor-pointer">
                <input
                  type="radio"
                  value={dur}
                  {...register("prep_duration")}
                  className="peer sr-only"
                />
                <span className="inline-block rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground-secondary transition-colors peer-checked:border-primary-500 peer-checked:bg-primary-50 peer-checked:text-primary-700">
                  {PREP_DURATION_LABELS[dur]}
                </span>
              </label>
            ))}
          </div>
          {errors.prep_duration && (
            <p className="mt-1 text-xs text-accent-500">{errors.prep_duration.message}</p>
          )}
        </fieldset>

        {/* 응시 횟수 */}
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-foreground">
            응시 횟수 <span className="text-accent-500">*</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {ATTEMPT_COUNTS.map((count) => (
              <label key={count} className="cursor-pointer">
                <input
                  type="radio"
                  value={count}
                  {...register("attempt_count")}
                  className="peer sr-only"
                />
                <span className="inline-block rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground-secondary transition-colors peer-checked:border-primary-500 peer-checked:bg-primary-50 peer-checked:text-primary-700">
                  {ATTEMPT_COUNT_LABELS[count]}
                </span>
              </label>
            ))}
          </div>
          {errors.attempt_count && (
            <p className="mt-1 text-xs text-accent-500">{errors.attempt_count.message}</p>
          )}
        </fieldset>
      </div>

      {/* 설문 — 체감 후기 */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-foreground">체감 후기</h4>

        {/* 체감 난이도 */}
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-foreground">
            체감 난이도 <span className="text-accent-500">*</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {PERCEIVED_DIFFICULTIES.map((diff) => (
              <label key={diff} className="cursor-pointer">
                <input
                  type="radio"
                  value={diff}
                  {...register("perceived_difficulty")}
                  className="peer sr-only"
                />
                <span className="inline-block rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground-secondary transition-colors peer-checked:border-primary-500 peer-checked:bg-primary-50 peer-checked:text-primary-700">
                  {PERCEIVED_DIFFICULTY_LABELS[diff]}
                </span>
              </label>
            ))}
          </div>
          {errors.perceived_difficulty && (
            <p className="mt-1 text-xs text-accent-500">{errors.perceived_difficulty.message}</p>
          )}
        </fieldset>

        {/* 시간 여유 */}
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-foreground">
            시간 여유 <span className="text-accent-500">*</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {TIME_SUFFICIENCIES.map((ts) => (
              <label key={ts} className="cursor-pointer">
                <input
                  type="radio"
                  value={ts}
                  {...register("time_sufficiency")}
                  className="peer sr-only"
                />
                <span className="inline-block rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground-secondary transition-colors peer-checked:border-primary-500 peer-checked:bg-primary-50 peer-checked:text-primary-700">
                  {TIME_SUFFICIENCY_LABELS[ts]}
                </span>
              </label>
            ))}
          </div>
          {errors.time_sufficiency && (
            <p className="mt-1 text-xs text-accent-500">{errors.time_sufficiency.message}</p>
          )}
        </fieldset>

        {/* 실제 소요 시간 */}
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-foreground">
            실제 소요 시간 <span className="text-accent-500">*</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {ACTUAL_DURATIONS.map((dur) => (
              <label key={dur} className="cursor-pointer">
                <input
                  type="radio"
                  value={dur}
                  {...register("actual_duration")}
                  className="peer sr-only"
                />
                <span className="inline-block rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground-secondary transition-colors peer-checked:border-primary-500 peer-checked:bg-primary-50 peer-checked:text-primary-700">
                  {ACTUAL_DURATION_LABELS[dur]}
                </span>
              </label>
            ))}
          </div>
          {errors.actual_duration && (
            <p className="mt-1 text-xs text-accent-500">{errors.actual_duration.message}</p>
          )}
        </fieldset>
      </div>

      {/* 에러 */}
      {error && (
        <div className="rounded-[var(--radius-md)] bg-accent-50 p-3 text-sm text-accent-600">
          {error}
        </div>
      )}

      {/* 제출 버튼 */}
      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-lg)] bg-primary-500 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-600 disabled:opacity-50"
      >
        {submitting && <Loader2 size={16} className="animate-spin" />}
        다음 단계로
      </button>
    </form>
  );
}
