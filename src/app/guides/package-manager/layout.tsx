import { GuideLayoutClient } from '@/components/guides/guide-layout-client';

export const revalidate = false;

export default function PackageManagerGuideLayout({ children }: { children: React.ReactNode }) {
  return <GuideLayoutClient parentSlug="package-manager">{children}</GuideLayoutClient>;
}
