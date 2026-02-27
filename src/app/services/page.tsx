import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '서비스 카탈로그 | Linkmap',
  description: '바이브 코딩에 필요한 인증, 데이터베이스, 배포, AI 등 서비스를 비교하고 프로젝트에 연결하세요.',
  keywords: ['서비스 카탈로그', 'API 서비스', 'Supabase', 'Stripe', 'Vercel', '바이브 코딩'],
};

import { createClient } from '@/lib/supabase/server';
import { ServiceCatalogClient } from '@/components/service/service-catalog-client';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import type { Profile, Service, ServiceDomainRecord } from '@/types';

export default async function ServicesPage() {
  let profile: Profile | null = null;
  let services: Service[] = [];
  let domains: ServiceDomainRecord[] = [];
  let usedServiceIds: string[] = [];
  let guideServiceIds: string[] = [];
  let guideApiKeyMap: Record<string, { url: string; label: string | null }> = {};
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      profile = profileData ?? null;
      // 사용자 프로젝트에서 사용 중인 서비스 ID 조회
      const { data: projectsData } = await supabase.from('projects').select('id').eq('user_id', user.id);
      const projectIds = (projectsData ?? []).map((p: { id: string }) => p.id);
      if (projectIds.length > 0) {
        const { data: projectServicesData } = await supabase
          .from('project_services')
          .select('service_id')
          .in('project_id', projectIds);
        usedServiceIds = [...new Set((projectServicesData ?? []).map((ps: { service_id: string }) => ps.service_id))];
      }
    }
    const [servicesRes, domainsRes, guidesRes] = await Promise.all([
      supabase.from('services').select('*').order('name'),
      supabase.from('service_domains').select('*').order('order_index'),
      supabase.from('service_guides').select('service_id, api_key_url, api_key_url_label'),
    ]);
    services = (servicesRes.data ?? []) as Service[];
    domains = (domainsRes.data ?? []) as ServiceDomainRecord[];
    const guidesData = (guidesRes.data ?? []) as { service_id: string; api_key_url: string | null; api_key_url_label: string | null }[];
    guideServiceIds = guidesData.map((g) => g.service_id);
    guideApiKeyMap = Object.fromEntries(
      guidesData
        .filter((g) => g.api_key_url)
        .map((g) => [g.service_id, { url: g.api_key_url!, label: g.api_key_url_label }])
    );
  } catch {
    profile = null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header profile={profile} />
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">서비스 카탈로그</h1>
          <p className="text-muted-foreground mt-1">
            내 프로젝트에 필요한 서비스를 쉽게 찾아 연결하세요
          </p>
        </div>
        <ServiceCatalogClient services={services} domains={domains} usedServiceIds={usedServiceIds} guideServiceIds={guideServiceIds} guideApiKeyMap={guideApiKeyMap} />
      </main>
      <Footer />
    </div>
  );
}
