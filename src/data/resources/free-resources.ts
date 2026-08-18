// ---------------------------------------------------------------------------
// 무료배포 자료 (Free Resources)
//
// 목적: Linkmap 홍보용 무료 배포 자료를 서비스 안에 항목으로 제공한다.
// 이 파일이 자료 1건의 단일 진실 원천(SSOT)이며, 아래 4곳이 여기서 파생된다.
//   ① /resources 허브 카드   ② /resources/[slug] 상세
//   ③ sitemap.ts 엔트리      ④ public/downloads/*.html 배포본의 역링크
//
// ── 유튜브 상호연결 규약 ────────────────────────────────────────────────
// 영상 발행 전에는 `youtube.videoId = null`로 두고, 발행 직후 videoId 한 줄만
// 채운다. 그 순간 허브(/resources) 카드의 "영상 준비 중" 칩이 유튜브 버튼으로
// 자동 전환된다. (상세 페이지는 자료 본문만 다루고 영상을 노출하지 않는다)
// 반대 방향(유튜브 → Linkmap)은 영상 설명란·고정댓글에 아래 URL을 넣는다.
//   https://www.linkmap.biz/resources/<slug>
// 절차 상세: docs/resources-youtube-link.md
// ---------------------------------------------------------------------------

/** 자료 유형 — 허브 필터·배지 라벨에 쓰인다 */
export type ResourceCategory = 'prompt' | 'tool' | 'checklist';

export const RESOURCE_CATEGORIES: Record<
  ResourceCategory,
  { label: string; description: string }
> = {
  prompt: { label: '지시문', description: 'AI에 그대로 붙여넣는 복사용 지시문' },
  tool: { label: '도구', description: '바로 열어 쓰는 완성본 도구' },
  checklist: { label: '체크리스트', description: '따라 하면 끝나는 점검 목록' },
};

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

export interface FreeResource {
  slug: string;
  /** 배포자료 번호 — 허브 정렬 및 "자료 N번" 표기에 쓰인다 */
  order: number;
  title: string;
  /** 한 줄 설명 — 카드/메타 description 공용 */
  description: string;
  category: ResourceCategory;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  /** 상세 상단 히어로 */
  hero: { headline: string; highlight: string; sub: string };
  youtube: ResourceYoutube;
  /** 자료 본문의 복사용 지시문 블록 */
  prompts: ResourcePromptBlock[];
  /** 함께 제공되는 바로가기 */
  links: ResourceLink[];
  /**
   * 오프라인 배포용 단일 HTML 파일 경로 (public/).
   * 반드시 `/resources/` 밖에 둘 것 — Workers는 정적 자산을 라우트보다 먼저
   * 매칭하고 `.html`을 확장자 없이도 서빙하므로, public/resources/<slug>.html은
   * Next 라우트 /resources/<slug>를 가려버린다.
   */
  downloadHref: string;
  /** 상세 하단 마무리 문구 */
  closing: string;
}

const EXCEL_MERGER_PROMPT = `엑셀 여러 개를 하나로 합치는 도구를 만들어 줘. 개발자가 아니어도 쓸 수 있어야 해.

[어떤 파일이 오는지]
- 매달 부서별로 엑셀 파일을 받아. .xlsx, .xls, .csv가 섞여 있어.
- 부서마다 열 이름과 머리글 위치가 조금씩 달라.
  어떤 파일은 맨 위에 제목이 두 줄 있어서, 머리글이 서너 번째 줄에서 시작해.
- 같은 뜻인데 표기가 조금 다른 열이 있어. 예: "품목코드"와 "품목 코드".
- 숫자가 글자로 저장된 칸이 있어. 예: 수량 칸의 "1,200".
- 시트가 두 개 이상인 파일도 있어.

[어떤 결과를 원하는지]
1. 파일 여러 개를 한꺼번에 끌어다 놓으면, 전부 한 표로 합쳐 줘.
2. 어느 파일에서 온 줄인지 알 수 있게 "출처파일" 열을 자동으로 붙여 줘.
3. 머리글이 첫 줄이 아니면 자동으로 찾아 줘.
4. 표기만 조금 다른 열은 같은 열로 합쳐 줘.
5. 글자로 저장된 숫자는 숫자로 바꿔 줘. 합계가 되도록.
6. 시트가 여러 개면 기본은 첫 시트만 쓰고, "모든 시트 합치기" 옵션도 넣어 줘.
7. 합치기 전에 미리보기로 행 수와 열이 맞는지 확인하게 해 주고,
   "엑셀로 내려받기" 버튼으로 저장하게 해 줘.
8. 제일 중요한 것 — 도구가 알아서 처리한 건 전부 "확인이 필요한 것" 목록으로
   화면에 보여 줘. (머리글을 몇 번째 줄로 봤는지 / 어떤 열들을 하나로 합쳤는지 /
   숫자로 바꾼 칸이 몇 개인지 / 안 쓴 시트가 있는지 / 이름 없는 열이 있는지)

[결과물의 형태]
- 인터넷 페이지처럼 보이는 HTML 파일 "하나"로 만들어 줘. 더블클릭하면 바로 열리게.
- 파일은 절대 서버로 보내지 마. 모든 처리는 브라우저 안에서만 끝나야 해.
- 회사 PC처럼 외부 연결이 막힌 곳에서도 돌아가야 해. 필요한 라이브러리는
  파일 안에 넣거나, "내 컴퓨터에 저장" 버튼으로 오프라인용 파일을
  따로 저장할 수 있게 해 줘.`;

