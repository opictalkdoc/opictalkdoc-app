"use client";

import {
  ClipboardList,
  BarChart3,
  PenLine,
  Headphones,
  ClipboardCheck,
  Target,
  ArrowRight,
  Sparkles,
  Check,
} from "lucide-react";
import ScrollReveal from "@/components/motion/ScrollReveal";
import CountUp from "./count-up";
import Pill from "./pill";
import { deepDives } from "./landing-data";

const iconMap = {
  survey: ClipboardList,
  frequency: BarChart3,
  script: PenLine,
  shadowing: Headphones,
  mockexam: ClipboardCheck,
  tutoring: Target,
} as const;

const bgMap = {
  cream: "bg-[#FAF6F1]",
  white: "bg-white",
  warm: "bg-[#F3ECE4]",
} as const;

export default function DeepDiveSection() {
  return (
    <>
      {deepDives.map((dive, idx) => {
        const Icon = iconMap[dive.id as keyof typeof iconMap];
        const isReversed = idx % 2 === 1;

        return (
          <section
            key={dive.id}
            id={`dive-${dive.id}`}
            className={`${bgMap[dive.bg]} py-20 sm:py-[100px]`}
          >
            <div className="mx-auto max-w-[1080px] px-6">
              <div
                className={`flex flex-col gap-10 md:items-center md:gap-16 ${
                  isReversed ? "md:flex-row-reverse" : "md:flex-row"
                }`}
              >
                {/* 텍스트 */}
                <div className="flex-1">
                  <ScrollReveal
                    preset={isReversed ? "fade-right" : "fade-left"}
                    duration={0.5}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-serif text-[0.8rem] font-bold tracking-wider text-[#D4835E]/50">
                        {dive.step}
                      </span>
                      <span className="rounded-md bg-[#D4835E]/10 px-2 py-0.5 text-[0.7rem] font-bold text-[#D4835E]">
                        {dive.badge}
                      </span>
                    </div>
                    <h3 className="mt-4 whitespace-pre-line text-[1.5rem] font-extrabold leading-[1.35] tracking-[-0.03em] text-[#3A2E25] [word-break:keep-all] sm:text-[1.8rem]">
                      {dive.heading}
                    </h3>
                    <ul className="mt-6 flex flex-col gap-3">
                      {dive.points.map((point, i) => (
                        <ScrollReveal
                          key={point}
                          preset="fade-up"
                          delay={i * 0.08}
                          duration={0.4}
                          as="li"
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D4835E]" />
                            <span className="text-[0.95rem] leading-[1.6] text-[#8B7E72]">
                              {point}
                            </span>
                          </div>
                        </ScrollReveal>
                      ))}
                    </ul>
                  </ScrollReveal>
                </div>

                {/* 우측 비주얼 */}
                <div className="flex-1">
                  <ScrollReveal
                    preset={isReversed ? "fade-left" : "fade-right"}
                    duration={0.5}
                    delay={0.15}
                  >
                    {/* 서베이 고정: 항목 카드 */}
                    {dive.surveyItems && (
                      <div className="rounded-2xl border border-[#EAE0D5] bg-[#FAF6F1] p-6 sm:p-8">
                        <p className="mb-3 text-[0.85rem] font-semibold text-[#3A2E25]">
                          하루오픽 기본 서베이
                        </p>
                        <div className="space-y-3">
                          <div className="rounded-xl bg-white p-3">
                            <p className="mb-2 text-[0.75rem] font-semibold text-[#D4835E]">기본 설문</p>
                            <div className="grid grid-cols-2 gap-1.5">
                              {dive.surveyItems.basic.map((item: string) => (
                                <div key={item} className="flex items-center gap-1.5 text-[0.8rem] text-[#8B7E72]">
                                  <Check className="h-3 w-3 shrink-0 text-[#D4835E]" />
                                  {item}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="rounded-xl bg-white p-3">
                            <p className="mb-2 text-[0.75rem] font-semibold text-[#D4835E]">배경 설문 (12개 이상)</p>
                            <div className="flex flex-wrap gap-1.5">
                              {dive.surveyItems.background.map((item: string) => (
                                <span key={item} className="rounded-full bg-[#D4835E]/[0.08] px-2.5 py-1 text-[0.75rem] font-medium text-[#3A2E25]">
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center justify-between rounded-xl bg-[#3A2E25] px-4 py-3">
                            <span className="text-[0.8rem] font-medium text-white/70">난이도</span>
                            <span className="font-serif text-[1.2rem] font-bold text-[#D4835E]">{dive.surveyItems.difficulty}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 스크립트: 7가지 결과 그리드 */}
                    {dive.example && (
                      <div className="rounded-2xl border border-[#EAE0D5] bg-[#FAF6F1] p-6 sm:p-8">
                        <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-[0.85rem] text-[#8B7E72]">
                          <Sparkles className="h-4 w-4 text-[#D4835E]" />
                          <span className="font-medium">
                            &quot;{dive.example.input}&quot;
                          </span>
                        </div>
                        <div className="mt-3 flex items-center justify-center py-1">
                          <ArrowRight className="h-4 w-4 -rotate-90 text-[#D4835E]/40" />
                        </div>
                        <div className="mt-1 grid grid-cols-2 gap-2 sm:grid-cols-3">
                          {dive.example.outputs.map((output, i) => (
                            <div
                              key={output}
                              className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-[0.8rem] font-medium ${
                                i === 0
                                  ? "col-span-2 bg-[#D4835E] text-white sm:col-span-3"
                                  : "bg-white text-[#3A2E25]"
                              }`}
                            >
                              <div
                                className={`h-1.5 w-1.5 rounded-full ${
                                  i === 0 ? "bg-white/50" : "bg-[#D4835E]/30"
                                }`}
                              />
                              {output}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 쉐도잉: 4단계 */}
                    {dive.steps4 && (
                      <div className="rounded-2xl border border-[#EAE0D5] bg-white p-6 sm:p-8">
                        <p className="mb-4 text-[0.85rem] font-semibold text-[#3A2E25]">
                          4단계 체화 프로세스
                        </p>
                        <div className="flex flex-col gap-2">
                          {dive.steps4.map((step, i) => (
                            <div
                              key={step}
                              className="flex items-center gap-3 rounded-xl bg-[#FAF6F1] px-4 py-3"
                            >
                              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#D4835E]/10 font-serif text-[0.75rem] font-bold text-[#D4835E]">
                                {i + 1}
                              </span>
                              <span className="text-[0.9rem] font-medium text-[#3A2E25]">
                                {step}
                              </span>
                              {i < dive.steps4!.length - 1 && (
                                <ArrowRight className="ml-auto h-3 w-3 text-[#B5A99D]" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 모의고사: 3개 통계 */}
                    {dive.stats && (
                      <div className="rounded-2xl border border-[#EAE0D5] bg-[#FAF6F1] p-6 sm:p-8">
                        <div className="grid grid-cols-3 gap-4">
                          {dive.stats.map((stat) => (
                            <div
                              key={stat.label}
                              className="flex flex-col items-center text-center"
                            >
                              <span className="font-serif text-[2rem] font-bold text-[#D4835E] sm:text-[2.5rem]">
                                <CountUp
                                  target={stat.value}
                                  suffix={stat.suffix}
                                />
                              </span>
                              <span className="mt-1 text-[0.8rem] font-medium text-[#3A2E25]">
                                {stat.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 튜터링: 3단 플로우 */}
                    {dive.flow && (
                      <div className="rounded-2xl border border-[#EAE0D5] bg-white p-6 sm:p-8">
                        <div className="flex flex-col gap-3">
                          {dive.flow.map((step, i) => (
                            <div key={step}>
                              <div className="flex items-center gap-3 rounded-xl bg-[#FAF6F1] px-4 py-3.5">
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#D4835E]/10 font-serif text-[0.75rem] font-bold text-[#D4835E]">
                                  {i + 1}
                                </span>
                                <span className="text-[0.9rem] font-semibold text-[#3A2E25]">
                                  {step}
                                </span>
                              </div>
                              {i < dive.flow!.length - 1 && (
                                <div className="flex justify-center py-1">
                                  <ArrowRight className="h-4 w-4 -rotate-90 text-[#D4835E]/30" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        <p className="mt-4 text-center text-[0.85rem] text-[#8B7E72]">
                          아는 것을 할 수 있는 것으로. 반복 수행으로 체화합니다.
                        </p>
                      </div>
                    )}

                    {/* 빈도분석: 아이콘 비주얼 */}
                    {!dive.surveyItems &&
                      !dive.example &&
                      !dive.steps4 &&
                      !dive.stats &&
                      !dive.flow && (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-[#EAE0D5] bg-white p-8 sm:p-12">
                          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#D4835E]/10">
                            <Icon className="h-10 w-10 text-[#D4835E]" />
                          </div>
                          <p className="mt-4 text-center text-[0.9rem] font-medium text-[#8B7E72]">
                            471개 기출 데이터 기반
                            <br />
                            주제별 · 질문별 빈도 분석
                          </p>
                        </div>
                      )}
                  </ScrollReveal>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
