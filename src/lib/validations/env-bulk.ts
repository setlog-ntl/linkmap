import { z } from 'zod';
import { envKeyNameSchema } from '@/lib/validations/env';

export const bulkEnvVarSchema = z.object({
  project_id: z.string().uuid('유효하지 않은 프로젝트 ID'),
  variables: z.array(
    z.object({
      key_name: envKeyNameSchema,
      value: z.string().max(10000, '값은 10,000자를 초과할 수 없습니다').default(''),
      environment: z.enum(['development', 'staging', 'production']).default('development'),
      is_secret: z.boolean().default(true),
      description: z.string().max(500).nullable().optional(),
      service_id: z.string().uuid().nullable().optional(),
    })
  ).min(1, '최소 1개의 변수가 필요합니다').max(100, '최대 100개까지 일괄 추가 가능합니다'),
}).refine(
  (data) => {
    const keys = data.variables.map((v) => `${v.key_name}:${v.environment}`);
    return new Set(keys).size === keys.length;
  },
  { message: '동일한 환경에 중복된 변수 이름이 있습니다' }
);

export type BulkEnvVarInput = z.infer<typeof bulkEnvVarSchema>;
