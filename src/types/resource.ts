// ---------------------------------------------------------------------------
// 무료배포 자료 (free_resources · M110)
//
// FreeResource 는 화면이 쓰는 도메인 형태, FreeResourceRow 는 DB 컬럼 그대로다.
// 둘 사이 변환은 src/lib/mappers/free-resource.ts 가 담당한다.
// JSONB 컬럼(hero/prompts/links)의 형태는 src/lib/validations/resource.ts(Zod)와
// 이 파일이 함께 계약을 이룬다 — 한쪽을 바꾸면 다른 쪽도 맞출 것.
// ---------------------------------------------------------------------------

/** 자료 유형 — DB CHECK(category IN ('prompt','tool','checklist'))와 동기화 */
export type ResourceCategory = 'prompt' | 'tool' | 'checklist';

/**
 * 유튜브 연결 정보.
 * videoId가 null이면 "영상 준비 중" 칩으로 렌더된다 — 발행 후 ID만 채우면 된다.
 */
export interface ResourceYoutube {
  videoId: string | null;
  /** 영상 제목(예정 포함) — 버튼의 스크린리더 라벨·툴팁에 쓰인다 */
  title: string;
}

/** 자료에 딸린 외부/내부 바로가기 */
export interface ResourceLink {
  label: string;
  description: string;
  href: string;
  /** external이면 새 탭 + rel=noopener */
  external: boolean;
  /** 강조 버튼 여부 */
  primary?: boolean;
}

/** 복사용 지시문 블록 */
export interface ResourcePromptBlock {
  id: string;
  title: string;
  description: string;
  /** 복사 대상 본문 — 그대로 클립보드에 들어간다 */
  body: string;
  note?: string;
}

/** 상세 상단 히어로 문구 — "{headline} {highlight} {sub}" 순으로 렌더된다 */
export interface ResourceHero {
  headline: string;
  highlight: string;
  sub: string;
}

/** 화면(허브·상세·sitemap)이 쓰는 자료 1건 */
export interface FreeResource {
  id: string;
  slug: string;
  /** 배포자료 번호 — 허브 정렬 및 "자료 N번" 표기에 쓰인다 */
  order: number;
  title: string;
  /** 한 줄 설명 — 카드/메타 description 공용 */
  description: string;
  category: ResourceCategory;
  /** YYYY-MM-DD */
  publishedAt: string;
  /** YYYY-MM-DD — 공개일과 같으면 생략 */
  updatedAt?: string;
  tags: string[];
  hero: ResourceHero;
  youtube: ResourceYoutube;
  /** 자료 본문의 복사용 지시문 블록 */
  prompts: ResourcePromptBlock[];
  /** 함께 제공되는 바로가기 */
  links: ResourceLink[];
  /**
   * 오프라인 배포용 단일 HTML 파일 경로. 없으면 상세의 내려받기 섹션이 숨겨진다.
   * 반드시 `/resources/` 밖(`/downloads/…`)에 둘 것 — Workers는 정적 자산을 라우트보다
   * 먼저 매칭하고 `.html`을 확장자 없이도 서빙하므로, public/resources/<slug>.html은
   * Next 라우트 /resources/<slug>를 가려버린다.
   */
  downloadHref: string | null;
  /** 상세 하단 마무리 문구 */
  closing: string;
}

/** free_resources 테이블 Row (M110) */
export interface FreeResourceRow {
  id: string;
  slug: string;
  sort_order: number;
  title: string;
  description: string;
  category: ResourceCategory;
  /** DATE → 'YYYY-MM-DD' */
  published_at: string;
  tags: string[];
  hero: ResourceHero;
  youtube_video_id: string | null;
  youtube_title: string;
  prompts: ResourcePromptBlock[];
  links: ResourceLink[];
  download_href: string | null;
  closing: string;
  /** false면 공개 페이지·sitemap·llms.txt 어디에도 노출되지 않는다 (RLS) */
  is_published: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}
