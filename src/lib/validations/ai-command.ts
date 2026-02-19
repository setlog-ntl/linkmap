import { z } from 'zod';

export const aiCommandSchema = z.object({
  command: z.string().min(1, '명령어를 입력하세요').max(300),
  project_id: z.string().uuid().optional(),
});
