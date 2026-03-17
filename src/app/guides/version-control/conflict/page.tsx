import type { Metadata } from 'next';
import { ConflictContent } from '@/components/guides/version-control-guide/conflict-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: '충돌 해결 — 버전 관리 심화 | Linkmap',
  description:
    'Git 충돌(conflict) 발생 원인과 해결 방법. merge vs rebase 비교, 실전 시나리오.',
  keywords: ['Git 충돌', 'conflict', 'merge', 'rebase', '충돌 해결', 'conflict markers'],
};

export default function ConflictPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'version-control/conflict',
    title: '충돌 해결 — 버전 관리 심화',
    description: 'Git 충돌(conflict) 발생 원인과 해결 방법. merge vs rebase 비교, 실전 시나리오.',
    faqs: [
      { q: '충돌이 왜 발생하나요?', a: '두 브랜치에서 같은 파일의 같은 줄을 다르게 수정하면 Git이 자동으로 합칠 수 없어 충돌이 발생합니다.' },
      { q: 'AI가 전체 파일을 덮어쓴 경우 어떻게 하나요?', a: 'git diff로 변경 범위를 확인하고, 필요한 부분만 선택적으로 수락하세요. VS Code의 3-way merge 에디터가 도움됩니다.' },
      { q: 'merge와 rebase 중 뭘 써야 하나요?', a: '초보자는 merge를 추천합니다. 히스토리가 보존되어 문제 추적이 쉽습니다.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <ConflictContent />
    </>
  );
}
