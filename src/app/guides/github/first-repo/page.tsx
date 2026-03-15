import type { Metadata } from 'next';
import { FirstRepoGuide } from '@/components/guides/github-guide/first-repo-guide';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: '첫 저장소 만들기 — GitHub | Linkmap',
  description:
    'GitHub에서 저장소를 생성하고, git init, 첫 커밋, git push까지 완료하는 방법을 설명합니다. .gitignore 설정 포함.',
  keywords: ['git init', '첫 커밋', 'git push', 'GitHub 저장소', '.gitignore', 'git add', '초보자'],
};

export default function FirstRepoPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'github/first-repo',
    title: '첫 저장소 만들기 — GitHub',
    description: 'GitHub에서 저장소를 생성하고, git init, 첫 커밋, git push까지 완료하는 방법을 설명합니다.',
    faqs: [
      { q: '.gitignore에 이미 커밋된 파일을 제거하려면?', a: 'git rm --cached 파일명으로 추적 목록에서 제거 후 커밋하면 됩니다. 파일 자체는 로컬에 유지됩니다.' },
      { q: 'git push 시 rejected 오류가 나요', a: '원격 저장소에 로컬에 없는 커밋이 있는 경우입니다. git pull로 먼저 최신 상태를 받아온 후 다시 push하세요.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <FirstRepoGuide />
    </>
  );
}
