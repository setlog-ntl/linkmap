import { z } from 'zod';
import { normalizeEnvKey, ENV_KEY_REGEX } from '@/lib/utils/env-key';

/**
 * 키 이름 스키마: 형식이 틀려도 거부하지 않고 자동 정규화한다.
 * (소문자 → 대문자, 특수문자 → 밑줄, 숫자 시작 → 밑줄 접두사)
 * 공백만 입력한 경우에만 거부된다.
 */
export const envKeyNameSchema = z
  .string()
  .min(1, '변수 이름은 필수입니다')
  .max(255, '변수 이름은 255자 이하')
  .transform(normalizeEnvKey)
  .refine((k) => ENV_KEY_REGEX.test(k), '변수 이름을 입력해주세요');

export const createEnvVarSchema = z.object({
  project_id: z.string().uuid('유효하지 않은 프로젝트 ID'),
  service_id: z.string().uuid().nullable().optional(),
  project_service_id: z.string().uuid().nullable().optional(),
  key_name: envKeyNameSchema,
  value: z.string().default(''),
  environment: z.enum(['development', 'staging', 'production']).default('development'),
  is_secret: z.boolean().default(true),
  description: z.string().max(500).nullable().optional(),
});

export const updateEnvVarSchema = z.object({
  id: z.string().uuid('유효하지 않은 환경변수 ID'),
  key_name: envKeyNameSchema.optional(),
  value: z.string().optional(),
  environment: z.enum(['development', 'staging', 'production']).optional(),
  is_secret: z.boolean().optional(),
  description: z.string().max(500).nullable().optional(),
  service_id: z.string().uuid().nullable().optional(),
  project_service_id: z.string().uuid().nullable().optional(),
});

export const syncEnvServicesSchema = z.object({
  project_id: z.string().uuid('유효하지 않은 프로젝트 ID'),
});

export type CreateEnvVarInput = z.infer<typeof createEnvVarSchema>;
export type UpdateEnvVarInput = z.infer<typeof updateEnvVarSchema>;
export type SyncEnvServicesInput = z.infer<typeof syncEnvServicesSchema>;
