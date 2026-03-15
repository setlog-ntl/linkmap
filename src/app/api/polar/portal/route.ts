import { NextRequest, NextResponse } from 'next/server';
import { Polar } from '@polar-sh/sdk';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, apiError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import { getRuntimeEnv } from '@/lib/env';

export async function POST(request: NextRequest) {
  // Step 1: 인증
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  // Step 2: 환경변수 확인
  const accessToken = getRuntimeEnv('POLAR_ACCESS_TOKEN');
  if (!accessToken) return apiError('결제 시스템이 설정되지 않았습니다', 503);

  // Step 3: polar_customer_id 조회
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('polar_customer_id')
    .eq('user_id', user.id)
    .single();

  if (!subscription?.polar_customer_id) {
    return apiError('구독 정보를 찾을 수 없습니다', 404);
  }

  // Step 4: Polar Customer Portal 세션 생성
  const polar = new Polar({ accessToken });
  const origin = request.headers.get('origin') || 'https://www.linkmap.biz';

  let portal;
  try {
    portal = await polar.customerSessions.create({
      customerId: subscription.polar_customer_id,
      returnUrl: `${origin}/settings/billing`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '결제 관리 세션 생성에 실패했습니다';
    return apiError(message, 502);
  }

  if (!portal?.customerPortalUrl) {
    return apiError('결제 관리 URL을 받지 못했습니다', 502);
  }

  // Step 5: 감사 로그
  await logAudit(user.id, {
    action: 'payment.portal_access',
    resourceType: 'subscription',
    details: {
      polar_customer_id: subscription.polar_customer_id,
      provider: 'polar',
    },
  });

  return NextResponse.json({ url: portal.customerPortalUrl });
}
