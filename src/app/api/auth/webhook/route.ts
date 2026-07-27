import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { getRuntimeEnv } from '@/lib/env';
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

// Supabase Database Webhooks에는 자동 서명이 없으므로
// 커스텀 Authorization 헤더에 설정한 시크릿 값을 직접 비교
function verifySecret(received: string, expected: string): boolean {
  const a = Buffer.from(received, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function POST(request: NextRequest) {
  const webhookSecret = getRuntimeEnv('SUPABASE_WEBHOOK_SECRET');

  const body = await request.text();

  // Fail-closed: 시크릿 미설정 시 검증 없이 처리하면 임의 welcome 메일 발송·감사로그
  // 위조가 가능하므로(2026-07-16 레드팀 F-10) 거부한다. 설정 상태에서만 검증 통과.
  if (!webhookSecret) {
    console.error('[auth/webhook] SUPABASE_WEBHOOK_SECRET not set — rejecting request');
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 });
  }
  const authHeader = request.headers.get('authorization') ?? '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  if (!verifySecret(token, webhookSecret)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
