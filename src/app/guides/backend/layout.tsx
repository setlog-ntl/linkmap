import { GuideLayoutClient } from '@/components/guides/guide-layout-client';

export default function BackendGuideLayout({ children }: { children: React.ReactNode }) {
  return <GuideLayoutClient parentSlug="backend">{children}</GuideLayoutClient>;
}
