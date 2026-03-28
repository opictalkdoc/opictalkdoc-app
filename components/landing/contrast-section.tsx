"use client";

import { X, Check } from "lucide-react";
import ScrollReveal from "@/components/motion/ScrollReveal";
import Pill from "./pill";
import { contrastItems } from "./landing-data";

export default function ContrastSection() {
  return (
    <section className="bg-[#F3ECE4] py-20 sm:py-[120px]">
      <div className="mx-auto max-w-[1080px] px-6">
        <ScrollReveal preset="fade-up" className="text-center">
          <Pill>전략적 접근</Pill>
          <h2 className="mt-5 text-[1.8rem] font-extrabold leading-[1.3] tracking-[-0.03em] text-[#3A2E25] [word-break:keep-all] sm:text-[2.4rem]">
            OPIc은 전략으로
            <br />
            준비하는 시험입니다
          </h2>
        </ScrollReveal>

        {/* 대비 테이블 */}
        <div className="mx-auto mt-12 max-w-[780px] sm:mt-16">
          {/* 헤더 — MD+ */}
          <div className="mb-5 hidden grid-cols-2 gap-6 md:grid">
            <span className="text-center text-sm font-semibold text-[#B5A99D]">
              무작정 준비
            </span>
            <span className="text-center text-sm font-semibold text-[#D4835E]">
              전략적 준비
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {contrastItems.map((item, i) => (
              <ScrollReveal
                key={item.before}
                preset="fade-up"
                delay={i * 0.06}
                duration={0.4}
              >
                <div className="grid grid-cols-1 gap-2 rounded-2xl bg-white p-3 shadow-[0_2px_12px_rgba(0,0,0,0.03)] md:grid-cols-2 md:gap-6 md:p-4">
                  {/* 무작정 준비 */}
                  <div className="flex items-center gap-3 rounded-xl bg-[#FAF6F1] px-6 py-3.5 md:px-10">
                    <X className="h-4 w-4 shrink-0 text-[#B5A99D]" />
                    <span className="text-[0.9rem] text-[#8B7E72] line-through decoration-[#B5A99D]/40">
                      {item.before}
                    </span>
                  </div>
                  {/* 전략적 준비 */}
                  <div className="flex items-center gap-3 rounded-xl bg-[#D4835E]/[0.08] px-6 py-3.5 md:px-10">
                    <Check className="h-4 w-4 shrink-0 text-[#D4835E]" />
                    <span className="text-[0.9rem] font-semibold text-[#3A2E25]">
                      {item.after}
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* 하단 카피 */}
        <ScrollReveal preset="fade-up" delay={0.3} className="mt-12 text-center sm:mt-16">
          <p className="text-[1rem] leading-[1.7] text-[#8B7E72] sm:text-[1.1rem]">
            시험을 아는 것이 전략의 시작입니다.
            <br className="sm:hidden" />{" "}
            <span className="font-semibold text-[#3A2E25]">하루오픽은 구조를 알고 준비합니다.</span>
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
