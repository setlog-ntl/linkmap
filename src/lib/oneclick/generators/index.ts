// ──────────────────────────────────────────────
// Generator Registry — 템플릿 슬러그 → Generator 매핑
// ──────────────────────────────────────────────

export type {
  TemplateGenerator,
  ComponentMapping,
} from './base-generator';

export {
  esc,
  jsonBlock,
  percentToLevel,
  levelToPercent,
  buildSocialsArray,
  buildGalleryArray,
  createExtractors,
  extractSiteBlock,
  parseArrayConstant,
  parseSocialsFromConfig,
  buildInitialState,
} from './base-generator';

import { personalBrandGenerator } from './personal-brand';
import { devShowcaseGenerator } from './dev-showcase';
import { linkCardGenerator } from './link-card';
import { digitalNamecardGenerator } from './digital-namecard';
import { freelancerPageGenerator } from './freelancer-page';
import { smallBizGenerator } from './small-biz';
import { smallBizCafeGenerator } from './small-biz-cafe';
import { invitationGenerator } from './invitation';
import type { TemplateGenerator } from './base-generator';

/** 모든 등록된 generator */
const generators: TemplateGenerator[] = [
  personalBrandGenerator,
  devShowcaseGenerator,
  linkCardGenerator,
  digitalNamecardGenerator,
  freelancerPageGenerator,
  smallBizGenerator,
  smallBizCafeGenerator,
  invitationGenerator,
];

/** slug → generator 매핑 (O(1) 조회) */
const registry = new Map<string, TemplateGenerator>(
  generators.map((g) => [g.slug, g])
);

/** 템플릿 슬러그로 generator를 가져옴. 없으면 personal-brand 기본값. */
export function getGenerator(slug?: string): TemplateGenerator {
  if (!slug) return personalBrandGenerator;
  return registry.get(slug) ?? personalBrandGenerator;
}

// 개별 generator re-export
export { personalBrandGenerator } from './personal-brand';
export { devShowcaseGenerator } from './dev-showcase';
export { linkCardGenerator } from './link-card';
export { digitalNamecardGenerator } from './digital-namecard';
export { freelancerPageGenerator } from './freelancer-page';
export { smallBizGenerator } from './small-biz';
export { smallBizCafeGenerator } from './small-biz-cafe';
export { invitationGenerator } from './invitation';
