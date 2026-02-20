import type { ModulePreset } from './personal-brand';
import { personalBrandPresets } from './personal-brand';
import { devShowcasePresets } from './dev-showcase';
import { freelancerPagePresets } from './freelancer-page';
import { digitalNamecardPresets } from './digital-namecard';
import { linkInBioProPresets } from './link-in-bio-pro';
import { smallBizPresets } from './small-biz';

const PRESET_MAP: Record<string, ModulePreset[]> = {
  'personal-brand': personalBrandPresets,
  'dev-showcase': devShowcasePresets,
  'freelancer-page': freelancerPagePresets,
  'digital-namecard': digitalNamecardPresets,
  'link-in-bio-pro': linkInBioProPresets,
  'small-biz': smallBizPresets,
};

export function getModulePresets(templateSlug: string): ModulePreset[] {
  return PRESET_MAP[templateSlug] || [];
}

export type { ModulePreset };
