import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { apiError } from '@/lib/api/errors';
import { encrypt } from '@/lib/crypto';
import { logAudit } from '@/lib/audit';
import { safeInternalPath } from '@/lib/utils/safe-redirect';

const OAUTH_TOKEN_CONFIGS: Record<string, {
  token_url: string;
  client_id_env: string;
  client_secret_env: string;
  user_info_url: string;
}> = {
  github: {
    token_url: 'https://github.com/login/oauth/access_token',
    client_id_env: 'GITHUB_OAUTH_CLIENT_ID',
    client_secret_env: 'GITHUB_OAUTH_CLIENT_SECRET',
    user_info_url: 'https://api.github.com/user',
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;

  const config = OAUTH_TOKEN_CONFIGS[provider];
  if (!config) return apiError('지원하지 않는 OAuth 프로바이더입니다', 400);

  const code = request.nextUrl.searchParams.get('code');
  const state = request.nextUrl.searchParams.get('state');
  if (!code || !state) return apiError('code와 state가 필요합니다', 400);

  // state_token으로 발급 컨텍스트를 조회하고, 아래에서 콜백 세션 사용자와 대조한다
  const adminClient = createAdminClient();
  const { data: oauthState, error: stateError } = await adminClient
    .from('oauth_states')
    .select('*')
    .eq('state_token', state)
    .single();

  if (stateError || !oauthState) {
    console.error('OAuth state lookup failed:', stateError?.message ?? 'no data');
    return NextResponse.redirect(
      new URL('/dashboard?error=oauth_state_invalid', request.nextUrl.origin)
    );
  }

  const userId = oauthState.user_id;
  // state 행은 사용자가 직접 INSERT할 수 있으므로 redirect_url도 신뢰하지 않는다 (Open Redirect 방어)
  const stateRedirect = safeInternalPath(oauthState.redirect_url, '/dashboard');

  // Check expiry
  if (new Date(oauthState.expires_at) < new Date()) {
    await adminClient.from('oauth_states').delete().eq('id', oauthState.id);
    return NextResponse.redirect(new URL('/dashboard?error=state_expired', request.nextUrl.origin));
  }

  // P0 (2026-07-12 감사): state_token 단독 식별 금지 — 콜백 세션 사용자를 state 발급자와 대조.
  // 공격자가 자신의 state로 피해자의 GitHub 인가를 유도하면 피해자 토큰이 공격자 계정에
  // 바인딩되므로, 세션이 없거나 발급자와 다르면 토큰 교환 전에 state를 소각하고 거부한다.
  // (OAuth redirect는 same-browser top-level GET이라 Lax 세션 쿠키가 유지됨 — 세션 부재는 비정상 경로)
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  // 인증 서비스 장애는 공격 시도와 구분한다 — state를 소각하지 않아 재시도를 허용
  if (authError && !user) {
    console.error('OAuth callback auth check failed:', authError.message);
    await logAudit(userId, {
      action: 'service_account.oauth_callback_rejected',
      resourceType: 'service_account',
      details: { provider, reason: 'auth_check_failed', state_id: oauthState.id },
    });
    return NextResponse.redirect(
      new URL('/dashboard?error=oauth_auth_unavailable', request.nextUrl.origin)
    );
  }

  if (!user || user.id !== userId) {
    await adminClient.from('oauth_states').delete().eq('id', oauthState.id);
    await logAudit(userId, {
      action: 'service_account.oauth_callback_rejected',
      resourceType: 'service_account',
      // 유인당한 세션 주체를 남겨야 사고 시 피해 범위를 산정할 수 있다 (식별자만, 토큰 아님)
      details: {
        provider,
        reason: user ? 'session_user_mismatch' : 'no_session',
        session_user_id: user?.id ?? null,
        state_id: oauthState.id,
      },
    });
    return NextResponse.redirect(
      new URL('/dashboard?error=oauth_session_mismatch', request.nextUrl.origin)
    );
  }

  // oauth_states RLS는 user_id만 강제하므로(012) 사용자가 PostgREST로 타인 project_id를 담은
  // state를 직접 INSERT할 수 있다. adminClient upsert는 RLS를 우회하므로 여기서 소유권을 재확인하지
  // 않으면 타 사용자 프로젝트의 GitHub 연결이 덮어써진다. authorize의 검증만으로는 부족하다.
  if (oauthState.project_id) {
    const { data: ownedProject } = await supabase
      .from('projects')
      .select('id')
      .eq('id', oauthState.project_id)
      .eq('user_id', user.id)
      .single();

    if (!ownedProject) {
      await adminClient.from('oauth_states').delete().eq('id', oauthState.id);
      await logAudit(user.id, {
        action: 'service_account.oauth_callback_rejected',
        resourceType: 'service_account',
        details: {
          provider,
          reason: 'project_not_owned',
          project_id: oauthState.project_id,
          state_id: oauthState.id,
        },
      });
      return NextResponse.redirect(
        new URL('/dashboard?error=oauth_project_forbidden', request.nextUrl.origin)
      );
    }
  }

  // state 단일 사용을 원자적으로 확정 — 삭제된 행이 없으면 이미 소비된 state다
  const { data: claimedState } = await adminClient
    .from('oauth_states')
    .delete()
    .eq('id', oauthState.id)
    .select('id')
    .single();

  if (!claimedState) {
    return NextResponse.redirect(
      new URL('/dashboard?error=oauth_state_invalid', request.nextUrl.origin)
    );
  }

  const clientId = process.env[config.client_id_env];
  const clientSecret = process.env[config.client_secret_env];
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL('/dashboard?error=oauth_not_configured', request.nextUrl.origin));
  }

  const appOrigin = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;

  try {
    // Exchange code for access token
    const tokenRes = await fetch(config.token_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: `${appOrigin}/api/oauth/${provider}/callback`,
      }),
      signal: AbortSignal.timeout(10000),
    });

    const tokenData = await tokenRes.json();

    if (tokenData.error || !tokenData.access_token) {
      console.error('OAuth token exchange failed:', tokenData.error ?? 'no access_token');
      return NextResponse.redirect(
        new URL(`${stateRedirect}?error=token_exchange_failed`, request.nextUrl.origin)
      );
    }

    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token || null;
    const expiresIn = tokenData.expires_in;
    const scopes = tokenData.scope ? tokenData.scope.split(',') : [];

    // Fetch user info
    let oauthMetadata: Record<string, unknown> = {};
    let providerUserId: string | null = null;
    try {
      const userRes = await fetch(config.user_info_url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'User-Agent': 'Linkmap/1.0',
        },
        signal: AbortSignal.timeout(10000),
      });
      if (userRes.ok) {
        const userData = await userRes.json();
        providerUserId = String(userData.id);
        oauthMetadata = {
          login: userData.login,
          name: userData.name,
          avatar_url: userData.avatar_url,
          email: userData.email,
        };
      }
    } catch {
      // Non-critical: continue without metadata
    }

    // Look up service ID by slug
    const { data: service } = await adminClient
      .from('services')
      .select('id')
      .eq('slug', oauthState.service_slug)
      .single();

    if (!service) {
      return NextResponse.redirect(
        new URL(`${stateRedirect}?error=service_not_found`, request.nextUrl.origin)
      );
    }

    // Encrypt tokens
    const encryptedAccessToken = encrypt(accessToken);
    const encryptedRefreshToken = refreshToken ? encrypt(refreshToken) : null;

    // Calculate token expiry
    const tokenExpiresAt = expiresIn
      ? new Date(Date.now() + expiresIn * 1000).toISOString()
      : null;

    // Save service account
    const isUserLevel = oauthState.flow_context === 'oneclick' || oauthState.flow_context === 'settings';
    const accountData = {
      service_id: service.id,
      user_id: userId,
      connection_type: 'oauth' as const,
      encrypted_access_token: encryptedAccessToken,
      encrypted_refresh_token: encryptedRefreshToken,
      token_expires_at: tokenExpiresAt,
      oauth_scopes: scopes,
      oauth_provider_user_id: providerUserId,
      oauth_metadata: oauthMetadata,
      display_name: (oauthMetadata.login as string) || null,
      auth_method: 'oauth' as const,
      status: 'active' as const,
      last_verified_at: new Date().toISOString(),
      error_message: null,
      updated_at: new Date().toISOString(),
    };

    let account: { id: string } | null = null;
    let error: unknown = null;

    if (isUserLevel) {
      // User-level account (project_id = NULL): identity-based matching via oauth_provider_user_id
      const existingQuery = adminClient
        .from('service_accounts')
        .select('id')
        .eq('user_id', userId)
        .eq('service_id', service.id)
        .is('project_id', null);

      // Match by provider user ID (same GitHub user = update, new GitHub user = insert)
      if (providerUserId) {
        existingQuery.eq('oauth_provider_user_id', providerUserId);
      }

      const { data: existing } = await existingQuery.single();

      if (existing) {
        const { data, error: updateErr } = await adminClient
          .from('service_accounts')
          .update(accountData)
          .eq('id', existing.id)
          .select('id')
          .single();
        account = data;
        error = updateErr;
      } else {
        const { data, error: insertErr } = await adminClient
          .from('service_accounts')
          .insert({ ...accountData, project_id: null })
          .select('id')
          .single();
        account = data;
        error = insertErr;
      }
    } else {
      // Project-level account: standard upsert
      const { data, error: upsertErr } = await adminClient
        .from('service_accounts')
        .upsert(
          { ...accountData, project_id: oauthState.project_id },
          { onConflict: 'project_id,service_id' }
        )
        .select('id')
        .single();
      account = data;
      error = upsertErr;
    }

    if (error) {
      return NextResponse.redirect(
        new URL(`${stateRedirect}?error=save_failed`, request.nextUrl.origin)
      );
    }

    await logAudit(userId, {
      action: 'service_account.connect_oauth',
      resourceType: 'service_account',
      resourceId: account?.id,
      details: {
        provider,
        project_id: oauthState.project_id,
        service_id: service.id,
        scopes,
      },
    });

    // Redirect based on flow context
    let redirectUrl: string;
    if (oauthState.flow_context === 'settings') {
      redirectUrl = `/settings/github?oauth_success=${provider}`;
    } else if (oauthState.flow_context === 'oneclick') {
      redirectUrl = `/sites/new?oauth_success=${provider}`;
    } else if (stateRedirect.includes('/service-map')) {
      redirectUrl = `${stateRedirect}?oauth_success=${provider}&show_repo_selector=true`;
    } else {
      redirectUrl = `${stateRedirect}?oauth_success=${provider}`;
    }
    return NextResponse.redirect(
      new URL(redirectUrl, request.nextUrl.origin)
    );
  } catch (err) {
    const isTimeout = err instanceof DOMException && err.name === 'TimeoutError';
    console.error('OAuth callback error:', isTimeout ? 'External API request timed out' : err);
    const errorCode = isTimeout ? 'timeout' : 'callback_failed';
    return NextResponse.redirect(
      new URL(`${stateRedirect}?error=${errorCode}`, request.nextUrl.origin)
    );
  }
}
