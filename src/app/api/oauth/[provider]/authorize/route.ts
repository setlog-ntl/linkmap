import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, apiError } from '@/lib/api/errors';
import { randomBytes } from 'crypto';

const OAUTH_CONFIGS: Record<string, {
  authorization_url: string;
  client_id_env: string;
  scopes: string[];
}> = {
  github: {
    authorization_url: 'https://github.com/login/oauth/authorize',
    client_id_env: 'GITHUB_OAUTH_CLIENT_ID',
    scopes: ['repo', 'read:org', 'read:user', 'workflow'],
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const config = OAUTH_CONFIGS[provider];
  if (!config) return apiError('지원하지 않는 OAuth 프로바이더입니다', 400);

  const clientId = process.env[config.client_id_env];
  if (!clientId) return apiError('OAuth 설정이 완료되지 않았습니다. 관리자에게 문의하세요.', 503);

  const flowContext = request.nextUrl.searchParams.get('flow_context');
  const projectId = request.nextUrl.searchParams.get('project_id');
  const serviceSlug = request.nextUrl.searchParams.get('service_slug') || provider;

  const isUserLevel = flowContext === 'settings' || flowContext === 'oneclick';

  if (isUserLevel) {
    // Settings/oneclick flow: no project_id required, user-level connection
  } else {
    // Project flow: project_id + service_slug required
    if (!projectId || !serviceSlug) return apiError('project_id와 service_slug가 필요합니다', 400);

    // Verify project ownership
    const { data: project } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single();

    if (!project) return apiError('프로젝트를 찾을 수 없습니다', 404);
  }

  // Generate CSRF state token
  const stateToken = randomBytes(32).toString('hex');

  const redirectUrl = flowContext === 'settings'
    ? '/settings/connections'
    : flowContext === 'oneclick'
      ? '/oneclick'
      : `/project/${projectId}/service-map`;

  // Store state in DB — RLS policy: user_id = auth.uid()
  const { error } = await supabase.from('oauth_states').insert({
    user_id: user.id,
    project_id: projectId || null,
    service_slug: serviceSlug,
    state_token: stateToken,
    redirect_url: redirectUrl,
    flow_context: flowContext || 'project',
  });

  if (error) {
    console.error('oauth_states insert error:', error);
    return apiError('OAuth 상태 저장에 실패했습니다', 500);
  }

  // Build authorization URL
  const appOrigin = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
  const authUrl = new URL(config.authorization_url);
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', `${appOrigin}/api/oauth/${provider}/callback`);
  authUrl.searchParams.set('scope', config.scopes.join(' '));
  authUrl.searchParams.set('state', stateToken);

  return NextResponse.redirect(authUrl.toString());
}
