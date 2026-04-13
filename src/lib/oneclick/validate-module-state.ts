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

/** 스칼라 필드 하나를 검증하고 오류를 errors 배열에 추가 */
function validateScalarField(
  val: unknown,
  field: { key: string; label: string; validation?: { required?: boolean; pattern?: string; patternMessage?: string } },
  moduleId: string,
  moduleName: string,
  fieldKey: string,
  errors: ValidationError[],
): void {
  const strVal = typeof val === 'string' ? val.trim() : '';

  if (field.validation?.required && !strVal) {
    errors.push({
      moduleId,
      moduleName,
      fieldKey,
      fieldLabel: field.label,
      message: `${field.label}은(는) 필수 입력 항목입니다`,
    });
    return;
  }

  if (field.validation?.pattern && strVal) {
    const re = new RegExp(field.validation.pattern);
    if (!re.test(strVal)) {
      errors.push({
        moduleId,
        moduleName,
        fieldKey,
        fieldLabel: field.label,
        message: field.validation.patternMessage ?? `${field.label} 형식을 확인하세요`,
      });
    }
  }
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
      // 배열 필드: 각 아이템의 서브필드를 개별 검증
      if (field.type === 'array') {
        const items = values[field.key];
        if (!Array.isArray(items) || !field.itemSchema) continue;

        for (let i = 0; i < items.length; i++) {
          const item = items[i] as Record<string, unknown>;
          for (const subField of field.itemSchema) {
            validateScalarField(
              item[subField.key],
              subField,
              mod.id,
              mod.name,
              `${field.key}[${i}].${subField.key}`,
              errors,
            );
          }
        }
        continue;
      }

      validateScalarField(
        values[field.key],
        field,
        mod.id,
        mod.name,
        field.key,
        errors,
      );
    }
  }

  return { valid: errors.length === 0, errors };
}
