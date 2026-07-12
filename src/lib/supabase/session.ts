import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { isAuthSessionCookie, isDefinitiveAuthFailure } from './auth-recovery';

/** 요청의 sb-* 세션 쿠키를 응답에서 만료 처리 (PKCE code-verifier 제외) */
function expireAuthCookies(request: NextRequest, response: NextResponse) {
  for (const cookie of request.cookies.getAll()) {
    if (isAuthSessionCookie(cookie.name)) {
      response.cookies.set(cookie.name, '', { maxAge: 0, path: '/' });
    }
  }
}

/** 세션 갱신 중 설정된 쿠키(토큰 회전 결과)를 리다이렉트 응답에도 전달 */
function copyResponseCookies(from: NextResponse, to: NextResponse) {
  for (const cookie of from.cookies.getAll()) {
    to.cookies.set(cookie);
  }
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse;
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options ?? {});
          });
        },
      },
    });

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    // 죽은 세션 자가치유: 인증 쿠키가 있는데 세션이 확정적으로 무효
    // (키 로테이션·세션 폐기·쿠키 손상 등)이면 쿠키를 만료시켜
    // 다음 요청부터 깨끗한 비로그인 상태로 복구한다.
    // 방치 시 클라이언트가 무효 토큰을 계속 전송해 전면 401 + 재로그인 실패가 발생.
    const hasAuthCookies = request.cookies
      .getAll()
      .some((c) => isAuthSessionCookie(c.name));
    const isDeadSession =
      !user && hasAuthCookies && isDefinitiveAuthFailure(authError);

    // Protected routes - redirect to login if not authenticated
    const protectedPaths = ['/dashboard', '/project', '/settings', '/admin', '/my-sites', '/sites'];
    const isProtectedPath = protectedPaths.some((path) =>
      request.nextUrl.pathname.startsWith(path)
    );

    if (!user && isProtectedPath) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/login';
      const redirectResponse = NextResponse.redirect(redirectUrl);
      copyResponseCookies(supabaseResponse, redirectResponse);
      if (isDeadSession) {
        expireAuthCookies(request, redirectResponse);
      }
      return redirectResponse;
    }

    if (isDeadSession) {
      expireAuthCookies(request, supabaseResponse);
    }

    // Redirect logged-in users away from auth pages
    const authPaths = ['/login', '/signup'];
    const isAuthPath = authPaths.some((path) =>
      request.nextUrl.pathname.startsWith(path)
    );

    if (user && isAuthPath) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/dashboard';
      const redirectResponse = NextResponse.redirect(redirectUrl);
      // 토큰이 이번 요청에서 회전됐다면 새 쿠키를 반드시 전달 —
      // 유실 시 브라우저가 이미 소비된 refresh token을 재사용해 세션이 강제 종료됨
      copyResponseCookies(supabaseResponse, redirectResponse);
      return redirectResponse;
    }
  } catch (error) {
    // 예기치 못한 오류(Supabase 장애 등) — 세션 유효성을 판단할 수 없으므로
    // 쿠키를 건드리지 않고 통과시킨다(fail-open). 보호 경로는 페이지 레벨 인증이 재검증.
    console.error(
      '[middleware] session refresh failed:',
      error instanceof Error ? error.message : error
    );
    return supabaseResponse;
  }

  return supabaseResponse;
}
