import type { Metadata } from "next";
import StrategyContent from "./StrategyContent";

export const metadata: Metadata = {
  title: "OPIc 전략 가이드 | 오픽톡닥",
  description:
    "OPIc 시험의 60%는 서베이가 결정합니다. 데이터 기반 전략으로 시험의 90% 이상을 커버하는 방법.",
};

export default function StrategyPage() {
  return <StrategyContent />;
}
