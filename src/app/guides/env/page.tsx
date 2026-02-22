export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { EnvGuide } from '@/components/guides/env-guide';
import type { Profile } from '@/types';

export const metadata: Metadata = {
  title: '환경변수 완전 정복 — 바이브 코더 가이드 | Linkmap',
  description:
    'AI가 만든 코드를 배포하려면 꼭 알아야 할 환경변수(.env) 개념을 초보자 눈높이에서 쉽게 설명합니다.',
  keywords: ['환경변수', '.env', 'API Key', 'NEXT_PUBLIC', '배포', '가이드', '초보자', 'Linkmap'],
};

export default async function EnvGuidePage() {
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
      <main className="flex-1 container">
        <EnvGuide />
      </main>
      <Footer />
    </div>
  );
}
