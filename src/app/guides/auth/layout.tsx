import { GuideLayoutClient } from '@/components/guides/guide-layout-client';

export default function AuthGuideLayout({ children }: { children: React.ReactNode }) {
  return <GuideLayoutClient parentSlug="auth">{children}</GuideLayoutClient>;
}
