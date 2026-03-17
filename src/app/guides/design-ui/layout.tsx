import { GuideLayoutClient } from '@/components/guides/guide-layout-client';

export default function DesignUiGuideLayout({ children }: { children: React.ReactNode }) {
  return <GuideLayoutClient parentSlug="design-ui">{children}</GuideLayoutClient>;
}
