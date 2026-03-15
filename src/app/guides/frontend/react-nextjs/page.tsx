import type { Metadata } from 'next';
import { ReactNextjsContent } from '@/components/guides/frontend-guide/react-nextjs-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: 'React / Next.js 기초 — 컴포넌트·Props·State | Linkmap',
  description:
    'React의 핵심 개념(컴포넌트, Props, State, useEffect)과 Next.js App Router(파일 기반 라우팅, 서버/클라이언트 컴포넌트)를 초보자 눈높이로 설명합니다.',
  keywords: ['React', 'Next.js', 'App Router', '컴포넌트', 'Props', 'State', 'useEffect', '서버 컴포넌트', '초보자'],
};

export default function ReactNextjsPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'frontend/react-nextjs',
    title: 'React / Next.js 기초',
    description: 'React 컴포넌트, Props, State와 Next.js App Router의 핵심 개념 설명.',
    faqs: [
      { q: 'React와 Next.js의 차이가 뭔가요?', a: 'React는 UI를 만드는 라이브러리고, Next.js는 React를 기반으로 라우팅·SSR·SSG·API Routes 등을 추가한 풀스택 프레임워크입니다.' },
      { q: "'use client'는 언제 추가하나요?", a: "useState, useEffect, onClick 등 브라우저 기능을 사용할 때 파일 첫 줄에 추가합니다. 없으면 서버 컴포넌트로 동작합니다." },
      { q: 'Props와 State의 차이가 뭔가요?', a: 'Props는 부모 컴포넌트에서 전달받는 읽기 전용 데이터고, State는 컴포넌트 내부에서 변할 수 있는 데이터입니다.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <ReactNextjsContent />
    </>
  );
}
