export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CompareClient } from '@/components/service/compare-client';
import type { Profile, ServiceComparison, Service } from '@/types';

export const metadata: Metadata = {
  title: '서비스 비교 — Supabase vs Firebase, Vercel vs Netlify | Linkmap',
  description:
    '같은 카테고리의 서비스를 한눈에 비교하세요. 가격, 무료 플랜, 난이도, 기능별 차이를 확인할 수 있습니다.',
  keywords: ['서비스 비교', 'Supabase vs Firebase', 'Vercel vs Netlify', '무료 플랜 비교', 'BaaS 비교', 'Linkmap'],
};

export default async function ComparePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile: Profile | null = null;
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    profile = data;
  }

  const [{ data: comparisons }, { data: services }] = await Promise.all([
    supabase.from('service_comparisons').select('*').order('category'),
    supabase.from('services').select('id, name, slug').order('name'),
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header profile={profile} />
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">서비스 비교</h1>
          <p className="text-muted-foreground mt-1">
            같은 카테고리의 서비스들을 비교하고 적합한 서비스를 선택하세요
          </p>
        </div>
        <CompareClient
          comparisons={(comparisons as ServiceComparison[]) || []}
          services={(services as Pick<Service, 'id' | 'name' | 'slug'>[]) || []}
        />
      </main>
      <Footer />
    </div>
  );
}
