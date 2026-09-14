// ---------------------------------------------------------------------------
// 무료배포 자료 (Free Resources) — 표시 상수·URL 헬퍼
//
// 자료 데이터의 단일 진실 원천(SSOT)은 DB `free_resources` 테이블(M110)이다.
// 관리자가 /admin/resources 에서 항목을 추가·발행하며, 아래 4곳이 거기서 파생된다.
//   ① /resources 허브 카드   ② /resources/[slug] 상세
//   ③ sitemap.ts 엔트리      ④ llms.txt 목록
// 서버 읽기: src/lib/resources/queries.ts · 타입: src/types/resource.ts
// 오프라인 배포본(public/downloads/*.html)은 자료 페이지 정식 URL로 역링크만 갖는다.
//
// ── 유튜브 상호연결 규약 ────────────────────────────────────────────────
// 영상 발행 전에는 영상 ID를 비워 두고, 발행 직후 관리자 화면에서 ID만 채운다.
// 그 순간 허브(/resources) 카드의 "영상 준비 중" 칩이 유튜브 버튼으로 바뀌고,
// 카드 상단에 영상 썸네일(i.ytimg.com)이 자동으로 붙는다.
// (상세 페이지는 자료 본문만 다루고 영상을 노출하지 않는다)
// 반대 방향(유튜브 → Linkmap)은 영상 설명란·고정댓글에 아래 URL을 넣는다.
//   https://www.linkmap.biz/resources/<slug>
// 절차 상세: docs/resources-youtube-link.md
// ---------------------------------------------------------------------------

import type { ResourceCategory, ResourceYoutube } from '@/types/resource';

// 기존 import 경로 호환 — 타입 정의는 src/types/resource.ts 에 있다
export type {
  ResourceCategory,
  ResourceYoutube,
  ResourceLink,
  ResourcePromptBlock,
  ResourceHero,
  FreeResource,
} from '@/types/resource';

export const RESOURCE_CATEGORIES: Record<
  ResourceCategory,
  { label: string; description: string }
> = {
  prompt: { label: '지시문', description: 'AI에 그대로 붙여넣는 복사용 지시문' },
  tool: { label: '도구', description: '바로 열어 쓰는 완성본 도구' },
  checklist: { label: '체크리스트', description: '따라 하면 끝나는 점검 목록' },
};

/**
 * 유튜브 → Linkmap 역방향 링크에 쓰는 정식 URL.
 * 영상 설명란·고정댓글에는 반드시 이 값을 넣는다 (자료 페이지가 상호연결의 허브).
 */
export function getResourceCanonicalUrl(slug: string): string {
  return `https://www.linkmap.biz/resources/${slug}`;
}

/** videoId가 채워졌을 때만 시청 URL을 만든다 */
export function getYoutubeWatchUrl(youtube: ResourceYoutube): string | null {
  return youtube.videoId ? `https://www.youtube.com/watch?v=${youtube.videoId}` : null;
}

/**
 * 허브 카드 썸네일 URL. hqdefault(480×360)는 모든 영상에 항상 존재한다 —
 * maxresdefault는 영상에 따라 없을 수 있어 쓰지 않는다. 4:3 프레임의 상하
 * 레터박스는 카드에서 16:9로 잘라 감춘다 (`aspect-video` + `object-cover`).
 * i.ytimg.com은 next.config.ts의 CSP img-src에 허용돼 있다.
 */
export function getYoutubeThumbnailUrl(youtube: ResourceYoutube): string | null {
  return youtube.videoId ? `https://i.ytimg.com/vi/${youtube.videoId}/hqdefault.jpg` : null;
}
