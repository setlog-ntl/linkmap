import { GuideLayoutClient } from '@/components/guides/guide-layout-client';

export default function AiToolsGuideLayout({ children }: { children: React.ReactNode }) {
  return <GuideLayoutClient parentSlug="ai-tools">{children}</GuideLayoutClient>;
}
