export const dynamic = 'force-dynamic';

import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { DemoProjectGrid } from '@/components/demo/demo-project-grid';
import type { ProjectWithServices } from '@/types';

const DEMO_USER_EMAIL = 'vcdemo@linkmap.site';
const PROJECT_PREVIEW_LIMIT = 12;

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
    is_showcase: false,
    showcase_description: null,
    showcase_tags: [],
    showcase_category: null,
    monthly_budget: null,
    budget_currency: 'USD',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    project_services: [
      { id: 'ps-1z', project_id: 'demo-1', service_id: 's-linkmap', status: 'connected', notes: null, account_identifier: null, cost_tier_id: null, custom_cost_monthly: null, custom_cost_yearly: null, cost_notes: null, billing_cycle: 'monthly', created_at: '', updated_at: '', service: { id: 's-linkmap', name: 'Linkmap', slug: 'linkmap', category: 'monitoring', description: null, description_ko: '서비스 연결 시각화 + 환경변수 관리', icon_url: null, website_url: null, docs_url: null, pricing_info: {}, required_env_vars: [], created_at: '' } },
      { id: 'ps-1a', project_id: 'demo-1', service_id: 's-vercel', status: 'connected', notes: null, account_identifier: null, cost_tier_id: null, custom_cost_monthly: null, custom_cost_yearly: null, cost_notes: null, billing_cycle: 'monthly', created_at: '', updated_at: '', service: { id: 's-vercel', name: 'Vercel', slug: 'vercel', category: 'deploy', description: null, description_ko: null, icon_url: null, website_url: null, docs_url: null, pricing_info: {}, required_env_vars: [], created_at: '' } },
      { id: 'ps-1b', project_id: 'demo-1', service_id: 's-supabase', status: 'connected', notes: null, account_identifier: null, cost_tier_id: null, custom_cost_monthly: null, custom_cost_yearly: null, cost_notes: null, billing_cycle: 'monthly', created_at: '', updated_at: '', service: { id: 's-supabase', name: 'Supabase', slug: 'supabase', category: 'database', description: null, description_ko: null, icon_url: null, website_url: null, docs_url: null, pricing_info: {}, required_env_vars: [], created_at: '' } },
      { id: 'ps-1c', project_id: 'demo-1', service_id: 's-stripe', status: 'connected', notes: null, account_identifier: null, cost_tier_id: null, custom_cost_monthly: null, custom_cost_yearly: null, cost_notes: null, billing_cycle: 'monthly', created_at: '', updated_at: '', service: { id: 's-stripe', name: 'Stripe', slug: 'stripe', category: 'payment', description: null, description_ko: null, icon_url: null, website_url: null, docs_url: null, pricing_info: {}, required_env_vars: [], created_at: '' } },
      { id: 'ps-1d', project_id: 'demo-1', service_id: 's-sendgrid', status: 'in_progress', notes: null, account_identifier: null, cost_tier_id: null, custom_cost_monthly: null, custom_cost_yearly: null, cost_notes: null, billing_cycle: 'monthly', created_at: '', updated_at: '', service: { id: 's-sendgrid', name: 'SendGrid', slug: 'sendgrid', category: 'email', description: null, description_ko: null, icon_url: null, website_url: null, docs_url: null, pricing_info: {}, required_env_vars: [], created_at: '' } },
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
    is_showcase: false,
    showcase_description: null,
    showcase_tags: [],
    showcase_category: null,
    monthly_budget: null,
    budget_currency: 'USD',
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    project_services: [
      { id: 'ps-2a', project_id: 'demo-2', service_id: 's-openai', status: 'connected', notes: null, account_identifier: null, cost_tier_id: null, custom_cost_monthly: null, custom_cost_yearly: null, cost_notes: null, billing_cycle: 'usage_based', created_at: '', updated_at: '', service: { id: 's-openai', name: 'OpenAI', slug: 'openai', category: 'ai', description: null, description_ko: null, icon_url: null, website_url: null, docs_url: null, pricing_info: {}, required_env_vars: [], created_at: '' } },
      { id: 'ps-2b', project_id: 'demo-2', service_id: 's-vercel', status: 'connected', notes: null, account_identifier: null, cost_tier_id: null, custom_cost_monthly: null, custom_cost_yearly: null, cost_notes: null, billing_cycle: 'monthly', created_at: '', updated_at: '', service: { id: 's-vercel', name: 'Vercel', slug: 'vercel', category: 'deploy', description: null, description_ko: null, icon_url: null, website_url: null, docs_url: null, pricing_info: {}, required_env_vars: [], created_at: '' } },
      { id: 'ps-2c', project_id: 'demo-2', service_id: 's-pinecone', status: 'connected', notes: null, account_identifier: null, cost_tier_id: null, custom_cost_monthly: null, custom_cost_yearly: null, cost_notes: null, billing_cycle: 'monthly', created_at: '', updated_at: '', service: { id: 's-pinecone', name: 'Pinecone', slug: 'pinecone', category: 'database', description: null, description_ko: null, icon_url: null, website_url: null, docs_url: null, pricing_info: {}, required_env_vars: [], created_at: '' } },
      { id: 'ps-2d', project_id: 'demo-2', service_id: 's-upstash', status: 'not_started', notes: null, account_identifier: null, cost_tier_id: null, custom_cost_monthly: null, custom_cost_yearly: null, cost_notes: null, billing_cycle: 'monthly', created_at: '', updated_at: '', service: { id: 's-upstash', name: 'Upstash', slug: 'upstash', category: 'database', description: null, description_ko: null, icon_url: null, website_url: null, docs_url: null, pricing_info: {}, required_env_vars: [], created_at: '' } },
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
    is_showcase: false,
    showcase_description: null,
    showcase_tags: [],
    showcase_category: null,
    monthly_budget: null,
    budget_currency: 'USD',
    created_at: new Date(Date.now() - 86400000 * 14).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    project_services: [
      { id: 'ps-3a', project_id: 'demo-3', service_id: 's-aws', status: 'connected', notes: null, account_identifier: null, cost_tier_id: null, custom_cost_monthly: null, custom_cost_yearly: null, cost_notes: null, billing_cycle: 'usage_based', created_at: '', updated_at: '', service: { id: 's-aws', name: 'AWS', slug: 'aws', category: 'deploy', description: null, description_ko: null, icon_url: null, website_url: null, docs_url: null, pricing_info: {}, required_env_vars: [], created_at: '' } },
      { id: 'ps-3b', project_id: 'demo-3', service_id: 's-stripe', status: 'connected', notes: null, account_identifier: null, cost_tier_id: null, custom_cost_monthly: null, custom_cost_yearly: null, cost_notes: null, billing_cycle: 'monthly', created_at: '', updated_at: '', service: { id: 's-stripe', name: 'Stripe', slug: 'stripe', category: 'payment', description: null, description_ko: null, icon_url: null, website_url: null, docs_url: null, pricing_info: {}, required_env_vars: [], created_at: '' } },
      { id: 'ps-3c', project_id: 'demo-3', service_id: 's-cloudflare', status: 'connected', notes: null, account_identifier: null, cost_tier_id: null, custom_cost_monthly: null, custom_cost_yearly: null, cost_notes: null, billing_cycle: 'monthly', created_at: '', updated_at: '', service: { id: 's-cloudflare', name: 'Cloudflare', slug: 'cloudflare', category: 'cdn', description: null, description_ko: null, icon_url: null, website_url: null, docs_url: null, pricing_info: {}, required_env_vars: [], created_at: '' } },
      { id: 'ps-3d', project_id: 'demo-3', service_id: 's-sendgrid', status: 'error', notes: null, account_identifier: null, cost_tier_id: null, custom_cost_monthly: null, custom_cost_yearly: null, cost_notes: null, billing_cycle: 'monthly', created_at: '', updated_at: '', service: { id: 's-sendgrid', name: 'SendGrid', slug: 'sendgrid', category: 'email', description: null, description_ko: null, icon_url: null, website_url: null, docs_url: null, pricing_info: {}, required_env_vars: [], created_at: '' } },
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
    is_showcase: false,
    showcase_description: null,
    showcase_tags: [],
    showcase_category: null,
    monthly_budget: null,
    budget_currency: 'USD',
    created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    project_services: [
      { id: 'ps-4a', project_id: 'demo-4', service_id: 's-github', status: 'connected', notes: null, account_identifier: null, cost_tier_id: null, custom_cost_monthly: null, custom_cost_yearly: null, cost_notes: null, billing_cycle: 'monthly', created_at: '', updated_at: '', service: { id: 's-github', name: 'GitHub', slug: 'github', category: 'cicd', description: null, description_ko: null, icon_url: null, website_url: null, docs_url: null, pricing_info: {}, required_env_vars: [], created_at: '' } },
      { id: 'ps-4b', project_id: 'demo-4', service_id: 's-cloudflare2', status: 'connected', notes: null, account_identifier: null, cost_tier_id: null, custom_cost_monthly: null, custom_cost_yearly: null, cost_notes: null, billing_cycle: 'monthly', created_at: '', updated_at: '', service: { id: 's-cloudflare2', name: 'Cloudflare', slug: 'cloudflare', category: 'cdn', description: null, description_ko: null, icon_url: null, website_url: null, docs_url: null, pricing_info: {}, required_env_vars: [], created_at: '' } },
      { id: 'ps-4c', project_id: 'demo-4', service_id: 's-analytics', status: 'in_progress', notes: null, account_identifier: null, cost_tier_id: null, custom_cost_monthly: null, custom_cost_yearly: null, cost_notes: null, billing_cycle: 'monthly', created_at: '', updated_at: '', service: { id: 's-analytics', name: 'Google Analytics', slug: 'google-analytics', category: 'analytics', description: null, description_ko: null, icon_url: null, website_url: null, docs_url: null, pricing_info: {}, required_env_vars: [], created_at: '' } },
    ],
  },
];

async function fetchDemoProjects(): Promise<ProjectWithServices[]> {
  try {
    const admin = createAdminClient();

    const { data: primaryProfile } = await admin
      .from('profiles')
      .select('id')
      .eq('email', DEMO_USER_EMAIL)
      .single();

    if (primaryProfile) {
      const { data } = await admin
        .from('projects')
        .select('*, project_services!project_services_project_id_fkey(*, service:services(*))')
        .eq('user_id', primaryProfile.id)
        .is('deleted_at', null)
        .order('updated_at', { ascending: false })
        .limit(PROJECT_PREVIEW_LIMIT);
      if (data && data.length > 0) return data as ProjectWithServices[];
    }
  } catch {
    // admin client 실패 시 하드코딩 샘플로 폴백
  }

  return FALLBACK_SAMPLE_PROJECTS;
}

export default async function DemoPage() {
  let isLoggedIn = false;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    isLoggedIn = !!user;
  } catch {
    // 미인증 상태 → 데모 계속 표시
  }

  const demoProjects = await fetchDemoProjects();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header profile={null} />
      <main className="flex-1">
        <DemoProjectGrid projects={demoProjects} isLoggedIn={isLoggedIn} />
      </main>
      <Footer />
    </div>
  );
}
