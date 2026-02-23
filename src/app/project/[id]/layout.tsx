export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { AppHeader } from '@/components/layout/app-header';
import { ProjectLayoutContent } from '@/components/project/project-layout-content';
import { ProjectTabs } from '@/components/project/project-tabs';
import { ServiceDetailSheetGlobal } from '@/components/service-map/service-detail-sheet-global';
import { ServiceDetailResolver } from '@/components/service-map/service-detail-resolver';
import type { Profile } from '@/types';

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let profile: Profile | null = null;
  let project: Record<string, unknown> | null = null;

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const [profileResult, projectResult] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('projects').select('*').eq('id', id).eq('user_id', user.id).single(),
    ]);

    profile = profileResult.data as Profile | null;
    project = projectResult.data;

    if (!project) redirect('/dashboard');
  } catch {
    redirect('/login');
  }

  const projectName = (project as Record<string, unknown>)?.name as string;

  return (
    <SidebarProvider>
      <AppSidebar profile={profile} />
      <div className="flex flex-1 flex-col min-h-screen w-full">
        <AppHeader projectName={projectName} />
        <ProjectLayoutContent
          projectId={id}
          projectName={projectName}
          projectDescription={(project as Record<string, unknown>)?.description as string}
        >
          {children}
        </ProjectLayoutContent>
      </div>
      <ServiceDetailSheetGlobal />
      <ServiceDetailResolver />
    </SidebarProvider>
  );
}
