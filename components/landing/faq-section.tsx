"use client";

import { Plus } from "lucide-react";
import ScrollReveal from "@/components/motion/ScrollReveal";
import Pill from "./pill";
import { faqs } from "./landing-data";

export default function FaqSection() {
  return (
    <section className="bg-[#F3ECE4] py-20 sm:py-[120px]">
      <div className="mx-auto max-w-[780px] px-6">
        <ScrollReveal preset="fade-up" className="mb-12 text-center">
          <Pill>자주 묻는 질문</Pill>
          <h2 className="mt-4 text-[1.8rem] font-extrabold tracking-[-0.03em] text-[#3A2E25] sm:text-[2.4rem]">
            궁금한 점이 있으신가요?
          </h2>
        </ScrollReveal>

        <div>
          {faqs.map((faq, i) => (
            <ScrollReveal
              key={faq.q}
              preset="fade-up"
              delay={i * 0.06}
              duration={0.4}
            >
              <details className="group border-b border-[#EAE0D5]">
                <summary className="flex cursor-pointer items-center justify-between py-[22px] text-[1rem] font-semibold text-[#3A2E25] sm:text-[1.05rem] [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <Plus className="h-5 w-5 flex-shrink-0 text-[#B5A99D] transition-transform group-open:rotate-45" />
                </summary>
                <div className="pb-[22px] text-[0.95rem] leading-[1.7] text-[#8B7E72]">
                  {faq.a}
                </div>
              </details>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
