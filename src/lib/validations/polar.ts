import { z } from 'zod';

export const polarCheckoutRequestSchema = z.object({
  productId: z
    .string()
    .min(1, '상품 ID가 필요합니다'),
});

export type PolarCheckoutRequest = z.infer<typeof polarCheckoutRequestSchema>;

export const polarCancelRequestSchema = z.object({
  reason: z.string().max(500, '취소 사유는 500자 이내로 입력해주세요').optional(),
});

export type PolarCancelRequest = z.infer<typeof polarCancelRequestSchema>;

export const polarRefundRequestSchema = z.object({
  orderId: z.string().min(1, '주문 ID가 필요합니다'),
  reason: z.enum(['customer_request', 'satisfaction_guarantee', 'duplicate', 'fraudulent', 'other']).default('customer_request'),
  amount: z.number().positive('환불 금액은 0보다 커야 합니다').optional(),
});

export type PolarRefundRequest = z.infer<typeof polarRefundRequestSchema>;
