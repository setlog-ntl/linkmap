/**
 * Service presets: common combinations of services for quick project setup.
 * These are shown in the onboarding flow.
 */

export interface ServicePreset {
  id: string;
  name: string;
  name_ko: string;
  description: string;
  description_ko: string;
  slugs: string[];
  icon: string;
}

export const servicePresets: ServicePreset[] = [
  {
    id: 'nextjs-supabase-vercel',
    name: 'Next.js + Supabase + Vercel',
    name_ko: 'Next.js + Supabase + Vercel',
    description: 'Full-stack starter with auth, database, and hosting',
    description_ko: '인증, 데이터베이스, 호스팅을 포함한 풀스택 스타터',
    slugs: ['supabase', 'vercel', 'clerk', 'resend'],
    icon: 'rocket',
  },
  {
    id: 'saas-starter',
    name: 'SaaS Starter',
    name_ko: 'SaaS 스타터',
    description: 'Complete SaaS stack with payments, auth, and monitoring',
    description_ko: '결제, 인증, 모니터링을 포함한 SaaS 스택',
    slugs: ['supabase', 'vercel', 'stripe', 'clerk', 'resend', 'posthog', 'sentry'],
    icon: 'building',
  },
  {
    id: 'ai-app',
    name: 'AI Application',
    name_ko: 'AI 앱',
    description: 'AI-powered app with LLM, vector DB, and storage',
    description_ko: 'LLM, 벡터 DB, 스토리지를 포함한 AI 앱',
    slugs: ['openai', 'anthropic', 'supabase', 'vercel', 'uploadthing'],
    icon: 'brain',
  },
  {
    id: 'korean-saas',
    name: 'Korean SaaS',
    name_ko: '한국형 SaaS',
    description: 'SaaS optimized for Korean market with local payments and social login',
    description_ko: '토스페이먼츠, 카카오 로그인 등 한국 시장 최적화 SaaS',
    slugs: ['supabase', 'vercel', 'kakao-login', 'naver-login', 'resend'],
    icon: 'flag',
  },
  {
    id: 'blog-portfolio',
    name: 'Blog / Portfolio',
    name_ko: '블로그 / 포트폴리오',
    description: 'Simple content site with CMS, analytics, and deploy',
    description_ko: 'CMS, 분석, 배포를 포함한 콘텐츠 사이트',
    slugs: ['vercel', 'sanity', 'posthog'],
    icon: 'pen',
  },
];
