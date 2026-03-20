import type { Metadata } from 'next';
import { CdnContent } from '@/components/guides/server-guide/cdn-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: 'CDN과 엣지 서버 — 전 세계를 빠르게 | Linkmap',
  description:
    'CDN(Content Delivery Network)의 동작 원리, 엣지 컴퓨팅 개념, Cloudflare·Vercel·AWS CloudFront 비교를 초보자 눈높이로 설명합니다.',
  keywords: [
    'CDN',
    'Content Delivery Network',
    '엣지 서버',
    '엣지 컴퓨팅',
    'Cloudflare',
    'CloudFront',
    'Vercel Edge',
    'Cloudflare Workers',
    '캐시',
    '콘텐츠 전송 네트워크',
  ],
};

export const revalidate = false;

export default function CdnPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'server/cdn',
    title: 'CDN과 엣지 서버 — 전 세계를 빠르게',
    description:
      'CDN의 동작 원리, 엣지 컴퓨팅 개념, 주요 CDN 제공자 비교를 설명합니다.',
    faqs: [
      {
        q: 'CDN을 쓰면 항상 빨라지나요?',
        a: '정적 파일은 거의 항상 빨라집니다. 실시간 데이터는 CDN 캐싱의 효과가 적으며, 이 경우 엣지 컴퓨팅이나 WebSocket을 사용합니다.',
      },
      {
        q: 'CDN 비용이 비싸지 않나요?',
        a: 'Cloudflare는 무료 플랜에서도 CDN 대역폭이 무제한입니다. Vercel, Netlify도 무료 플랜에 CDN이 포함되어 있어 추가 비용이 없습니다.',
      },
      {
        q: '엣지 서버리스와 일반 서버리스의 차이는?',
        a: '일반 서버리스는 특정 리전에서만 실행됩니다. 엣지 서버리스는 전 세계 300+ 위치에서 실행되어 어디서든 빠르지만, 실행 시간/메모리 제한이 더 엄격합니다.',
      },
      {
        q: 'Next.js를 쓰면 CDN이 자동으로 적용되나요?',
        a: 'Vercel이나 Cloudflare Pages에 배포하면 정적 자원에 CDN이 자동 적용됩니다. 별도 설정 없이 전 세계 사용자에게 빠르게 전달됩니다.',
      },
      {
        q: '캐시(Cache)란 무엇인가요?',
        a: '자주 요청되는 데이터를 임시 저장해두는 것입니다. CDN 엣지 서버에 파일을 캐싱하면 원본 서버까지 가지 않고 엣지에서 바로 응답할 수 있습니다.',
      },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <CdnContent />
    </>
  );
}
