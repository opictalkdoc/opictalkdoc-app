import { MockExamContent } from "@/components/mock-exam/mock-exam-content";

export const metadata = {
  title: "모의고사 | 오픽톡닥",
};

// 인증은 미들웨어에서 처리
export default function MockExamPage() {
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
