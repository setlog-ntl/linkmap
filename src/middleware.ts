import { updateSession } from '@/lib/supabase/session';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // 인증 보호 경로
    '/dashboard/:path*',
    '/project/:path*',
    '/settings/:path*',
    '/admin/:path*',
    '/my-sites/:path*',
    '/sites/:path*',
    '/login',
    '/signup',
    // 공개 경로 (세션 갱신 기회 확보 — 장시간 체류 후 대시보드 진입 시 세션 유실 방지)
    '/pricing',
    '/guides/:path*',
    '/showcase/:path*',
    '/blog/:path*',
    '/services/:path*',
  ],
};
