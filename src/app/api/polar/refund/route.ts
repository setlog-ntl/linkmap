import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { unauthorizedError, apiError, validationError } from '@/lib/api/errors';
import { polarRefundRequestSchema } from '@/lib/validations/polar';
import { logAudit } from '@/lib/audit';
import { getRuntimeEnv } from '@/lib/env';

const REFUND_WINDOW_DAYS = 7;

export async function POST(request: NextRequest) {
  // Step 1: 인증
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  // Step 2: 환경변수 확인
  const accessToken = getRuntimeEnv('POLAR_ACCESS_TOKEN');
  if (!accessToken) return apiError('결제 시스템이 설정되지 않았습니다', 503);

  // Step 3: 요청 검증
  const body = await request.json();
  const parsed = polarRefundRequestSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  // Step 4: 소유권 확인 — 현재 사용자의 구독 확인
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('polar_subscription_id, current_period_start')
    .eq('user_id', user.id)
    .single();

  if (!subscription?.polar_subscription_id) {
    return apiError('구독 정보를 찾을 수 없습니다', 404);
  }

  // Step 5: 환불 가능 여부 확인 — 최근 7일 이내 결제만 가능
  if (subscription.current_period_start) {
    const periodStart = new Date(subscription.current_period_start);
    const refundDeadline = new Date(
      periodStart.getTime() + REFUND_WINDOW_DAYS * 24 * 60 * 60 * 1000,
    );
    if (new Date() > refundDeadline) {
      return apiError(
        `환불은 결제일로부터 ${REFUND_WINDOW_DAYS}일 이내에만 가능합니다`,
        422,
      );
    }
  }

  // Step 6: 비즈니스 로직 — Polar SDK로 환불 요청
  const { Polar } = await import('@polar-sh/sdk');
  const polar = new Polar({ accessToken });

  // RefundCreate.amount는 필수 (cents 단위). amount 미지정 시 REST API fallback으로 전액 환불
  if (parsed.data.amount) {
    try {
      const refundResult = await polar.refunds.create({
        orderId: parsed.data.orderId,
        reason: parsed.data.reason,
        amount: parsed.data.amount,
      });

      // refund_history 기록 (감사 성격 — adminClient 사용)
      const adminClient = createAdminClient();
      await adminClient.from('refund_history').insert({
        user_id: user.id,
        polar_subscription_id: subscription.polar_subscription_id,
        polar_order_id: parsed.data.orderId,
        polar_refund_id: refundResult.id,
        amount: refundResult.amount,
        currency: refundResult.currency,
        reason: parsed.data.reason,
        status: 'pending',
      });

      // 감사 로그
      await logAudit(user.id, {
        action: 'payment.refund_requested',
        resourceType: 'refund',
        resourceId: refundResult.id,
        details: {
          orderId: parsed.data.orderId,
          amount: refundResult.amount,
          reason: parsed.data.reason,
          provider: 'polar',
        },
        ipAddress: request.headers.get('x-forwarded-for') ?? undefined,
      });

      return NextResponse.json({
        success: true,
        refundId: refundResult.id,
        status: 'pending',
      });
    } catch (sdkErr: unknown) {
      const message = sdkErr instanceof Error
        ? sdkErr.message
        : '환불 요청에 실패했습니다';
      return apiError(message, 502);
    }
  }

  // amount 미지정: REST API 직접 호출로 전액 환불
  try {
    const res = await fetch('https://api.polar.sh/v1/refunds/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order_id: parsed.data.orderId,
        reason: parsed.data.reason,
      }),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      return apiError(
        `환불 요청에 실패했습니다: ${errorBody}`,
        res.status >= 500 ? 502 : res.status,
      );
    }

    const refundResult = (await res.json()) as {
      id: string;
      amount?: number;
      currency?: string;
    };

    // refund_history 기록
    const adminClient = createAdminClient();
    await adminClient.from('refund_history').insert({
      user_id: user.id,
      polar_subscription_id: subscription.polar_subscription_id,
      polar_order_id: parsed.data.orderId,
      polar_refund_id: refundResult.id,
      amount: refundResult.amount ?? 0,
      currency: refundResult.currency ?? 'usd',
      reason: parsed.data.reason,
      status: 'pending',
    });

    // 감사 로그
    await logAudit(user.id, {
      action: 'payment.refund_requested',
      resourceType: 'refund',
      resourceId: refundResult.id,
      details: {
        orderId: parsed.data.orderId,
        amount: refundResult.amount,
        reason: parsed.data.reason,
        provider: 'polar',
        method: 'rest_api_full_refund',
      },
      ipAddress: request.headers.get('x-forwarded-for') ?? undefined,
    });

    return NextResponse.json({
      success: true,
      refundId: refundResult.id,
      status: 'pending',
    });
  } catch (fetchErr: unknown) {
    const message = fetchErr instanceof Error
      ? fetchErr.message
      : '환불 요청에 실패했습니다';
    return apiError(message, 502);
  }
}
