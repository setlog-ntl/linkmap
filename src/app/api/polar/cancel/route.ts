import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, apiError, validationError } from '@/lib/api/errors';
import { requireMfa } from '@/lib/api/mfa-guard';
import { polarCancelRequestSchema } from '@/lib/validations/polar';
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
  const parsed = polarCancelRequestSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  // Step 4: 소유권 확인 — 현재 사용자의 구독 조회
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('polar_subscription_id, status, current_period_end')
    .eq('user_id', user.id)
    .single();

  if (!subscription?.polar_subscription_id) {
    return apiError('활성 구독을 찾을 수 없습니다', 404);
  }

  if (subscription.status === 'canceled') {
    return apiError('이미 취소된 구독입니다', 409);
  }

  // Step 5: 비즈니스 로직 — Polar SDK로 구독 취소 (기간 종료 시 취소)
  const { Polar } = await import('@polar-sh/sdk');
  const polar = new Polar({ accessToken });
  const subscriptionId = subscription.polar_subscription_id;

  try {
    // SubscriptionCancel: cancelAtPeriodEnd=true → 현재 빌링 기간 종료 시 취소
    await polar.subscriptions.update({
      id: subscriptionId,
      subscriptionUpdate: {
        cancelAtPeriodEnd: true,
        customerCancellationComment: parsed.data.reason ?? undefined,
      },
    });
  } catch (err: unknown) {
    // fallback: revoke (즉시 취소)
    try {
      await polar.subscriptions.revoke({ id: subscriptionId });
    } catch (revokeErr: unknown) {
      const message = revokeErr instanceof Error
        ? revokeErr.message
        : '구독 취소에 실패했습니다';
      return apiError(message, 502);
    }
  }

  // DB 업데이트: status + canceled_at (plan은 webhook에서 처리)
  const canceledAt = new Date().toISOString();
  await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      canceled_at: canceledAt,
      updated_at: canceledAt,
    })
    .eq('user_id', user.id);

  // Step 6: 감사 로그
  await logAudit(user.id, {
    action: 'payment.subscription_cancel_requested',
    resourceType: 'subscription',
    resourceId: subscriptionId,
    details: {
      reason: parsed.data.reason ?? null,
      provider: 'polar',
      periodEnd: subscription.current_period_end,
    },
    ipAddress: request.headers.get('x-forwarded-for') ?? undefined,
  });

  return NextResponse.json({
    success: true,
    canceledAt,
    periodEnd: subscription.current_period_end,
  });
}
