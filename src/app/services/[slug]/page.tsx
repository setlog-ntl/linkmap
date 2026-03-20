export const revalidate = 86400; // ISR: 24시간마다 재생성 (서비스 카탈로그 변경 빈도 낮음)

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ServiceDetailClient } from '@/components/service/service-detail-client';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateServiceJsonLd } from '@/lib/seo/json-ld';
import type { Service, ServiceGuide, ServiceCostTier, ServiceDependency } from '@/types';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: service } = await supabase
    .from('services')
    .select('name, description, description_ko, category')
    .eq('slug', slug)
    .single();

  if (!service) {
    return { title: '서비스를 찾을 수 없습니다 | Linkmap' };
  }

  const title = `${service.name} — 서비스 상세 | Linkmap`;
  const description = service.description_ko || service.description;

  return {
    title,
    description,
    keywords: [service.name, service.category, '서비스', '환경변수', 'API', 'Linkmap'],
    openGraph: {
      title,
      description,
      type: 'website',
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch service by slug
  const { data: service } = await supabase
    .from('services')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!service) notFound();

  // Parallel fetch related data (auth 제거 — 공개 카탈로그)
  const [
    { data: guide },
    { data: costTiers },
    { data: dependencies },
  ] = await Promise.all([
    supabase
      .from('service_guides')
      .select('*')
      .eq('service_id', service.id)
      .single(),
    supabase
      .from('service_cost_tiers')
      .select('*')
      .eq('service_id', service.id)
      .order('order_index'),
    supabase
      .from('service_dependencies')
      .select('*, depends_on_service:services!service_dependencies_depends_on_service_id_fkey(*)')
      .eq('service_id', service.id),
  ]);

  const typedService = service as Service;
  const serviceJsonLd = generateServiceJsonLd({
    name: typedService.name,
    slug: typedService.slug,
    description: typedService.description_ko ?? typedService.description ?? '',
    category: typedService.category,
    websiteUrl: typedService.website_url ?? undefined,
    pricingInfo: (typedService.pricing_info as Record<string, unknown>) ?? undefined,
    difficultyLevel: typedService.difficulty_level ?? undefined,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <JsonLdScript data={serviceJsonLd} />
      <Header profile={null} />
      <main className="flex-1 container py-8">
        <ServiceDetailClient
          service={typedService}
          guide={(guide as ServiceGuide) || null}
          costTiers={(costTiers as ServiceCostTier[]) || []}
          dependencies={(dependencies as (ServiceDependency & { depends_on_service: Service })[]) || []}
        />
      </main>
      <Footer />
    </div>
  );
}
