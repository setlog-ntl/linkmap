import type { Metadata } from 'next';
import { CloudflareGuide } from '@/components/guides/cloudflare-guide';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: 'Cloudflare 연결 가이드 | Linkmap',
  description:
    'Cloudflare Workers에 Linkmap을 배포할 때 필요한 계정 설정, 빌드 명령, 환경변수(시크릿) 설정을 단계별로 안내합니다.',
  keywords: ['Cloudflare', 'Workers', '배포', '가이드', 'wrangler', '환경변수', '시크릿', 'Linkmap'],
};

export default function CloudflareGuidePage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'cloudflare',
    title: 'Cloudflare 연결 가이드',
    description: 'Cloudflare Workers에 배포할 때 필요한 계정 설정, 빌드 명령, 환경변수 설정을 단계별로 안내합니다.',
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <CloudflareGuide />
    </>
  );
}
