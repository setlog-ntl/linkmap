import type { Metadata } from 'next';
import { HostingTypesContent } from '@/components/guides/server-guide/hosting-types-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: '호스팅 유형 비교 — 정적·동적·서버리스·VPS | Linkmap',
  description:
    '정적 호스팅, 동적 호스팅(PaaS), 서버리스, VPS의 차이와 Vercel·Cloudflare·Railway 등 플랫폼 선택 기준을 비교합니다.',
  keywords: [
    '호스팅 비교',
    '정적 호스팅',
    '동적 호스팅',
    'PaaS',
    '서버리스',
    'VPS',
    'Vercel',
    'Cloudflare',
    'Railway',
    'Netlify',
    '무료 호스팅',
  ],
};

export default function HostingTypesPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'server/hosting-types',
    title: '호스팅 유형 비교 — 정적·동적·서버리스·VPS',
    description:
      '정적 호스팅, 동적 호스팅, 서버리스, VPS의 차이와 플랫폼 선택 기준을 비교합니다.',
    faqs: [
      {
        q: 'Next.js 앱은 어디에 배포해야 하나요?',
        a: 'Vercel이 가장 쉽고 최적화되어 있습니다. Next.js를 만든 회사가 직접 운영하기 때문에 설정이 거의 필요 없습니다. Cloudflare Pages + Workers도 대역폭 무제한이라 좋은 대안입니다.',
      },
      {
        q: '무료 플랜으로 실제 서비스를 운영할 수 있나요?',
        a: '네, 월 방문자 수천~수만 명 수준까지는 무료 플랜으로 충분합니다. Vercel과 Cloudflare 모두 무료 플랜이 넉넉합니다.',
      },
      {
        q: '정적 호스팅과 동적 호스팅의 차이는?',
        a: '정적 호스팅은 미리 만든 HTML 파일을 그대로 전달합니다. 동적 호스팅은 요청이 올 때마다 서버에서 HTML을 새로 생성합니다.',
      },
      {
        q: 'PaaS와 서버리스의 차이가 뭔가요?',
        a: 'PaaS는 서버가 항상 켜져서 대기합니다. 서버리스는 요청이 올 때만 함수가 깨어나서 실행합니다. 서버리스가 비용 효율적이지만 콜드 스타트가 있을 수 있습니다.',
      },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <HostingTypesContent />
    </>
  );
}
