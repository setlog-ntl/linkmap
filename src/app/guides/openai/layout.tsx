import { GuideLayoutClient } from '@/components/guides/guide-layout-client';

export default function OpenAIGuideLayout({ children }: { children: React.ReactNode }) {
  return <GuideLayoutClient parentSlug="openai">{children}</GuideLayoutClient>;
}
