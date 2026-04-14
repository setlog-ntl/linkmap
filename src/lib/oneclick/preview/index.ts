// ──────────────────────────────────────────────
// Preview HTML Generation — Entry Point
// ──────────────────────────────────────────────

import type { ModuleConfigState } from '@/lib/module-schema';
import { generatePersonalBrandPreview } from './personal-brand';
import { generateDevShowcasePreview } from './dev-showcase';
import { generateDigitalNamecardPreview } from './digital-namecard';
import { generateFreelancerPagePreview } from './freelancer-page';
import { generateLinkCardPreview } from './link-card';
import { generateSmallBizPreview } from './small-biz';
import { generateSmallBizCafePreview } from './small-biz-cafe';
import { generateInvitationPreview } from './invitation';

type PreviewGenerator = (
  state: ModuleConfigState,
  liveUrl: string,
  imageMap: Record<string, string>,
) => string;

const GENERATORS: Record<string, PreviewGenerator> = {
  'personal-brand': generatePersonalBrandPreview,
  'dev-showcase': generateDevShowcasePreview,
  'digital-namecard': generateDigitalNamecardPreview,
  'freelancer-page': generateFreelancerPagePreview,
  'link-card': generateLinkCardPreview,
  'small-biz': generateSmallBizPreview,
  'small-biz-cafe': generateSmallBizCafePreview,
  'invitation': generateInvitationPreview,
};

export function generatePreviewHtml(
  state: ModuleConfigState,
  templateSlug: string,
  liveUrl: string,
  imageMap: Record<string, string> = {},
): string | null {
  const gen = GENERATORS[templateSlug];
  if (!gen) return null;
  return gen(state, liveUrl, imageMap);
}
