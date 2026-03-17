import { BookOpen, Wrench, Key, Shield, Monitor, Server, Globe, Github, Cloud, Bot, Database, Triangle, Chrome, MessageCircle, FileText, FolderOpen, Rocket, RefreshCw, Atom, CloudCog, GitBranch, Terminal, Package, KeyRound, Zap, Link2, ServerCog, ShoppingCart, Network, ShieldCheck, Palette, Mail, CreditCard, Activity, Workflow, Plug, Cpu, Code, Smartphone, AlertTriangle, Lock, Globe2, Layers, BookMarked, Search, ToggleRight, Bell, Send, Radio, Webhook, Timer, Share2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type GuideCategory = 'concept' | 'service';

export interface GuideMeta {
  slug: string;
  title: string;
  description: string;
  category: GuideCategory;
  icon: LucideIcon;
  badge?: string;
  readingTime?: string;
  href: string;
}

export const GUIDE_CATEGORIES: Record<GuideCategory, { label: string; icon: LucideIcon; description: string }> = {
  concept: { label: '기본 개념', icon: BookOpen, description: '개발에 꼭 필요한 핵심 개념을 쉽게 설명합니다' },
  service: { label: '서비스 가이드', icon: Wrench, description: '자주 쓰는 서비스를 단계별로 설정합니다' },
};

export const GUIDE_LIST: GuideMeta[] = [
  // ── 기본 개념 (바이브코딩 학습 순서대로 정렬) ──
  // 1~4: 시작 단계 — AI 도구 선택, 화면 만들기, 패키지 설치, 코드 관리
  { slug: 'ai-tools', title: 'AI 도구 활용', description: 'AI 도구로 코드를 생성하는 법', category: 'concept', icon: Bot, badge: '바이브코딩 필수', readingTime: '15분', href: '/guides/ai-tools' },
  { slug: 'frontend', title: '프론트엔드 기초', description: '화면을 만드는 기본 원리', category: 'concept', icon: Monitor, badge: '입문', readingTime: '12분', href: '/guides/frontend' },
  { slug: 'package-manager', title: '패키지 매니저', description: 'npm과 의존성 관리 기초', category: 'concept', icon: Package, badge: '입문', readingTime: '10분', href: '/guides/package-manager' },
  { slug: 'version-control', title: '버전 관리', description: 'Git으로 코드 변경 관리하기', category: 'concept', icon: GitBranch, badge: '입문', readingTime: '12분', href: '/guides/version-control' },
  // 5~8: 개발 단계 — 환경변수, API, 백엔드, 인증
  { slug: 'env', title: '환경변수 관리', description: '환경변수와 비밀 키 관리법', category: 'concept', icon: Key, badge: '필수', readingTime: '10분', href: '/guides/env' },
  { slug: 'api-basics', title: 'API 연동 기초', description: 'API 요청과 응답 이해하기', category: 'concept', icon: Plug, badge: '입문', readingTime: '12분', href: '/guides/api-basics' },
  { slug: 'backend', title: '백엔드 기초', description: '서버 로직과 데이터 처리', category: 'concept', icon: Server, readingTime: '10분', href: '/guides/backend' },
  { slug: 'auth', title: '인증 구현', description: '로그인과 사용자 인증 구현', category: 'concept', icon: Shield, readingTime: '15분', href: '/guides/auth' },
  // 9~10: 완성 단계 — 디자인, 보안
  { slug: 'design-ui', title: '디자인/UI', description: '보기 좋은 UI 만드는 원칙', category: 'concept', icon: Palette, badge: '입문', readingTime: '10분', href: '/guides/design-ui' },
  { slug: 'security', title: '보안 기초', description: '웹 앱 보안 기초 점검 항목', category: 'concept', icon: ShieldCheck, badge: '필수', readingTime: '12분', href: '/guides/security' },
  // 11~13: 배포 단계 — 도메인, 서버, 배포
  { slug: 'domain', title: '도메인 연결', description: '도메인 구매와 연결 방법', category: 'concept', icon: Globe, readingTime: '8분', href: '/guides/domain' },
  { slug: 'server', title: '서버·호스팅', description: '호스팅 서비스 선택과 설정', category: 'concept', icon: ServerCog, readingTime: '10분', href: '/guides/server' },
  { slug: 'deploy', title: '배포하기', description: '앱을 인터넷에 배포하기', category: 'concept', icon: Rocket, readingTime: '10분', href: '/guides/deploy' },
  // 14~17: 확장 단계 — 알림, 결제, 모니터링, 자동화
  { slug: 'communication', title: '알림 연동', description: '이메일·알림 연동 방법', category: 'concept', icon: Mail, readingTime: '10분', href: '/guides/communication' },
  { slug: 'payment', title: '결제 연동', description: '결제 시스템 연동 기초', category: 'concept', icon: CreditCard, readingTime: '12분', href: '/guides/payment' },
  { slug: 'monitoring', title: '모니터링', description: '에러 추적과 성능 모니터링', category: 'concept', icon: Activity, readingTime: '10분', href: '/guides/monitoring' },
  { slug: 'automation', title: '자동화', description: '반복 작업을 자동화하는 법', category: 'concept', icon: Workflow, readingTime: '10분', href: '/guides/automation' },
  // 서비스 가이드
  { slug: 'github', title: 'GitHub 시작하기', description: '가입부터 첫 저장소까지 5단계 완성', category: 'service', icon: Github, badge: '단계별', readingTime: '30분', href: '/guides/github' },
  { slug: 'cloudflare', title: 'Cloudflare 연결', description: '계정 생성부터 자동 배포까지 7단계', category: 'service', icon: Cloud, badge: '단계별', readingTime: '40분', href: '/guides/cloudflare' },
  { slug: 'openai', title: 'OpenAI 연동', description: 'API 키 설정부터 스트리밍까지', category: 'service', icon: Bot, badge: 'AI', readingTime: '15분', href: '/guides/openai' },
  { slug: 'supabase', title: 'Supabase 시작하기', description: '계정 생성부터 DB, 인증, RLS까지 10분 완성', category: 'service', icon: Database, badge: '단계별', readingTime: '20분', href: '/guides/supabase' },
  { slug: 'vercel', title: 'Vercel 배포하기', description: 'GitHub 연동부터 커스텀 도메인까지 15분 완성', category: 'service', icon: Triangle, badge: '단계별', readingTime: '15분', href: '/guides/vercel' },
];

export interface SubGuideMeta {
  slug: string;
  parentSlug: string;
  title: string;
  description: string;
  icon: LucideIcon;
  badge?: string;
  readingTime?: string;
  href: string;
  steps?: number;
  screenshots?: number;
}

export const SUB_GUIDE_LIST: SubGuideMeta[] = [
  // ── 환경변수 (env) ──
  { slug: 'overview', parentSlug: 'env', title: '개요 — 환경변수란?', description: 'API 키와 시크릿의 개념, 왜 필요한지', icon: FileText, readingTime: '3분', href: '/guides/env' },
  { slug: 'dotenv-files', parentSlug: 'env', title: '.env 파일 관리', description: '.env, .env.local, .env.example 차이와 사용법', icon: FolderOpen, readingTime: '4분', href: '/guides/env/dotenv-files' },
  { slug: 'deploy-vars', parentSlug: 'env', title: '배포 환경변수 설정', description: 'Vercel, Cloudflare에서 환경변수 등록하기', icon: Rocket, readingTime: '3분', href: '/guides/env/deploy-vars' },

  // ── 인증 (auth) ──
  { slug: 'overview', parentSlug: 'auth', title: '개요 — 인증 기초', description: '앱 로그인 vs 서비스 연동 인증 차이', icon: FileText, readingTime: '5분', href: '/guides/auth' },
  { slug: 'google', parentSlug: 'auth', title: '구글 로그인 설정', description: 'Google Cloud Console에서 OAuth 클라이언트 설정부터 Supabase 연동까지', icon: Chrome, badge: '스크린샷 포함', readingTime: '10분', href: '/guides/auth/google', steps: 7, screenshots: 12 },
  { slug: 'kakao', parentSlug: 'auth', title: '카카오 로그인 설정', description: '카카오 개발자 콘솔에서 앱 생성부터 Supabase OIDC 연동까지', icon: MessageCircle, badge: '스크린샷 포함', readingTime: '8분', href: '/guides/auth/kakao', steps: 6, screenshots: 10 },

  // ── 프론트엔드 (frontend) ──
  { slug: 'overview', parentSlug: 'frontend', title: '개요 — 브라우저와 렌더링', description: '웹 브라우저가 화면을 그리는 과정', icon: FileText, readingTime: '4분', href: '/guides/frontend' },
  { slug: 'rendering-modes', parentSlug: 'frontend', title: 'CSR vs SSR vs SSG', description: '렌더링 모드 비교와 선택 기준', icon: RefreshCw, readingTime: '4분', href: '/guides/frontend/rendering-modes' },
  { slug: 'react-nextjs', parentSlug: 'frontend', title: 'React / Next.js 기초', description: 'Linkmap에 사용된 기술 스택 이해하기', icon: Atom, readingTime: '4분', href: '/guides/frontend/react-nextjs' },

  // ── 백엔드 (backend) ──
  { slug: 'overview', parentSlug: 'backend', title: '개요 — API란?', description: 'REST API, 엔드포인트 기초 개념', icon: FileText, readingTime: '3분', href: '/guides/backend' },
  { slug: 'database', parentSlug: 'backend', title: '데이터베이스 기초', description: 'RDB, NoSQL, 스키마 개념', icon: Database, readingTime: '4분', href: '/guides/backend/database' },
  { slug: 'baas', parentSlug: 'backend', title: 'BaaS 활용하기', description: 'Supabase/Firebase로 백엔드 없이 개발', icon: CloudCog, readingTime: '3분', href: '/guides/backend/baas' },

  // ── 도메인 (domain) ──
  { slug: 'overview', parentSlug: 'domain', title: '개요 — 도메인이란?', description: '인터넷 주소의 개념, IP vs 도메인, URL 구조', icon: FileText, readingTime: '3분', href: '/guides/domain' },
  { slug: 'how-to-buy', parentSlug: 'domain', title: '도메인 구매 방법', description: '이름 짓기, 등록 업체 선택, 구매 후 체크리스트', icon: ShoppingCart, readingTime: '5분', href: '/guides/domain/how-to-buy' },
  { slug: 'dns-records', parentSlug: 'domain', title: 'DNS 레코드 설정', description: 'A, CNAME, TXT 레코드와 Vercel·Cloudflare 연결 실전', icon: Network, readingTime: '6분', href: '/guides/domain/dns-records' },

  // ── 서버·호스팅 (server) ──
  { slug: 'overview', parentSlug: 'server', title: '개요 — 서버란?', description: '서버의 개념, 내 PC와 차이, 호스팅 유형 소개', icon: FileText, readingTime: '3분', href: '/guides/server' },
  { slug: 'hosting-types', parentSlug: 'server', title: '호스팅 유형 비교', description: '정적·동적·서버리스·VPS 비교와 플랫폼 추천', icon: ServerCog, readingTime: '5분', href: '/guides/server/hosting-types' },
  { slug: 'cdn', parentSlug: 'server', title: 'CDN과 엣지 서버', description: 'CDN 동작 원리, 엣지 컴퓨팅, 제공자 비교', icon: Globe, readingTime: '5분', href: '/guides/server/cdn' },

  // ── 배포 (deploy) ──
  { slug: 'overview', parentSlug: 'deploy', title: '개요 — 배포란?', description: '수동 vs 자동 배포, 배포 환경 3가지', icon: FileText, readingTime: '3분', href: '/guides/deploy' },
  { slug: 'vercel-deploy', parentSlug: 'deploy', title: 'Vercel 배포 가이드', description: '가입부터 첫 배포, Preview URL, 커스텀 도메인까지', icon: Triangle, readingTime: '7분', href: '/guides/deploy/vercel-deploy' },
  { slug: 'github-actions', parentSlug: 'deploy', title: 'GitHub Actions 가이드', description: 'CI/CD 핵심 개념, YAML 문법, 실전 워크플로우', icon: GitBranch, readingTime: '8분', href: '/guides/deploy/github-actions' },
  { slug: 'cicd', parentSlug: 'deploy', title: 'CI/CD 배포 파이프라인', description: 'GitHub Actions로 자동 배포 구축', icon: RefreshCw, readingTime: '5분', href: '/guides/deploy/cicd' },

  // ── AI 도구 (ai-tools) ──
  { slug: 'overview', parentSlug: 'ai-tools', title: '개요 — 바이브코딩이란?', description: 'AI와 대화하며 코딩하는 새로운 개발 방식', icon: FileText, readingTime: '4분', href: '/guides/ai-tools' },
  { slug: 'prompt-engineering', parentSlug: 'ai-tools', title: '프롬프트 엔지니어링', description: '좋은 지시 구조, 컨텍스트 관리, 규격 문서 작성', icon: Code, readingTime: '5분', href: '/guides/ai-tools/prompt-engineering' },
  { slug: 'cursor-claude', parentSlug: 'ai-tools', title: 'Cursor / Claude Code 활용법', description: '설치, 설정, 실전 워크플로우', icon: Terminal, readingTime: '4분', href: '/guides/ai-tools/cursor-claude' },
  { slug: 'ai-api', parentSlug: 'ai-tools', title: 'AI API 연동 기초', description: 'OpenAI/Anthropic API, 토큰, 비용 관리, 스트리밍', icon: Cpu, readingTime: '4분', href: '/guides/ai-tools/ai-api' },

  // ── 보안 (security) ──
  { slug: 'overview', parentSlug: 'security', title: '개요 — 웹 보안이 중요한 이유', description: 'AI 코드의 보안 취약점과 왜 신경 써야 하는지', icon: FileText, readingTime: '3분', href: '/guides/security' },
  { slug: 'secrets-management', parentSlug: 'security', title: '시크릿 관리', description: '.env 보호, 키 로테이션, 환경 분리', icon: KeyRound, readingTime: '4분', href: '/guides/security/secrets-management' },
  { slug: 'web-vulnerabilities', parentSlug: 'security', title: '웹 취약점 기초', description: 'XSS, CSRF, SQL Injection, 입력 검증', icon: AlertTriangle, readingTime: '4분', href: '/guides/security/web-vulnerabilities' },
  { slug: 'https-cors', parentSlug: 'security', title: 'HTTPS와 CORS', description: 'SSL 인증서, 동일 출처 정책, CORS 에러 해결', icon: Lock, readingTime: '3분', href: '/guides/security/https-cors' },

  // ── 버전 관리 (version-control) ──
  { slug: 'overview', parentSlug: 'version-control', title: '개요 — Git 브랜치란?', description: '분기의 개념, 왜 필요한가', icon: FileText, readingTime: '3분', href: '/guides/version-control' },
  { slug: 'branching', parentSlug: 'version-control', title: '브랜치 전략', description: 'main/feature/hotfix, AI 코드는 별도 브랜치에서', icon: GitBranch, readingTime: '4분', href: '/guides/version-control/branching' },
  { slug: 'pull-request', parentSlug: 'version-control', title: 'PR과 코드 리뷰', description: '생성, 리뷰, 머지, Preview 배포', icon: Globe2, readingTime: '3분', href: '/guides/version-control/pull-request' },
  { slug: 'conflict', parentSlug: 'version-control', title: '충돌 해결', description: 'conflict markers, merge vs rebase, 실전 시나리오', icon: RefreshCw, readingTime: '3분', href: '/guides/version-control/conflict' },

  // ── 패키지 매니저 (package-manager) ──
  { slug: 'overview', parentSlug: 'package-manager', title: '개요 — 패키지 매니저란?', description: 'npm/yarn/pnpm 비교, 왜 필요한가', icon: FileText, readingTime: '3분', href: '/guides/package-manager' },
  { slug: 'npm-basics', parentSlug: 'package-manager', title: 'npm 기본 명령어', description: 'install, update, run, scripts', icon: Terminal, readingTime: '3분', href: '/guides/package-manager/npm-basics' },
  { slug: 'package-json', parentSlug: 'package-manager', title: 'package.json 이해하기', description: 'dependencies vs devDependencies, semver ^/~', icon: FileText, readingTime: '3분', href: '/guides/package-manager/package-json' },
  { slug: 'troubleshooting', parentSlug: 'package-manager', title: 'npm 에러 해결', description: '버전 충돌, audit 경고, node_modules 재설치', icon: AlertTriangle, readingTime: '3분', href: '/guides/package-manager/troubleshooting' },

  // ── API 연동 기초 (api-basics) ──
  { slug: 'overview', parentSlug: 'api-basics', title: '개요 — API란 무엇인가?', description: '레스토랑 비유, REST vs GraphQL', icon: FileText, readingTime: '3분', href: '/guides/api-basics' },
  { slug: 'fetch-axios', parentSlug: 'api-basics', title: 'HTTP 요청 보내기', description: 'fetch, GET/POST, 헤더, 바디, JSON', icon: Zap, readingTime: '4분', href: '/guides/api-basics/fetch-axios' },
  { slug: 'error-handling', parentSlug: 'api-basics', title: '에러 핸들링', description: '상태 코드 401/403/404/500, try/catch, 재시도', icon: AlertTriangle, readingTime: '3분', href: '/guides/api-basics/error-handling' },
  { slug: 'api-auth', parentSlug: 'api-basics', title: 'API 인증 방식', description: 'API Key, Bearer Token, OAuth 소개', icon: Shield, readingTime: '3분', href: '/guides/api-basics/api-auth' },

  // ── 디자인/UI (design-ui) ──
  { slug: 'overview', parentSlug: 'design-ui', title: '개요 — 웹 디자인 기초', description: '색상, 타이포그래피, 여백', icon: FileText, readingTime: '3분', href: '/guides/design-ui' },
  { slug: 'tailwind', parentSlug: 'design-ui', title: 'Tailwind CSS 시작하기', description: '유틸리티 클래스, 반응형 접두사', icon: Palette, readingTime: '3분', href: '/guides/design-ui/tailwind' },
  { slug: 'components', parentSlug: 'design-ui', title: '컴포넌트 라이브러리', description: 'shadcn/ui, Radix UI 활용', icon: Layers, readingTime: '3분', href: '/guides/design-ui/components' },
  { slug: 'responsive', parentSlug: 'design-ui', title: '반응형 디자인', description: '모바일 퍼스트, 브레이크포인트, flex/grid', icon: Smartphone, readingTime: '3분', href: '/guides/design-ui/responsive' },

  // ── 커뮤니케이션 (communication) ──
  { slug: 'overview', parentSlug: 'communication', title: '개요 — 알림 서비스의 종류', description: '이메일/SMS/푸시/실시간', icon: FileText, readingTime: '3분', href: '/guides/communication' },
  { slug: 'email', parentSlug: 'communication', title: '이메일 발송 기초', description: 'Resend, SendGrid, 트랜잭셔널 vs 마케팅', icon: Send, readingTime: '3분', href: '/guides/communication/email' },
  { slug: 'push', parentSlug: 'communication', title: '푸시 알림', description: 'FCM, OneSignal, 웹 푸시', icon: Bell, readingTime: '3분', href: '/guides/communication/push' },
  { slug: 'realtime', parentSlug: 'communication', title: '실시간 메시징', description: 'WebSocket, Supabase Realtime, Pusher', icon: Radio, readingTime: '3분', href: '/guides/communication/realtime' },

  // ── 결제 (payment) ──
  { slug: 'overview', parentSlug: 'payment', title: '개요 — 온라인 결제의 구조', description: 'PG사 역할, 결제 흐름 도식', icon: FileText, readingTime: '3분', href: '/guides/payment' },
  { slug: 'stripe', parentSlug: 'payment', title: 'Stripe 결제', description: 'Checkout, Payment Intent, 테스트 모드', icon: CreditCard, readingTime: '4분', href: '/guides/payment/stripe' },
  { slug: 'toss', parentSlug: 'payment', title: '토스페이먼츠', description: '한국 PG 특성, 빌링키, 가상계좌', icon: CreditCard, readingTime: '4분', href: '/guides/payment/toss' },
  { slug: 'webhook', parentSlug: 'payment', title: '결제 웹훅 처리', description: '이벤트 검증, 멱등성, 재시도', icon: Webhook, readingTime: '3분', href: '/guides/payment/webhook' },

  // ── 모니터링 (monitoring) ──
  { slug: 'overview', parentSlug: 'monitoring', title: '개요 — 왜 모니터링이 필요한가', description: '배포 후 블랙박스 문제', icon: FileText, readingTime: '3분', href: '/guides/monitoring' },
  { slug: 'error-tracking', parentSlug: 'monitoring', title: '에러 추적', description: 'Sentry, LogRocket, 세션 리플레이', icon: Search, readingTime: '3분', href: '/guides/monitoring/error-tracking' },
  { slug: 'analytics', parentSlug: 'monitoring', title: '웹 분석', description: 'Google Analytics, Vercel Analytics, Plausible', icon: Activity, readingTime: '3분', href: '/guides/monitoring/analytics' },
  { slug: 'feature-flags', parentSlug: 'monitoring', title: '피처 플래그', description: '점진적 롤아웃, A/B 테스트, LaunchDarkly', icon: ToggleRight, readingTime: '3분', href: '/guides/monitoring/feature-flags' },

  // ── 자동화 (automation) ──
  { slug: 'overview', parentSlug: 'automation', title: '개요 — 자동화란?', description: '수동 작업을 없애는 이유', icon: FileText, readingTime: '3분', href: '/guides/automation' },
  { slug: 'webhook', parentSlug: 'automation', title: '웹훅 이해하기', description: '이벤트 기반, 시그니처 검증, 디버깅', icon: Webhook, readingTime: '3분', href: '/guides/automation/webhook' },
  { slug: 'scheduling', parentSlug: 'automation', title: '스케줄링과 큐', description: 'cron, BullMQ, Inngest, Trigger.dev', icon: Timer, readingTime: '3분', href: '/guides/automation/scheduling' },
  { slug: 'sns-api', parentSlug: 'automation', title: 'SNS API 연동', description: '카카오/인스타그램/유튜브 API 소개', icon: Share2, readingTime: '3분', href: '/guides/automation/sns-api' },

  // ── GitHub (github) ──
  { slug: 'overview', parentSlug: 'github', title: '개요 — GitHub이란?', description: 'Git과 GitHub의 차이, 핵심 개념', icon: FileText, readingTime: '5분', href: '/guides/github' },
  { slug: 'git-setup', parentSlug: 'github', title: 'Git 설치 + 가입', description: '환경 세팅과 기본 설정', icon: Terminal, readingTime: '10분', href: '/guides/github/git-setup' },
  { slug: 'first-repo', parentSlug: 'github', title: '첫 저장소 만들기', description: '레포 생성, 첫 커밋, 푸시', icon: Package, readingTime: '15분', href: '/guides/github/first-repo' },

  // ── Cloudflare (cloudflare) ──
  { slug: 'overview', parentSlug: 'cloudflare', title: '개요 — Cloudflare란?', description: 'CDN, DNS, 보안의 올인원 플랫폼', icon: FileText, readingTime: '5분', href: '/guides/cloudflare' },
  { slug: 'domain', parentSlug: 'cloudflare', title: '계정 생성 + 도메인 연결', description: '네임서버 설정과 SSL 인증서', icon: Globe, readingTime: '10분', href: '/guides/cloudflare/domain' },
  { slug: 'workers', parentSlug: 'cloudflare', title: 'Workers 배포 설정', description: 'Wrangler CLI, 배포 설정, 라우팅', icon: Zap, readingTime: '15분', href: '/guides/cloudflare/workers' },
  { slug: 'secrets', parentSlug: 'cloudflare', title: '환경변수 + 시크릿 관리', description: 'Workers 시크릿, KV 바인딩', icon: KeyRound, readingTime: '10분', href: '/guides/cloudflare/secrets' },

  // ── OpenAI (openai) ──
  { slug: 'overview', parentSlug: 'openai', title: '개요 — OpenAI API란?', description: 'GPT, 토큰, 모델 선택 기초', icon: FileText, readingTime: '3분', href: '/guides/openai' },
  { slug: 'api-key', parentSlug: 'openai', title: 'API 키 발급 + 설정', description: '콘솔에서 키 발급, 환경변수 등록', icon: KeyRound, readingTime: '5분', href: '/guides/openai/api-key' },
  { slug: 'nextjs-integration', parentSlug: 'openai', title: 'Next.js 연동 + 스트리밍', description: 'API 라우트, 스트리밍 응답 구현', icon: Zap, readingTime: '7분', href: '/guides/openai/nextjs-integration' },

  // ── Supabase (supabase) ──
  { slug: 'overview', parentSlug: 'supabase', title: '개요 — Supabase란?', description: 'Firebase 대안, PostgreSQL 기반 BaaS', icon: FileText, readingTime: '3분', href: '/guides/supabase' },
  { slug: 'project-setup', parentSlug: 'supabase', title: '프로젝트 생성 + 환경변수', description: '프로젝트 만들기, 3개 키 설정', icon: Rocket, readingTime: '5분', href: '/guides/supabase/project-setup' },
  { slug: 'auth-setup', parentSlug: 'supabase', title: '인증(Auth) 설정', description: '소셜 로그인, 이메일 인증, 미들웨어', icon: Shield, readingTime: '7분', href: '/guides/supabase/auth-setup' },
  { slug: 'database-rls', parentSlug: 'supabase', title: '데이터베이스 + RLS', description: '테이블 생성, RLS 정책, 3종 클라이언트', icon: Database, readingTime: '5분', href: '/guides/supabase/database-rls' },

  // ── Vercel (vercel) ──
  { slug: 'overview', parentSlug: 'vercel', title: '개요 — Vercel이란?', description: 'Next.js 최적화 배포 플랫폼', icon: FileText, readingTime: '3분', href: '/guides/vercel' },
  { slug: 'github-deploy', parentSlug: 'vercel', title: 'GitHub 연동 + 첫 배포', description: '레포 연결, 자동 배포, 프리뷰', icon: GitBranch, readingTime: '7분', href: '/guides/vercel/github-deploy' },
  { slug: 'custom-domain', parentSlug: 'vercel', title: '커스텀 도메인 연결', description: '도메인 추가, DNS 설정, SSL', icon: Link2, readingTime: '5분', href: '/guides/vercel/custom-domain' },
];

export function getGuidesByCategory(category: GuideCategory): GuideMeta[] {
  return GUIDE_LIST.filter(g => g.category === category);
}

export function getSubGuides(parentSlug: string): SubGuideMeta[] {
  return SUB_GUIDE_LIST.filter(g => g.parentSlug === parentSlug);
}

export function getGuidesWithChildren(): (GuideMeta & { children: SubGuideMeta[] })[] {
  return GUIDE_LIST.map(g => ({ ...g, children: getSubGuides(g.slug) }));
}

/** 서비스 slug → 가이드 페이지 href 매핑 */
export const SERVICE_GUIDE_HREF: Record<string, string> = {
  supabase: '/guides/supabase',
  vercel: '/guides/vercel',
  openai: '/guides/openai',
  github: '/guides/github',
  cloudflare: '/guides/cloudflare',
  'kakao-login': '/guides/auth/kakao',
  'google-oauth': '/guides/auth/google',
};

// ── 러닝패스 ──

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  guideSlugs: string[];
  badge?: string;
}

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'vibe-coding-intro',
    title: '바이브코딩 입문',
    description: '코딩 경험 0 → AI로 첫 웹앱 배포까지',
    icon: Bot,
    badge: '첫 프로젝트',
    guideSlugs: ['ai-tools', 'env', 'frontend', 'design-ui', 'backend', 'deploy'],
  },
  {
    id: 'dev-tools',
    title: '실전 도구',
    description: '앱을 만든 후 "제대로" 관리하는 법',
    icon: Wrench,
    badge: '개발 생산성',
    guideSlugs: ['version-control', 'package-manager', 'security', 'api-basics', 'domain', 'server'],
  },
  {
    id: 'scale-up',
    title: '서비스 확장',
    description: '프로젝트를 실제 서비스로 확장',
    icon: Rocket,
    badge: '수익화/운영',
    guideSlugs: ['auth', 'communication', 'payment', 'monitoring', 'automation'],
  },
];
