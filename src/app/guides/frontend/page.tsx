export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { FrontendGuide } from '@/components/guides/frontend-guide';
import type { Profile } from '@/types';

export const metadata: Metadata = {
  title: '프론트엔드란? — 바이브 코더 가이드 | Linkmap',
  description:
    '브라우저에서 실행되는 모든 것 — HTML·CSS·JavaScript부터 React·Next.js까지 초보자 눈높이로 설명합니다.',
  keywords: ['프론트엔드', 'HTML', 'CSS', 'JavaScript', 'React', '컴포넌트', 'CSR', 'SSR', '초보자'],
};

export default async function FrontendGuidePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let profile: Profile | null = null;
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    profile = data;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header profile={profile} />
      <main className="flex-1 container">
        <FrontendGuide />
      </main>
      <Footer />
    </div>
  );
}
