import type { Metadata } from 'next';
import { EnvGuide } from '@/components/guides/env-guide';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: '환경변수 완전 정복 — 바이브 코더 가이드 | Linkmap',
  description:
    'AI가 만든 코드를 배포하려면 꼭 알아야 할 환경변수(.env) 개념을 초보자 눈높이에서 쉽게 설명합니다.',
  keywords: ['환경변수', '.env', 'API Key', 'NEXT_PUBLIC', '배포', '가이드', '초보자', 'Linkmap'],
};

export const revalidate = false;

export default function EnvGuidePage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'env',
    title: '환경변수 완전 정복 — 바이브 코더 가이드',
    description: 'AI가 만든 코드를 배포하려면 꼭 알아야 할 환경변수(.env) 개념을 초보자 눈높이에서 쉽게 설명합니다.',
    faqs: [
      { q: '.env와 .env.local의 차이는?', a: '.env는 git에 포함될 수 있는 기본값 파일이고, .env.local은 로컬 전용 파일로 .gitignore에 자동 포함됩니다.' },
      { q: '환경변수를 잘못 입력하면 어떻게 되나요?', a: '대부분 앱이 시작은 되지만 해당 기능이 작동하지 않습니다. 콘솔에서 unauthorized나 invalid key 에러를 확인하세요.' },
      { q: '이미 GitHub에 .env를 올렸으면 어떻게 하나요?', a: '해당 서비스에서 즉시 키를 교체(rotate)하세요. git rm --cached .env로 추적 해제 후 .gitignore에 추가하세요.' },
      { q: '.env.example은 GitHub에 올려도 되나요?', a: '네, 올려야 합니다! 실제 값 대신 설명이나 빈 값을 넣어두면 팀원이 어떤 환경변수가 필요한지 쉽게 알 수 있습니다.' },
      { q: '배포 후 환경변수 에러가 나면 어떻게 하나요?', a: '배포 플랫폼 대시보드에서 모든 환경변수가 등록되어 있는지 확인하고, 변수명 오타가 없는지 확인하세요.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <EnvGuide />
    </>
  );
}
