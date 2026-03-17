import { GuideLayoutClient } from '@/components/guides/guide-layout-client';

export default function ApiBasicsGuideLayout({ children }: { children: React.ReactNode }) {
  return <GuideLayoutClient parentSlug="api-basics">{children}</GuideLayoutClient>;
}
