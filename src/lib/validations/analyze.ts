import { z } from 'zod';

export const analyzeKeySchema = z.object({
  project_id: z.string().uuid('유효하지 않은 프로젝트 ID'),
  value: z.string().min(1, '키 값은 필수입니다').optional(),
  content: z.string().min(1, '.env 내용은 필수입니다').optional(),
  key_name: z.string().max(255).optional(),
}).refine(
  (data) => data.value || data.content,
  { message: 'value 또는 content 중 하나는 필수입니다' },
);

export const analyzeApplySchema = z.object({
  project_id: z.string().uuid('유효하지 않은 프로젝트 ID'),
  entries: z.array(z.object({
    key_name: z.string()
      .min(1, '변수 이름은 필수입니다')
      .max(255)
      .regex(/^[A-Z][A-Z0-9_]*$/, '변수 이름은 대문자, 숫자, 밑줄만 허용'),
    value: z.string(),
    service_id: z.string().uuid().nullable(),
    environment: z.enum(['development', 'staging', 'production']).default('development'),
    is_secret: z.boolean().default(true),
  })).min(1, '최소 1개의 환경변수가 필요합니다'),
});

export type AnalyzeKeyInput = z.infer<typeof analyzeKeySchema>;
export type AnalyzeApplyInput = z.infer<typeof analyzeApplySchema>;
