import { NextRequest, NextResponse } from 'next/server';
import { Polar } from '@polar-sh/sdk';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, apiError, validationError } from '@/lib/api/errors';
import { polarCheckoutRequestSchema } from '@/lib/validations/polar';
import { logAudit } from '@/lib/audit';

export async function POST(request: NextRequest) {
  // Step 1: 인증
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  // Step 2: 환경변수 확인
  const accessToken = process.env.POLAR_ACCESS_TOKEN;
  if (!accessToken) return apiError('결제 시스템이 설정되지 않았습니다', 503);

  // Step 3: 요청 검증
  const body = await request.json();
  const parsed = polarCheckoutRequestSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);
  const { productId } = parsed.data;

  // Step 4: Polar checkout 세션 생성
  const polar = new Polar({ accessToken });
  const origin = request.headers.get('origin') || 'https://www.linkmap.biz';
  const successUrl = process.env.POLAR_SUCCESS_URL || `${origin}/dashboard?upgraded=true`;

  const checkout = await polar.checkouts.create({
    products: [productId],
    successUrl,
    customerEmail: user.email ?? undefined,
    externalCustomerId: user.id,
    metadata: {
      user_id: user.id,
    },
  });

  // Step 5: 감사 로그
  await logAudit(user.id, {
    action: 'payment.checkout_initiated',
    resourceType: 'subscription',
    details: {
      productId,
      provider: 'polar',
      checkoutId: checkout.id,
    },
    ipAddress: request.headers.get('x-forwarded-for') ?? undefined,
  });

  return NextResponse.json({ url: checkout.url });
}
