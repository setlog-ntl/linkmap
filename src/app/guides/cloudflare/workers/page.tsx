import type { Metadata } from 'next';
import { CloudflareWorkersGuide } from '@/components/guides/cloudflare-guide/workers-guide';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: 'Cloudflare Workers 배포 설정 가이드 | Linkmap',
  description:
    'Wrangler CLI로 Next.js를 Cloudflare Workers에 배포하는 방법. wrangler.toml 설정, @opennextjs/cloudflare 사용법 포함.',
  keywords: ['Cloudflare Workers', 'Wrangler', 'Next.js 배포', 'wrangler.toml', 'opennextjs', '서버리스'],
};

export const revalidate = false;

export default function CloudflareWorkersPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'cloudflare/workers',
    title: 'Cloudflare Workers 배포 설정 가이드',
    description: 'Wrangler CLI로 Next.js를 Cloudflare Workers에 배포하는 방법. wrangler.toml 설정, @opennextjs/cloudflare 사용법.',
    faqs: [
      { q: 'Windows에서 npm run build:cf가 실패해요', a: 'Cloudflare Workers 빌드는 콜론(:)이 포함된 파일명을 생성하므로 Windows NTFS에서 실패합니다. WSL(Windows Subsystem for Linux)에서 실행하세요.' },
      { q: 'wrangler deploy 후 변경이 반영되지 않아요', a: 'Workers는 CDN에 캐시됩니다. 배포 후 수 초~수 분 대기하거나 브라우저 캐시를 지우세요.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <CloudflareWorkersGuide />
    </>
  );
}
