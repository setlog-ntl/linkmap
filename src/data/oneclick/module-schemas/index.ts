import type { TemplateModuleSchema } from '@/lib/module-schema';
import { personalBrandModuleSchema } from './personal-brand';
import { devShowcaseModuleSchema } from './dev-showcase';
import { linkCardModuleSchema } from './link-card';
import { digitalNamecardModuleSchema } from './digital-namecard';
import { freelancerPageModuleSchema } from './freelancer-page';
import { smallBizModuleSchema } from './small-biz';
import { smallBizCafeModuleSchema } from './small-biz-cafe';

const schemaMap: Record<string, TemplateModuleSchema> = {
  'personal-brand': personalBrandModuleSchema,
  'dev-showcase': devShowcaseModuleSchema,
  'link-card': linkCardModuleSchema,
  'digital-namecard': digitalNamecardModuleSchema,
  'freelancer-page': freelancerPageModuleSchema,
  'small-biz': smallBizModuleSchema,
  'small-biz-cafe': smallBizCafeModuleSchema,
};

/** 템플릿 slug로 모듈 스키마 조회 (없으면 null) */
export function getModuleSchema(
  templateSlug: string
): TemplateModuleSchema | null {
  return schemaMap[templateSlug] ?? null;
}
