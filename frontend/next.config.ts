import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  experimental: {
    // lucide-react 등 대형 아이콘 라이브러리 번들 최적화
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
