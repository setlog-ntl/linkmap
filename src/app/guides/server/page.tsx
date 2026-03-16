import type { Metadata } from 'next';
import { ServerGuide } from '@/components/guides/server-guide';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: '서버·호스팅 이해하기 — 바이브 코더 가이드 | Linkmap',
  description:
    '서버란 무엇인가, 내 컴퓨터와 서버의 차이, 호스팅 유형(정적·동적·서버리스·VPS) 비교를 초보자 눈높이로 설명합니다.',
  keywords: ['서버', '호스팅', 'VPS', '서버리스', 'localhost', '배포', '초보자', '바이브코딩'],
};

export default function ServerGuidePage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'server',
    title: '서버·호스팅 이해하기 — 바이브 코더 가이드',
    description:
      '서버란 무엇인가, 내 컴퓨터와 서버의 차이, 호스팅 유형 비교를 초보자 눈높이로 설명합니다.',
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <ServerGuide />
    </>
  );
}
