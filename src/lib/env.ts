import { getCloudflareContext } from '@opennextjs/cloudflare';

/**
 * process.env 우선, 없으면 Cloudflare Workers 런타임 env에서 읽음.
 * - 로컬 개발: .env.local → process.env
 * - Cloudflare Workers 배포: Dashboard Secrets/Vars → Worker env binding
 */
export function getRuntimeEnv(key: string): string | undefined {
  const v = process.env[key];
  if (v) return v;
  try {
    const { env } = getCloudflareContext();
    return (env as Record<string, string | undefined>)[key];
  } catch {
    return undefined;
  }
}
