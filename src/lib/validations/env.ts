import { z } from 'zod';

export const createEnvVarSchema = z.object({
  project_id: z.string().uuid('유효하지 않은 프로젝트 ID'),
  service_id: z.string().uuid().nullable().optional(),
  key_name: z
    .string()
    .min(1, '변수 이름은 필수입니다')
    .max(255, '변수 이름은 255자 이하')
    .regex(/^[A-Z][A-Z0-9_]*$/, '변수 이름은 대문자, 숫자, 밑줄만 허용'),
  value: z.string().default(''),
  environment: z.enum(['development', 'staging', 'production']).default('development'),
  is_secret: z.boolean().default(true),
  description: z.string().max(500).nullable().optional(),
});

export const updateEnvVarSchema = z.object({
  id: z.string().uuid('유효하지 않은 환경변수 ID'),
  key_name: z
    .string()
    .min(1)
    .max(255)
    .regex(/^[A-Z][A-Z0-9_]*$/)
    .optional(),
  value: z.string().optional(),
  environment: z.enum(['development', 'staging', 'production']).optional(),
  is_secret: z.boolean().optional(),
  description: z.string().max(500).nullable().optional(),
});

export type CreateEnvVarInput = z.infer<typeof createEnvVarSchema>;
export type UpdateEnvVarInput = z.infer<typeof updateEnvVarSchema>;
