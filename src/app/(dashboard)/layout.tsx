export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/layout/header';
import type { Profile } from '@/types';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let profile: Profile | null = null;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      profile = data ?? null;
    }
  } catch {
    profile = null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header profile={profile} />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
