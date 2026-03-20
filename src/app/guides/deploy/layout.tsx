import { GuideLayoutClient } from '@/components/guides/guide-layout-client';

export const revalidate = false;

export default function DeployGuideLayout({ children }: { children: React.ReactNode }) {
  return <GuideLayoutClient parentSlug="deploy">{children}</GuideLayoutClient>;
}
