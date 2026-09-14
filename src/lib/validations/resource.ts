import { z } from 'zod';

// ---------------------------------------------------------------------------
// 무료배포 자료 (free_resources · M110) 입력 검증
//
// JSONB 컬럼(hero/prompts/links)의 형태는 src/types/resource.ts 와 함께 계약을 이룬다.
// 길이 상한은 관리자 오입력·과대 페이로드 방지용이며 화면 레이아웃 기준으로 잡았다.
// ---------------------------------------------------------------------------

/** URL 경로에 그대로 들어가므로 영문 소문자·숫자·하이픈만 (DB CHECK와 동일) */
export const RESOURCE_SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** 유튜브 영상 ID는 항상 11자 (DB CHECK와 동일) */
export const YOUTUBE_VIDEO_ID_REGEX = /^[A-Za-z0-9_-]{11}$/;

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * 오프라인 배포본 경로. `/downloads/` 아래 정적 파일 또는 외부 URL만 허용한다.
 * `/resources/` 아래 정적 파일은 Next 라우트를 가리므로 여기서부터 막는다.
 */
const DOWNLOAD_HREF_REGEX = /^(\/downloads\/\S+|https?:\/\/\S+)$/;

export const RESOURCE_CATEGORY_VALUES = ['prompt', 'tool', 'checklist'] as const;

const heroSchema = z.object({
  headline: z.string().min(1, '히어로 첫 줄은 필수입니다').max(60),
  highlight: z.string().min(1, '히어로 강조 문구는 필수입니다').max(60),
  sub: z.string().min(1, '히어로 마무리 문구는 필수입니다').max(80),
});

const promptBlockSchema = z.object({
  id: z
    .string()
    .min(1, '블록 ID는 필수입니다')
    .max(40)
    .regex(/^[a-z0-9-]+$/, '블록 ID는 영문 소문자·숫자·하이픈만 사용'),
  title: z.string().min(1, '블록 제목은 필수입니다').max(120),
  description: z.string().max(500),
  body: z.string().min(1, '복사용 본문은 필수입니다').max(20000),
  note: z.string().max(500).optional(),
});

const promptsSchema = z
  .array(promptBlockSchema)
  .max(10, '지시문 블록은 최대 10개')
  .refine(
    (blocks) => new Set(blocks.map((b) => b.id)).size === blocks.length,
    '지시문 블록 ID가 중복됩니다'
  );

const linkSchema = z.object({
  label: z.string().min(1, '링크 라벨은 필수입니다').max(80),
  description: z.string().max(300),
  href: z
    .string()
    .min(1, '링크 주소는 필수입니다')
    .max(500)
    .refine(
      (v) => v.startsWith('/') || /^https?:\/\//.test(v),
      '내부 경로(/)나 http(s) URL만 허용'
    ),
  external: z.boolean(),
  primary: z.boolean().optional(),
});

export const createResourceSchema = z.object({
  slug: z
    .string()
    .min(1, 'slug는 필수입니다')
    .max(80)
    .regex(RESOURCE_SLUG_REGEX, 'slug는 영문 소문자·숫자·하이픈만 사용'),
  sort_order: z.number().int().min(1).max(9999),
  title: z.string().min(1, '제목은 필수입니다').max(120),
  description: z.string().min(1, '한 줄 설명은 필수입니다').max(500),
  category: z.enum(RESOURCE_CATEGORY_VALUES),
  published_at: z.string().regex(ISO_DATE_REGEX, '공개일은 YYYY-MM-DD 형식'),
  tags: z.array(z.string().min(1).max(30)).max(10, '태그는 최대 10개'),
  hero: heroSchema,
  youtube_video_id: z
    .string()
    .regex(YOUTUBE_VIDEO_ID_REGEX, '유튜브 영상 ID는 11자입니다')
    .nullable(),
  youtube_title: z.string().max(200),
  prompts: promptsSchema,
  links: z.array(linkSchema).max(6, '바로가기는 최대 6개'),
  download_href: z
    .string()
    .max(500)
    .regex(DOWNLOAD_HREF_REGEX, '/downloads/ 아래 경로 또는 http(s) URL만 허용')
    .nullable(),
  closing: z.string().max(500),
  is_published: z.boolean(),
});

export const updateResourceSchema = createResourceSchema.partial();

export type CreateResourceInput = z.input<typeof createResourceSchema>;
export type UpdateResourceInput = z.input<typeof updateResourceSchema>;
