export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BackendGuide } from '@/components/guides/backend-guide';
import type { Profile } from '@/types';

export const metadata: Metadata = {
  title: '백엔드란? — 바이브 코더 가이드 | Linkmap',
  description:
    '사용자 눈에는 보이지 않지만 앱을 돌아가게 하는 서버·API·데이터베이스 개념을 초보자 눈높이로 설명합니다.',
  keywords: ['백엔드', 'API', '데이터베이스', 'REST', 'Supabase', 'Firebase', 'BaaS', '서버', '초보자'],
};

export default async function BackendGuidePage() {
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
        <BackendGuide />
      </main>
      <Footer />
    </div>
  );
}
