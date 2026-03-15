import { GUIDE_LIST } from '@/data/ui/guide-meta';

const SITE_URL = 'https://www.linkmap.biz';

export function GET() {
  const guideLines = GUIDE_LIST.map(
    (g) => `- ${g.title}: ${g.description} → ${SITE_URL}${g.href}`
  ).join('\n');

  const body = `# Linkmap
> 바이브 코딩 플랫폼 — 서비스 연결 시각화, API 키 암호화 관리, 환경변수 자동 설정, 원클릭 배포

## 소개
Linkmap(linkmap.biz)은 바이브 코딩 시대의 프로젝트 설정 플랫폼입니다.
초보자부터 개발자까지, 복잡한 서비스 연결과 환경변수 관리를 쉽고 안전하게 해결합니다.

## 핵심 기능
- **서비스 카탈로그**: 80+ 외부 서비스(Supabase, Vercel, OpenAI 등)의 연결 방법·환경변수·가격 정보를 한곳에서 확인
- **서비스 맵 시각화**: React Flow 기반으로 프로젝트의 서비스 연결 구조를 시각적으로 파악
- **API 키 암호화 관리**: AES-256-GCM 알고리즘으로 모든 시크릿을 암호화 저장
- **환경변수 자동 점검**: 누락·형식 오류·만료 여부를 자동으로 검사
- **원클릭 배포**: 개발자 홈, 링크카드, 디지털 명함 등 6개 템플릿을 3분 만에 배포
- **GitHub 연동**: 리포지토리 시크릿을 자동으로 배포·동기화
- **교육 가이드**: 환경변수, 인증, 프론트엔드, 백엔드, 배포 등 10개 교육 콘텐츠

## 요금제
- **Free**: 프로젝트 3개, 환경변수 50개, 서비스 카탈로그 전체 열람
- **Pro**: 프로젝트 무제한, 환경변수 무제한, GitHub 시크릿 자동 배포, 팀 협업

## 교육 가이드
${guideLines}

## 주요 서비스 카테고리
- 인증: Supabase Auth, Clerk, NextAuth, OAuth (Google/GitHub/Kakao/Naver/Apple)
- 데이터베이스: Supabase, Firebase, PlanetScale, Neon
- 배포·호스팅: Vercel, Cloudflare, Netlify, Railway, Render, Fly.io
- 결제: Stripe, Lemon Squeezy
- AI: OpenAI, Anthropic Claude, Google Gemini, Groq, DeepSeek, Perplexity
- 이메일: Resend, SendGrid
- 모니터링: PostHog, Sentry, Datadog, Mixpanel, LogRocket
- 파일 저장: Cloudinary, AWS S3, UploadThing
- 검색: Algolia, Meilisearch
- CMS: Sanity, Contentful, Strapi

## 기술 스택
Next.js (App Router) + Supabase + TypeScript + Tailwind CSS + shadcn/ui
배포: Cloudflare Workers (@opennextjs/cloudflare)

## 링크
- 홈페이지: ${SITE_URL}
- 서비스 카탈로그: ${SITE_URL}/services
- 요금제: ${SITE_URL}/pricing
- 가이드: ${SITE_URL}/guides
- FAQ: ${SITE_URL}/faq
- 용어집: ${SITE_URL}/glossary
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
