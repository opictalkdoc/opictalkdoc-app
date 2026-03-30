"use client";

import { Check, X, ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/motion/ScrollReveal";
import Link from "next/link";

/* ── 서베이 항목 데이터 ── */

const SURVEY_ITEMS = [
  { cat: "직업", choice: "일 경험 없음", strategy: "차단", color: "text-[#BF5B43]", reason: "직장 콤보가 시험에 안 나옴" },
  { cat: "학생 여부", choice: "아니오", strategy: "차단", color: "text-[#BF5B43]", reason: "학교/수업 콤보가 시험에 안 나옴" },
  { cat: "수강", choice: "5년 이상", strategy: "차단", color: "text-[#BF5B43]", reason: "수강 관련 꼬리 질문 안 나옴" },
  { cat: "거주지", choice: "홀로 거주", strategy: "축소", color: "text-amber-600", reason: "가족 묘사 문제 제거" },
  { cat: "여가 활동", choice: "영화, 쇼핑, TV, 공연, 콘서트", strategy: "핵심", color: "text-primary-600", reason: "핵심 학습 주제" },
  { cat: "취미/관심사", choice: "음악 감상 (단독)", strategy: "핵심", color: "text-primary-600", reason: "하나만 고르면 100% 출제" },
  { cat: "운동", choice: "조깅, 걷기, 운동안함", strategy: "필러", color: "text-[#8B7E72]", reason: "선택해도 출제 0건" },
  { cat: "휴가/여행", choice: "집휴가, 국내여행, 해외여행", strategy: "핵심", color: "text-primary-600", reason: "핵심 학습 주제" },
];

export default function SurveySection() {
  return (
    <section id="dive-survey" className="bg-white py-20 sm:py-[100px]">
      <div className="mx-auto max-w-[1080px] px-6">
        <div className="flex flex-col gap-10 md:gap-12">
          {/* 상단: 텍스트 */}
          <div className="text-center">
            <ScrollReveal preset="fade-up" duration={0.5}>
              <div className="flex items-center justify-center gap-3">
                <span className="font-serif text-[0.8rem] font-bold tracking-wider text-[#D4835E]/50">
                  가장 중요한 첫 단계
                </span>
                <span className="rounded-md bg-[#D4835E]/10 px-2 py-0.5 text-[0.7rem] font-bold text-[#D4835E]">
                  서베이 고정
                </span>
              </div>
              <h2 className="mt-4 whitespace-pre-line text-[1.5rem] font-extrabold leading-[1.35] tracking-[-0.03em] text-[#3A2E25] [word-break:keep-all] sm:text-[1.8rem]">
                {"하루오픽 권장 서베이가\n곧 전략입니다"}
              </h2>
              <p className="mt-3 text-[0.85rem] text-[#8B7E72] [word-break:keep-all]">
                하루오픽은 이 서베이를 기반으로 운영됩니다.
              </p>
              <p className="mt-3 whitespace-pre-line sm:whitespace-normal text-[0.9rem] leading-[1.7] text-[#8B7E72] [word-break:keep-all] md:mx-auto md:max-w-[540px]">
                {"최소의 노력으로 최대의 효과를 내는\n서베이 전략, "}<span className="font-semibold text-[#3A2E25]">함께 하시겠어요?</span>
              </p>

              {/* 전략 요약 3줄 */}
              <div className="mt-6 flex flex-col items-start mx-auto w-fit space-y-3">
                {[
                  { label: "차단", desc: "직장·학교·수강 콤보를 원천 제거", color: "bg-[#BF5B43]" },
                  { label: "축소", desc: "불필요한 출제 범위를 줄여 학습 부담 감소", color: "bg-amber-500" },
                  { label: "핵심", desc: "빈출 주제만 골라 학습 범위 압축", color: "bg-[#D4835E]" },
                  { label: "필러", desc: "항목 수만 채우고 출제되지 않는 안전 선택", color: "bg-[#B5A99D]" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className={`${item.color} shrink-0 rounded-md px-2 py-0.5 text-[0.65rem] font-bold text-white`}>
                      {item.label}
                    </span>
                    <span className="text-[0.85rem] text-[#8B7E72]">{item.desc}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Link
                href="/strategy"
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#3A2E25] px-5 py-3 text-[0.85rem] font-semibold text-white transition-colors hover:bg-[#4A3F36] sm:inline-flex sm:w-auto"
              >
                전략 가이드 자세히 보기
                <ArrowRight className="h-4 w-4" />
              </Link>
            </ScrollReveal>
          </div>

          {/* 하단: 서베이 카드 */}
          <div className="md:mx-auto md:w-full md:max-w-[600px]">
            <ScrollReveal preset="fade-up" duration={0.5} delay={0.15}>
              <div className="rounded-2xl border border-[#EAE0D5] bg-[#FAF6F1] p-5 sm:p-7">
                <div className="flex items-center justify-between">
                  <p className="text-[0.85rem] font-semibold text-[#3A2E25]">
                    하루오픽 권장 서베이
                  </p>
                  <span className="rounded-full bg-[#3A2E25] px-2.5 py-0.5 text-[0.65rem] font-bold text-white">
                    난이도 5-5
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  {SURVEY_ITEMS.map((item) => (
                    <div
                      key={item.cat}
                      className="flex items-center gap-3 rounded-xl bg-white px-3.5 py-2.5"
                    >
                      {/* 전략 아이콘 */}
                      {item.strategy === "차단" ? (
                        <X className="h-3.5 w-3.5 shrink-0 text-[#BF5B43]" />
                      ) : item.strategy === "축소" ? (
                        <X className="h-3.5 w-3.5 shrink-0 text-amber-600" />
                      ) : item.strategy === "필러" ? (
                        <div className="h-3.5 w-3.5 shrink-0 rounded-full border-2 border-[#B5A99D]" />
                      ) : (
                        <Check className="h-3.5 w-3.5 shrink-0 text-[#D4835E]" />
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[0.75rem] font-bold text-[#3A2E25]">{item.cat}</span>
                          <span className={`text-[0.65rem] font-semibold ${item.color}`}>
                            {item.strategy}
                          </span>
                        </div>
                        <p className="text-[0.7rem] text-[#8B7E72]">{item.choice}</p>
                      </div>

                      <span className="shrink-0 text-[0.65rem] text-[#B5A99D]">{item.reason}</span>
                    </div>
                  ))}
                </div>

                {/* 하단 요약 */}
                <div className="mt-4 rounded-xl bg-[#3A2E25] px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[0.8rem] font-medium text-white/70">학습 주제</span>
                    <span className="font-serif text-[1.1rem] font-bold text-[#D4835E]">10개로 압축</span>
                  </div>
                  <p className="mt-1 text-[0.7rem] text-white/40">
                    권장 서베이 선택 → 출제 범위 고정 → 시험의 60% 이상 커버
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
