import { GuideLayoutClient } from '@/components/guides/guide-layout-client';

export default function ServerGuideLayout({ children }: { children: React.ReactNode }) {
  return <GuideLayoutClient parentSlug="server">{children}</GuideLayoutClient>;
}
