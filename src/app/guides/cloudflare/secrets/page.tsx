import type { Metadata } from 'next';
import { CloudflareSecretsGuide } from '@/components/guides/cloudflare-guide/secrets-guide';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: 'Cloudflare Workers 환경변수 + 시크릿 관리 | Linkmap',
  description:
    'Cloudflare Workers에서 API 키와 민감 정보를 안전하게 관리하는 방법. wrangler secret put, KV 네임스페이스 사용법.',
  keywords: ['Cloudflare Workers', 'wrangler secret', 'KV Storage', '환경변수', '시크릿 관리', '보안'],
};

export const revalidate = false;

export default function CloudflareSecretsPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'cloudflare/secrets',
    title: 'Cloudflare Workers 환경변수 + 시크릿 관리',
    description: 'Cloudflare Workers에서 API 키와 민감 정보를 안전하게 관리하는 방법. wrangler secret, KV 네임스페이스.',
    faqs: [
      { q: 'wrangler secret list에서 등록한 시크릿 값을 볼 수 있나요?', a: '아니요. 시크릿은 등록 후 값을 다시 확인할 수 없습니다. 키 이름만 확인 가능합니다.' },
      { q: 'KV 읽기는 빠른데 쓰기는 왜 느린가요?', a: 'Workers KV는 읽기에 최적화된 Eventually Consistent 스토리지입니다. 쓰기 후 전 세계 전파에 최대 60초가 걸릴 수 있습니다.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <CloudflareSecretsGuide />
    </>
  );
}
