import { GuideLayoutClient } from '@/components/guides/guide-layout-client';

export default function DeployGuideLayout({ children }: { children: React.ReactNode }) {
  return <GuideLayoutClient parentSlug="deploy">{children}</GuideLayoutClient>;
}
