export const dynamic = 'force-dynamic';

import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ProjectsPreviewSection } from '@/components/landing/projects-preview-section';
import type { Profile, ProjectWithServices } from '@/types';

const DEMO_USER_EMAIL = 'cdhnaya2@naver.com';
const PROJECT_PREVIEW_LIMIT = 12;

export default async function DemoPage() {
  let profile: Profile | null = null;

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      profile = data ?? null;
    }
  } catch {
    profile = null;
  }

  let demoProjects: ProjectWithServices[] = [];

  try {
    const admin = createAdminClient();
    const { data: demoProfile } = await admin
      .from('profiles')
      .select('id')
      .eq('email', DEMO_USER_EMAIL)
      .single();

    if (demoProfile) {
      const { data } = await admin
        .from('projects')
        .select('*, project_services(*, service:services(*))')
        .eq('user_id', demoProfile.id)
        .is('deleted_at', null)
        .order('updated_at', { ascending: false })
        .limit(PROJECT_PREVIEW_LIMIT);
      demoProjects = (data as ProjectWithServices[]) ?? [];
    }
  } catch {
    demoProjects = [];
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header profile={profile} />

      <main className="flex-1">
        <div className="pt-16">
          <ProjectsPreviewSection
            projects={demoProjects}
            isDemo={true}
            isLoggedIn={!!profile}
          />
        </div>

        {demoProjects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-40 text-center">
            <p className="text-muted-foreground text-lg">샘플 프로젝트를 불러올 수 없습니다.</p>
            <p className="text-muted-foreground text-sm mt-2">잠시 후 다시 시도해 주세요.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
