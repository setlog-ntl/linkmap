import type { ModulePreset } from './personal-brand';
import { personalBrandPresets } from './personal-brand';
import { devShowcasePresets } from './dev-showcase';
import { freelancerPagePresets } from './freelancer-page';
import { digitalNamecardPresets } from './digital-namecard';
import { linkCardPresets } from './link-card';
import { smallBizPresets } from './small-biz';
import { smallBizCafePresets } from './small-biz-cafe';
import { invitationPresets } from './invitation';
import { excelMergePresets } from './excel-merge';

const PRESET_MAP: Record<string, ModulePreset[]> = {
  'personal-brand': personalBrandPresets,
  'dev-showcase': devShowcasePresets,
  'freelancer-page': freelancerPagePresets,
  'digital-namecard': digitalNamecardPresets,
  'link-card': linkCardPresets,
  'small-biz': smallBizPresets,
  'small-biz-cafe': smallBizCafePresets,
  'invitation': invitationPresets,
  'excel-merge': excelMergePresets,
};

export function getModulePresets(templateSlug: string): ModulePreset[] {
  return PRESET_MAP[templateSlug] || [];
}

export type { ModulePreset };
