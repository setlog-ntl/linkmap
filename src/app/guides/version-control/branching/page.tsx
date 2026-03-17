import type { Metadata } from 'next';
import { BranchingContent } from '@/components/guides/version-control-guide/branching-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: '브랜치 전략 — 버전 관리 심화 | Linkmap',
  description:
    'main/feature/hotfix 브랜치 전략. AI 코드는 별도 브랜치에서 관리하는 이유와 방법.',
  keywords: ['브랜치 전략', 'Git Flow', 'GitHub Flow', 'Trunk Based', '브랜치 네이밍'],
};

export default function BranchingPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'version-control/branching',
    title: '브랜치 전략 — 버전 관리 심화',
    description: 'main/feature/hotfix 브랜치 전략. AI 코드는 별도 브랜치에서 관리하는 이유와 방법.',
    faqs: [
      { q: '1인 개발인데 브랜치 전략이 필요한가요?', a: '네. GitHub Flow처럼 간단한 전략이라도 사용하면 실험적 코드를 안전하게 테스트하고 되돌릴 수 있습니다.' },
      { q: 'Git Flow와 GitHub Flow 중 뭘 써야 하나요?', a: '1인 또는 소규모 팀은 GitHub Flow, 릴리스 주기가 있는 팀은 Git Flow를 추천합니다.' },
      { q: '브랜치 이름은 어떻게 짓나요?', a: 'feature/기능명, fix/버그명, ai/기능명 형식을 사용하면 목적이 명확합니다.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <BranchingContent />
    </>
  );
}
