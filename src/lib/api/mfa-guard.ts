import { SupabaseClient } from '@supabase/supabase-js';
import { mfaRequiredError } from './errors';

/**
 * 민감 API에서 MFA 검증을 요구하는 가드.
 * - MFA 미등록 사용자 → null (통과, 선택적이므로)
 * - MFA 등록 + aal2 → null (통과)
 * - MFA 등록 + aal1 → 403 MFA_REQUIRED 응답
 */
export async function requireMfa(supabase: SupabaseClient) {
  const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

  if (error || !data) {
    return null;
  }

  const { currentLevel, nextLevel } = data;

  // nextLevel이 aal2이면 MFA factor가 등록된 상태
  // currentLevel이 aal1이면 아직 TOTP 검증을 안 한 상태
  if (nextLevel === 'aal2' && currentLevel === 'aal1') {
    return mfaRequiredError();
  }

  return null;
}
