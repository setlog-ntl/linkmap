import { GuideLayoutClient } from '@/components/guides/guide-layout-client';

export default function VercelGuideLayout({ children }: { children: React.ReactNode }) {
  return <GuideLayoutClient parentSlug="vercel">{children}</GuideLayoutClient>;
}
