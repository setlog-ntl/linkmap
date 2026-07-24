import { describe, it, expect } from 'vitest';
import { SERVICE_SLUGS } from '../service-slugs';
import { services } from '../services';
import { servicesV2 } from '../services-v2';
import { subcategories } from '../subcategories';
import { domains } from '../domains';

/**
 * SERVICE_SLUGS는 sitemap 라우트에 470KB 카탈로그가 번들되는 것을 피하려고
 * 수동으로 관리하는 목록이다. 그래서 카탈로그와 드리프트가 날 수 있고,
 * 실제로 2026-07 이전까지 24개가 누락된 채 방치됐다. 이 테스트가 그 재발을 막는다.
 */
describe('SERVICE_SLUGS ↔ 카탈로그 정합성', () => {
  const catalogSlugs = [...new Set([...services, ...servicesV2].map((s) => s.slug))];

  it('카탈로그의 모든 slug가 sitemap 목록에 있다', () => {
    const listed = new Set(SERVICE_SLUGS);
    const missing = catalogSlugs.filter((s) => !listed.has(s));
    expect(missing, `sitemap 누락 — service-slugs.ts에 추가 필요: ${missing.join(', ')}`).toEqual([]);
  });

  it('sitemap 목록에 카탈로그에 없는 slug가 없다', () => {
    const known = new Set(catalogSlugs);
    const ghost = SERVICE_SLUGS.filter((s) => !known.has(s));
    expect(ghost, `카탈로그에 없는 slug — /services/[slug]가 404가 된다: ${ghost.join(', ')}`).toEqual([]);
  });

  it('sitemap 목록에 중복이 없다', () => {
    const dupes = SERVICE_SLUGS.filter((s, i) => SERVICE_SLUGS.indexOf(s) !== i);
    expect([...new Set(dupes)]).toEqual([]);
  });
});

describe('카탈로그 분류 참조 무결성', () => {
  const all = [...services, ...servicesV2];

  it('service.id가 전부 고유하다', () => {
    const ids = all.map((s) => s.id);
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect([...new Set(dupes)]).toEqual([]);
  });

  it('subcategory가 전부 service_subcategories에 존재한다 (DB FK 제약)', () => {
    const known = new Set(subcategories.map((s) => s.id));
    const bad = all
      .filter((s) => s.subcategory && !known.has(s.subcategory))
      .map((s) => `${s.slug} → '${s.subcategory}'`);
    expect(bad, `subcategories.ts에 없는 subcategory — DB upsert가 FK 위반으로 실패한다: ${bad.join(', ')}`).toEqual([]);
  });

  it('domain이 전부 service_domains에 존재한다 (DB FK 제약)', () => {
    const known = new Set(domains.map((d) => d.id));
    const bad = all
      .filter((s) => s.domain && !known.has(s.domain))
      .map((s) => `${s.slug} → '${s.domain}'`);
    expect(bad).toEqual([]);
  });
});
