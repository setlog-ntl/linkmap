import { GuideLayoutClient } from '@/components/guides/guide-layout-client';

export const revalidate = false;

export default function EnvGuideLayout({ children }: { children: React.ReactNode }) {
  return <GuideLayoutClient parentSlug="env">{children}</GuideLayoutClient>;
}
