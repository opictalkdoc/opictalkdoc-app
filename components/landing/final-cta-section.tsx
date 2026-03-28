"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/motion/ScrollReveal";

export default function FinalCtaSection() {
  return (
    <section className="cta-gradient relative overflow-hidden py-24 text-center sm:py-[120px]">
      <div className="pointer-events-none absolute right-[-100px] top-[-100px] h-[400px] w-[400px] bg-[radial-gradient(circle,rgba(212,131,94,0.08)_0%,transparent_70%)]" />
      <div className="relative mx-auto max-w-3xl px-6">
        <ScrollReveal preset="fade-up">
          <h2 className="text-[1.8rem] font-extrabold leading-[1.35] tracking-[-0.03em] text-[#3A2E25] sm:text-[2.4rem]">
            당신의 하루가
            <br />
            가장 완벽한 OPIc 준비입니다
          </h2>
        </ScrollReveal>
        <ScrollReveal preset="fade-up" delay={0.15}>
          <p className="mt-4 text-[1rem] leading-[1.7] text-[#8B7E72] sm:text-[1.1rem]">
            지금 무료로 시작하세요.
            <br className="sm:hidden" />{" "}
            모의고사 1회, 빈도 분석, 쉐도잉 훈련이 포함됩니다.
          </p>
        </ScrollReveal>
        <ScrollReveal preset="scale-up" delay={0.3}>
          <Link
            href="/signup"
            className="mt-9 inline-flex items-center gap-2 rounded-full bg-[#D4835E] px-11 py-[18px] text-[1.1rem] font-extrabold text-white shadow-[0_4px_20px_rgba(212,131,94,0.3)] transition-all hover:-translate-y-0.5 hover:bg-[#C07350]"
          >
            무료로 시작하기 <ArrowRight className="h-5 w-5" />
          </Link>
        </ScrollReveal>
        <ScrollReveal preset="fade-in" delay={0.4}>
          <p className="mt-[18px] text-[0.85rem] text-[#B5A99D]">
            지금 바로, 부담 없이 시작하세요
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
