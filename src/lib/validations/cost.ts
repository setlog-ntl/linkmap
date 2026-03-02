import { z } from 'zod';

export const updateServiceCostSchema = z
  .object({
    cost_tier_id: z.string().uuid().nullable().optional(),
    custom_cost_monthly: z.number().min(0).max(999999.99).nullable().optional(),
    custom_cost_yearly: z.number().min(0).max(999999.99).nullable().optional(),
    cost_notes: z.string().max(500).nullable().optional(),
    billing_cycle: z
      .enum(['monthly', 'yearly', 'one_time', 'usage_based'])
      .optional(),
  })
  .refine((d) => !(d.cost_tier_id && d.custom_cost_monthly != null), {
    message: '요금 단계와 커스텀 금액은 동시에 설정할 수 없습니다',
  });

export type UpdateServiceCostInput = z.infer<typeof updateServiceCostSchema>;

export const syncOpenAIUsageSchema = z.object({
  api_key: z
    .string()
    .min(1)
    .regex(/^sk-/, 'OpenAI API Key는 sk-로 시작해야 합니다')
    .optional(),
});

export type SyncOpenAIUsageInput = z.infer<typeof syncOpenAIUsageSchema>;
