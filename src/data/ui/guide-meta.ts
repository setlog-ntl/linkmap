import { BookOpen, Wrench, Key, Shield, Monitor, Server, Globe, Github, Cloud, Bot, Database, Triangle, Chrome, MessageCircle } from 'lucide-react';
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
  steps: number;
  screenshots: number;
}

export const SUB_GUIDE_LIST: SubGuideMeta[] = [
  {
    slug: 'google',
    parentSlug: 'auth',
    title: '구글 로그인 설정',
    description: 'Google Cloud Console에서 OAuth 클라이언트 설정부터 Supabase 연동까지 스크린샷과 함께 안내',
    icon: Chrome,
    badge: '스크린샷 포함',
    readingTime: '10분',
    href: '/guides/auth/google',
    steps: 7,
    screenshots: 12,
  },
  {
    slug: 'kakao',
    parentSlug: 'auth',
    title: '카카오 로그인 설정',
    description: '카카오 개발자 콘솔에서 앱 생성부터 Supabase OIDC 연동까지 스크린샷과 함께 안내',
    icon: MessageCircle,
    badge: '스크린샷 포함',
    readingTime: '8분',
    href: '/guides/auth/kakao',
    steps: 6,
    screenshots: 10,
  },
];

export function getGuidesByCategory(category: GuideCategory): GuideMeta[] {
  return GUIDE_LIST.filter(g => g.category === category);
}

export function getSubGuides(parentSlug: string): SubGuideMeta[] {
  return SUB_GUIDE_LIST.filter(g => g.parentSlug === parentSlug);
}
