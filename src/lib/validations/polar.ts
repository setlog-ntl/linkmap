import { z } from 'zod';

export const polarCheckoutRequestSchema = z.object({
  productId: z
    .string()
    .min(1, '상품 ID가 필요합니다'),
});

export type PolarCheckoutRequest = z.infer<typeof polarCheckoutRequestSchema>;
