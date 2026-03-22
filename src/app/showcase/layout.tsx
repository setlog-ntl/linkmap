import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateShowcaseJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: '쇼케이스 — 원클릭 배포 사이트 모음 | Linkmap',
  description:
    'Linkmap 원클릭 배포로 만들어진 실제 사이트를 구경하세요. 링크카드, 디지털 명함, 프리랜서 홍보 페이지 등 다양한 템플릿 예시.',
  keywords: ['쇼케이스', '원클릭 배포', '포트폴리오', '링크카드', '디지털 명함', '프리랜서 홍보'],
  openGraph: {
    title: '쇼케이스 — 원클릭 배포 사이트 모음 | Linkmap',
    description:
      'Linkmap 원클릭 배포로 만들어진 실제 사이트를 구경하세요.',
    url: 'https://www.linkmap.biz/showcase',
  },
  alternates: { canonical: 'https://www.linkmap.biz/showcase' },
};

export default function ShowcaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <JsonLdScript data={generateShowcaseJsonLd()} />
      <Header profile={null} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
