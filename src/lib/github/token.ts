import { decrypt } from '@/lib/crypto';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Safely decrypt a GitHub access token.
 * On failure (e.g. after ENCRYPTION_KEY rotation), marks the account as 'expired'.
 */
export async function safeDecryptToken(
  encryptedToken: string,
  supabase: SupabaseClient,
  accountId: string
): Promise<{ token: string } | { error: string }> {
  try {
    const token = decrypt(encryptedToken);
    return { token };
  } catch {
    // Mark stale account so the user is prompted to reconnect
    await supabase
      .from('service_accounts')
      .update({ status: 'expired' })
      .eq('id', accountId);

    return {
      error:
        'GitHub 토큰이 유효하지 않습니다. 암호화 키가 변경되었습니다. GitHub를 다시 연결해주세요.',
    };
  }
}

/**
 * Resolve the user's active GitHub OAuth token.
 * Looks up the service_accounts table, decrypts the token, and returns it.
 * Returns null if no active GitHub account or decryption fails.
 */
export async function resolveUserGitHubToken(
  supabase: SupabaseClient,
  userId: string
): Promise<string | null> {
  const { data: githubService } = await supabase
    .from('services')
    .select('id')
    .eq('slug', 'github')
    .single();

  if (!githubService) return null;

  const { data: ghAccount } = await supabase
    .from('service_accounts')
    .select('id, encrypted_access_token')
    .eq('user_id', userId)
    .eq('service_id', githubService.id)
    .eq('connection_type', 'oauth')
    .eq('status', 'active')
    .order('project_id', { ascending: false, nullsFirst: false })
    .limit(1)
    .single();

  if (!ghAccount) return null;

  const result = await safeDecryptToken(ghAccount.encrypted_access_token, supabase, ghAccount.id);
  if ('error' in result) return null;

  return result.token;
}
