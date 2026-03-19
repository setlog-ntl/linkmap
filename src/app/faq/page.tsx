import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateFaqJsonLd } from '@/lib/seo/json-ld';
import { FAQ_DATA, FAQ_CATEGORIES } from '@/data/seo/faq-data';

export const metadata: Metadata = {
  title: '자주 묻는 질문 (FAQ) — 바이브 코딩, 환경변수, 배포 | Linkmap',
  description:
    '바이브 코딩이란? 환경변수란? API 키를 안전하게 관리하는 방법은? 무료로 홈페이지 만드는 방법까지, Linkmap에 대한 모든 질문과 답변.',
  keywords: [
    '바이브 코딩이란',
    '환경변수란',
    'API 키 관리',
    '무료 홈페이지',
    'FAQ',
    'Linkmap',
    'Supabase vs Firebase',
  ],
};

export default function FaqPage() {
  const faqJsonLd = generateFaqJsonLd(
    FAQ_DATA.map((f) => ({ question: f.question, answer: f.answer }))
  );

  const categories = Object.entries(FAQ_CATEGORIES);

  return (
    <div className="min-h-screen flex flex-col">
      <JsonLdScript data={faqJsonLd} />
      <Header profile={null} />
      <main className="flex-1 container py-12 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">자주 묻는 질문</h1>
        <p className="text-muted-foreground mb-10">
          바이브 코딩, 환경변수, 배포, 보안에 대해 궁금한 점을 찾아보세요.
        </p>

        {categories.map(([key, label]) => {
          const items = FAQ_DATA.filter((f) => f.category === key);
          if (items.length === 0) return null;
          return (
            <section key={key} className="mb-10">
              <h2 className="text-xl font-semibold mb-4 text-brand-blue">{label}</h2>
              <div className="space-y-4">
                {items.map((faq, i) => (
                  <details key={i} className="group rounded-lg border bg-card p-4">
                    <summary className="cursor-pointer font-medium list-none flex items-center justify-between">
                      {faq.question}
                      <span className="ml-2 text-muted-foreground group-open:rotate-180 transition-transform">&#9662;</span>
                    </summary>
                    <p className="mt-3 text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          );
        })}
      </main>
      <Footer />
    </div>
  );
}
