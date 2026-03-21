export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { AppHeader } from '@/components/layout/app-header';
import { ServiceDetailSheetGlobal } from '@/components/service-map/service-detail-sheet-global';
import { ServiceDetailResolver } from '@/components/service-map/service-detail-resolver';
import { FeedbackFab } from '@/components/layout/feedback-fab';
import type { Profile } from '@/types';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let profile: Profile | null = null;
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (!user || authError) {
    redirect('/login');
  }

  try {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    profile = data ?? null;
  } catch {
    // 프로필 조회 실패는 비치명적 — null로 진행
    profile = null;
  }

  return (
    <SidebarProvider>
      <AppSidebar profile={profile} />
      <div className="flex flex-1 flex-col min-h-screen w-full">
        <AppHeader profile={profile} />
        <main className="flex-1">
          {children}
        </main>
      </div>
      <ServiceDetailSheetGlobal />
      <ServiceDetailResolver />
      <FeedbackFab />
    </SidebarProvider>
  );
}
