// ──────────────────────────────────────────────
// 모듈 상태 유효성 검증 (클라이언트/서버 공용)
// ──────────────────────────────────────────────

import type { ModuleConfigState, ModuleFieldDef, TemplateModuleSchema } from '@/lib/module-schema';

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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** 스칼라 필드 하나를 검증하고 오류를 errors 배열에 추가 */
function validateScalarField(
  val: unknown,
  field: ModuleFieldDef,
  moduleId: string,
  moduleName: string,
  fieldKey: string,
  errors: ValidationError[],
): void {
  const strVal = typeof val === 'string' ? val.trim() : typeof val === 'number' ? String(val) : '';
  const v = field.validation;

  const push = (message: string) =>
    errors.push({ moduleId, moduleName, fieldKey, fieldLabel: field.label, message });

  // 필수
  if (v?.required && !strVal) {
    push(`${field.label}은(는) 필수 입력 항목입니다`);
    return;
  }

  // 빈 값이면 이후 형식 검증 생략 (required는 위에서 처리)
  if (!strVal) return;

  // 문자열 길이
  if (v?.minLength != null && strVal.length < v.minLength) {
    push(`${field.label}은(는) 최소 ${v.minLength}자 이상이어야 합니다`);
  }
  if (v?.maxLength != null && strVal.length > v.maxLength) {
    push(`${field.label}은(는) 최대 ${v.maxLength}자까지 입력 가능합니다`);
  }

  // 숫자 범위
  if (field.type === 'number') {
    const num = typeof val === 'number' ? val : Number(strVal);
    if (!Number.isFinite(num)) {
      push(`${field.label}은(는) 숫자여야 합니다`);
    } else {
      if (v?.min != null && num < v.min) push(`${field.label}은(는) ${v.min} 이상이어야 합니다`);
      if (v?.max != null && num > v.max) push(`${field.label}은(는) ${v.max} 이하여야 합니다`);
    }
  }

  // 이메일 형식
  if (v?.inputType === 'email' && !EMAIL_RE.test(strVal)) {
    push(`${field.label} 이메일 형식을 확인하세요`);
  }

  // URL 형식 — 관대하게: 공백 포함 또는 점(.) 없음만 거부 (바른 도메인/상대경로 허용)
  if ((field.type === 'url' || field.type === 'image' || v?.inputType === 'url') && (/\s/.test(strVal) || (!strVal.includes('.') && !strVal.startsWith('/')))) {
    push(`${field.label} URL 형식을 확인하세요`);
  }

  // 패턴
  if (v?.pattern) {
    const re = new RegExp(v.pattern);
    if (!re.test(strVal)) {
      push(v.patternMessage ?? `${field.label} 형식을 확인하세요`);
    }
  }
}

/** 활성 모듈의 필수 필드 누락 및 형식 불일치 검사 */
export function validateModuleState(
  state: ModuleConfigState,
  schema: TemplateModuleSchema,
): ValidationResult {
  const errors: ValidationError[] = [];

  for (const mod of schema.modules) {
    if (!state.enabled.includes(mod.id)) continue;

    const values = state.values[mod.id] || {};

    for (const field of mod.fields) {
      // 배열 필드: maxItems 검사 + 각 아이템의 서브필드 개별 검증
      if (field.type === 'array') {
        const items = values[field.key];
        if (!Array.isArray(items) || !field.itemSchema) continue;

        if (field.maxItems != null && items.length > field.maxItems) {
          errors.push({
            moduleId: mod.id,
            moduleName: mod.name,
            fieldKey: field.key,
            fieldLabel: field.label,
            message: `${field.label}은(는) 최대 ${field.maxItems}개까지 추가할 수 있습니다`,
          });
        }

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
