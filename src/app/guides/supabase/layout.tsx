import { GuideLayoutClient } from '@/components/guides/guide-layout-client';

export const revalidate = false;

export default function SupabaseGuideLayout({ children }: { children: React.ReactNode }) {
  return <GuideLayoutClient parentSlug="supabase">{children}</GuideLayoutClient>;
}
