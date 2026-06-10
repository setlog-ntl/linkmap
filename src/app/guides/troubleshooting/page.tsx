import type { Metadata } from 'next';
import { TroubleshootingGuide } from '@/components/guides/troubleshooting-guide';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: '흔한 에러 해결 허브 — 바이브 코더 가이드 | Linkmap',
  description:
    '빌드·배포·환경변수·CORS·패키지 에러를 증상 → 원인 → 해결 순서로 정리한 트러블슈팅 허브. 바이브코딩 초보자가 자주 만나는 에러를 한곳에서 해결하세요.',
  keywords: ['에러 해결', '트러블슈팅', '빌드 에러', '배포 에러', 'CORS 에러', 'npm 에러', '환경변수 에러', '바이브코딩'],
};

export const revalidate = false;

export default function TroubleshootingPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'troubleshooting',
    title: '흔한 에러 해결 허브 — 바이브 코더 가이드',
    description: '빌드·배포·환경변수·CORS·패키지 에러를 증상 → 원인 → 해결 순서로 정리합니다.',
    faqs: [
      { q: '에러 메시지가 영어라 무슨 뜻인지 모르겠어요.', a: '에러의 첫 줄을 그대로 복사해 AI에게 "이 에러 무슨 뜻이고 어떻게 고쳐?"라고 물어보세요. 전체 로그보다 첫 에러 한 줄이 핵심입니다.' },
      { q: '에러를 만나면 어디서부터 봐야 하나요?', a: '콘솔/로그에서 첫 번째 빨간 에러를 찾고, 그 에러가 가리키는 파일·줄을 연 뒤, 비슷한 증상을 카테고리에서 찾으세요. "마지막으로 무엇을 바꿨는지"도 큰 힌트입니다.' },
      { q: '로컬에서는 되는데 배포본에서만 안 됩니다.', a: '거의 항상 환경변수가 배포 플랫폼에 등록되지 않았거나 재배포가 안 된 경우입니다. 배포 플랫폼 대시보드에서 환경변수를 확인하고 재배포하세요.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <TroubleshootingGuide />
    </>
  );
}
