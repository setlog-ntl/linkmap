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

const FALLBACK_SAMPLE_PROJECTS: ProjectWithServices[] = [
  {
    id: 'demo-1',
    user_id: 'demo',
    name: 'SaaS 스타트업',
    description: 'Next.js + Supabase 기반 구독 서비스',
    icon_type: 'emoji',
    icon_value: '🚀',
    tech_stack: {},
    team_id: null,
    main_service_id: null,
    link_url: null,
    is_favorited: false,
    monthly_budget: null,
    budget_currency: 'USD',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    project_services: [
      { id: 'ps-1a', project_id: 'demo-1', service_id: 's-vercel', status: 'connected', notes: null, cost_tier_id: null, custom_cost_monthly: null, custom_cost_yearly: null, cost_notes: null, billing_cycle: 'monthly', created_at: '', updated_at: '', service: { id: 's-vercel', name: 'Vercel', slug: 'vercel', category: 'deploy', description: null, description_ko: null, icon_url: null, website_url: null, docs_url: null, pricing_info: {}, required_env_vars: [], created_at: '' } },
      { id: 'ps-1b', project_id: 'demo-1', service_id: 's-supabase', status: 'connected', notes: null, cost_tier_id: null, custom_cost_monthly: null, custom_cost_yearly: null, cost_notes: null, billing_cycle: 'monthly', created_at: '', updated_at: '', service: { id: 's-supabase', name: 'Supabase', slug: 'supabase', category: 'database', description: null, description_ko: null, icon_url: null, website_url: null, docs_url: null, pricing_info: {}, required_env_vars: [], created_at: '' } },
      { id: 'ps-1c', project_id: 'demo-1', service_id: 's-stripe', status: 'connected', notes: null, cost_tier_id: null, custom_cost_monthly: null, custom_cost_yearly: null, cost_notes: null, billing_cycle: 'monthly', created_at: '', updated_at: '', service: { id: 's-stripe', name: 'Stripe', slug: 'stripe', category: 'payment', description: null, description_ko: null, icon_url: null, website_url: null, docs_url: null, pricing_info: {}, required_env_vars: [], created_at: '' } },
      { id: 'ps-1d', project_id: 'demo-1', service_id: 's-sendgrid', status: 'in_progress', notes: null, cost_tier_id: null, custom_cost_monthly: null, custom_cost_yearly: null, cost_notes: null, billing_cycle: 'monthly', created_at: '', updated_at: '', service: { id: 's-sendgrid', name: 'SendGrid', slug: 'sendgrid', category: 'email', description: null, description_ko: null, icon_url: null, website_url: null, docs_url: null, pricing_info: {}, required_env_vars: [], created_at: '' } },
    ],
  },
  {
    id: 'demo-2',
    user_id: 'demo',
    name: 'AI 챗봇 앱',
    description: 'OpenAI 기반 고객 지원 자동화',
    icon_type: 'emoji',
    icon_value: '🤖',
    tech_stack: {},
    team_id: null,
    main_service_id: null,
    link_url: null,
    is_favorited: true,
    monthly_budget: null,
    budget_currency: 'USD',
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    project_services: [
      { id: 'ps-2a', project_id: 'demo-2', service_id: 's-openai', status: 'connected', notes: null, cost_tier_id: null, custom_cost_monthly: null, custom_cost_yearly: null, cost_notes: null, billing_cycle: 'usage_based', created_at: '', updated_at: '', service: { id: 's-openai', name: 'OpenAI', slug: 'openai', category: 'ai', description: null, description_ko: null, icon_url: null, website_url: null, docs_url: null, pricing_info: {}, required_env_vars: [], created_at: '' } },
      { id: 'ps-2b', project_id: 'demo-2', service_id: 's-vercel', status: 'connected', notes: null, cost_tier_id: null, custom_cost_monthly: null, custom_cost_yearly: null, cost_notes: null, billing_cycle: 'monthly', created_at: '', updated_at: '', service: { id: 's-vercel', name: 'Vercel', slug: 'vercel', category: 'deploy', description: null, description_ko: null, icon_url: null, website_url: null, docs_url: null, pricing_info: {}, required_env_vars: [], created_at: '' } },
      { id: 'ps-2c', project_id: 'demo-2', service_id: 's-pinecone', status: 'connected', notes: null, cost_tier_id: null, custom_cost_monthly: null, custom_cost_yearly: null, cost_notes: null, billing_cycle: 'monthly', created_at: '', updated_at: '', service: { id: 's-pinecone', name: 'Pinecone', slug: 'pinecone', category: 'database', description: null, description_ko: null, icon_url: null, website_url: null, docs_url: null, pricing_info: {}, required_env_vars: [], created_at: '' } },
      { id: 'ps-2d', project_id: 'demo-2', service_id: 's-upstash', status: 'not_started', notes: null, cost_tier_id: null, custom_cost_monthly: null, custom_cost_yearly: null, cost_notes: null, billing_cycle: 'monthly', created_at: '', updated_at: '', service: { id: 's-upstash', name: 'Upstash', slug: 'upstash', category: 'database', description: null, description_ko: null, icon_url: null, website_url: null, docs_url: null, pricing_info: {}, required_env_vars: [], created_at: '' } },
      { id: 'ps-2e', project_id: 'demo-2', service_id: 's-sentry', status: 'not_started', notes: null, cost_tier_id: null, custom_cost_monthly: null, custom_cost_yearly: null, cost_notes: null, billing_cycle: 'monthly', created_at: '', updated_at: '', service: { id: 's-sentry', name: 'Sentry', slug: 'sentry', category: 'monitoring', description: null, description_ko: null, icon_url: null, website_url: null, docs_url: null, pricing_info: {}, required_env_vars: [], created_at: '' } },
    ],
  },
  {
    id: 'demo-3',
    user_id: 'demo',
    name: '이커머스 쇼핑몰',
    description: 'AWS 인프라 기반 쇼핑몰',
    icon_type: 'emoji',
    icon_value: '🛒',
    tech_stack: {},
    team_id: null,
    main_service_id: null,
    link_url: null,
    is_favorited: false,
    monthly_budget: null,
    budget_currency: 'USD',
    created_at: new Date(Date.now() - 86400000 * 14).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    project_services: [
      { id: 'ps-3a', project_id: 'demo-3', service_id: 's-aws', status: 'connected', notes: null, cost_tier_id: null, custom_cost_monthly: null, custom_cost_yearly: null, cost_notes: null, billing_cycle: 'usage_based', created_at: '', updated_at: '', service: { id: 's-aws', name: 'AWS', slug: 'aws', category: 'deploy', description: null, description_ko: null, icon_url: null, website_url: null, docs_url: null, pricing_info: {}, required_env_vars: [], created_at: '' } },
      { id: 'ps-3b', project_id: 'demo-3', service_id: 's-stripe', status: 'connected', notes: null, cost_tier_id: null, custom_cost_monthly: null, custom_cost_yearly: null, cost_notes: null, billing_cycle: 'monthly', created_at: '', updated_at: '', service: { id: 's-stripe', name: 'Stripe', slug: 'stripe', category: 'payment', description: null, description_ko: null, icon_url: null, website_url: null, docs_url: null, pricing_info: {}, required_env_vars: [], created_at: '' } },
      { id: 'ps-3c', project_id: 'demo-3', service_id: 's-cloudflare', status: 'connected', notes: null, cost_tier_id: null, custom_cost_monthly: null, custom_cost_yearly: null, cost_notes: null, billing_cycle: 'monthly', created_at: '', updated_at: '', service: { id: 's-cloudflare', name: 'Cloudflare', slug: 'cloudflare', category: 'cdn', description: null, description_ko: null, icon_url: null, website_url: null, docs_url: null, pricing_info: {}, required_env_vars: [], created_at: '' } },
      { id: 'ps-3d', project_id: 'demo-3', service_id: 's-sendgrid', status: 'error', notes: null, cost_tier_id: null, custom_cost_monthly: null, custom_cost_yearly: null, cost_notes: null, billing_cycle: 'monthly', created_at: '', updated_at: '', service: { id: 's-sendgrid', name: 'SendGrid', slug: 'sendgrid', category: 'email', description: null, description_ko: null, icon_url: null, website_url: null, docs_url: null, pricing_info: {}, required_env_vars: [], created_at: '' } },
    ],
  },
  {
    id: 'demo-4',
    user_id: 'demo',
    name: '개인 포트폴리오',
    description: 'GitHub Pages + CDN 정적 사이트',
    icon_type: 'emoji',
    icon_value: '💼',
    tech_stack: {},
    team_id: null,
    main_service_id: null,
    link_url: null,
    is_favorited: false,
    monthly_budget: null,
    budget_currency: 'USD',
    created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    project_services: [
      { id: 'ps-4a', project_id: 'demo-4', service_id: 's-github', status: 'connected', notes: null, cost_tier_id: null, custom_cost_monthly: null, custom_cost_yearly: null, cost_notes: null, billing_cycle: 'monthly', created_at: '', updated_at: '', service: { id: 's-github', name: 'GitHub', slug: 'github', category: 'cicd', description: null, description_ko: null, icon_url: null, website_url: null, docs_url: null, pricing_info: {}, required_env_vars: [], created_at: '' } },
      { id: 'ps-4b', project_id: 'demo-4', service_id: 's-cloudflare2', status: 'connected', notes: null, cost_tier_id: null, custom_cost_monthly: null, custom_cost_yearly: null, cost_notes: null, billing_cycle: 'monthly', created_at: '', updated_at: '', service: { id: 's-cloudflare2', name: 'Cloudflare', slug: 'cloudflare', category: 'cdn', description: null, description_ko: null, icon_url: null, website_url: null, docs_url: null, pricing_info: {}, required_env_vars: [], created_at: '' } },
      { id: 'ps-4c', project_id: 'demo-4', service_id: 's-analytics', status: 'in_progress', notes: null, cost_tier_id: null, custom_cost_monthly: null, custom_cost_yearly: null, cost_notes: null, billing_cycle: 'monthly', created_at: '', updated_at: '', service: { id: 's-analytics', name: 'Google Analytics', slug: 'google-analytics', category: 'analytics', description: null, description_ko: null, icon_url: null, website_url: null, docs_url: null, pricing_info: {}, required_env_vars: [], created_at: '' } },
    ],
  },
];

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

  // 미로그인 사용자: 샘플 계정의 프로젝트 가져오기 (없으면 fallback 사용)
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
      }
    } catch {
      previewProjects = [];
    }
    // DB 데이터 없으면 하드코딩 샘플 사용
    if (previewProjects.length === 0) {
      previewProjects = FALLBACK_SAMPLE_PROJECTS;
    }
    isDemo = true;
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
