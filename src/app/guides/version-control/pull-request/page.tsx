import type { Metadata } from 'next';
import { PullRequestContent } from '@/components/guides/version-control-guide/pull-request-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: 'PR과 코드 리뷰 — 버전 관리 심화 | Linkmap',
  description:
    'Pull Request 생성, 코드 리뷰, 머지, Preview 배포까지의 과정.',
  keywords: ['Pull Request', 'PR', '코드 리뷰', '머지', 'Preview 배포', 'GitHub'],
};

export default function PullRequestPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'version-control/pull-request',
    title: 'PR과 코드 리뷰 — 버전 관리 심화',
    description: 'Pull Request 생성, 코드 리뷰, 머지, Preview 배포까지의 과정.',
    faqs: [
      { q: 'PR은 왜 만들어야 하나요?', a: 'PR은 코드 변경사항을 팀원(또는 미래의 나)이 리뷰할 수 있는 공간입니다. 버그를 사전에 발견하고 코드 품질을 유지할 수 있습니다.' },
      { q: '1인 개발인데도 PR을 만들어야 하나요?', a: '네. PR은 변경 이력을 남기고, AI 코드를 검토하는 좋은 기회입니다. Vercel Preview URL로 배포 전 확인도 가능합니다.' },
      { q: 'PR 제목은 어떻게 쓰나요?', a: 'feat: 로그인 기능 추가, fix: 검색 오류 수정처럼 Conventional Commits 형식을 추천합니다.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <PullRequestContent />
    </>
  );
}
