'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { QueryCache, MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { TooltipProvider } from '@/components/ui/tooltip';
import { CommandPalette } from '@/components/command-palette';
import { createClient } from '@/lib/supabase/client';
import { isDefinitiveAuthFailure } from '@/lib/supabase/auth-recovery';

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

/** 쿼리/뮤테이션의 확정적 인증 실패 → 세션 정리 + 보호 경로면 로그인으로 */
function handleGlobalAuthError(error: unknown) {
  if (!isDefinitiveAuthFailure(error)) return;
  void purgeDeadSession().then(() => {
    if (isProtectedPath(window.location.pathname)) {
      // 전체 리로드로 미들웨어를 태워 서버측 쿠키 정리까지 보장
      window.location.href = '/login';
    }
  });
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
        if (!user && isDefinitiveAuthFailure(error)) {
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
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({ onError: handleGlobalAuthError }),
        mutationCache: new MutationCache({ onError: handleGlobalAuthError }),
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            retry: (failureCount, error) => {
              // 인증 실패는 재시도해도 결과가 같음 — 즉시 복구 로직으로 위임
              if (isDefinitiveAuthFailure(error)) return false;
              if (error instanceof Error && error.message.includes('401')) return false;
              return failureCount < 1;
            },
          },
        },
      })
  );

  useAuthStateListener();

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider delayDuration={400} skipDelayDuration={200}>
          {children}
          <CommandPalette />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
