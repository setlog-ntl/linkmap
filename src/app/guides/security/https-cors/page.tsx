import type { Metadata } from 'next';
import { HttpsCorsContent } from '@/components/guides/security-guide/https-cors-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: 'HTTPS와 CORS — 보안 기초 가이드 | Linkmap',
  description:
    'SSL 인증서, 동일 출처 정책, CORS 에러 해결법을 초보자 눈높이로 설명합니다.',
  keywords: ['HTTPS', 'SSL', 'TLS', 'CORS', '동일 출처 정책', 'CORS 에러', '보안'],
};

export default function HttpsCorsPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'security/https-cors',
    title: 'HTTPS와 CORS — 보안 기초 가이드',
    description: 'SSL 인증서, 동일 출처 정책, CORS 에러 해결법을 초보자 눈높이로 설명합니다.',
    faqs: [
      { q: 'HTTPS는 왜 필수인가요?', a: 'HTTP는 데이터가 암호화되지 않아 중간에서 도청할 수 있습니다. HTTPS는 SSL/TLS로 암호화하여 비밀번호, 결제 정보 등을 안전하게 전송합니다.' },
      { q: 'CORS 에러는 왜 발생하나요?', a: '브라우저의 보안 정책으로, 내 사이트(origin)와 다른 주소의 API를 호출하면 차단됩니다. 서버에서 Access-Control-Allow-Origin 헤더를 설정하면 해결됩니다.' },
      { q: 'SSL 인증서는 돈이 드나요?', a: "Let's Encrypt를 사용하면 무료입니다. Vercel, Cloudflare는 자동으로 SSL 인증서를 발급해줍니다." },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <HttpsCorsContent />
    </>
  );
}
