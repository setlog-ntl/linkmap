import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,

  // Barrel export 최적화 — lucide-react(296파일), recharts 등의 전체 라이브러리 번들링 방지
  // Workers CPU 시간 절약 (cold start 시 파싱 비용 대폭 감소)
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'recharts',
      '@xyflow/react',
      'react-markdown',
      'date-fns',
      'framer-motion',
    ],
  },

  // Cloudflare Workers 배포 시 NEXT_PUBLIC_* 환경변수가 클라이언트 번들에 인라인되도록 보장
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    NEXT_PUBLIC_POLAR_PRODUCT_PRO: process.env.NEXT_PUBLIC_POLAR_PRODUCT_PRO,
    NEXT_PUBLIC_POLAR_PRODUCT_TEAM: process.env.NEXT_PUBLIC_POLAR_PRODUCT_TEAM,
    NEXT_PUBLIC_POLAR_PRODUCT_PRO_YEARLY: process.env.NEXT_PUBLIC_POLAR_PRODUCT_PRO_YEARLY,
    NEXT_PUBLIC_POLAR_PRODUCT_TEAM_YEARLY: process.env.NEXT_PUBLIC_POLAR_PRODUCT_TEAM_YEARLY,
  },
  turbopack: {},

  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },

  async headers() {
    // CSP: report-only 모드로 시작 — 위반 시 콘솔 로그만 출력, 차단하지 않음
    const cspDirectives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://js.stripe.com https://static.cloudflareinsights.com https://www.clarity.ms https://scripts.clarity.ms",
      "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com",
      "font-src 'self' https://cdn.jsdelivr.net https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https://*.supabase.co https://avatars.githubusercontent.com https://lh3.googleusercontent.com https://www.google-analytics.com https://www.googletagmanager.com https://cdn.jsdelivr.net https://c.clarity.ms https://c.bing.com",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://stats.g.doubleclick.net https://cloudflareinsights.com https://j.clarity.ms https://c.clarity.ms https://v.clarity.ms https://c.bing.com",
      "frame-src https://js.stripe.com https://*.supabase.co",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ');

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy-Report-Only',
            value: cspDirectives,
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
