import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export const revalidate = false;

export default function GlossaryLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header profile={null} />
      <main className="flex-1 container px-4 sm:px-6 py-10 md:py-14 max-w-5xl mx-auto w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}
