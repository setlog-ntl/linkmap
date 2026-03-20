import { GuideLayoutClient } from '@/components/guides/guide-layout-client';

export const revalidate = false;

export default function OpenAIGuideLayout({ children }: { children: React.ReactNode }) {
  return <GuideLayoutClient parentSlug="openai">{children}</GuideLayoutClient>;
}
