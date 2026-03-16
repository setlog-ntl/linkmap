import type { Metadata } from 'next';
import { DomainGuide } from '@/components/guides/domain-guide';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: '도메인 완전 정복 — 바이브 코더 가이드 | Linkmap',
  description:
    '도메인이란 무엇인지, URL 구조, TLD 종류, 도메인 구매처 비교까지 — 내 사이트 주소를 만들고 연결하는 방법을 초보자 눈높이로 설명합니다.',
  keywords: ['도메인', 'URL', 'TLD', '도메인 구매', '가비아', 'Cloudflare', 'Namecheap', '서브도메인', '초보자'],
};

export default function DomainGuidePage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'domain',
    title: '도메인 완전 정복 — 바이브 코더 가이드',
    description: '도메인 기초, URL 구조, TLD 종류, 도메인 구매처 비교를 초보자 눈높이로 설명합니다.',
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <DomainGuide />
    </>
  );
}
