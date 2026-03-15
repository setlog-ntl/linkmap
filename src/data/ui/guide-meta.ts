import { BookOpen, Wrench, Key, Shield, Monitor, Server, Globe, Github, Cloud, Bot, Database, Triangle, Chrome, MessageCircle, FileText, FolderOpen, Rocket, RefreshCw, Atom, ServerCog, CloudCog, GitBranch, Terminal, Package, KeyRound, Zap, Link2, LayoutDashboard } from 'lucide-react';
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
  // 기본 개념
  { slug: 'env', title: '환경변수 완전 정복', description: 'API 키와 환경변수(.env)의 개념부터 배포까지', category: 'concept', icon: Key, badge: '초보자용', readingTime: '10분', href: '/guides/env' },
  { slug: 'auth', title: '인증 가이드', description: '앱 로그인·서비스 연동 개념 + 구글·카카오 로그인 설정법', category: 'concept', icon: Shield, badge: '초보자용', readingTime: '15분', href: '/guides/auth' },
  { slug: 'frontend', title: '프론트엔드 가이드', description: '브라우저 렌더링, 컴포넌트, CSR·SSR·SSG', category: 'concept', icon: Monitor, readingTime: '12분', href: '/guides/frontend' },
  { slug: 'backend', title: '백엔드 가이드', description: 'API, 데이터베이스, BaaS의 기초', category: 'concept', icon: Server, readingTime: '10분', href: '/guides/backend' },
  { slug: 'deploy', title: '도메인·배포·서버', description: '도메인, DNS, 호스팅, 배포 파이프라인', category: 'concept', icon: Globe, readingTime: '15분', href: '/guides/deploy' },
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

  // ── 배포 (deploy) ──
  { slug: 'overview', parentSlug: 'deploy', title: '개요 — 도메인과 DNS', description: '도메인 구매, DNS 레코드 설정 방법', icon: FileText, readingTime: '5분', href: '/guides/deploy' },
  { slug: 'hosting', parentSlug: 'deploy', title: '서버와 호스팅', description: '정적/동적 호스팅, CDN 개념', icon: ServerCog, readingTime: '5분', href: '/guides/deploy/hosting' },
  { slug: 'cicd', parentSlug: 'deploy', title: 'CI/CD 배포 파이프라인', description: 'GitHub Actions로 자동 배포 구축', icon: RefreshCw, readingTime: '5분', href: '/guides/deploy/cicd' },

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
