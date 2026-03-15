import { GuideLayoutClient } from '@/components/guides/guide-layout-client';

export default function CloudflareGuideLayout({ children }: { children: React.ReactNode }) {
  return <GuideLayoutClient parentSlug="cloudflare">{children}</GuideLayoutClient>;
}
