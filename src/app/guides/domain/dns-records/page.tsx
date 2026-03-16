import type { Metadata } from 'next';
import { DnsRecordsContent } from '@/components/guides/domain-guide/dns-records-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: 'DNS 레코드 설정 — A, CNAME, TXT, MX 완전 가이드 | Linkmap',
  description:
    'DNS 동작 원리, 레코드 종류(A, AAAA, CNAME, TXT, MX, NS), Vercel·Cloudflare 도메인 연결 방법, TTL 개념까지 초보자용으로 설명합니다.',
  keywords: ['DNS', 'DNS 레코드', 'A 레코드', 'CNAME', 'TXT', 'MX', 'TTL', 'Vercel 도메인', 'Cloudflare DNS', '초보자'],
};

export default function DnsRecordsPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'domain/dns-records',
    title: 'DNS 레코드 설정 — A, CNAME, TXT, MX 완전 가이드',
    description: 'DNS 동작 원리와 레코드 종류, Vercel·Cloudflare 도메인 연결 방법을 설명합니다.',
    faqs: [
      { q: 'DNS 레코드를 잘못 설정하면 사이트가 망가지나요?', a: '기존 레코드를 삭제하지 않고 추가하면 괜찮습니다. TTL이 지나면 수정이 반영됩니다.' },
      { q: 'Vercel과 Cloudflare를 동시에 쓸 수 있나요?', a: '네. Cloudflare DNS에서 Vercel 서버를 가리키는 CNAME 레코드를 추가하면 됩니다.' },
      { q: 'DNS 전파 상태를 확인하는 방법이 있나요?', a: 'dnschecker.org에서 전 세계 DNS 전파 상태를 실시간으로 확인할 수 있습니다.' },
      { q: 'TTL을 0으로 설정하면 더 빠른가요?', a: '실제로는 ISP나 리졸버가 최소 30~60초 캐시합니다. 불필요하게 0으로 설정하면 DNS 서버 부하만 늘어납니다.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <DnsRecordsContent />
    </>
  );
}
