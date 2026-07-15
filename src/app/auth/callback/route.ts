import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { isPkceVerifierCookie } from '@/lib/supabase/auth-recovery';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const error_param = searchParams.get('error');
  const error_description = searchParams.get('error_description');
  const rawNext = searchParams.get('next') ?? '/dashboard';
  // Open redirect 방지: 반드시 /로 시작하고 프로토콜 포함 금지
  const next = rawNext.startsWith('/') && !rawNext.startsWith('//') && !rawNext.includes('://')
    ? rawNext
    : '/dashboard';

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
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
    // verifier가 없었다면 멀티탭 덮어쓰기가 압도적으로 유력하다 — 사용자가
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
