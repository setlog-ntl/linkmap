import type { Metadata } from 'next';
import { SecurityGuide } from '@/components/guides/security-guide';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: '보안 기초 가이드 — 바이브 코더 가이드 | Linkmap',
  description:
    'AI로 코딩할 때 놓치기 쉬운 보안 기초. 시크릿 관리, 웹 취약점, HTTPS·CORS를 초보자 눈높이로 설명합니다.',
  keywords: ['웹 보안', '시크릿 관리', 'XSS', 'CSRF', 'CORS', 'HTTPS', '환경변수 보안', '초보자'],
};

export default function SecurityGuidePage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'security',
    title: '보안 기초 가이드 — 바이브 코더 가이드',
    description: 'AI로 코딩할 때 놓치기 쉬운 보안 기초. 시크릿 관리, 웹 취약점, HTTPS·CORS를 초보자 눈높이로 설명합니다.',
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <SecurityGuide />
    </>
  );
}
