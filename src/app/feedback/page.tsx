import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { FeedbackBoard } from '@/components/feedback/FeedbackBoard';

export default function FeedbackPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header profile={null} />
      <main className="flex-1 container max-w-3xl mx-auto px-4 py-10">
        <FeedbackBoard isLoggedIn={false} />
      </main>
      <Footer />
    </div>
  );
}
