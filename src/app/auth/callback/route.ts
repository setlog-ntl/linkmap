import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { isPkceVerifierCookie } from '@/lib/supabase/auth-recovery';
import { safeInternalPath } from '@/lib/utils/safe-redirect';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const error_param = searchParams.get('error');
  const error_description = searchParams.get('error_description');
  // Open redirect 방지: 내부 경로만 허용 (safeInternalPath로 일원화)
  const next = safeInternalPath(searchParams.get('next'));

  // 재시도 시 원래 목적지를 잃지 않도록 실패 리다이렉트에 next를 보존한다
  const loginRetryQs = next !== '/dashboard' ? `&redirect=${encodeURIComponent(next)}` : '';

  // OAuth provider returned an error
  if (error_param) {
    console.error('[auth/callback] OAuth error from provider:', {
      error: error_param,
      description: error_description,
    });
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error_description || error_param)}${loginRetryQs}`
    );
  }

  if (code) {
    // PKCE verifier 부재를 교환 전에 확인해 실패 사유를 구분한다.
    // 판정 전용 — 교환 시도 자체는 그대로 두어 동작을 바꾸지 않는다
    // (verifier가 쿠키 외 경로로 전달될 여지를 남김).
    const cookieStore = await cookies();
    const hasVerifier = cookieStore.getAll().some((c) => isPkceVerifierCookie(c.name));

    const supabase = await createClient();

    // 성공 리다이렉트(로컬/프록시/기본) — 교환 성공과 세션 복구 두 경로에서 공용.
    const successRedirect = () => {
      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';
      if (isLocalEnv) return NextResponse.redirect(`${origin}${next}`);
      if (forwardedHost) return NextResponse.redirect(`https://${forwardedHost}${next}`);
      return NextResponse.redirect(`${origin}${next}`);
    };

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return successRedirect();
    }

    // 교환이 실패했어도 이미 유효한 세션이 있으면(직전/동시 플로우가 성공했거나
    // 콜백이 중복 요청된 경우) 오류를 노출하지 않고 성공으로 처리한다 — 코드 재사용
    // 레이스로 인한 auth_exchange 오탐을 막는다(읽기 전용 검사, 인증 약화 아님).
    try {
      const { data: { user: recoveredUser } } = await supabase.auth.getUser();
      if (recoveredUser) {
        return successRedirect();
      }
    } catch (recoveryErr) {
      // getUser 실패는 "복구 불가"만 의미 — 원 실패(exchange)는 아래에서 분류·리다이렉트한다
      console.error('[auth/callback] recovery getUser threw:', recoveryErr instanceof Error ? recoveryErr.message : recoveryErr);
    }

    // verifier가 없었다면 멀티탭/멀티클릭 덮어쓰기가 압도적으로 유력하다 — 사용자가
    // 취할 행동이 다르므로(다른 로그인 탭 정리) 사유를 구분해 내려보낸다.
    const reason = hasVerifier ? 'auth_exchange' : 'auth_verifier';
    console.error('[auth/callback] Session exchange failed:', {
      reason,
      hasVerifier,
      message: error.message,
      status: error.status,
    });
    // 원문 메시지는 URL에 싣지 않는다 — 분류 코드만 전달
    return NextResponse.redirect(`${origin}/login?error=${reason}${loginRetryQs}`);
  }

  console.error('[auth/callback] No code parameter in callback URL');
  return NextResponse.redirect(`${origin}/login?error=auth_nocode${loginRetryQs}`);
}
