import type { FreeResource, FreeResourceRow } from '@/types';

/**
 * free_resources Row → 화면 도메인(FreeResource).
 * updated_at은 시스템 타임스탬프이므로 공개일보다 뒤인 날짜일 때만 노출한다 —
 * 공개 당일 저장한 자료가 "갱신됨"으로 보이지 않게.
 */
export function toFreeResource(row: FreeResourceRow): FreeResource {
  const updatedDate = row.updated_at.slice(0, 10);
  return {
    id: row.id,
    slug: row.slug,
    order: row.sort_order,
    title: row.title,
    description: row.description,
    category: row.category,
    publishedAt: row.published_at,
    updatedAt: updatedDate > row.published_at ? updatedDate : undefined,
    tags: row.tags ?? [],
    hero: row.hero,
    youtube: { videoId: row.youtube_video_id, title: row.youtube_title },
    prompts: row.prompts ?? [],
    links: row.links ?? [],
    downloadHref: row.download_href,
    closing: row.closing,
  };
}
