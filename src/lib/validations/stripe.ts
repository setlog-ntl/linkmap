import { z } from 'zod';

export const checkoutRequestSchema = z.object({
  priceId: z
    .string()
    .min(1, '가격 ID가 필요합니다')
    .startsWith('price_', '유효한 Stripe 가격 ID 형식이 아닙니다'),
});

export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;
