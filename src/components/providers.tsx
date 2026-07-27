'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { QueryCache, MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { MotionConfig } from 'framer-motion';
import { TooltipProvider } from '@/components/ui/tooltip';
import { CommandPalette } from '@/components/command-palette';
import { createClient } from '@/lib/supabase/client';
import {
  isDefinitiveAuthFailure,
  isExpiredJwtFailure,
  isStaleClientKeyFailure,
} from '@/lib/supabase/auth-recovery';
import { installChunkFailureRecovery, reloadForFreshBundle } from '@/lib/stale-bundle';

/** 인증이 필요한 경로 접두사 */
const AUTH_REQUIRED_PREFIXES = ['/dashboard', '/project', '/settings', '/admin', '/my-sites', '/sites'];

function isProtectedPath(pathname: string): boolean {
  return AUTH_REQUIRED_PREFIXES.some((p) => pathname.startsWith(p));
}

/**
 * 죽은 세션 정리 — 서버에서 무효가 된 세션(키 로테이션·세션 폐기 등)을
 * 로컬(쿠키/스토리지)에서 제거해 무효 토큰이 계속 전송되는 것을 차단한다.
 * 여러 쿼리가 동시에 실패해도 signOut은 1회만 수행.
 */
let purgeInFlight: Promise<void> | null = null;
function purgeDeadSession(): Promise<void> {
  if (!purgeInFlight) {
    purgeInFlight = (async () => {
      try {
        await createClient().auth.signOut({ scope: 'local' });
      } catch (error) {
        // 서버 logout 호출은 무효 토큰이라 실패할 수 있음 — 로컬 세션 제거가 목적이므로
        // 실패해도 진행 (supabase-js는 API 실패와 무관하게 로컬 세션을 제거함)
        console.error('[auth] purgeDeadSession:', error instanceof Error ? error.message : error);
      } finally {
        purgeInFlight = null;
      }
    })();
  }
  return purgeInFlight;
}

/**
 * 만료 토큰 복구 — refresh token으로 세션 갱신을 시도한다.
 * - 'recovered': 갱신 성공 → 세션 살아있음, 절대 정리 금지
 * - 'dead': 갱신 거부(refresh_token_not_found 등) 또는 갱신 직후에도 만료
 *   401 재발(쿨다운 내 재진입 = 새 토큰조차 거부) → 정리 경로로 강등
 * - 'indeterminate': 네트워크 오류 등 생사 판단 불가 → 세션 유지(정리 금지)
 * 동시 다발 401은 하나의 갱신 요청으로 합류한다.
 */
let refreshInFlight: Promise<'recovered' | 'dead' | 'indeterminate'> | null = null;
let lastRefreshAttemptAt = 0;
const REFRESH_RECOVERY_COOLDOWN_MS = 30 * 1000;

function tryRecoverExpiredSession(): Promise<'recovered' | 'dead' | 'indeterminate'> {
  if (refreshInFlight) return refreshInFlight;
  if (Date.now() - lastRefreshAttemptAt < REFRESH_RECOVERY_COOLDOWN_MS) {
    return Promise.resolve('dead');
  }
  lastRefreshAttemptAt = Date.now();
  refreshInFlight = (async (): Promise<'recovered' | 'dead' | 'indeterminate'> => {
    try {
      const { data, error } = await createClient().auth.refreshSession();
      if (data.session) return 'recovered';
      return error && isDefinitiveAuthFailure(error) ? 'dead' : 'indeterminate';
    } catch (error) {
      console.error(
        '[auth] 만료 세션 갱신 실패:',
        error instanceof Error ? error.message : error
      );
      return 'indeterminate';
    } finally {
      refreshInFlight = null;
    }
  })();
  return refreshInFlight;
}

function purgeAndRedirect(): Promise<void> {
  return purgeDeadSession().then(() => {
    if (isProtectedPath(window.location.pathname)) {
      // 전체 리로드로 미들웨어를 태워 서버측 쿠키 정리까지 보장
      window.location.href = '/login';
    }
  });
}

/**
 * 쿼리/뮤테이션의 확정적 인증 실패 처리. 복구 수단이 각기 달라 순서가 중요:
 * 폐기 키(구 번들) → 문서 리로드 / 만료 토큰 → 세션 갱신 후 리페치 /
 * 그 외 확정 실패(세션 폐기 등) → 세션 정리 + 보호 경로면 로그인으로.
 */
