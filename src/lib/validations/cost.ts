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

const openAIModelUsageSchema = z.object({
  modelId: z.string(),
  cost: z.number().min(0),
  inputTokens: z.number().int().min(0),
  outputTokens: z.number().int().min(0),
});

const clientUsageDataSchema = z.object({
  total_cost: z.number().min(0),
  period_start: z.string(),
  period_end: z.string(),
  by_model: z.array(openAIModelUsageSchema).default([]),
});

export const syncOpenAIUsageSchema = z.object({
  api_key: z
    .string()
    .min(10)
    .regex(/^sk/, 'OpenAI API Key는 sk로 시작해야 합니다')
    .optional(),
  // 클라이언트가 브라우저에서 직접 OpenAI를 호출한 결과
  // 서버 측 지역 제한 우회용
  usage_data: clientUsageDataSchema.optional(),
});

export type SyncOpenAIUsageInput = z.infer<typeof syncOpenAIUsageSchema>;
export type ClientUsageData = z.infer<typeof clientUsageDataSchema>;

export const ALLOWED_ATTACHMENT_MIME_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/heic',
  'text/csv',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
] as const;

export const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024; // 10MB

export const ATTACHMENT_TYPES = ['invoice', 'receipt', 'contract', 'screenshot', 'other'] as const;

export const createAttachmentMetaSchema = z.object({
  attachment_type: z.enum(ATTACHMENT_TYPES).default('other'),
  notes: z.string().max(500).nullable().optional(),
});
