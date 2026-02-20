import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { ScriptsContent } from "@/components/scripts/scripts-content";

export const metadata = {
  title: "스크립트 | 오픽톡닥",
};

export default async function ScriptsPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="pb-8 pt-2 lg:pt-0">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">스크립트</h1>
        <p className="mt-1 text-foreground-secondary">
          AI가 만드는 맞춤 영어 답변으로 OPIc을 준비하세요.
        </p>
      </div>
      <ScriptsContent />
    </div>
  );
}
