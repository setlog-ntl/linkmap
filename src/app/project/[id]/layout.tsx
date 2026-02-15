export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { ProjectTabs } from '@/components/project/project-tabs';
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header profile={profile} />
      <div className="container py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{(project as Record<string, unknown>)?.name as string}</h1>
          {(project as Record<string, unknown>)?.description && (
            <p className="text-muted-foreground mt-1">{(project as Record<string, unknown>).description as string}</p>
          )}
        </div>
        <ProjectTabs projectId={id} />
        <div className="mt-6">
          {children}
        </div>
      </div>
    </div>
  );
}
