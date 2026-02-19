/**
 * Resolves OpenAI API key from env or DB ai_providers table.
 */
import { createAdminClient } from '@/lib/supabase/admin';
import { decrypt } from '@/lib/crypto';

export async function resolveOpenAIKey(): Promise<{ apiKey: string; baseUrl?: string }> {
  // 1. Check environment variable
  if (process.env.OPENAI_API_KEY) {
    return { apiKey: process.env.OPENAI_API_KEY };
  }

  // 2. Check DB ai_providers table
  const adminSupabase = createAdminClient();
  const { data: providerRow } = await adminSupabase
    .from('ai_providers')
    .select('*')
    .eq('slug', 'openai')
    .eq('is_enabled', true)
    .single();

  if (providerRow?.encrypted_api_key) {
    return {
      apiKey: decrypt(providerRow.encrypted_api_key),
      baseUrl: providerRow.base_url || undefined,
    };
  }

  throw new Error('OpenAI API 키가 설정되지 않았습니다. 환경변수 또는 AI 설정에서 등록하세요.');
}
