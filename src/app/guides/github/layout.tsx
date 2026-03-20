import { GuideLayoutClient } from '@/components/guides/guide-layout-client';

export const revalidate = false;

export default function GitHubGuideLayout({ children }: { children: React.ReactNode }) {
  return <GuideLayoutClient parentSlug="github">{children}</GuideLayoutClient>;
}
