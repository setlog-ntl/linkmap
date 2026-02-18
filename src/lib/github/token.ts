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
