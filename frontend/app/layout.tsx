import type { Metadata } from "next";
import { Inter, Jua, Fraunces } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const jua = Jua({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jua",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  title: {
    template: "%s | OPIcTalkDoc",
    default: "OPIcTalkDoc - AI 기반 OPIc 말하기 학습",
  },
  description:
    "AI와 함께하는 OPIc 영어 말하기 학습 플랫폼. 모의고사, AI 훈련소, 쉐도잉으로 목표 등급을 달성하세요.",
  openGraph: {
    title: "OPIcTalkDoc - AI 기반 OPIc 말하기 학습",
    description:
      "AI와 함께하는 OPIc 영어 말하기 학습 플랫폼. 모의고사, AI 훈련소, 쉐도잉으로 목표 등급을 달성하세요.",
    url: "https://opictalkdoc.com",
    siteName: "OPIcTalkDoc",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${inter.variable} ${jua.variable} ${fraunces.variable}`}>
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
