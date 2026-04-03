import type { LucideIcon } from 'lucide-react';
import { Flame, Compass } from 'lucide-react';
import type { BlogPostMeta } from './posts-meta';

// ---------------------------------------------------------------------------
// Blog series — 시리즈 마스터 데이터 (경량 모듈, tree-shaking 보장)
// ---------------------------------------------------------------------------

export interface BlogSeriesInfo {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  /** 시리즈 전체를 관통하는 한 줄 서사 */
  tagline: string;
}

export const BLOG_SERIES: BlogSeriesInfo[] = [
  {
    id: 'linkmap-dev-story',
    title: 'ERP 담당자의 Linkmap 개발기',
    description: '비개발자가 AI와 함께 SaaS를 만들기까지의 실전 여정',
    icon: Flame,
    tagline: '코드는 AI가 짰다. 나머지는 전부 내가 해야 했다.',
  },
  {
    id: 'user-to-creator',
    title: '사용자에서 창작자로',
    description: '바이브 코딩이 여는 시대 전환의 이야기',
    icon: Compass,
    tagline: '당신은 이미 만들 수 있는 사람입니다.',
  },
];

export function getSeriesById(id: string): BlogSeriesInfo | undefined {
  return BLOG_SERIES.find((s) => s.id === id);
}

export function getSeriesPostSlugs(
  seriesId: string,
  allMeta: Pick<BlogPostMeta, 'slug' | 'series'>[],
): string[] {
  return allMeta
    .filter((p) => p.series?.id === seriesId)
    .sort((a, b) => a.series!.order - b.series!.order)
    .map((p) => p.slug);
}
