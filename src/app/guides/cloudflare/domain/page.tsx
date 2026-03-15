import type { Metadata } from 'next';
import { CloudflareDomainGuide } from '@/components/guides/cloudflare-guide/domain-guide';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: 'Cloudflare 계정 생성 + 도메인 연결 가이드 | Linkmap',
  description:
    'Cloudflare에 가입하고 구매한 도메인을 연결하는 방법입니다. 네임서버 변경, SSL 자동 설정, DDoS 보호를 무료로 사용하세요.',
  keywords: ['Cloudflare', '도메인 연결', '네임서버', 'SSL', 'DNS', 'HTTPS', 'DDoS 보호'],
};

export default function CloudflareDomainPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'cloudflare/domain',
    title: 'Cloudflare 계정 생성 + 도메인 연결 가이드',
    description: 'Cloudflare에 가입하고 구매한 도메인을 연결하는 방법. 네임서버 변경, SSL, DDoS 보호 설정.',
    faqs: [
      { q: '네임서버 변경 후 얼마나 기다려야 하나요?', a: '보통 수 분에서 최대 48시간이 걸립니다. Cloudflare 대시보드에서 Active 상태가 되면 완료입니다.' },
      { q: 'SSL을 Flexible로 설정하면 왜 문제가 생기나요?', a: 'Flexible 모드에서 서버가 HTTPS 리다이렉트를 설정하면 Cloudflare와 서버 간 무한 루프가 발생합니다. Full 이상으로 설정하세요.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <CloudflareDomainGuide />
    </>
  );
}
