import { z } from 'zod';

export const stackRecommendSchema = z.object({
  description: z.string().min(5, '프로젝트 설명은 최소 5자 이상이어야 합니다').max(500),
  project_id: z.string().uuid().optional(),
});
