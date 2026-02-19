import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { MyPageContent } from "@/components/mypage/mypage-content";

export const metadata = {
  title: "마이페이지 | 오픽톡닥",
};

export default async function MyPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const userData = {
    email: user.email || "",
    name: user.user_metadata?.display_name || "",
    avatarUrl: user.user_metadata?.avatar_url || "",
    provider: user.app_metadata?.provider || "email",
    createdAt: user.created_at,
    targetGrade: user.user_metadata?.target_grade || "",
    examDate: user.user_metadata?.exam_date || "",
    weeklyGoal: user.user_metadata?.weekly_goal || "",
  };

  return (
    <div className="pb-8 pt-2 lg:pt-0">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">마이페이지</h1>
        <p className="mt-1 text-foreground-secondary">
          계정 정보와 학습 설정을 관리하세요.
        </p>
      </div>
      <MyPageContent user={userData} />
    </div>
  );
}
