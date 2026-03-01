export function getResendApiKey(): string | null {
  const apiKey = process.env.RESEND_API_KEY ?? null;
  if (!apiKey) {
    console.warn('[email] RESEND_API_KEY not set — email sending disabled');
  }
  return apiKey;
}

export function getFromEmail(): string {
  return process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev';
}
