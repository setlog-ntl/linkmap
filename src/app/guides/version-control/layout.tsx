import { GuideLayoutClient } from '@/components/guides/guide-layout-client';

export default function VersionControlGuideLayout({ children }: { children: React.ReactNode }) {
  return <GuideLayoutClient parentSlug="version-control">{children}</GuideLayoutClient>;
}
