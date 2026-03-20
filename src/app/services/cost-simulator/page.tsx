import type { Metadata } from 'next';

export const revalidate = 86400; // ISR: 24시간 캐시 (비용 데이터 변경 빈도 낮음)

export const metadata: Metadata = {
  title: '비용 시뮬레이터 | Linkmap',
  description: '서비스 조합별 월간 비용을 시뮬레이션하세요. 무료 스택 조합을 한눈에 확인할 수 있습니다.',
  keywords: ['비용 시뮬레이터', '스택 비용 계산기', 'SaaS 비용', '무료 스택'],
};

import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CostSimulatorClient } from '@/components/service/cost-simulator-client';
import type { Service, ServiceCostTier } from '@/types';

export default async function CostSimulatorPage() {
  let services: Service[] = [];
  let costTiers: ServiceCostTier[] = [];

  try {
    const supabase = await createClient();
    const [servicesRes, tiersRes] = await Promise.all([
      supabase
        .from('services')
        .select('*')
        .eq('is_custom', false)
        .order('name'),
      supabase
        .from('service_cost_tiers')
        .select('*')
        .order('order_index'),
    ]);

    services = (servicesRes.data ?? []) as Service[];
    costTiers = (tiersRes.data ?? []) as ServiceCostTier[];
  } catch {
    // fallback: empty data
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header profile={null} />
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">비용 시뮬레이터</h1>
          <p className="text-muted-foreground mt-1">
            서비스를 선택하고 요금제를 비교해 최적의 스택을 찾아보세요
          </p>
        </div>
        <CostSimulatorClient services={services} costTiers={costTiers} />
      </main>
      <Footer />
    </div>
  );
}
