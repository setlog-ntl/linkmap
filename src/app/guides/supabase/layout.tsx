import { GuideLayoutClient } from '@/components/guides/guide-layout-client';

export default function SupabaseGuideLayout({ children }: { children: React.ReactNode }) {
  return <GuideLayoutClient parentSlug="supabase">{children}</GuideLayoutClient>;
}
