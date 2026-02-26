import { redirect } from "next/navigation";
import { ImmersiveHeader } from "@/components/layout/immersive-header";
import { ShadowingContent } from "@/components/shadowing/shadowing-content";
import { getShadowingData } from "@/lib/actions/scripts";

export const metadata = {
  title: "쉐도잉 훈련 | 오픽톡닥",
};

interface PageProps {
  searchParams: Promise<{ packageId?: string; scriptId?: string }>;
}

export default async function ShadowingPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { packageId } = params;

  if (!packageId) {
    redirect("/scripts");
  }

  // 서버에서 패키지 데이터 사전 조회
  const result = await getShadowingData(packageId);

  if (result.error || !result.data) {
    return (
      <>
        <ImmersiveHeader title="쉐도잉 훈련" backHref="/scripts" />
        <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
          <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-8 text-center">
            <p className="text-lg font-semibold text-foreground">
              패키지를 불러올 수 없습니다
            </p>
            <p className="mt-2 text-sm text-foreground-secondary">
              {result.error || "패키지가 존재하지 않거나 접근 권한이 없습니다."}
            </p>
          </div>
        </main>
      </>
    );
  }

  const topicLabel = result.data.topic
    ? `${result.data.topic} · 쉐도잉`
    : "쉐도잉 훈련";

  return (
    <>
      <ImmersiveHeader title={topicLabel} backHref="/scripts" />
      <main className="flex flex-1 flex-col">
        <ShadowingContent data={result.data} />
      </main>
    </>
  );
}
