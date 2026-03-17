import { GuideLayoutClient } from '@/components/guides/guide-layout-client';

export default function MonitoringGuideLayout({ children }: { children: React.ReactNode }) {
  return <GuideLayoutClient parentSlug="monitoring">{children}</GuideLayoutClient>;
}
