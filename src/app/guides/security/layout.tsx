import { GuideLayoutClient } from '@/components/guides/guide-layout-client';

export default function SecurityGuideLayout({ children }: { children: React.ReactNode }) {
  return <GuideLayoutClient parentSlug="security">{children}</GuideLayoutClient>;
}
