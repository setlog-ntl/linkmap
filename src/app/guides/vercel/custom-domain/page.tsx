import type { Metadata } from 'next';
import { VercelCustomDomainGuide } from '@/components/guides/vercel-guide/custom-domain-guide';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: 'Vercel 커스텀 도메인 연결 가이드 | Linkmap',
  description:
    'Vercel에 커스텀 도메인을 연결하고 DNS(A/CNAME 레코드)를 설정하는 방법. 자동 SSL 발급과 www 리다이렉트 설정 포함.',
  keywords: ['Vercel 도메인', 'DNS 설정', 'A 레코드', 'CNAME', 'SSL 인증서', 'www 리다이렉트', '커스텀 도메인'],
};

export default function VercelCustomDomainPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'vercel/custom-domain',
    title: 'Vercel 커스텀 도메인 연결 가이드',
    description: 'Vercel에 커스텀 도메인을 연결하고 DNS 설정하는 방법. 자동 SSL 발급과 www 리다이렉트.',
    faqs: [
      { q: 'DNS 레코드를 추가했는데 Vercel에서 Invalid Configuration이라고 해요', a: 'DNS 전파에 시간이 걸립니다. 최대 48시간 기다리거나 nslookup 명령으로 전파 상태를 확인하세요.' },
      { q: '커스텀 도메인 연결 후 Supabase 로그인이 안 돼요', a: 'Supabase Authentication → URL Configuration에서 Site URL과 Redirect URLs를 새 도메인으로 업데이트해야 합니다.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <VercelCustomDomainGuide />
    </>
  );
}
