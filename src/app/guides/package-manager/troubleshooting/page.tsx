import type { Metadata } from 'next';
import { TroubleshootingContent } from '@/components/guides/package-manager-guide/troubleshooting-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: 'npm 에러 해결 — 패키지 매니저 가이드 | Linkmap',
  description:
    '버전 충돌, peer dependency 에러, audit 경고, node_modules 재설치 방법.',
  keywords: ['npm 에러', 'ERESOLVE', 'peer dependency', 'npm audit', 'node_modules', '트러블슈팅'],
};

export default function TroubleshootingPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'package-manager/troubleshooting',
    title: 'npm 에러 해결 — 패키지 매니저 가이드',
    description: '버전 충돌, peer dependency 에러, audit 경고, node_modules 재설치 방법.',
    faqs: [
      {
        q: 'ERESOLVE 에러가 나면 어떻게 하나요?',
        a: '--legacy-peer-deps 옵션으로 우회하거나, 충돌하는 패키지 버전을 맞춰주면 됩니다.',
      },
      {
        q: 'npm audit 경고는 무시해도 되나요?',
        a: '심각도(severity)를 확인하세요. critical/high는 반드시 해결, moderate/low는 상황에 따라 판단합니다.',
      },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <TroubleshootingContent />
    </>
  );
}
