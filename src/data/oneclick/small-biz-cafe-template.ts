// ──────────────────────────────────────────────
// Small Biz Cafe Template
// small-biz와 동일한 컴포넌트를 사용하며 slug만 다름
// ──────────────────────────────────────────────

import { smallBizTemplate } from './small-biz-template';
import type { HomepageTemplateContent } from './homepage-template-content';

export const smallBizCafeTemplate: HomepageTemplateContent = {
  ...smallBizTemplate,
  slug: 'small-biz-cafe',
  repoName: 'small-biz-cafe',
  description: 'Cafe promotion one-page site',
};
