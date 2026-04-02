import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { FeedbackBoard } from '@/components/feedback/FeedbackBoard';
import type { Profile } from '@/types';

export default async function FeedbackPage() {
  let profile: Profile | null = null;
  let isLoggedIn = false;

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      isLoggedIn = true;
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      profile = data ?? null;
    }
  } catch {
    // 인증 확인 실패는 비치명적 — 비로그인 상태로 진행
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header profile={profile} />
      <main className="flex-1 container max-w-3xl mx-auto px-4 py-10">
        <FeedbackBoard isLoggedIn={isLoggedIn} />
      </main>
      <Footer />
    </div>
  );
}
