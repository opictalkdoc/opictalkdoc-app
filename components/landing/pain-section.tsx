"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/motion/ScrollReveal";
import CountUp from "./count-up";
import Pill from "./pill";
import { painCards } from "./landing-data";

export default function PainSection() {
  return (
    <section className="bg-white py-20 sm:py-[120px]">
      <div className="mx-auto max-w-[1080px] px-6">
        {/* 헤딩 */}
        <ScrollReveal preset="fade-up" className="text-center">
          <Pill>전략 점검</Pill>
          <h2 className="mt-5 text-[1.8rem] font-extrabold leading-[1.3] tracking-[-0.03em] text-[#3A2E25] sm:text-[2.4rem]">
            OPIc,
            <br className="sm:hidden" /> 정말 알고 준비하고 계세요?
          </h2>
        </ScrollReveal>

        {/* 질문 카드 3열 */}
        <div className="mx-auto mt-10 grid max-w-[860px] gap-2.5 sm:mt-12 sm:grid-cols-3 sm:gap-4">
          {painCards.map((item, i) => (
            <ScrollReveal
              key={item.quote}
              preset="fade-up"
              delay={i * 0.08}
              duration={0.5}
            >
              <div className="flex flex-row items-center justify-between rounded-[14px] bg-[#FAF6F1] px-4 py-5 transition-colors hover:bg-[#F3ECE4] sm:flex-col sm:gap-3 sm:px-5 sm:py-7 sm:text-center">
                <span className="text-[0.95rem] text-[#8B7E72] sm:text-[1rem]">
                  {item.quote}
                </span>
                <span className="px-3 font-bold text-[#3A2E25] sm:hidden">
                  →
                </span>
                <span className="hidden text-[#D4835E] sm:block">↓</span>
                <strong className="text-[0.95rem] font-bold text-[#3A2E25] sm:text-[1.15rem]">
                  {item.nudge}
                </strong>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* 68% 카운트업 */}
        <ScrollReveal
          preset="fade-up"
          delay={0.2}
          className="mt-14 text-center sm:mt-20"
        >
          <p className="text-[1.05rem] text-[#8B7E72]">대충 아는 사람의</p>
          <p className="font-serif text-[4rem] font-bold leading-none tracking-[-0.05em] text-[#D4835E] sm:text-[7rem]">
            <CountUp target={68} suffix="%" />
          </p>
          <p className="mt-2 text-[1.05rem] text-[#8B7E72]">
            가 IM2 이하입니다
          </p>
          <Link
            href="/strategy"
            className="mt-7 inline-flex items-center gap-1.5 rounded-full bg-[#D4835E] px-10 py-4 text-[16px] font-bold text-white shadow-lg shadow-[#D4835E]/25 transition-all hover:-translate-y-0.5 hover:bg-[#C4734E] hover:shadow-xl hover:shadow-[#D4835E]/30"
          >
            내 전략, 괜찮을까? <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-3 text-[0.85rem] text-[#B5A99D]">
            30초면 확인할 수 있습니다
          </p>
        </ScrollReveal>

        {/* 브릿지 카피 */}
        <ScrollReveal preset="fade-in" delay={0.3} duration={0.8}>
          <p className="mt-16 text-center text-[1rem] text-[#8B7E72] sm:mt-20 sm:text-[1.05rem]">
            하루오픽은{" "}
            <strong className="text-[#3A2E25]">정확한 데이터</strong>와{" "}
            <strong className="text-[#3A2E25]">나의 스토리</strong>로
            <br className="sm:hidden" />{" "}
            전략적으로 준비합니다.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
