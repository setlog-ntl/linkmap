import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function GuidesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header profile={null} />
      <main className="flex-1 container">
        {children}
      </main>
      <Footer />
    </div>
  );
}
