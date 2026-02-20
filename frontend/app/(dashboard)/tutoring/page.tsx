import { TutoringContent } from "@/components/tutoring/tutoring-content";

export const metadata = {
  title: "튜터링 | 오픽톡닥",
};

// 인증은 미들웨어에서 처리
export default function TutoringPage() {
  return (
    <div className="pb-8 pt-2 lg:pt-0">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">튜터링</h1>
        <p className="mt-1 text-foreground-secondary">
          AI 주치의 톡닥이가 진단하고, 처방하고, 훈련까지 함께합니다.
        </p>
      </div>
      <TutoringContent />
    </div>
  );
}
