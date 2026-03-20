import { GuideLayoutClient } from '@/components/guides/guide-layout-client';

export const revalidate = false;

export default function BackendGuideLayout({ children }: { children: React.ReactNode }) {
  return <GuideLayoutClient parentSlug="backend">{children}</GuideLayoutClient>;
}
