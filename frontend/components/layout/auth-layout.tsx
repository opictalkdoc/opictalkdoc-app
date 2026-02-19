import Link from "next/link";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* 로고 */}
        <div className="mb-8 text-center">
          <Link href="/">
            <span className="font-display text-2xl text-primary-500">
              오픽톡닥
            </span>
          </Link>
        </div>

        {/* 카드 */}
        <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-6 shadow-md sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
