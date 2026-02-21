import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getUser } from "@/lib/auth";
import { GradeNudgeBanner } from "@/components/ui/grade-nudge-banner";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  const currentGrade = user?.user_metadata?.current_grade || "";
  const targetGrade = user?.user_metadata?.target_grade || "";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <GradeNudgeBanner
        currentGrade={currentGrade}
        targetGrade={targetGrade}
      />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>
      <Footer />
    </div>
  );
}
