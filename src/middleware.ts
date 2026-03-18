import { updateSession } from '@/lib/supabase/session';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // 인증 보호가 필요한 경로만 매칭 (공개 페이지 제외 → CPU 시간 절약)
    '/dashboard/:path*',
    '/project/:path*',
    '/settings/:path*',
    '/admin/:path*',
    '/my-sites/:path*',
    '/login',
    '/signup',
  ],
};
