import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, apiError } from '@/lib/api/errors';
import { randomBytes } from 'crypto';

const GITHUB_SCOPES = ['repo', 'read:org', 'read:user', 'workflow'];

/**
 * GET /api/oneclick/oauth/authorize
 * 원클릭 배포 전용 GitHub OAuth 시작점.
 * project_id/service_slug 없이 user-level 계정 생성.
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  if (!clientId) return apiError('OAuth 설정이 완료되지 않았습니다. 관리자에게 문의하세요.', 503);

  // Generate CSRF state token
  const stateToken = randomBytes(32).toString('hex');

  // Store state in DB (project_id: null, flow_context: 'oneclick')
  // RLS policy: user_id = auth.uid() — 유저 본인 insert 허용
  const { error } = await supabase.from('oauth_states').insert({
    user_id: user.id,
    project_id: null,
    service_slug: 'github',
    state_token: stateToken,
    redirect_url: '/oneclick',
    flow_context: 'oneclick',
  });

  if (error) return apiError('OAuth 상태 저장에 실패했습니다', 500);

  // Build authorization URL
  const appOrigin = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
  const redirectUri = `${appOrigin}/api/oauth/github/callback`;

  // TODO: 디버그 완료 후 제거 — redirect 대신 JSON 반환
  return NextResponse.json({
    debug: true,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? '(undefined)',
    requestOrigin: request.nextUrl.origin,
    appOrigin,
    redirectUri,
    clientId,
    authUrl: `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`,
  });
}
