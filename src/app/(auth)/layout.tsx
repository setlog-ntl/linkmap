import type { Metadata } from 'next';

// Workers Free Plan CPU 10ms 제한 대응:
// 인증 폼은 클라이언트 컴포넌트이므로 셸만 정적 빌드.
// Supabase Auth는 클라이언트에서 호출되어 서버 동적 렌더링 불필요.
export const revalidate = false;

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
