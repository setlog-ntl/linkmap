export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/landing/hero-section';
import { SocialProofSection } from '@/components/landing/social-proof-section';
import { FeaturesBento } from '@/components/landing/features-bento';
import { HowItWorks } from '@/components/landing/how-it-works';
import { TemplateShowcase } from '@/components/landing/template-showcase';
import { ServicesGrid } from '@/components/landing/services-grid';
import { PricingSection, FinalCtaSection } from '@/components/landing/cta-section';
import { ProjectsPreviewSection } from '@/components/landing/projects-preview-section';
import type { Profile, ProjectWithServices } from '@/types';

const DEMO_USER_EMAIL = 'cdhrich2@gmail.com';
const PROJECT_PREVIEW_LIMIT = 6;

export default async function LandingPage() {
  let profile: Profile | null = null;
  let previewProjects: ProjectWithServices[] = [];
  let isDemo = false;

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      profile = data ?? null;

      // 로그인 사용자: 자신의 프로젝트 가져오기
      const { data: projects } = await supabase
        .from('projects')
        .select('*, project_services(*, service:services(*))')
        .is('deleted_at', null)
        .order('updated_at', { ascending: false })
        .limit(PROJECT_PREVIEW_LIMIT);
      previewProjects = (projects as ProjectWithServices[]) ?? [];
    }
  } catch {
    profile = null;
  }

  // 미로그인 사용자: 샘플 계정의 프로젝트 가져오기
  if (!profile) {
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
        previewProjects = (data as ProjectWithServices[]) ?? [];
        isDemo = previewProjects.length > 0;
      }
    } catch {
      previewProjects = [];
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header profile={profile} />

      {/* Section 1: Hero — 듀얼 메시지 */}
      <HeroSection />

      {/* Section 2: How It Works — 경로 선택 (초보자/개발자 탭) */}
      <HowItWorks />

      {/* Section 3: Template Showcase — 초보자 deep-dive */}
      <TemplateShowcase />

      {/* Section 4: Core Features — 개발자 deep-dive */}
      <FeaturesBento />

      {/* Section 5: Supported Services */}
      <ServicesGrid />

      {/* Section 6: Social Proof — 구매 전 신뢰 */}
      <SocialProofSection />

      {/* Section 7: My Projects — 로그인 시 실제 데이터, 미로그인 시 샘플 */}
      <ProjectsPreviewSection
        projects={previewProjects}
        isDemo={isDemo}
        isLoggedIn={!!profile}
      />

      {/* Section 8: Pricing */}
      <PricingSection />

      {/* Section 9: Final CTA */}
      <FinalCtaSection />

      <Footer />
    </div>
  );
}
