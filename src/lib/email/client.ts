import { getCloudflareContext } from '@opennextjs/cloudflare';

/**
 * process.env 우선, 없으면 Cloudflare Workers 런타임 env에서 읽음.
 * - 로컬 개발: .env.local → process.env
 * - Cloudflare Workers 배포: Dashboard Secrets/Vars → Worker env binding
 */
function getRuntimeEnv(key: string): string | undefined {
  const v = process.env[key];
  if (v) return v;
  try {
    const { env } = getCloudflareContext();
    return (env as Record<string, string | undefined>)[key];
  } catch {
    return undefined;
  }
}

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