import { GuideLayoutClient } from '@/components/guides/guide-layout-client';

export default function CommunicationGuideLayout({ children }: { children: React.ReactNode }) {
  return <GuideLayoutClient parentSlug="communication">{children}</GuideLayoutClient>;
}
