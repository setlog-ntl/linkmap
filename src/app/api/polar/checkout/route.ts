import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, apiError, validationError } from '@/lib/api/errors';
import { requireMfa } from '@/lib/api/mfa-guard';
import { polarCheckoutRequestSchema } from '@/lib/validations/polar';
import { logAudit } from '@/lib/audit';
import { getRuntimeEnv } from '@/lib/env';

export async function POST(request: NextRequest) {
  // Step 1: 인증
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const mfaResponse = await requireMfa(supabase);
  if (mfaResponse) return mfaResponse;

  // Step 2: 환경변수 확인
  const accessToken = getRuntimeEnv('POLAR_ACCESS_TOKEN');
  if (!accessToken) return apiError('결제 시스템이 설정되지 않았습니다', 503);

  // Step 3: 요청 검증
  const body = await request.json();
  const parsed = polarCheckoutRequestSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);
  const { productId } = parsed.data;

  // Step 4: Polar checkout 세션 생성
  const { Polar } = await import('@polar-sh/sdk');
  const polar = new Polar({ accessToken });
  const origin = request.headers.get('origin') || 'https://www.linkmap.biz';
  const successUrl = process.env.POLAR_SUCCESS_URL || `${origin}/dashboard?upgraded=true`;

  let checkout;
  try {
    checkout = await polar.checkouts.create({
      products: [productId],
      successUrl,
      customerEmail: user.email ?? undefined,
      externalCustomerId: user.id,
      allowTrial: true,
      metadata: {
        user_id: user.id,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '결제 세션 생성에 실패했습니다';
    return apiError(message, 502);
  }

  if (!checkout?.url) {
    return apiError('결제 URL을 받지 못했습니다', 502);
  }

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
