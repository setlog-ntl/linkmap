import type { LucideIcon } from 'lucide-react';
import { Sparkles, Shield, GitBranch, LayoutDashboard, Scale, Rocket } from 'lucide-react';

// ---------------------------------------------------------------------------
// Blog topic tag types & constants — 클라이언트 번들용 경량 모듈
// category(단일) → topicTags(복수) 전환: 하나의 포스트가 여러 주제를 가질 수 있음
// ---------------------------------------------------------------------------

export type BlogTopicTag = 'vibe-coding' | 'env-management' | 'comparison' | 'tutorial' | 'insight' | 'deploy-ops';

export const BLOG_TOPIC_TAGS: Record<BlogTopicTag, { label: string; icon: LucideIcon; description: string }> = {
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

const tagOrder: BlogTopicTag[] = ['vibe-coding', 'env-management', 'comparison', 'tutorial', 'insight', 'deploy-ops'];

export function getTopicTagOrder(): BlogTopicTag[] {
  return tagOrder;
}

// ---------------------------------------------------------------------------
// Backward compatibility re-exports (deprecated — 신규 코드는 위 이름 사용)
// ---------------------------------------------------------------------------
/** @deprecated Use BlogTopicTag instead */
export type BlogCategory = BlogTopicTag;
/** @deprecated Use BLOG_TOPIC_TAGS instead */
export const BLOG_CATEGORIES = BLOG_TOPIC_TAGS;
/** @deprecated Use getTopicTagOrder instead */
export const getBlogCategoryOrder = getTopicTagOrder;
