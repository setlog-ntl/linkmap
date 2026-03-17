import { GuideLayoutClient } from '@/components/guides/guide-layout-client';

export default function AutomationGuideLayout({ children }: { children: React.ReactNode }) {
  return <GuideLayoutClient parentSlug="automation">{children}</GuideLayoutClient>;
}
