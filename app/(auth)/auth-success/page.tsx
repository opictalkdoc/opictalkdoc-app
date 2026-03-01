"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

const messages: Record<string, { title: string; description: string }> = {
  signup: {
    title: "이메일을 확인해주세요",
    description:
      "가입하신 이메일로 확인 링크를 보냈습니다. 이메일을 확인하고 링크를 클릭해주세요.",
  },
  "forgot-password": {
    title: "이메일을 확인해주세요",
    description:
      "비밀번호 재설정 링크를 이메일로 보냈습니다. 이메일을 확인해주세요.",
  },
  "reset-password": {
    title: "비밀번호가 변경되었습니다",
    description: "새 비밀번호로 로그인할 수 있습니다.",
  },
};

const defaultMessage = {
  title: "처리 완료",
  description: "요청이 성공적으로 처리되었습니다.",
};

function AuthSuccessContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") ?? "";
  const { title, description } = messages[type] ?? defaultMessage;

  return (
    <>
      {/* 체크 아이콘 */}
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-50">
        <svg
          className="h-6 w-6 text-primary-500"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>
      </div>

      <h1 className="mt-4 text-center text-2xl font-bold">{title}</h1>
      <p className="mt-2 text-center text-sm text-foreground-secondary">
        {description}
      </p>

      <div className="mt-6">
        <Link href="/login">
          <Button className="w-full">로그인 페이지로 이동</Button>
        </Link>
      </div>
    </>
  );
}

export default function AuthSuccessPage() {
  return (
    <Suspense>
      <AuthSuccessContent />
    </Suspense>
  );
}
