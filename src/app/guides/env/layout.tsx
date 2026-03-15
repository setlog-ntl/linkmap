import { GuideLayoutClient } from '@/components/guides/guide-layout-client';

export default function EnvGuideLayout({ children }: { children: React.ReactNode }) {
  return <GuideLayoutClient parentSlug="env">{children}</GuideLayoutClient>;
}
