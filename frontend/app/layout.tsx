import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | 오픽톡닥",
    default: "오픽톡닥 - AI 기반 OPIc 말하기 학습",
  },
  description:
    "AI와 함께하는 OPIc 영어 말하기 학습 플랫폼. 모의고사, AI 훈련소, 쉐도잉으로 목표 등급을 달성하세요.",
  openGraph: {
    title: "오픽톡닥 - AI 기반 OPIc 말하기 학습",
    description:
      "AI와 함께하는 OPIc 영어 말하기 학습 플랫폼. 모의고사, AI 훈련소, 쉐도잉으로 목표 등급을 달성하세요.",
    url: "https://opictalkdoc.com",
    siteName: "오픽톡닥",
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
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&family=Noto+Serif+KR:wght@400;700&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
