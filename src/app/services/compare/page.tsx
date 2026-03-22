export const revalidate = 86400; // ISR: 24시간마다 재생성 (비교 데이터 변경 빈도 낮음)

import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CompareClient } from '@/components/service/compare-client';
import { generateItemListJsonLd } from '@/lib/seo/json-ld';
import type { ServiceComparison, Service } from '@/types';

export const metadata: Metadata = {
  title: '서비스 비교 — Supabase vs Firebase, Vercel vs Netlify | Linkmap',
  description:
    '같은 카테고리의 서비스를 한눈에 비교하세요. 가격, 무료 플랜, 난이도, 기능별 차이를 확인할 수 있습니다.',
  keywords: ['서비스 비교', 'Supabase vs Firebase', 'Vercel vs Netlify', '무료 플랜 비교', 'BaaS 비교', 'Linkmap'],
  alternates: { canonical: 'https://www.linkmap.biz/services/compare' },
};

export default async function ComparePage() {
  const supabase = await createClient();

  const [{ data: comparisons }, { data: services }] = await Promise.all([
    supabase.from('service_comparisons').select('*').order('category'),
    supabase.from('services').select('id, name, slug').order('name'),
  ]);

  const comparisonList = (comparisons as ServiceComparison[]) || [];

  const jsonLd = comparisonList.length > 0
    ? generateItemListJsonLd(
        comparisonList.map((c) => ({
          name: c.title_ko || c.services.join(' vs '),
          url: `https://www.linkmap.biz/services/compare?category=${c.category}`,
          description: `${c.services.join(' vs ')} 비교 — 가격, 무료 플랜, 난이도, 기능별 차이`,
        }))
      )
    : null;

  return (
    <div className="min-h-screen flex flex-col">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <Header profile={null} />
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">서비스 비교</h1>
          <p className="text-muted-foreground mt-1">
            같은 카테고리의 서비스들을 비교하고 적합한 서비스를 선택하세요
          </p>
        </div>
        <CompareClient
          comparisons={comparisonList}
          services={(services as Pick<Service, 'id' | 'name' | 'slug'>[]) || []}
        />
      </main>
      <Footer />
    </div>
  );
}
