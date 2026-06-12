import { NextRequest } from 'next/server';
import { createHash } from 'crypto';
import { createAdminClient } from '@/lib/supabase/admin';

export interface TokenAuthResult {
  userId: string;
  scopes: string[];
  tokenId: string;
}

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/**
 * Bearer 토큰(stl_xxx)으로 API 인증을 수행한다.
 * MCP 서버 등 브라우저 세션이 없는 클라이언트를 위한 인증 방식.
 *
 * @returns 인증 성공 시 { userId, scopes, tokenId }, 실패 시 null
 */
export async function authenticateByApiToken(
  request: NextRequest
): Promise<TokenAuthResult | null> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer stl_')) return null;

  const rawToken = authHeader.slice(7); // "Bearer " 제거
  const tokenHash = hashToken(rawToken);

  const supabase = createAdminClient();

  // 토큰 해시로 조회
  const { data: token, error } = await supabase
    .from('api_tokens')
    .select('id, user_id, scopes, expires_at')
    .eq('token_hash', tokenHash)
    .single();

  if (error || !token) return null;

  // 만료 확인
  if (token.expires_at && new Date(token.expires_at) < new Date()) {
    return null;
  }

  // last_used_at 갱신 (비동기, 실패해도 무시)
  supabase
    .from('api_tokens')
    .update({ last_used_at: new Date().toISOString() })
    .eq('id', token.id)
    .then(() => {});

  return {
    userId: token.user_id,
    scopes: token.scopes ?? ['read', 'write'],
    tokenId: token.id,
  };
}

/**
 * 토큰이 요구하는 스코프를 포함하는지 확인한다.
 */
export function hasScope(auth: TokenAuthResult, requiredScope: string): boolean {
  return auth.scopes.includes(requiredScope);
}

/**
 * Request에서 Supabase 세션 또는 API 토큰 인증을 시도한다.
 * API 라우트에서 두 인증 방식을 모두 지원할 때 사용.
 */
export async function authenticateRequest(
  request: NextRequest
): Promise<{ type: 'session'; userId: string } | { type: 'token'; auth: TokenAuthResult } | null> {
  // 1차: API 토큰 확인
  const tokenAuth = await authenticateByApiToken(request);
  if (tokenAuth) {
    return { type: 'token', auth: tokenAuth };
  }

  // 2차: Supabase 세션은 호출하는 측에서 처리
  return null;
}
