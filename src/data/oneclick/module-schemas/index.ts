import type { TemplateModuleSchema } from '@/lib/module-schema';
import { personalBrandModuleSchema } from './personal-brand';
import { devShowcaseModuleSchema } from './dev-showcase';
import { linkInBioProModuleSchema } from './link-in-bio-pro';

const schemaMap: Record<string, TemplateModuleSchema> = {
  'personal-brand': personalBrandModuleSchema,
  'dev-showcase': devShowcaseModuleSchema,
  'link-in-bio-pro': linkInBioProModuleSchema,
};

/** 템플릿 slug로 모듈 스키마 조회 (없으면 null) */
export function getModuleSchema(
  templateSlug: string
): TemplateModuleSchema | null {
  return schemaMap[templateSlug] ?? null;
}
