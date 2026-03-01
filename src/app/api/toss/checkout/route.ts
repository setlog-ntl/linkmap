import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, apiError, validationError } from '@/lib/api/errors';

const tossCheckoutSchema = z.object({
  amount: z.number().int().positive(),
  orderName: z.string().min(1),
  orderId: z.string().min(1),
});

export async function POST(request: NextRequest) {
  // Step 1: 인증
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  // Step 2: 환경변수 확인
  const tossKey = process.env.TOSS_SECRET_KEY;
  if (!tossKey) return apiError('Toss Payments가 설정되지 않았습니다', 503);

  // Step 3: 입력 검증
  const body = await request.json();
  const parsed = tossCheckoutSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  // TODO: POST https://api.tosspayments.com/v1/payment-flow/billing-auth 호출 예정
  return NextResponse.json(
    { error: 'Toss Payments 연동이 준비 중입니다' },
    { status: 501 }
  );
}
