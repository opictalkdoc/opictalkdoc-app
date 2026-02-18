"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { forgotPassword } from "@/lib/actions/auth";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/lib/validations/auth";

export default function ForgotPasswordPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordInput) => {
    setServerError(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", data.email);
      const result = await forgotPassword(formData);
      if (result?.error) {
        setServerError(result.error);
      }
    });
  };

  return (
    <>
      <h1 className="text-center text-2xl font-bold">비밀번호 찾기</h1>
      <p className="mt-2 text-center text-sm text-foreground-secondary">
        가입한 이메일 주소를 입력하면 비밀번호 재설정 링크를 보내드립니다
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
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
            이메일
          </label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            autoComplete="email"
            error={!!errors.email}
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-accent-500">
              {errors.email.message}
            </p>
          )}
        </div>
        <Button type="submit" className="mt-2 w-full" disabled={isPending}>
          {isPending ? "전송 중..." : "재설정 링크 보내기"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-foreground-secondary">
        비밀번호가 기억나셨나요?{" "}
        <Link
          href="/login"
          className="font-medium text-primary-500 hover:text-primary-600"
        >
          로그인
        </Link>
      </p>
    </>
  );
}
