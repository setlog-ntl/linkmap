import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PricingContent } from './pricing-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generatePricingJsonLd } from '@/lib/seo/json-ld';

export const revalidate = false;

export const metadata: Metadata = {
  title: '요금제 | Linkmap',
  description: 'Linkmap Free와 Pro 요금제를 비교하세요. 무료로 시작하고, Pro로 프로젝트와 환경변수 제한을 확장하세요.',
  keywords: ['Linkmap 요금제', '가격', 'Pro 플랜', '무료', 'API 키 관리'],
  alternates: { canonical: 'https://www.linkmap.biz/pricing' },
};

export default function PricingPage() {
  const pricingJsonLd = generatePricingJsonLd();

  return (
    <div className="min-h-screen flex flex-col">
      <JsonLdScript data={pricingJsonLd} />
      <Header profile={null} />
      <main className="flex-1 container py-16">
        <PricingContent />
      </main>
      <Footer />
    </div>
  );
}
