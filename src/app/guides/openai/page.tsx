export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { OpenAIGuide } from '@/components/guides/openai-guide';
import type { Profile } from '@/types';

export const metadata: Metadata = {
  title: 'OpenAI 연동 가이드 | Linkmap',
  description:
    'GPT-4o, DALL-E, Whisper 등 OpenAI API를 Next.js 프로젝트에 안전하게 연동하는 방법. API 키 보안부터 스트리밍, 비용 관리까지.',
  keywords: ['OpenAI', 'GPT-4o', 'ChatGPT', 'AI API', 'Next.js', '연동', '가이드', 'Linkmap'],
};

export default async function OpenAIGuidePage() {
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
        <OpenAIGuide />
      </main>
      <Footer />
    </div>
  );
}
