"use client";

import ScrollReveal from "@/components/motion/ScrollReveal";
import CountUp from "./count-up";
import Pill from "./pill";
import { proofStats } from "./landing-data";

export default function SocialProofSection() {
  return (
    <section className="bg-[#F3ECE4] py-20 sm:py-[100px]">
      <div className="mx-auto max-w-[1080px] px-6">
        <ScrollReveal preset="fade-up" className="text-center">
          <Pill>하루오픽의 학습 체계</Pill>
          <h2 className="mt-5 text-[1.8rem] font-extrabold leading-[1.3] tracking-[-0.03em] text-[#3A2E25] sm:text-[2.4rem]">
            숫자로 보는 하루오픽
          </h2>
        </ScrollReveal>

        <div className="mx-auto mt-12 grid max-w-[800px] gap-4 sm:grid-cols-3 sm:gap-6">
          {proofStats.map((stat, i) => (
            <ScrollReveal
              key={stat.label}
              preset="scale-up"
              delay={i * 0.1}
              duration={0.5}
            >
              <div className="flex flex-col items-center rounded-2xl bg-white p-6 text-center shadow-[0_2px_16px_rgba(0,0,0,0.03)] sm:p-8">
                <span className="font-serif text-[2.5rem] font-bold text-[#D4835E] sm:text-[3rem]">
                  <CountUp target={stat.value} suffix={stat.suffix} />
                </span>
                <span className="mt-2 text-[0.95rem] font-bold text-[#3A2E25]">
                  {stat.label}
                </span>
                <span className="mt-1 text-[0.8rem] text-[#8B7E72]">
                  {stat.desc}
                </span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
