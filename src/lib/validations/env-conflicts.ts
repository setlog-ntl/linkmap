import { z } from 'zod';

export const resolveConflictSchema = z.object({
  project_id: z.string().uuid('유효하지 않은 프로젝트 ID'),
  key_name: z.string().min(1, '키 이름은 필수입니다'),
  source_env: z.enum(['development', 'staging', 'production']),
  target_envs: z
    .array(z.enum(['development', 'staging', 'production']))
    .min(1, '대상 환경을 하나 이상 선택하세요'),
  action: z.enum(['copy', 'delete']),
});

export type ResolveConflictInput = z.infer<typeof resolveConflictSchema>;
