import { ReviewsContent } from "@/components/reviews/reviews-content";
import { getStats } from "@/lib/actions/reviews";

export const metadata = {
  title: "시험후기 | 오픽톡닥",
};

export default async function ReviewsPage() {
  const stats = await getStats();

  return (
    <div className="pb-8 pt-2 lg:pt-0">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">시험후기</h1>
        <p className="mt-1 text-foreground-secondary">
          실제 시험 후기를 분석하여 출제 빈도를 파악하세요.
        </p>
      </div>
      <ReviewsContent initialStats={stats} />
    </div>
  );
}
