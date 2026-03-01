import { Resend } from 'resend';

let _client: Resend | null = null;

export function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[email] RESEND_API_KEY not set — email sending disabled');
    return null;
  }
  if (!_client) {
    _client = new Resend(apiKey);
  }
  return _client;
}

export function getFromEmail(): string {
  return process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev';
}
