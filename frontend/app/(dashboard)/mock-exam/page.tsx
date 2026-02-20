import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { MockExamContent } from "@/components/mock-exam/mock-exam-content";

export const metadata = {
  title: "모의고사 | 오픽톡닥",
};

export default async function MockExamPage() {
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
        <h1 className="text-2xl font-bold text-foreground">모의고사</h1>
        <p className="mt-1 text-foreground-secondary">
          실전과 동일한 환경에서 모의고사를 응시하고 AI 평가를 받으세요.
        </p>
      </div>
      <MockExamContent />
    </div>
  );
}
