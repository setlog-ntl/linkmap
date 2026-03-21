'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { TooltipProvider } from '@/components/ui/tooltip';
import { CommandPalette } from '@/components/command-palette';
import { createClient } from '@/lib/supabase/client';

/** 인증이 필요한 경로 접두사 */
const AUTH_REQUIRED_PREFIXES = ['/dashboard', '/project', '/settings', '/admin', '/my-sites', '/sites'];

function useAuthStateListener() {
  const router = useRouter();
  const pathname = usePathname();
  const wasSignedIn = useRef(false);

  const isProtectedPath = AUTH_REQUIRED_PREFIXES.some((p) => pathname.startsWith(p));

  useEffect(() => {
    const supabase = createClient();

    // 현재 세션 확인 (초기 상태 설정)
    supabase.auth.getSession().then(({ data: { session } }) => {
      wasSignedIn.current = !!session;
    }).catch(() => {});

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || (event === 'TOKEN_REFRESHED' && !session)) {
        // 로그아웃 또는 토큰 갱신 실패 → 보호 경로에서만 리다이렉트
        if (wasSignedIn.current && isProtectedPath) {
          wasSignedIn.current = false;
          router.push('/login');
        }
        wasSignedIn.current = false;
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        wasSignedIn.current = true;
      }
    });

    return () => subscription.unsubscribe();
  }, [router, isProtectedPath]);
}

/** TanStack Query에서 401 응답 시 자동 로그인 페이지 이동 */
function useGlobal401Handler(queryClient: QueryClient) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isProtected = AUTH_REQUIRED_PREFIXES.some((p) => pathname.startsWith(p));
    if (!isProtected) return;

    const defaults = queryClient.getDefaultOptions();

    queryClient.setDefaultOptions({
      ...defaults,
      mutations: {
        ...defaults.mutations,
        onError: (error: Error) => {
          if (error.message.includes('401')) {
            router.push('/login');
          }
        },
      },
    });
  }, [queryClient, router, pathname]);
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            retry: (failureCount, error) => {
              // 401 에러는 재시도하지 않음
              if (error instanceof Error && error.message.includes('401')) return false;
              return failureCount < 1;
            },
          },
        },
      })
  );

  useAuthStateListener();
  useGlobal401Handler(queryClient);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {children}
          <CommandPalette />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
