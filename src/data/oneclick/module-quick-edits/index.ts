import type { QuickEditQuestion } from './types';
import { personalBrandQuickEdits } from './personal-brand';
import { devShowcaseQuickEdits } from './dev-showcase';
import { freelancerPageQuickEdits } from './freelancer-page';
import { digitalNamecardQuickEdits } from './digital-namecard';
import { linkInBioProQuickEdits } from './link-in-bio-pro';
import { smallBizQuickEdits } from './small-biz';

const QUICK_EDIT_MAP: Record<string, QuickEditQuestion[]> = {
  'personal-brand': personalBrandQuickEdits,
  'dev-showcase': devShowcaseQuickEdits,
  'freelancer-page': freelancerPageQuickEdits,
  'digital-namecard': digitalNamecardQuickEdits,
  'link-in-bio-pro': linkInBioProQuickEdits,
  'small-biz': smallBizQuickEdits,
};

export function getQuickEdits(templateSlug: string): QuickEditQuestion[] {
  return QUICK_EDIT_MAP[templateSlug] || [];
}

export type { QuickEditQuestion };
