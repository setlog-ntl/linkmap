import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, apiError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';

export async function POST(request: NextRequest) {
  // Step 1: 인증
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  // Step 2: 환경변수 확인
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) return apiError('결제 시스템이 설정되지 않았습니다', 503);

  // Step 3: stripe_customer_id 조회
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .single();

  if (!subscription?.stripe_customer_id) {
    return apiError('구독 정보를 찾을 수 없습니다', 404);
  }

  // Step 4: Stripe Customer Portal 세션 생성
  const origin = request.headers.get('origin') || 'https://www.linkmap.biz';
  const portalRes = await fetch('https://api.stripe.com/v1/billing_portal/sessions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${stripeKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      customer: subscription.stripe_customer_id,
      return_url: `${origin}/settings/billing`,
    }),
  });

  const portalSession = await portalRes.json();
  if (!portalSession.url) {
    return apiError('Customer Portal 세션 생성에 실패했습니다', 502);
  }

  // Step 5: 감사 로그
  await logAudit(user.id, {
    action: 'payment.portal_access',
    resourceType: 'subscription',
    details: { stripe_customer_id: subscription.stripe_customer_id },
  });

  return NextResponse.json({ url: portalSession.url });
}
