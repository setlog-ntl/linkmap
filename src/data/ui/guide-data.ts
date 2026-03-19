// ---------------------------------------------------------------------------
// Guide data — 아이콘 없는 순수 데이터 (서버 컴포넌트용)
// guide-meta.ts(48개 lucide 아이콘)가 서버 번들에 포함되는 것을 방지
// ---------------------------------------------------------------------------

export type GuideCategory = 'concept' | 'service';

export interface GuideData {
  slug: string;
  title: string;
  description: string;
  category: GuideCategory;
  badge?: string;
  readingTime?: string;
  href: string;
}

export interface SubGuideData {
  slug: string;
  parentSlug: string;
  title: string;
  description: string;
  badge?: string;
  readingTime?: string;
  href: string;
  steps?: number;
  screenshots?: number;
}

// ── 가이드 목록 (아이콘 제외) ──

export const GUIDE_DATA: GuideData[] = [
  // 기본 개념
  { slug: 'ai-tools', title: 'AI 도구 활용', description: 'AI 도구로 코드를 생성하는 법', category: 'concept', badge: '바이브코딩 필수', readingTime: '15분', href: '/guides/ai-tools' },
  { slug: 'frontend', title: '프론트엔드 기초', description: '화면을 만드는 기본 원리', category: 'concept', badge: '입문', readingTime: '12분', href: '/guides/frontend' },
  { slug: 'package-manager', title: '패키지 매니저', description: 'npm과 의존성 관리 기초', category: 'concept', badge: '입문', readingTime: '10분', href: '/guides/package-manager' },
  { slug: 'version-control', title: '버전 관리', description: 'Git으로 코드 변경 관리하기', category: 'concept', badge: '입문', readingTime: '12분', href: '/guides/version-control' },
  { slug: 'env', title: '환경변수 관리', description: '환경변수와 비밀 키 관리법', category: 'concept', badge: '필수', readingTime: '10분', href: '/guides/env' },
  { slug: 'api-basics', title: 'API 연동 기초', description: 'API 요청과 응답 이해하기', category: 'concept', badge: '입문', readingTime: '12분', href: '/guides/api-basics' },
  { slug: 'backend', title: '백엔드 기초', description: '서버 로직과 데이터 처리', category: 'concept', readingTime: '10분', href: '/guides/backend' },
  { slug: 'auth', title: '인증 구현', description: '로그인과 사용자 인증 구현', category: 'concept', readingTime: '15분', href: '/guides/auth' },
  { slug: 'design-ui', title: '디자인/UI', description: '보기 좋은 UI 만드는 원칙', category: 'concept', badge: '입문', readingTime: '10분', href: '/guides/design-ui' },
  { slug: 'security', title: '보안 기초', description: '웹 앱 보안 기초 점검 항목', category: 'concept', badge: '필수', readingTime: '12분', href: '/guides/security' },
  { slug: 'domain', title: '도메인 연결', description: '도메인 구매와 연결 방법', category: 'concept', readingTime: '8분', href: '/guides/domain' },
  { slug: 'server', title: '서버·호스팅', description: '호스팅 서비스 선택과 설정', category: 'concept', readingTime: '10분', href: '/guides/server' },
  { slug: 'deploy', title: '배포하기', description: '앱을 인터넷에 배포하기', category: 'concept', readingTime: '10분', href: '/guides/deploy' },
  { slug: 'communication', title: '알림 연동', description: '이메일·알림 연동 방법', category: 'concept', readingTime: '10분', href: '/guides/communication' },
  { slug: 'payment', title: '결제 연동', description: '결제 시스템 연동 기초', category: 'concept', readingTime: '12분', href: '/guides/payment' },
  { slug: 'monitoring', title: '모니터링', description: '에러 추적과 성능 모니터링', category: 'concept', readingTime: '10분', href: '/guides/monitoring' },
  { slug: 'automation', title: '자동화', description: '반복 작업을 자동화하는 법', category: 'concept', readingTime: '10분', href: '/guides/automation' },
  // 서비스 가이드
  { slug: 'github', title: 'GitHub 시작하기', description: '가입부터 첫 저장소까지 5단계 완성', category: 'service', badge: '단계별', readingTime: '30분', href: '/guides/github' },
  { slug: 'cloudflare', title: 'Cloudflare 연결', description: '계정 생성부터 자동 배포까지 7단계', category: 'service', badge: '단계별', readingTime: '40분', href: '/guides/cloudflare' },
  { slug: 'openai', title: 'OpenAI 연동', description: 'API 키 설정부터 스트리밍까지', category: 'service', badge: 'AI', readingTime: '15분', href: '/guides/openai' },
  { slug: 'supabase', title: 'Supabase 시작하기', description: '계정 생성부터 DB, 인증, RLS까지 10분 완성', category: 'service', badge: '단계별', readingTime: '20분', href: '/guides/supabase' },
  { slug: 'vercel', title: 'Vercel 배포하기', description: 'GitHub 연동부터 커스텀 도메인까지 15분 완성', category: 'service', badge: '단계별', readingTime: '15분', href: '/guides/vercel' },
];

