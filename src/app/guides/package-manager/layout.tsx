import { GuideLayoutClient } from '@/components/guides/guide-layout-client';

export default function PackageManagerGuideLayout({ children }: { children: React.ReactNode }) {
  return <GuideLayoutClient parentSlug="package-manager">{children}</GuideLayoutClient>;
}
