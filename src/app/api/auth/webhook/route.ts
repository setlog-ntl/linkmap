import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual, createHmac } from 'crypto';
import { logAudit } from '@/lib/audit';
import { sendEmail } from '@/lib/email/sender';

interface SupabaseAuthHookPayload {
  type: string;
  table: string;
  record?: {
    id?: string;
    email?: string;
    raw_user_meta_data?: { full_name?: string; name?: string };
  };
}

function isAuthHookPayload(value: unknown): value is SupabaseAuthHookPayload {
  return (
    typeof value === 'object' &&
    value !== null &&
    'type' in value &&
    'table' in value &&
    typeof (value as Record<string, unknown>).type === 'string' &&
    typeof (value as Record<string, unknown>).table === 'string'
  );
}

function verifyWebhookSignature(
  payload: string,
  signatureHeader: string,
  secret: string
): boolean {
  // Format: t=<timestamp>,v1=<signature>
  const parts = signatureHeader.split(',').reduce<Record<string, string>>((acc, part) => {
    const eqIdx = part.indexOf('=');
    if (eqIdx !== -1) {
      const k = part.slice(0, eqIdx).trim();
      const v = part.slice(eqIdx + 1).trim();
      acc[k] = v;
    }
    return acc;
  }, {});

  const timestamp = parts['t'];
  const receivedSig = parts['v1'];

  if (!timestamp || !receivedSig) return false;

  const signedPayload = `${timestamp}.${payload}`;
  const computedSig = createHmac('sha256', secret).update(signedPayload, 'utf8').digest('hex');

  const a = Buffer.from(receivedSig, 'utf8');
  const b = Buffer.from(computedSig, 'utf8');

  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.SUPABASE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.warn('[auth/webhook] SUPABASE_WEBHOOK_SECRET not set — skipping verification');
    return NextResponse.json({ received: true });
  }

  const body = await request.text();
  const signature = request.headers.get('x-supabase-signature') ?? request.headers.get('webhook-signature') ?? '';

  if (!verifyWebhookSignature(body, signature, webhookSecret)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!isAuthHookPayload(parsed)) {
    return NextResponse.json({ received: true });
  }

  // Only handle new user signups
  if (parsed.type !== 'INSERT' || parsed.table !== 'users') {
    return NextResponse.json({ received: true });
  }

  const record = parsed.record;
  if (!record?.id || !record?.email) {
    return NextResponse.json({ received: true });
  }

  const userName =
    record.raw_user_meta_data?.full_name ??
    record.raw_user_meta_data?.name ??
    undefined;

  const sent = await sendEmail({
    type: 'welcome',
    to: record.email,
    userName,
  });

  await logAudit(record.id, {
    action: sent ? 'email.welcome' : 'email.send_failed',
    resourceType: 'user',
    resourceId: record.id,
    details: { email: record.email, sent },
  });

  return NextResponse.json({ received: true });
}
