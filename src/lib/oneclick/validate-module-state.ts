// ──────────────────────────────────────────────
// 모듈 상태 유효성 검증 (클라이언트/서버 공용)
// ──────────────────────────────────────────────

import type { ModuleConfigState, TemplateModuleSchema } from '@/lib/module-schema';

export interface ValidationError {
  moduleId: string;
  moduleName: string;
  fieldKey: string;
  fieldLabel: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/** 활성 모듈의 필수 필드 누락 및 패턴 불일치 검사 */
export function validateModuleState(
  state: ModuleConfigState,
  schema: TemplateModuleSchema,
): ValidationResult {
  const errors: ValidationError[] = [];

  for (const mod of schema.modules) {
    if (!state.enabled.includes(mod.id)) continue;

    const values = state.values[mod.id] || {};

    for (const field of mod.fields) {
      if (field.type === 'array') continue; // 배열은 개별 항목 검증 스킵

      const val = values[field.key];
      const strVal = typeof val === 'string' ? val.trim() : '';

      // 필수 필드 누락
      if (field.validation?.required && !strVal) {
        errors.push({
          moduleId: mod.id,
          moduleName: mod.name,
          fieldKey: field.key,
          fieldLabel: field.label,
          message: `${field.label}은(는) 필수 입력 항목입니다`,
        });
        continue;
      }

      // 패턴 검증
      if (field.validation?.pattern && strVal) {
        const re = new RegExp(field.validation.pattern);
        if (!re.test(strVal)) {
          errors.push({
            moduleId: mod.id,
            moduleName: mod.name,
            fieldKey: field.key,
            fieldLabel: field.label,
            message: field.validation.patternMessage ?? `${field.label} 형식을 확인하세요`,
          });
        }
      }
    }
  }

  return { valid: errors.length === 0, errors };
}
