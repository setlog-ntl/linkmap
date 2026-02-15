export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AuthGuide } from '@/components/guides/auth-guide';
import type { Profile } from '@/types';

export const metadata: Metadata = {
  title: '인증 가이드 — 두 가지만 알면 됩니다 | Linkmap',
  description:
    'Linkmap의 앱 로그인과 서비스 연동, 두 가지 인증 레이어를 쉽게 이해하세요. 초보자용 시각 가이드.',
  keywords: ['인증', 'OAuth', 'API Key', '로그인', '서비스 연동', '가이드', '초보자', 'Linkmap'],
};

export default async function AuthGuidePage() {
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
        <AuthGuide />
      </main>
      <Footer />
    </div>
  );
}
