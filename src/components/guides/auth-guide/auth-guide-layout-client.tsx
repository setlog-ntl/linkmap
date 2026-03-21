'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { AuthSubNav } from './auth-sub-nav';

const breadcrumbMap: Record<string, string> = {
  '/guides/auth': '인증 가이드',
  '/guides/auth/google': '구글 로그인 설정',
  '/guides/auth/kakao': '카카오 로그인 설정',
};

export function AuthGuideLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isSubPage = pathname !== '/guides/auth';
  const currentLabel = breadcrumbMap[pathname] ?? '';

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-muted-foreground py-4">
        <Link prefetch={false} href="/guides" className="hover:text-foreground transition-colors">
          가이드
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        {isSubPage ? (
          <>
            <Link prefetch={false} href="/guides/auth" className="hover:text-foreground transition-colors">
              인증 가이드
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-foreground font-medium">{currentLabel}</span>
          </>
        ) : (
          <span className="text-foreground font-medium">인증 가이드</span>
        )}
      </nav>

      {/* Sub Navigation */}
      <AuthSubNav />

      {/* Content */}
      {children}
    </div>
  );
}
