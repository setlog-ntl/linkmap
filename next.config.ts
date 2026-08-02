import type { NextConfig } from "next";

// 잘린/레거시 anon 키로는 빌드 자체를 중단한다 — 어떤 빌드 파이프라인(GitHub Actions,
// Cloudflare Workers Builds, 로컬)을 타든 오염 번들이 배포되는 것을 원천 차단.
// 2026-08-01~02: CF Workers Builds의 빌드 변수에 앞글자 잘린 키(b_publishable_…)가
// 저장되어 매 push마다 오염 배포가 라이브를 덮어쓰던 사고의 재발 방지.
// (키 부재는 허용 — 배포 외 목적의 빌드를 막지 않는다. CI 테스트 빌드는 placeholder-key 사용)
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (anonKey && anonKey !== 'placeholder-key' && !anonKey.startsWith('sb_publishable_')) {
  throw new Error(
    `NEXT_PUBLIC_SUPABASE_ANON_KEY 형식 오류(접두사 "${anonKey.slice(0, 8)}…") — ` +
    'sb_publishable_ 키가 아니므로 빌드를 중단합니다. 빌드 환경변수를 확인하세요.'
  );
}

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
    // CSP 위반 리포트 수집 엔드포인트 (레드팀 F-5 Stage 1).
    // report-only인데 수집처가 없어 무의미했던 것을 실효화 — 위반이 /api/csp-report로 전송된다.
    const cspReportPath = '/api/csp-report';
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';
    const cspReportUrl = appUrl ? `${appUrl}${cspReportPath}` : cspReportPath;

    // CSP: report-only 모드 — 위반을 수집만 하고 차단하지 않음.
    // enforce 전환 전, 프로덕션에서 실제 걸리는 리소스를 관찰한다.
    const cspDirectives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://js.stripe.com https://static.cloudflareinsights.com https://www.clarity.ms https://scripts.clarity.ms",
      "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com",
      "font-src 'self' https://cdn.jsdelivr.net https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https://*.supabase.co https://avatars.githubusercontent.com https://lh3.googleusercontent.com https://www.google-analytics.com https://www.googletagmanager.com https://*.google.com https://*.google.co.kr https://cdn.jsdelivr.net https://c.clarity.ms https://c.bing.com https://images.unsplash.com https://plus.unsplash.com",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://stats.g.doubleclick.net https://cloudflareinsights.com https://*.clarity.ms https://c.bing.com",
      "frame-src https://js.stripe.com https://*.supabase.co https://*.github.io",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      // 위반 리포트 전송처 — report-uri(레거시·광범위 지원) + report-to(Reporting API)
      `report-uri ${cspReportPath}`,
      "report-to csp-endpoint",
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
            // Reporting API: report-to 그룹 'csp-endpoint'의 실제 수신 URL 정의
            key: 'Reporting-Endpoints',
            value: `csp-endpoint="${cspReportUrl}"`,
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