function handleGlobalAuthError(error: unknown, refetchQuery?: () => void) {
  // 폐기 키 401 = 구 번들 실행 중. 키가 JS에 인라인이라 세션 정리로는 복구
  // 불가 — 새 문서를 받아야 하므로 확정 실패 분기보다 먼저 처리한다.
  if (isStaleClientKeyFailure(error)) {
    reloadForFreshBundle();
    return;
  }
  if (!isDefinitiveAuthFailure(error)) return;
  // 만료 토큰은 회복 가능 — 갱신을 먼저 시도하고, 거부될 때만 정리한다.
  // (갱신 없이 바로 정리하면 절전 복귀 탭마다 강제 로그아웃 발생)
  if (isExpiredJwtFailure(error)) {
    void tryRecoverExpiredSession().then((result) => {
      if (result === 'recovered') {
        refetchQuery?.();
        return;
      }
      if (result === 'dead') void purgeAndRedirect();
      // 'indeterminate'는 세션 유지 — 다음 사용자 액션/리페치에서 재판정
    });
    return;
  }
  void purgeAndRedirect();
}

function useAuthStateListener() {
  const router = useRouter();
  const pathname = usePathname();
  const wasSignedIn = useRef(false);

  // ref로 참조해 경로 변경 시 리스너 effect 재실행(재구독·재검증) 없이
  // 이벤트 시점의 현재 경로로 판단 — 페이지 이동마다 auth 서버 호출이 반복되는 것을 방지
  const isProtectedRef = useRef(isProtectedPath(pathname));
  useEffect(() => {
    isProtectedRef.current = isProtectedPath(pathname);
  }, [pathname]);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    // 초기 세션 확인 + 서버 검증(전체 페이지 로드당 1회): 로컬에 세션이 있어도
    // 서버에서 무효(키 로테이션 등)라면 정리 — 로그인 화면 401 스팸·재로그인 실패 방지
    supabase.auth
      .getSession()
      .then(async ({ data: { session } }) => {
        if (cancelled) return;
        wasSignedIn.current = !!session;
        if (!session) return;

        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        if (cancelled) return;
        if (!user && isStaleClientKeyFailure(error)) {
          // 구 번들의 폐기 키 — 세션 정리·로그인 리다이렉트 대신 새 번들 로드
          reloadForFreshBundle();
          return;
        }
        if (!user && isDefinitiveAuthFailure(error)) {
          // 만료 토큰(클록 스큐 등으로 로컬 갱신을 건너뛴 경우)은 갱신 우선
          if (isExpiredJwtFailure(error) && (await tryRecoverExpiredSession()) === 'recovered') {
            wasSignedIn.current = true;
            return;
          }
          wasSignedIn.current = false;
          await purgeDeadSession();
          if (isProtectedRef.current) router.push('/login');
        }
      })
      .catch(() => {
        // getSession/getUser 네트워크 실패 — 세션 유효성 판단 불가, 다음 요청에서 재시도
        wasSignedIn.current = false;
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || (event === 'TOKEN_REFRESHED' && !session)) {
        // 로그아웃 또는 토큰 갱신 실패 → 보호 경로에서만 리다이렉트
        if (wasSignedIn.current && isProtectedRef.current) {
          wasSignedIn.current = false;
          router.push('/login');
        }
        wasSignedIn.current = false;
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        wasSignedIn.current = true;
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [router]);
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => {
    const client: QueryClient = new QueryClient({
      queryCache: new QueryCache({
        // 만료 토큰이 갱신으로 복구되면 실패한 쿼리만 즉시 재조회해
        // 사용자 개입 없이 화면을 회복시킨다
        onError: (error, query) =>
          handleGlobalAuthError(error, () => {
            void client.refetchQueries({ queryKey: query.queryKey });
          }),
      }),
      mutationCache: new MutationCache({
        // 뮤테이션은 자동 재실행이 안전하지 않음 — 세션 복구만 수행
        onError: (error) => handleGlobalAuthError(error),
      }),
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000,
          retry: (failureCount, error) => {
            // 인증 실패는 재시도해도 결과가 같음 — 즉시 복구 로직으로 위임
            if (isStaleClientKeyFailure(error)) return false;
            if (isDefinitiveAuthFailure(error)) return false;
            if (error instanceof Error && error.message.includes('401')) return false;
            return failureCount < 1;
          },
        },
      },
    });
    return client;
  });

  useAuthStateListener();

  // 배포 후 구 청크 404(스테일 HTML) — 새 문서 로드로 자가치유
  useEffect(() => installChunkFailureRecovery(), []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <MotionConfig reducedMotion="user">
        <QueryClientProvider client={queryClient}>
          <TooltipProvider delayDuration={400} skipDelayDuration={200}>
            {children}
            <CommandPalette />
          </TooltipProvider>
        </QueryClientProvider>
      </MotionConfig>
    </ThemeProvider>
  );
}
