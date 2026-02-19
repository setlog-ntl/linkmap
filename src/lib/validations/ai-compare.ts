import { z } from 'zod';

export const compareServicesSchema = z.object({
  slugs: z.array(z.string().min(1)).min(2, '최소 2개 서비스를 선택하세요').max(4, '최대 4개 서비스만 비교 가능합니다'),
});
