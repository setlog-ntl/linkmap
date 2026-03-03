import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '요금제 | Linkmap',
  description: 'Linkmap Free와 Pro 요금제를 비교하세요. 무료로 시작하고, Pro로 프로젝트와 환경변수 제한을 확장하세요.',
  keywords: ['Linkmap 요금제', '가격', 'Pro 플랜', '무료', 'API 키 관리'],
};

import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PricingContent } from './pricing-content';
import type { Profile } from '@/types';

export default async function PricingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let profile: Profile | null = null;
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    profile = data;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header profile={profile} />
      <main className="flex-1 container py-16">
        <PricingContent />
      </main>
      <Footer />
    </div>
  );
}
