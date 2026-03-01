import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { timingSafeEqual, createHmac } from 'crypto';
import { logAudit } from '@/lib/audit';
import { sendEmail } from '@/lib/email/sender';

function verifyStripeSignature(
  payload: string,
  signatureHeader: string,
  secret: string,
  tolerance = 300 // 5 minutes
): { verified: boolean; event?: unknown; error?: string } {
  const parts = signatureHeader.split(',').reduce<Record<string, string>>((acc, part) => {
    const [key, value] = part.split('=');
    if (key && value) acc[key.trim()] = value.trim();
    return acc;
  }, {});

  const timestamp = parts['t'];
  const expectedSig = parts['v1'];

  if (!timestamp || !expectedSig) {
    return { verified: false, error: 'Invalid signature header format' };
  }

  // Check timestamp tolerance to prevent replay attacks
  const timestampAge = Math.floor(Date.now() / 1000) - parseInt(timestamp, 10);
  if (isNaN(timestampAge) || timestampAge > tolerance) {
    return { verified: false, error: 'Webhook timestamp too old' };
  }

  // Compute expected signature: HMAC-SHA256 of "timestamp.payload"
  const signedPayload = `${timestamp}.${payload}`;
  const computedSig = createHmac('sha256', secret).update(signedPayload, 'utf8').digest('hex');

  // Timing-safe comparison
  const a = Buffer.from(expectedSig, 'utf8');
  const b = Buffer.from(computedSig, 'utf8');
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { verified: false, error: 'Signature verification failed' };
  }

  try {
    const event = JSON.parse(payload);
    return { verified: true, event };
  } catch {
    return { verified: false, error: 'Invalid JSON payload' };
  }
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  // Verify webhook signature using Stripe's signing scheme (HMAC-SHA256)
  const { verified, event, error: verifyError } = verifyStripeSignature(body, signature, webhookSecret);
  if (!verified || !event) {
    console.error('Stripe webhook signature verification failed:', verifyError);
    return NextResponse.json({ error: verifyError || 'Signature verification failed' }, { status: 400 });
  }

  const { type, data } = event as { type: string; data: { object: Record<string, unknown> } };

  const supabase = await createClient();

  switch (type) {
    case 'checkout.session.completed': {
      const session = data.object;
      const customerId = session.customer;
      const subscriptionId = session.subscription;

      const [, { data: sub }] = await Promise.all([
        supabase
          .from('subscriptions')
          .update({
            stripe_subscription_id: subscriptionId,
            plan: 'pro',
            status: 'active',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', customerId),
        supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', customerId as string)
          .single(),
      ]);

      if (sub?.user_id) {
        // Send upgrade email
        const adminClient = createAdminClient();
        const { data: profile } = await adminClient
          .from('profiles')
          .select('email')
          .eq('id', sub.user_id)
          .single();

        if (profile?.email) {
          const sent = await sendEmail({
            type: 'subscription_change',
            to: profile.email,
            changeType: 'upgraded',
            plan: 'Pro',
          });
          await logAudit(sub.user_id, {
            action: sent ? 'email.subscription_change' : 'email.send_failed',
            resourceType: 'subscription',
            details: { changeType: 'upgraded', plan: 'pro', sent },
          });
        }

        await logAudit(sub.user_id, {
          action: 'payment.checkout_complete',
          resourceType: 'subscription',
          details: {
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            plan: 'pro',
          },
        });
      }
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = data.object as {
        id: string;
        status: string;
        current_period_start: number;
        current_period_end: number;
      };
      const status = subscription.status === 'active' ? 'active' : 'past_due';

      const [, { data: subUpdated }] = await Promise.all([
        supabase
          .from('subscriptions')
          .update({
            status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id),
        supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', subscription.id)
          .single(),
      ]);

      if (subUpdated?.user_id) {
        // Send subscription update email
        const adminClient = createAdminClient();
        const { data: profile } = await adminClient
          .from('profiles')
          .select('email')
          .eq('id', subUpdated.user_id)
          .single();

        if (profile?.email) {
          const sent = await sendEmail({
            type: 'subscription_change',
            to: profile.email,
            changeType: 'updated',
            status,
          });
          await logAudit(subUpdated.user_id, {
            action: sent ? 'email.subscription_change' : 'email.send_failed',
            resourceType: 'subscription',
            details: { changeType: 'updated', status, sent },
          });
        }

        await logAudit(subUpdated.user_id, {
          action: 'payment.subscription_updated',
          resourceType: 'subscription',
          details: {
            stripe_subscription_id: subscription.id,
            status,
          },
        });
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = data.object as { id: string };

      const { data: subDeleted } = await supabase
        .from('subscriptions')
        .select('user_id')
        .eq('stripe_subscription_id', subscription.id)
        .single();

      await supabase
        .from('subscriptions')
        .update({
          plan: 'free',
          status: 'canceled',
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_subscription_id', subscription.id);

      if (subDeleted?.user_id) {
        // Send cancellation email
        const adminClient = createAdminClient();
        const { data: profile } = await adminClient
          .from('profiles')
          .select('email')
          .eq('id', subDeleted.user_id)
          .single();

        if (profile?.email) {
          const sent = await sendEmail({
            type: 'subscription_change',
            to: profile.email,
            changeType: 'canceled',
          });
          await logAudit(subDeleted.user_id, {
            action: sent ? 'email.subscription_change' : 'email.send_failed',
            resourceType: 'subscription',
            details: { changeType: 'canceled', sent },
          });
        }

        await logAudit(subDeleted.user_id, {
          action: 'payment.subscription_canceled',
          resourceType: 'subscription',
          details: { stripe_subscription_id: subscription.id },
        });
      }
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = data.object as {
        customer: string;
        attempt_count: number;
        amount_due: number;
      };

      const { data: subFailed } = await supabase
        .from('subscriptions')
        .select('user_id')
        .eq('stripe_customer_id', invoice.customer as string)
        .single();

      if (subFailed?.user_id) {
        await supabase
          .from('subscriptions')
          .update({ status: 'past_due', updated_at: new Date().toISOString() })
          .eq('stripe_customer_id', invoice.customer as string);

        const adminClient = createAdminClient();
        const { data: profile } = await adminClient
          .from('profiles')
          .select('email')
          .eq('id', subFailed.user_id)
          .single();

        if (profile?.email) {
          const sent = await sendEmail({
            type: 'subscription_change',
            to: profile.email,
            changeType: 'updated',
            status: 'past_due',
          });
          await logAudit(subFailed.user_id, {
            action: sent ? 'email.subscription_change' : 'email.send_failed',
            resourceType: 'subscription',
            details: { changeType: 'payment_failed', sent },
          });
        }

        await logAudit(subFailed.user_id, {
          action: 'payment.invoice_failed',
          resourceType: 'subscription',
          details: {
            stripe_customer_id: invoice.customer,
            attempt_count: invoice.attempt_count,
            amount_due: invoice.amount_due,
          },
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
