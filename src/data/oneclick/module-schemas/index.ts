import type { TemplateModuleSchema } from '@/lib/module-schema';
import { personalBrandModuleSchema } from './personal-brand';

const schemaMap: Record<string, TemplateModuleSchema> = {
  'personal-brand': personalBrandModuleSchema,
};

/** 템플릿 slug로 모듈 스키마 조회 (없으면 null) */
export function getModuleSchema(
  templateSlug: string
): TemplateModuleSchema | null {
  return schemaMap[templateSlug] ?? null;
}
