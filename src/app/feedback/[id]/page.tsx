export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/admin';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { FeedbackDetail } from '@/components/feedback/FeedbackDetail';
import type { Profile } from '@/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function FeedbackDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile: Profile | null = null;
  let admin = false;

  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    profile = data;
    admin = await isAdmin(user.id);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header profile={profile} />
      <main className="flex-1 container max-w-3xl mx-auto px-4 py-10">
        <FeedbackDetail
          id={id}
          isLoggedIn={!!user}
          isAdmin={admin}
          currentUserId={user?.id ?? null}
        />
      </main>
      <Footer />
    </div>
  );
}
