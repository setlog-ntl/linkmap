import type { Metadata } from 'next';
import { VersionControlGuide } from '@/components/guides/version-control-guide';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: '버전 관리 심화 — 바이브 코더 가이드 | Linkmap',
  description:
    'Git 브랜치 전략, PR과 코드 리뷰, 충돌 해결까지. AI 코드를 안전하게 관리하는 방법을 초보자 눈높이로 설명합니다.',
  keywords: ['Git', '브랜치', 'Pull Request', '코드 리뷰', '충돌 해결', 'merge', 'rebase', '초보자'],
};

export const revalidate = false;

export default function VersionControlGuidePage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'version-control',
    title: '버전 관리 심화 — 바이브 코더 가이드',
    description: 'Git 브랜치 전략, PR과 코드 리뷰, 충돌 해결까지. AI 코드를 안전하게 관리하는 방법을 초보자 눈높이로 설명합니다.',
    faqs: [
      { q: '브랜치를 꼭 나눠야 하나요?', a: 'main 브랜치에 직접 작업하면 배포 코드가 망가질 수 있습니다. feature 브랜치에서 작업 후 PR로 머지하는 것이 안전합니다.' },
      { q: 'AI가 생성한 코드도 브랜치를 나눠야 하나요?', a: '네. AI 코드는 예상과 다를 수 있으므로 별도 브랜치에서 리뷰 후 머지하는 것이 좋습니다.' },
      { q: 'merge와 rebase 중 뭘 써야 하나요?', a: '초보자는 merge를 추천합니다. 히스토리가 보존되어 문제 추적이 쉽습니다. rebase는 깔끔한 히스토리가 필요할 때 사용합니다.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <VersionControlGuide />
    </>
  );
}
