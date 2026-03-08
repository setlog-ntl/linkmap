// ──────────────────────────────────────────────
// Small Biz Cafe Generator
// small-biz와 동일한 로직을 재사용하며 slug만 다름
// ──────────────────────────────────────────────

import { smallBizGenerator } from './small-biz';
import type { TemplateGenerator } from './base-generator';

export const smallBizCafeGenerator: TemplateGenerator = {
  ...smallBizGenerator,
  slug: 'small-biz-cafe',
};
