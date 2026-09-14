/**
 * 무료배포 자료 — 공개 페이지용 서버 읽기 (ISR).
 *
 * 쿠키 없는 anon 클라이언트로 읽으므로 RLS `public_read_published`가 허용한
 * 발행 자료만 보인다. 관리자 목록(미발행 포함)은 /api/admin/resources 가 담당한다.
 * React cache()로 감싸 generateMetadata와 페이지 본문이 같은 요청에서 DB를 한 번만 친다.
 */
import 'server-only';
import { cache } from 'react';
import { createPublicClient } from '@/lib/supabase/public';
import { toFreeResource } from '@/lib/mappers/free-resource';
import type { FreeResource, FreeResourceRow } from '@/types';

const TABLE = 'free_resources';

/**
 * `next build`의 프리렌더 단계인가.
 * /resources는 ISR이지만 정적 경로라 빌드 시점에 한 번 렌더된다. 이때 DB 조회가 실패하면
 * (테이블 미적용·네트워크 등) 빌드 전체가 깨지므로 빈 목록으로 생성하고, 배포 후 첫 요청이
 * 60초 ISR 재검증으로 실제 데이터를 채우게 한다. 런타임에는 반대로 throw해야 한다 —
 * 빈 페이지가 캐시되는 대신 직전 캐시본이 그대로 서빙되도록.
 */
function isBuildPhase(): boolean {
  return process.env.NEXT_PHASE === 'phase-production-build';
}

/** 발행된 자료 전체 — 배포자료 번호순 */
export const getPublishedResources = cache(async (): Promise<FreeResource[]> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('is_published', true)
    .order('sort_order', { ascending: true });

  if (error) {
    if (isBuildPhase()) {
      console.warn(
        `[free-resources] 빌드 프리렌더 중 DB 조회 실패 — 빈 목록으로 생성, 첫 요청 후 ISR이 채움: ${error.message}`
      );
      return [];
    }
    throw new Error(`무료배포 자료 목록 조회 실패: ${error.message}`);
  }
  return ((data ?? []) as FreeResourceRow[]).map(toFreeResource);
});

/** slug로 발행된 자료 1건 — 없거나 미발행이면 null */
export const getPublishedResource = cache(
  async (slug: string): Promise<FreeResource | null> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle();

    if (error) throw new Error(`무료배포 자료 조회 실패(${slug}): ${error.message}`);
    return data ? toFreeResource(data as FreeResourceRow) : null;
  }
);

/** sitemap용 경량 엔트리 */
export async function getPublishedResourceSitemapEntries(): Promise<
  { slug: string; publishedAt: string; updatedAt?: string }[]
> {
  const resources = await getPublishedResources();
  return resources.map(({ slug, publishedAt, updatedAt }) => ({ slug, publishedAt, updatedAt }));
}
