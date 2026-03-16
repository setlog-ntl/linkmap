import { GuideLayoutClient } from '@/components/guides/guide-layout-client';

export default function DomainGuideLayout({ children }: { children: React.ReactNode }) {
  return <GuideLayoutClient parentSlug="domain">{children}</GuideLayoutClient>;
}
