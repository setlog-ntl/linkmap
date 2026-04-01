export const revalidate = false;

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { FeedbackDetail } from '@/components/feedback/FeedbackDetail';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function FeedbackDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen flex flex-col">
      <Header profile={null} />
      <main className="flex-1 container max-w-3xl mx-auto px-4 py-10">
        <FeedbackDetail
          id={id}
          isLoggedIn={false}
          isAdmin={false}
          currentUserId={null}
        />
      </main>
      <Footer />
    </div>
  );
}
