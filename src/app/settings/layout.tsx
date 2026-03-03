export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { AppHeader } from '@/components/layout/app-header';
import { SettingsNav } from '@/components/settings/settings-nav';
import type { Profile } from '@/types';

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  let profile: Profile | null = null;
  try {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    profile = data ?? null;
  } catch {
    profile = null;
  }

  return (
    <SidebarProvider>
      <AppSidebar profile={profile} />
      <div className="flex flex-1 flex-col min-h-screen w-full">
        <AppHeader />
        <main className="flex-1 bg-background">
          <div className="container py-8 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Settings sub-nav */}
              <aside className="md:w-52 shrink-0">
                <SettingsNav />
              </aside>
              {/* Content */}
              <div className="flex-1 min-w-0">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
