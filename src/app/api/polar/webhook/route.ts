import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { logAudit } from '@/lib/audit';
import { sendEmail } from '@/lib/email/sender';
import { getRuntimeEnv } from '@/lib/env';

/** metadata 또는 externalId에서 user_id 추출 */
function resolveUserId(
  customer?: { externalId?: string | null },
  metadata?: Record<string, string | number | boolean> | null,
): string | null {
  if (customer?.externalId) return customer.externalId;
  if (metadata?.user_id) return String(metadata.user_id);
  return null;
}

type WebhookHandler = (req: NextRequest) => Promise<Response>;
let _handler: WebhookHandler | null = null;

async function getHandler(): Promise<WebhookHandler> {
  if (_handler) return _handler;
  const { Webhooks } = await import('@polar-sh/nextjs');
  _handler = Webhooks({
    webhookSecret: getRuntimeEnv('POLAR_WEBHOOK_SECRET') ?? '',

    onSubscriptionActive: async (payload) => {
      const sub = payload.data;
      const userId = resolveUserId(sub.customer, sub.metadata);
      if (!userId) return;

      const adminClient = createAdminClient();

      // 구독 레코드 upsert (plan → pro 활성화, trial 포함)
      const subStatus = sub.status === 'trialing' ? 'trialing' : 'active';
      await adminClient
        .from('subscriptions')
        .upsert({
          user_id: userId,
          polar_customer_id: sub.customerId,
          polar_subscription_id: sub.id,
          plan: 'pro',
          status: subStatus,
          payment_provider: 'polar',
          current_period_start: sub.currentPeriodStart.toISOString(),
          current_period_end: sub.currentPeriodEnd.toISOString(),
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      // 업그레이드 이메일 발송
      const { data: profile } = await adminClient
        .from('profiles')
        .select('email')
        .eq('id', userId)
        .single();

      if (profile?.email) {
        const sent = await sendEmail({
          type: 'subscription_change',
          to: profile.email,
          changeType: 'upgraded',
          plan: 'Pro',
        });
        await logAudit(userId, {
          action: sent ? 'email.subscription_change' : 'email.send_failed',
          resourceType: 'subscription',
          details: { changeType: 'upgraded', plan: 'pro', sent },
        });
      }

      await logAudit(userId, {
        action: 'payment.checkout_complete',
        resourceType: 'subscription',
        details: {
          polar_customer_id: sub.customerId,
          polar_subscription_id: sub.id,
          plan: 'pro',
          provider: 'polar',
        },
      });
    },

    onSubscriptionUpdated: async (payload) => {
      const sub = payload.data;
      const userId = resolveUserId(sub.customer, sub.metadata);
      if (!userId) return;

      const adminClient = createAdminClient();
      const statusMap: Record<string, string> = { active: 'active', trialing: 'trialing', past_due: 'past_due' };
      const status = statusMap[sub.status] ?? 'past_due';

      await adminClient
        .from('subscriptions')
        .update({
          status,
          current_period_start: sub.currentPeriodStart.toISOString(),
          current_period_end: sub.currentPeriodEnd.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('polar_subscription_id', sub.id);

      // 구독 변경 이메일
      const { data: profile } = await adminClient
        .from('profiles')
        .select('email')
        .eq('id', userId)
        .single();

      if (profile?.email) {
        const sent = await sendEmail({
          type: 'subscription_change',
          to: profile.email,
          changeType: 'updated',
          status,
        });
        await logAudit(userId, {
          action: sent ? 'email.subscription_change' : 'email.send_failed',
          resourceType: 'subscription',
          details: { changeType: 'updated', status, sent },
        });
      }

      await logAudit(userId, {
        action: 'payment.subscription_updated',
        resourceType: 'subscription',
        details: {
          polar_subscription_id: sub.id,
          status,
          provider: 'polar',
        },
      });
    },

    onSubscriptionCanceled: async (payload) => {
      const sub = payload.data;
      const userId = resolveUserId(sub.customer, sub.metadata);
      if (!userId) return;

      const adminClient = createAdminClient();

      await adminClient
        .from('subscriptions')
        .update({
          plan: 'free',
          status: 'canceled',
          updated_at: new Date().toISOString(),
        })
        .eq('polar_subscription_id', sub.id);

      // 구독 취소 이메일
      const { data: profile } = await adminClient
        .from('profiles')
        .select('email')
        .eq('id', userId)
        .single();

      if (profile?.email) {
        const sent = await sendEmail({
          type: 'subscription_change',
          to: profile.email,
          changeType: 'canceled',
        });
        await logAudit(userId, {
          action: sent ? 'email.subscription_change' : 'email.send_failed',
          resourceType: 'subscription',
          details: { changeType: 'canceled', sent },
        });
      }

      await logAudit(userId, {
        action: 'payment.subscription_canceled',
        resourceType: 'subscription',
        details: {
          polar_subscription_id: sub.id,
          provider: 'polar',
        },
      });
    },

    onSubscriptionRevoked: async (payload) => {
      const sub = payload.data;
      const userId = resolveUserId(sub.customer, sub.metadata);
      if (!userId) return;

      const adminClient = createAdminClient();

      await adminClient
        .from('subscriptions')
        .update({
          plan: 'free',
          status: 'canceled',
          updated_at: new Date().toISOString(),
        })
        .eq('polar_subscription_id', sub.id);

      await logAudit(userId, {
        action: 'payment.subscription_canceled',
        resourceType: 'subscription',
        details: {
          polar_subscription_id: sub.id,
          provider: 'polar',
          reason: 'revoked',
        },
      });
    },

    onOrderCreated: async (payload) => {
      const order = payload.data;
      const userId = resolveUserId(order.customer, order.metadata);
      if (!userId) return;

      await logAudit(userId, {
        action: 'payment.order_created',
        resourceType: 'subscription',
        details: {
          orderId: order.id,
          totalAmount: order.totalAmount,
          currency: order.currency,
          provider: 'polar',
        },
      });
    },

    onOrderRefunded: async (payload) => {
      const order = payload.data;
      const userId = resolveUserId(order.customer, order.metadata);
      if (!userId) return;

      const adminClient = createAdminClient();

      // refund_history 상태 업데이트
      await adminClient
        .from('refund_history')
        .update({
          status: 'succeeded',
          processed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('polar_order_id', order.id)
        .eq('user_id', userId);

      // 환불 이메일 발송
      const { data: profile } = await adminClient
        .from('profiles')
        .select('email')
        .eq('id', userId)
        .single();

      if (profile?.email) {
        const sent = await sendEmail({
          type: 'subscription_change',
          to: profile.email,
          changeType: 'refunded',
        });
        await logAudit(userId, {
          action: sent ? 'email.subscription_change' : 'email.send_failed',
          resourceType: 'refund',
          details: { changeType: 'refunded', sent },
        });
      }

      await logAudit(userId, {
        action: 'payment.refund_completed',
        resourceType: 'refund',
        details: {
          orderId: order.id,
          provider: 'polar',
        },
      });
    },
  });
  return _handler;
}

export async function POST(req: NextRequest) {
  const handler = await getHandler();
  return handler(req);
}
