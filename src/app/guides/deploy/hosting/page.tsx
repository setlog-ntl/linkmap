import type { Metadata } from 'next';
import { HostingContent } from '@/components/guides/deploy-guide/hosting-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: '서버와 호스팅 — 정적·동적·서버리스·CDN 비교 | Linkmap',
  description:
    '정적 호스팅, 동적 호스팅, 서버리스, CDN의 차이와 Vercel·Cloudflare·Railway 등 플랫폼 선택 기준을 설명합니다.',
  keywords: ['서버', '호스팅', 'CDN', '서버리스', 'Vercel', 'Cloudflare', 'Railway', '정적 호스팅', '배포'],
};

export const revalidate = false;

export default function HostingPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'deploy/hosting',
    title: '서버와 호스팅 — 정적·동적·서버리스·CDN 비교',
    description: '정적/동적 호스팅, 서버리스, CDN의 차이와 플랫폼 선택 기준.',
    faqs: [
      { q: 'Next.js 앱은 어디에 배포해야 하나요?', a: 'Vercel이 가장 쉽고 최적화되어 있습니다. Cloudflare Pages + Workers도 좋은 선택입니다. 두 플랫폼 모두 무료 플랜이 충분합니다.' },
      { q: 'CDN이 없으면 어떻게 되나요?', a: '서울 사용자가 미국 서버에 직접 요청해야 해서 200ms 이상의 지연이 발생합니다. Vercel, Cloudflare는 기본으로 CDN을 제공합니다.' },
      { q: '정적 호스팅과 동적 호스팅의 차이는?', a: '정적 호스팅은 미리 만든 HTML 파일을 그대로 전달합니다. 동적 호스팅은 요청이 올 때마다 서버에서 HTML을 생성합니다.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <HostingContent />
    </>
  );
}
