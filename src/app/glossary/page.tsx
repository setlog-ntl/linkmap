import type { Metadata } from 'next';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGlossaryJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo/json-ld';
import { GlossaryBrowser } from '@/components/glossary/glossary-browser';
import { GLOSSARY_ENTRIES } from '@/data/seo/glossary-terms';

export const revalidate = false;

export const metadata: Metadata = {
  title: '용어사전 — 바이브 코딩·개발 용어를 비유로 쉽게 | Linkmap',
  description:
    '환경변수, API 키, OAuth, JWT, RLS, BaaS, CI/CD, SSR/SSG 등 바이브 코딩·웹 개발 용어를 초보자도 이해하기 쉽게 비유와 예시로 설명합니다. 검색으로 바로 찾아보세요.',
  keywords: [
    '개발 용어사전',
    '바이브 코딩 용어',
    '환경변수란',
    'API 키란',
    'OAuth란',
    'JWT란',
    'BaaS란',
    '개발 용어집',
    'Linkmap',
  ],
  alternates: { canonical: 'https://www.linkmap.biz/glossary' },
  openGraph: {
    title: '용어사전 — 바이브 코딩·개발 용어를 비유로 쉽게',
    description:
      '바이브 코딩과 웹 개발에 등장하는 용어를 비유와 예시로 쉽게 설명하는 사전. 검색으로 바로 찾아보세요.',
    url: 'https://www.linkmap.biz/glossary',
    type: 'website',
  },
};

export default function GlossaryPage() {
  const glossaryJsonLd = generateGlossaryJsonLd(
    GLOSSARY_ENTRIES.map((t) => ({ term: t.term, definition: t.definition ?? t.oneLiner }))
  );
  const breadcrumb = generateBreadcrumbJsonLd([
    { name: '홈', href: '/' },
    { name: '용어사전', href: '/glossary' },
  ]);

  return (
    <>
      <JsonLdScript data={glossaryJsonLd} />
      <JsonLdScript data={breadcrumb} />

      {/* Hero */}
      <div className="text-center space-y-3 mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">용어사전</h1>
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
          바이브 코딩과 웹 개발에서 만나는 용어를, 코딩을 처음 접하는 분도 이해할 수 있도록{' '}
          {/* 모바일에서는 br이 숨겨지므로 위 줄 끝의 {' '}로 단어 붙음 방지 */}
          <br className="hidden sm:block" />
          비유와 실제 예시로 풀어 설명합니다.
        </p>
      </div>

      <GlossaryBrowser />
    </>
  );
}
