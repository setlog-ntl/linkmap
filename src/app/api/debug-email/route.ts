import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getResendApiKey, getFromEmail } from '@/lib/email/client';
import { sendEmail } from '@/lib/email/sender';

// 임시 디버그 엔드포인트 — 확인 후 삭제 예정
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization') ?? '';
  if (authHeader !== 'Bearer debug-linkmap-2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let cfEnvKeys: string[] = [];
  let cfResendKeyLen = 0;
  let cfFromEmail = '';
  try {
    const { env } = getCloudflareContext();
    const e = env as Record<string, unknown>;
    cfEnvKeys = Object.keys(e).slice(0, 30);
    cfResendKeyLen = ((e.RESEND_API_KEY as string) ?? '').length;
    cfFromEmail = (e.RESEND_FROM_EMAIL as string) ?? '';
  } catch (err) {
    cfEnvKeys = [`ERROR: ${String(err)}`];
  }

  const apiKey = getResendApiKey();
  const fromEmail = getFromEmail();
  const sent = await sendEmail({
    type: 'welcome',
    to: 'cdhrich2@gmail.com',
    userName: '디버그 테스터',
  });

  return NextResponse.json({
    procResendKeyLen: (process.env.RESEND_API_KEY ?? '').length,
    procFromEmail: process.env.RESEND_FROM_EMAIL ?? '',
    cfResendKeyLen,
    cfFromEmail,
    cfEnvKeys,
    resolvedApiKeyLen: (apiKey ?? '').length,
    resolvedFromEmail: fromEmail,
    sent,
  });
}
