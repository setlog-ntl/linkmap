import { GuideLayoutClient } from '@/components/guides/guide-layout-client';

export const revalidate = false;

export default function AiBasicsGuideLayout({ children }: { children: React.ReactNode }) {
  return <GuideLayoutClient parentSlug="ai-basics">{children}</GuideLayoutClient>;
}
