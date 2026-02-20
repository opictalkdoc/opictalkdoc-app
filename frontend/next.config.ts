import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "http",
        hostname: "k.kakaocdn.net",
      },
      {
        protocol: "https",
        hostname: "k.kakaocdn.net",
      },
    ],
  },
  experimental: {
    // lucide-react 등 대형 아이콘 라이브러리 번들 최적화
    optimizePackageImports: ["lucide-react"],
    // 클라이언트 라우터 캐시: 같은 페이지 재방문 시 즉시 전환
    staleTimes: {
      dynamic: 30, // 동적 페이지 30초간 클라이언트 캐시
    },
  },
};

export default nextConfig;
