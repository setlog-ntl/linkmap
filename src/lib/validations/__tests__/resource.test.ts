import { describe, it, expect } from 'vitest';
import { createResourceSchema, updateResourceSchema } from '../resource';

const VALID = {
  slug: 'excel-merger-prompt',
  sort_order: 1,
  title: '엑셀 취합기',
  description: '설명',
  category: 'prompt',
  published_at: '2026-08-18',
  tags: ['엑셀 취합'],
  hero: { headline: '코드 몰라도,', highlight: '3분 만에', sub: '나만의 도구를 배포합니다' },
  youtube_video_id: 'ytTX-OmHspY',
  youtube_title: '영상 제목',
  prompts: [{ id: 'build', title: '지시문', description: '', body: '본문' }],
  links: [{ label: '배포하기', description: '', href: '/sites/new', external: false, primary: true }],
  download_href: '/downloads/excel-merger-prompt.html',
  closing: '마무리',
  is_published: true,
};

function ok(patch: Record<string, unknown>): boolean {
  return createResourceSchema.safeParse({ ...VALID, ...patch }).success;
}

describe('createResourceSchema', () => {
  it('accepts the seeded resource shape', () => {
    expect(createResourceSchema.safeParse(VALID).success).toBe(true);
  });

  // slug는 URL 경로에 그대로 들어간다 — 대문자·공백·특수문자를 넣으면 라우트가 어긋난다
  it('rejects slugs that are not lowercase-kebab', () => {
    expect(ok({ slug: 'Excel Merger' })).toBe(false);
    expect(ok({ slug: 'a--b' })).toBe(false);
    expect(ok({ slug: '-lead' })).toBe(false);
    expect(ok({ slug: 'ok-slug-2' })).toBe(true);
  });

  it('accepts a null video id and rejects anything that is not 11 chars', () => {
    expect(ok({ youtube_video_id: null })).toBe(true);
    expect(ok({ youtube_video_id: 'short' })).toBe(false);
    expect(ok({ youtube_video_id: 'https://youtu.be/ytTX-OmHspY' })).toBe(false);
  });

  // public/resources/ 아래 정적 파일은 Next 라우트를 가린다 — 경로 규칙을 스키마에서부터 막는다
  it('only allows /downloads/ paths or absolute URLs for the offline file', () => {
    expect(ok({ download_href: null })).toBe(true);
    expect(ok({ download_href: '/downloads/x.html' })).toBe(true);
    expect(ok({ download_href: 'https://example.com/x.html' })).toBe(true);
    expect(ok({ download_href: '/resources/x.html' })).toBe(false);
  });

  it('rejects duplicate prompt block ids', () => {
    expect(
      ok({
        prompts: [
          { id: 'build', title: 'a', description: '', body: 'x' },
          { id: 'build', title: 'b', description: '', body: 'y' },
        ],
      })
    ).toBe(false);
  });

  it('rejects link hrefs that are neither internal paths nor http(s) URLs', () => {
    expect(ok({ links: [{ label: 'x', description: '', href: 'javascript:alert(1)', external: true }] })).toBe(false);
    expect(ok({ links: [{ label: 'x', description: '', href: 'mailto:a@b.c', external: true }] })).toBe(false);
  });

  it('rejects unknown categories and malformed dates', () => {
    expect(ok({ category: 'video' })).toBe(false);
    expect(ok({ published_at: '2026/08/18' })).toBe(false);
  });
});

describe('updateResourceSchema', () => {
  it('accepts a partial payload such as a publish toggle', () => {
    expect(updateResourceSchema.safeParse({ is_published: false }).success).toBe(true);
  });

  it('still validates the fields that are present', () => {
    expect(updateResourceSchema.safeParse({ slug: 'Bad Slug' }).success).toBe(false);
  });
});
