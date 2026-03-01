"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { resetPassword } from "@/lib/actions/auth";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/lib/validations/auth";

export default function ResetPasswordPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (data: ResetPasswordInput) => {
    setServerError(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.append("password", data.password);
      formData.append("confirmPassword", data.confirmPassword);
      const result = await resetPassword(formData);
      if (result?.error) {
        setServerError(result.error);
      }
    });
  };

  return (
    <>
      <h1 className="text-center text-2xl font-bold">새 비밀번호 설정</h1>
      <p className="mt-2 text-center text-sm text-foreground-secondary">
        새로운 비밀번호를 입력해주세요
      </p>

      {serverError && (
        <div className="mt-4 rounded-[var(--radius-md)] border border-accent-200 bg-accent-50 p-3 text-sm text-accent-600">
          {serverError}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 flex flex-col gap-4"
      >
        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium"
          >
            새 비밀번호
          </label>
          <PasswordInput
            id="password"
            placeholder="8자 이상"
            autoComplete="new-password"
            error={!!errors.password}
            {...register("password")}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-accent-500">
              {errors.password.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-1.5 block text-sm font-medium"
          >
            비밀번호 확인
          </label>
          <PasswordInput
            id="confirmPassword"
            placeholder="비밀번호를 다시 입력"
            autoComplete="new-password"
            error={!!errors.confirmPassword}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-accent-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        <Button type="submit" className="mt-2 w-full" disabled={isPending}>
          {isPending ? "변경 중..." : "비밀번호 변경"}
        </Button>
      </form>
    </>
  );
}