const EXCEL_MERGER_REFINE_PROMPT = `우리 자재팀 파일은 머리글이 4번째 줄이야. 자동 감지가 놓치면 4번째 줄부터 읽게 해 줘.
수량, 금액, 단가 열은 무조건 숫자로 취급해 줘. 글자가 섞여 있으면 알려 줘.
"거래처"와 "거래처명"도 같은 열로 합쳐 줘.
합친 결과에서 빈 줄과 소계 줄은 빼 줘. 몇 줄을 뺐는지 알려 줘.`;

export const FREE_RESOURCES: FreeResource[] = [
  {
    slug: 'excel-merger-prompt',
    order: 1,
    title: '엑셀 취합기 — 클로드 지시문 전문',
    description:
      '부서별 엑셀 파일을 하나로 합치는 도구를 코드 없이 만드는 지시문 전문. 클로드에 그대로 붙여넣고 파일 이름과 열 이름만 바꾸면 됩니다.',
    category: 'prompt',
    publishedAt: '2026-08-18',
    tags: ['엑셀 취합', '클로드', '사무직 자동화', '바이브코딩', '노코드 배포'],
    hero: {
      headline: '코드 몰라도,',
      highlight: '3분 만에',
      sub: '나만의 도구를 배포합니다',
    },
    youtube: {
      videoId: null, // 영상 발행 후 여기만 채우면 허브 카드에 유튜브 버튼이 뜬다
      title: '클로드 엑셀 — 매달 하던 파일 취합, 클릭 한 번으로 끝냈습니다',
    },
    prompts: [
      {
        id: 'build',
        title: '직접 만들고 싶다면 — 복사용 지시문',
        description:
          '클로드에 아래를 그대로 붙여넣으세요. 어떤 파일이 오는지 · 어떤 결과를 원하는지 · 결과물의 형태, 세 가지가 전부 들어 있습니다.',
        body: EXCEL_MERGER_PROMPT,
        note: '잠시 기다리면 HTML 파일이 하나 나옵니다. 내려받아서 더블클릭하면 끝. 파일 이름과 열 이름만 여러분 업무에 맞게 바꾸면 됩니다.',
      },
      {
        id: 'refine',
        title: '한 번에 안 되면 — 이렇게 다듬으세요',
        description:
          '여러분만 아는 함정을 한 줄씩 말해 주면 됩니다. 필요한 줄만 복사해서 쓰세요.',
        body: EXCEL_MERGER_REFINE_PROMPT,
      },
    ],
    links: [
      {
        label: '나만의 엑셀자동화 템플릿으로 배포하기',
        description: '템플릿을 고르고 클릭 한 번이면 내 도구에 URL이 생깁니다. 무료 3개까지.',
        href: '/sites/new?template=excel-merge',
        external: false,
        primary: true,
      },
      {
        label: '완성본 먼저 써 보기',
        description: '설치도 가입도 없이 링크만 열면 바로 씁니다. 파일은 브라우저 밖으로 나가지 않습니다.',
        href: 'https://setlog-ntl.github.io/myexceltool/',
        external: true,
      },
    ],
    downloadHref: '/downloads/excel-merger-prompt.html',
    closing:
      '다 만들었다면 Linkmap에 올려 URL 하나로 어디서든 여세요. 파일 처리는 똑같이 브라우저 안에서만 됩니다.',
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** 배포자료 번호순 목록 */
export function getFreeResources(): FreeResource[] {
  return [...FREE_RESOURCES].sort((a, b) => a.order - b.order);
}

export function getFreeResource(slug: string): FreeResource | undefined {
  return FREE_RESOURCES.find((r) => r.slug === slug);
}

/** generateStaticParams용 */
export function getFreeResourceSlugs(): { slug: string }[] {
  return FREE_RESOURCES.map(({ slug }) => ({ slug }));
}

/** sitemap용 경량 엔트리 */
export function getFreeResourceSitemapEntries(): {
  slug: string;
  publishedAt: string;
  updatedAt?: string;
}[] {
  return FREE_RESOURCES.map(({ slug, publishedAt, updatedAt }) => ({
    slug,
    publishedAt,
    updatedAt,
  }));
}

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
