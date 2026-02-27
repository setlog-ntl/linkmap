export { services, checklistItems } from './services';
export type { ServiceSeed, ChecklistItemSeed } from './services';
export { servicesV2 } from './services-v2';
export { templates } from './templates';
export { domains } from './domains';
export { subcategories } from './subcategories';

// Service guides: merge all batches into a single export
import { serviceGuides as _base } from './service-guides';
import { serviceGuidesBatch3 } from './service-guides-batch3';
import { serviceGuidesBatch4 } from './service-guides-batch4';
import { serviceGuidesBatch5a } from './service-guides-batch5a';
import { serviceGuidesBatch5b } from './service-guides-batch5b';

export const serviceGuides = [
  ..._base,
  ...serviceGuidesBatch3,
  ...serviceGuidesBatch4,
  ...serviceGuidesBatch5a,
  ...serviceGuidesBatch5b,
];

export { costTiers } from './cost-tiers';
export { dependencies } from './dependencies';
export { comparisons } from './comparisons';
