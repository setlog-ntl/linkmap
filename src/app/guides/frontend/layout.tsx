import { GuideLayoutClient } from '@/components/guides/guide-layout-client';

export default function FrontendGuideLayout({ children }: { children: React.ReactNode }) {
  return <GuideLayoutClient parentSlug="frontend">{children}</GuideLayoutClient>;
}
