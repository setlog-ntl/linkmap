import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGlossaryJsonLd } from '@/lib/seo/json-ld';
import { GLOSSARY_DATA, GLOSSARY_CATEGORIES } from '@/data/seo/glossary-data';

export const revalidate = false;

export const metadata: Metadata = {
  title: '바이브 코딩 용어집 — 환경변수, API, OAuth, BaaS 40+ 용어 | Linkmap',
  description:
    '바이브 코딩에 필요한 개발 용어를 한눈에. 환경변수, API 키, OAuth, JWT, RLS, BaaS, CI/CD, SSR/SSG 등 40+ 용어를 한/영 정의로 쉽게 설명합니다.',
  keywords: [
    '개발 용어집',
    '바이브 코딩 용어',
    '환경변수란',
    'OAuth란',
    'JWT란',
    'BaaS란',
    'API란',
    'Linkmap',
  ],
  alternates: { canonical: 'https://www.linkmap.biz/glossary' },
};

export default function GlossaryPage() {
  const glossaryJsonLd = generateGlossaryJsonLd(
    GLOSSARY_DATA.map((t) => ({ term: t.term, definition: t.definition }))
  );

  const categories = Object.entries(GLOSSARY_CATEGORIES);

  return (
    <div className="min-h-screen flex flex-col">
      <JsonLdScript data={glossaryJsonLd} />
      <Header profile={null} />
      <main className="flex-1 container px-4 sm:px-6 py-12 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">바이브 코딩 용어집</h1>
        <p className="text-muted-foreground mb-10">
          바이브 코딩과 웹 개발에 자주 등장하는 용어를 한/영 정의로 쉽게 설명합니다.
        </p>

        {categories.map(([key, label]) => {
          const terms = GLOSSARY_DATA.filter((t) => t.category === key);
          if (terms.length === 0) return null;
          return (
            <section key={key} className="mb-10">
              <h2 className="text-xl font-semibold mb-4 text-brand-blue">{label}</h2>
              <div className="grid gap-3">
                {terms.map((t, i) => (
                  <div key={i} className="rounded-lg border bg-card p-4">
                    <div className="flex items-baseline gap-2 mb-1">
                      <h3 className="font-semibold text-base">{t.term}</h3>
                      <span className="text-xs text-muted-foreground">{t.termEn}</span>
                    </div>
                    <p className="text-sm text-foreground/90 leading-relaxed mb-1">{t.definition}</p>
                    <p className="text-xs text-muted-foreground italic">{t.definitionEn}</p>
                  </div>
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
