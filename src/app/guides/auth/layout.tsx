import { AuthGuideLayoutClient } from '@/components/guides/auth-guide/auth-guide-layout-client';

export default function AuthGuideLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuideLayoutClient>{children}</AuthGuideLayoutClient>;
}
