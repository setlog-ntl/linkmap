/**
 * Resolves AI provider API keys from env or DB ai_providers table.
 */
import { createAdminClient } from '@/lib/supabase/admin';
import { decrypt } from '@/lib/crypto';
import type { AiProviderSlug } from '@/types';

/** Thrown when an AI provider API key is not configured. */
export class AIKeyNotConfiguredError extends Error {
  public readonly provider: string;
  constructor(provider: string) {
    super(`${provider} API 키가 설정되지 않았습니다. 환경변수 또는 AI 설정에서 등록하세요.`);
    this.name = 'AIKeyNotConfiguredError';
    this.provider = provider;
  }
}

const ENV_KEY_MAP: Record<string, string> = {
  openai: 'OPENAI_API_KEY',
  anthropic: 'ANTHROPIC_API_KEY',
  google: 'GOOGLE_AI_API_KEY',
};

/**
 * Resolve an AI provider's API key. Checks environment variable first, then DB.
 */
export async function resolveAIProviderKey(
  providerSlug: AiProviderSlug
): Promise<{ apiKey: string; baseUrl?: string }> {
  // 1. Check environment variable
  const envKey = ENV_KEY_MAP[providerSlug];
  if (envKey && process.env[envKey]) {
    return { apiKey: process.env[envKey]! };
  }

  // 2. Check DB ai_providers table
  const adminSupabase = createAdminClient();
  const { data: providerRow } = await adminSupabase
    .from('ai_providers')
    .select('*')
    .eq('slug', providerSlug)
    .eq('is_enabled', true)
    .single();

  if (providerRow?.encrypted_api_key) {
    return {
      apiKey: decrypt(providerRow.encrypted_api_key),
      baseUrl: providerRow.base_url || undefined,
    };
  }

  throw new AIKeyNotConfiguredError(providerSlug);
}

/** Backward-compatible wrapper for OpenAI key resolution. */
export async function resolveOpenAIKey(): Promise<{ apiKey: string; baseUrl?: string }> {
  return resolveAIProviderKey('openai');
}
