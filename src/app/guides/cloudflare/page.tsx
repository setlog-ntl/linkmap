export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CloudflareGuide } from '@/components/guides/cloudflare-guide';
import type { Profile } from '@/types';

export const metadata: Metadata = {
  title: 'Cloudflare 연결 가이드 | Linkmap',
  description:
    'Cloudflare Workers에 Linkmap을 배포할 때 필요한 계정 설정, 빌드 명령, 환경변수(시크릿) 설정을 단계별로 안내합니다.',
  keywords: ['Cloudflare', 'Workers', '배포', '가이드', 'wrangler', '환경변수', '시크릿', 'Linkmap'],
};

export default async function CloudflareGuidePage() {
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
        <CloudflareGuide />
      </main>
      <Footer />
    </div>
  );
}
