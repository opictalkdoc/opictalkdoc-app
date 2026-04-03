import { PatternsContent } from "@/components/patterns/patterns-content";

export const metadata = {
  title: "만능패턴",
};

export default function PatternsPage() {
  return (
    <div className="pb-6 pt-1 sm:pb-8 sm:pt-2 lg:pt-0">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">
          만능패턴
        </h1>
        <p className="mt-0.5 text-sm text-foreground-secondary sm:mt-1 sm:text-base">
          어떤 주제에도 바로 쓸 수 있는 OPIc 필수 패턴을 익혀보세요.
        </p>
      </div>
      <PatternsContent />
    </div>
  );
}
