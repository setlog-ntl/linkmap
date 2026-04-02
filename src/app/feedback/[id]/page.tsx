export const revalidate = false;

import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { FeedbackDetail } from '@/components/feedback/FeedbackDetail';
import type { Profile } from '@/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function FeedbackDetailPage({ params }: PageProps) {
  const { id } = await params;

  let profile: Profile | null = null;
  let isLoggedIn = false;
  let isAdmin = false;
  let currentUserId: string | null = null;

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      isLoggedIn = true;
      currentUserId = user.id;
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      profile = data ?? null;
      isAdmin = profile?.is_admin ?? false;
    }
  } catch {
    // 인증 확인 실패는 비치명적
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header profile={profile} />
      <main className="flex-1 container max-w-3xl mx-auto px-4 py-10">
        <FeedbackDetail
          id={id}
          isLoggedIn={isLoggedIn}
          isAdmin={isAdmin}
          currentUserId={currentUserId}
        />
      </main>
      <Footer />
    </div>
  );
}
