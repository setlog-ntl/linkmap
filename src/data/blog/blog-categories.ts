import type { LucideIcon } from 'lucide-react';
import { Sparkles, Shield, GitBranch, LayoutDashboard, Scale, Rocket } from 'lucide-react';

// ---------------------------------------------------------------------------
// Blog category types & constants — 클라이언트 번들용 경량 모듈
// posts.ts(3,595줄)와 분리하여 tree-shaking 보장
// ---------------------------------------------------------------------------

export type BlogCategory = 'vibe-coding' | 'env-management' | 'comparison' | 'tutorial' | 'insight' | 'deploy-ops';

export const BLOG_CATEGORIES: Record<BlogCategory, { label: string; icon: LucideIcon; description: string }> = {
  'vibe-coding': {
    label: '바이브 코딩',
    icon: Sparkles,
    description: 'AI 시대의 새로운 개발 방식',
  },
  'env-management': {
    label: '환경변수 관리',
    icon: Shield,
    description: 'API 키와 시크릿을 안전하게',
  },
  comparison: {
    label: '비교 분석',
    icon: Scale,
    description: '도구와 서비스 객관적 비교',
  },
  tutorial: {
    label: '튜토리얼',
    icon: GitBranch,
    description: '단계별 실전 가이드',
  },
  insight: {
    label: '인사이트',
    icon: LayoutDashboard,
    description: '개발 생태계 관찰과 의견',
  },
  'deploy-ops': {
    label: '배포관리',
    icon: Rocket,
    description: '배포 환경 설정과 운영 노하우',
  },
};

const categoryOrder: BlogCategory[] = ['vibe-coding', 'env-management', 'comparison', 'tutorial', 'insight', 'deploy-ops'];

export function getBlogCategoryOrder(): BlogCategory[] {
  return categoryOrder;
}
