import { getRuntimeEnv } from '@/lib/env';

export function getResendApiKey(): string | null {
  const apiKey = getRuntimeEnv('RESEND_API_KEY') ?? null;
  if (!apiKey) {
    console.warn('[email] RESEND_API_KEY not set — email sending disabled');
  }
  return apiKey;
}

export function getFromEmail(): string {
  const email = getRuntimeEnv('RESEND_FROM_EMAIL') ?? 'noreply@linkmap.biz';
  const name = getRuntimeEnv('RESEND_FROM_NAME') ?? 'Linkmap';
  return `${name} <${email}>`;
}