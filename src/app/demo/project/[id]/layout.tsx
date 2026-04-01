export const revalidate = false;

import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { AppHeader } from '@/components/layout/app-header';
import { DemoBanner } from '@/components/demo/demo-banner';
import { DemoProjectLayoutContent } from '@/components/demo/demo-project-layout-content';

const DEMO_USER_EMAIL = 'vcdemo@linkmap.site';

export default async function DemoProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let projectName = '데모 프로젝트';
  let projectDescription: string | undefined;

  try {
    const admin = createAdminClient();

    const { data: demoProfile } = await admin
      .from('profiles')
      .select('id')
      .eq('email', DEMO_USER_EMAIL)
      .single();

    if (!demoProfile) redirect('/demo');

    const { data: project } = await admin
      .from('projects')
      .select('id, name, description, user_id')
      .eq('id', id)
      .eq('user_id', demoProfile.id)
      .is('deleted_at', null)
      .single();

    if (!project) redirect('/demo');

    projectName = project.name;
    projectDescription = (project.description as string | null) ?? undefined;
  } catch {
    redirect('/demo');
  }

  return (
    <SidebarProvider>
      <AppSidebar profile={null} />
      <div className="flex flex-1 flex-col min-h-screen w-full">
        <DemoBanner />
        <AppHeader projectName={projectName} />
        <DemoProjectLayoutContent
          projectId={id}
          projectName={projectName}
          projectDescription={projectDescription}
        >
          {children}
        </DemoProjectLayoutContent>
      </div>
    </SidebarProvider>
  );
}
