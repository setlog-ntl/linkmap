export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
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

  // 로그인된 사용자는 대시보드로 이동
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) redirect('/');
  } catch {
    // 미인증 → 계속
  }

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
