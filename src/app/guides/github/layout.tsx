import { GuideLayoutClient } from '@/components/guides/guide-layout-client';

export default function GitHubGuideLayout({ children }: { children: React.ReactNode }) {
  return <GuideLayoutClient parentSlug="github">{children}</GuideLayoutClient>;
}
