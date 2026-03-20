import { GuideLayoutClient } from '@/components/guides/guide-layout-client';

export const revalidate = false;

export default function AutomationGuideLayout({ children }: { children: React.ReactNode }) {
  return <GuideLayoutClient parentSlug="automation">{children}</GuideLayoutClient>;
}
