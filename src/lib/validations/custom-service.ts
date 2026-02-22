import { z } from 'zod';

export const createCustomServiceSchema = z.object({
  name: z.string().min(1, '서비스 이름은 필수입니다').max(100),
  category: z.string().default('other'),
  description: z.string().max(500).optional(),
  icon_emoji: z.string().max(10).optional(),
  website_url: z.string().url().max(500).optional().or(z.literal('')),
  docs_url: z.string().url().max(500).optional().or(z.literal('')),
});

export const updateCustomServiceSchema = createCustomServiceSchema.partial();
