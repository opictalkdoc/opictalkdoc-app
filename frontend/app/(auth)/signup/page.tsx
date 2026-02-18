"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signup } from "@/lib/actions/auth";
import { signupSchema, type SignupInput } from "@/lib/validations/auth";

export default function SignupPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = (data: SignupInput) => {
    setServerError(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      const result = await signup(formData);
      if (result?.error) {
        setServerError(result.error);
      }
    });
  };

  return (
    <>
      <h1 className="text-center text-2xl font-bold">회원가입</h1>
      <p className="mt-2 text-center text-sm text-foreground-secondary">
        무료 계정을 만들고 OPIc 학습을 시작하세요
      </p>

      {/* 에러 메시지 */}
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
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
            이름
          </label>
          <Input
            id="name"
            type="text"
            placeholder="홍길동"
            autoComplete="name"
            error={!!errors.name}
            {...register("name")}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-accent-500">
              {errors.name.message}
            </p>
          )}
        </div>
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
        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium"
          >
            비밀번호
          </label>
          <Input
            id="password"
            type="password"
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
        <Button type="submit" className="mt-2 w-full" disabled={isPending}>
          {isPending ? "가입 중..." : "회원가입"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-foreground-secondary">
        이미 계정이 있으신가요?{" "}
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