// ── 서브 가이드 목록 (아이콘 제외) ──

export const SUB_GUIDE_DATA: SubGuideData[] = [
  { slug: 'overview', parentSlug: 'env', title: '개요 — 환경변수란?', description: 'API 키와 시크릿의 개념, 왜 필요한지', readingTime: '3분', href: '/guides/env' },
  { slug: 'dotenv-files', parentSlug: 'env', title: '.env 파일 관리', description: '.env, .env.local, .env.example 차이와 사용법', readingTime: '4분', href: '/guides/env/dotenv-files' },
  { slug: 'deploy-vars', parentSlug: 'env', title: '배포 환경변수 설정', description: 'Vercel, Cloudflare에서 환경변수 등록하기', readingTime: '3분', href: '/guides/env/deploy-vars' },
  { slug: 'overview', parentSlug: 'auth', title: '개요 — 인증 기초', description: '앱 로그인 vs 서비스 연동 인증 차이', readingTime: '5분', href: '/guides/auth' },
  { slug: 'google', parentSlug: 'auth', title: '구글 로그인 설정', description: 'Google Cloud Console에서 OAuth 클라이언트 설정부터 Supabase 연동까지', badge: '스크린샷 포함', readingTime: '10분', href: '/guides/auth/google', steps: 7, screenshots: 12 },
  { slug: 'kakao', parentSlug: 'auth', title: '카카오 로그인 설정', description: '카카오 개발자 콘솔에서 앱 생성부터 Supabase OIDC 연동까지', badge: '스크린샷 포함', readingTime: '8분', href: '/guides/auth/kakao', steps: 6, screenshots: 10 },
  { slug: 'overview', parentSlug: 'frontend', title: '개요 — 브라우저와 렌더링', description: '웹 브라우저가 화면을 그리는 과정', readingTime: '4분', href: '/guides/frontend' },
  { slug: 'rendering-modes', parentSlug: 'frontend', title: 'CSR vs SSR vs SSG', description: '렌더링 모드 비교와 선택 기준', readingTime: '4분', href: '/guides/frontend/rendering-modes' },
  { slug: 'react-nextjs', parentSlug: 'frontend', title: 'React / Next.js 기초', description: 'Linkmap에 사용된 기술 스택 이해하기', readingTime: '4분', href: '/guides/frontend/react-nextjs' },
  { slug: 'overview', parentSlug: 'backend', title: '개요 — API란?', description: 'REST API, 엔드포인트 기초 개념', readingTime: '3분', href: '/guides/backend' },
  { slug: 'database', parentSlug: 'backend', title: '데이터베이스 기초', description: 'RDB, NoSQL, 스키마 개념', readingTime: '4분', href: '/guides/backend/database' },
  { slug: 'baas', parentSlug: 'backend', title: 'BaaS 활용하기', description: 'Supabase/Firebase로 백엔드 없이 개발', readingTime: '3분', href: '/guides/backend/baas' },
  { slug: 'overview', parentSlug: 'domain', title: '개요 — 도메인이란?', description: '인터넷 주소의 개념, IP vs 도메인, URL 구조', readingTime: '3분', href: '/guides/domain' },
  { slug: 'how-to-buy', parentSlug: 'domain', title: '도메인 구매 방법', description: '이름 짓기, 등록 업체 선택, 구매 후 체크리스트', readingTime: '5분', href: '/guides/domain/how-to-buy' },
  { slug: 'dns-records', parentSlug: 'domain', title: 'DNS 레코드 설정', description: 'A, CNAME, TXT 레코드와 Vercel·Cloudflare 연결 실전', readingTime: '6분', href: '/guides/domain/dns-records' },
  { slug: 'overview', parentSlug: 'server', title: '개요 — 서버란?', description: '서버의 개념, 내 PC와 차이, 호스팅 유형 소개', readingTime: '3분', href: '/guides/server' },
  { slug: 'hosting-types', parentSlug: 'server', title: '호스팅 유형 비교', description: '정적·동적·서버리스·VPS 비교와 플랫폼 추천', readingTime: '5분', href: '/guides/server/hosting-types' },
  { slug: 'cdn', parentSlug: 'server', title: 'CDN과 엣지 서버', description: 'CDN 동작 원리, 엣지 컴퓨팅, 제공자 비교', readingTime: '5분', href: '/guides/server/cdn' },
  { slug: 'overview', parentSlug: 'deploy', title: '개요 — 배포란?', description: '수동 vs 자동 배포, 배포 환경 3가지', readingTime: '3분', href: '/guides/deploy' },
  { slug: 'vercel-deploy', parentSlug: 'deploy', title: 'Vercel 배포 가이드', description: '가입부터 첫 배포, Preview URL, 커스텀 도메인까지', readingTime: '7분', href: '/guides/deploy/vercel-deploy' },
  { slug: 'github-actions', parentSlug: 'deploy', title: 'GitHub Actions 가이드', description: 'CI/CD 핵심 개념, YAML 문법, 실전 워크플로우', readingTime: '8분', href: '/guides/deploy/github-actions' },
  { slug: 'cicd', parentSlug: 'deploy', title: 'CI/CD 배포 파이프라인', description: 'GitHub Actions로 자동 배포 구축', readingTime: '5분', href: '/guides/deploy/cicd' },
  { slug: 'overview', parentSlug: 'ai-tools', title: '개요 — 바이브코딩이란?', description: 'AI와 대화하며 코딩하는 새로운 개발 방식', readingTime: '4분', href: '/guides/ai-tools' },
  { slug: 'prompt-engineering', parentSlug: 'ai-tools', title: '프롬프트 엔지니어링', description: '좋은 지시 구조, 컨텍스트 관리, 규격 문서 작성', readingTime: '5분', href: '/guides/ai-tools/prompt-engineering' },
  { slug: 'cursor-claude', parentSlug: 'ai-tools', title: 'Cursor / Claude Code 활용법', description: '설치, 설정, 실전 워크플로우', readingTime: '4분', href: '/guides/ai-tools/cursor-claude' },
  { slug: 'ai-api', parentSlug: 'ai-tools', title: 'AI API 연동 기초', description: 'OpenAI/Anthropic API, 토큰, 비용 관리, 스트리밍', readingTime: '4분', href: '/guides/ai-tools/ai-api' },
  { slug: 'overview', parentSlug: 'security', title: '개요 — 웹 보안이 중요한 이유', description: 'AI 코드의 보안 취약점과 왜 신경 써야 하는지', readingTime: '3분', href: '/guides/security' },
  { slug: 'secrets-management', parentSlug: 'security', title: '시크릿 관리', description: '.env 보호, 키 로테이션, 환경 분리', readingTime: '4분', href: '/guides/security/secrets-management' },
  { slug: 'web-vulnerabilities', parentSlug: 'security', title: '웹 취약점 기초', description: 'XSS, CSRF, SQL Injection, 입력 검증', readingTime: '4분', href: '/guides/security/web-vulnerabilities' },
  { slug: 'https-cors', parentSlug: 'security', title: 'HTTPS와 CORS', description: 'SSL 인증서, 동일 출처 정책, CORS 에러 해결', readingTime: '3분', href: '/guides/security/https-cors' },
  { slug: 'overview', parentSlug: 'version-control', title: '개요 — Git 브랜치란?', description: '분기의 개념, 왜 필요한가', readingTime: '3분', href: '/guides/version-control' },
  { slug: 'branching', parentSlug: 'version-control', title: '브랜치 전략', description: 'main/feature/hotfix, AI 코드는 별도 브랜치에서', readingTime: '4분', href: '/guides/version-control/branching' },
  { slug: 'pull-request', parentSlug: 'version-control', title: 'PR과 코드 리뷰', description: '생성, 리뷰, 머지, Preview 배포', readingTime: '3분', href: '/guides/version-control/pull-request' },
  { slug: 'conflict', parentSlug: 'version-control', title: '충돌 해결', description: 'conflict markers, merge vs rebase, 실전 시나리오', readingTime: '3분', href: '/guides/version-control/conflict' },
  { slug: 'overview', parentSlug: 'package-manager', title: '개요 — 패키지 매니저란?', description: 'npm/yarn/pnpm 비교, 왜 필요한가', readingTime: '3분', href: '/guides/package-manager' },
  { slug: 'npm-basics', parentSlug: 'package-manager', title: 'npm 기본 명령어', description: 'install, update, run, scripts', readingTime: '3분', href: '/guides/package-manager/npm-basics' },
  { slug: 'package-json', parentSlug: 'package-manager', title: 'package.json 이해하기', description: 'dependencies vs devDependencies, semver ^/~', readingTime: '3분', href: '/guides/package-manager/package-json' },
  { slug: 'troubleshooting', parentSlug: 'package-manager', title: 'npm 에러 해결', description: '버전 충돌, audit 경고, node_modules 재설치', readingTime: '3분', href: '/guides/package-manager/troubleshooting' },
  { slug: 'overview', parentSlug: 'api-basics', title: '개요 — API란 무엇인가?', description: '레스토랑 비유, REST vs GraphQL', readingTime: '3분', href: '/guides/api-basics' },
  { slug: 'fetch-axios', parentSlug: 'api-basics', title: 'HTTP 요청 보내기', description: 'fetch, GET/POST, 헤더, 바디, JSON', readingTime: '4분', href: '/guides/api-basics/fetch-axios' },
  { slug: 'error-handling', parentSlug: 'api-basics', title: '에러 핸들링', description: '상태 코드 401/403/404/500, try/catch, 재시도', readingTime: '3분', href: '/guides/api-basics/error-handling' },
  { slug: 'api-auth', parentSlug: 'api-basics', title: 'API 인증 방식', description: 'API Key, Bearer Token, OAuth 소개', readingTime: '3분', href: '/guides/api-basics/api-auth' },
  { slug: 'overview', parentSlug: 'design-ui', title: '개요 — 웹 디자인 기초', description: '색상, 타이포그래피, 여백', readingTime: '3분', href: '/guides/design-ui' },
  { slug: 'tailwind', parentSlug: 'design-ui', title: 'Tailwind CSS 시작하기', description: '유틸리티 클래스, 반응형 접두사', readingTime: '3분', href: '/guides/design-ui/tailwind' },
  { slug: 'components', parentSlug: 'design-ui', title: '컴포넌트 라이브러리', description: 'shadcn/ui, Radix UI 활용', readingTime: '3분', href: '/guides/design-ui/components' },
  { slug: 'responsive', parentSlug: 'design-ui', title: '반응형 디자인', description: '모바일 퍼스트, 브레이크포인트, flex/grid', readingTime: '3분', href: '/guides/design-ui/responsive' },
  { slug: 'overview', parentSlug: 'communication', title: '개요 — 알림 서비스의 종류', description: '이메일/SMS/푸시/실시간', readingTime: '3분', href: '/guides/communication' },
  { slug: 'email', parentSlug: 'communication', title: '이메일 발송 기초', description: 'Resend, SendGrid, 트랜잭셔널 vs 마케팅', readingTime: '3분', href: '/guides/communication/email' },
  { slug: 'push', parentSlug: 'communication', title: '푸시 알림', description: 'FCM, OneSignal, 웹 푸시', readingTime: '3분', href: '/guides/communication/push' },
  { slug: 'realtime', parentSlug: 'communication', title: '실시간 메시징', description: 'WebSocket, Supabase Realtime, Pusher', readingTime: '3분', href: '/guides/communication/realtime' },
  { slug: 'overview', parentSlug: 'payment', title: '개요 — 온라인 결제의 구조', description: 'PG사 역할, 결제 흐름 도식', readingTime: '3분', href: '/guides/payment' },
  { slug: 'stripe', parentSlug: 'payment', title: 'Stripe 결제', description: 'Checkout, Payment Intent, 테스트 모드', readingTime: '4분', href: '/guides/payment/stripe' },
  { slug: 'toss', parentSlug: 'payment', title: '토스페이먼츠', description: '한국 PG 특성, 빌링키, 가상계좌', readingTime: '4분', href: '/guides/payment/toss' },
  { slug: 'webhook', parentSlug: 'payment', title: '결제 웹훅 처리', description: '이벤트 검증, 멱등성, 재시도', readingTime: '3분', href: '/guides/payment/webhook' },
  { slug: 'overview', parentSlug: 'monitoring', title: '개요 — 왜 모니터링이 필요한가', description: '배포 후 블랙박스 문제', readingTime: '3분', href: '/guides/monitoring' },
  { slug: 'error-tracking', parentSlug: 'monitoring', title: '에러 추적', description: 'Sentry, LogRocket, 세션 리플레이', readingTime: '3분', href: '/guides/monitoring/error-tracking' },
  { slug: 'analytics', parentSlug: 'monitoring', title: '웹 분석', description: 'Google Analytics, Vercel Analytics, Plausible', readingTime: '3분', href: '/guides/monitoring/analytics' },
  { slug: 'feature-flags', parentSlug: 'monitoring', title: '피처 플래그', description: '점진적 롤아웃, A/B 테스트, LaunchDarkly', readingTime: '3분', href: '/guides/monitoring/feature-flags' },
  { slug: 'overview', parentSlug: 'automation', title: '개요 — 자동화란?', description: '수동 작업을 없애는 이유', readingTime: '3분', href: '/guides/automation' },
  { slug: 'webhook', parentSlug: 'automation', title: '웹훅 이해하기', description: '이벤트 기반, 시그니처 검증, 디버깅', readingTime: '3분', href: '/guides/automation/webhook' },
  { slug: 'scheduling', parentSlug: 'automation', title: '스케줄링과 큐', description: 'cron, BullMQ, Inngest, Trigger.dev', readingTime: '3분', href: '/guides/automation/scheduling' },
  { slug: 'sns-api', parentSlug: 'automation', title: 'SNS API 연동', description: '카카오/인스타그램/유튜브 API 소개', readingTime: '3분', href: '/guides/automation/sns-api' },
  { slug: 'overview', parentSlug: 'github', title: '개요 — GitHub이란?', description: 'Git과 GitHub의 차이, 핵심 개념', readingTime: '5분', href: '/guides/github' },
  { slug: 'git-setup', parentSlug: 'github', title: 'Git 설치 + 가입', description: '환경 세팅과 기본 설정', readingTime: '10분', href: '/guides/github/git-setup' },
  { slug: 'first-repo', parentSlug: 'github', title: '첫 저장소 만들기', description: '레포 생성, 첫 커밋, 푸시', readingTime: '15분', href: '/guides/github/first-repo' },
  { slug: 'overview', parentSlug: 'cloudflare', title: '개요 — Cloudflare란?', description: 'CDN, DNS, 보안의 올인원 플랫폼', readingTime: '5분', href: '/guides/cloudflare' },
  { slug: 'domain', parentSlug: 'cloudflare', title: '계정 생성 + 도메인 연결', description: '네임서버 설정과 SSL 인증서', readingTime: '10분', href: '/guides/cloudflare/domain' },
  { slug: 'workers', parentSlug: 'cloudflare', title: 'Workers 배포 설정', description: 'Wrangler CLI, 배포 설정, 라우팅', readingTime: '15분', href: '/guides/cloudflare/workers' },
  { slug: 'secrets', parentSlug: 'cloudflare', title: '환경변수 + 시크릿 관리', description: 'Workers 시크릿, KV 바인딩', readingTime: '10분', href: '/guides/cloudflare/secrets' },
  { slug: 'overview', parentSlug: 'openai', title: '개요 — OpenAI API란?', description: 'GPT, 토큰, 모델 선택 기초', readingTime: '3분', href: '/guides/openai' },
  { slug: 'api-key', parentSlug: 'openai', title: 'API 키 발급 + 설정', description: '콘솔에서 키 발급, 환경변수 등록', readingTime: '5분', href: '/guides/openai/api-key' },
  { slug: 'nextjs-integration', parentSlug: 'openai', title: 'Next.js 연동 + 스트리밍', description: 'API 라우트, 스트리밍 응답 구현', readingTime: '7분', href: '/guides/openai/nextjs-integration' },
  { slug: 'overview', parentSlug: 'supabase', title: '개요 — Supabase란?', description: 'Firebase 대안, PostgreSQL 기반 BaaS', readingTime: '3분', href: '/guides/supabase' },
  { slug: 'project-setup', parentSlug: 'supabase', title: '프로젝트 생성 + 환경변수', description: '프로젝트 만들기, 3개 키 설정', readingTime: '5분', href: '/guides/supabase/project-setup' },
  { slug: 'auth-setup', parentSlug: 'supabase', title: '인증(Auth) 설정', description: '소셜 로그인, 이메일 인증, 미들웨어', readingTime: '7분', href: '/guides/supabase/auth-setup' },
  { slug: 'database-rls', parentSlug: 'supabase', title: '데이터베이스 + RLS', description: '테이블 생성, RLS 정책, 3종 클라이언트', readingTime: '5분', href: '/guides/supabase/database-rls' },
  { slug: 'overview', parentSlug: 'vercel', title: '개요 — Vercel이란?', description: 'Next.js 최적화 배포 플랫폼', readingTime: '3분', href: '/guides/vercel' },
  { slug: 'github-deploy', parentSlug: 'vercel', title: 'GitHub 연동 + 첫 배포', description: '레포 연결, 자동 배포, 프리뷰', readingTime: '7분', href: '/guides/vercel/github-deploy' },
  { slug: 'custom-domain', parentSlug: 'vercel', title: '커스텀 도메인 연결', description: '도메인 추가, DNS 설정, SSL', readingTime: '5분', href: '/guides/vercel/custom-domain' },
];

// ── 유틸리티 함수 ──

export function getGuideDataBySlug(slug: string): GuideData | undefined {
  return GUIDE_DATA.find(g => g.slug === slug);
}

export function getSubGuideData(parentSlug: string): SubGuideData[] {
  return SUB_GUIDE_DATA.filter(g => g.parentSlug === parentSlug);
}
