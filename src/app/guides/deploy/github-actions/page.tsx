import type { Metadata } from 'next';
import { GithubActionsContent } from '@/components/guides/deploy-guide/github-actions-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: 'GitHub Actions 가이드 — CI/CD 자동화 | Linkmap',
  description:
    'GitHub Actions 핵심 개념, YAML 문법, 실전 워크플로우 예제. 린트 검사부터 Vercel 자동 배포까지 단계별로 안내합니다.',
  keywords: ['GitHub Actions', 'CI/CD', '자동 배포', 'YAML', 'Workflow', '린트', '빌드', '초보자'],
};

export default function GithubActionsPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'deploy/github-actions',
    title: 'GitHub Actions 가이드 — CI/CD 자동화',
    description: 'GitHub Actions 핵심 개념, YAML 문법, 실전 워크플로우 예제.',
    faqs: [
      { q: 'GitHub Actions는 무료인가요?', a: '공개 저장소는 완전 무료, 비공개 저장소는 월 2000분 무료입니다.' },
      { q: 'Vercel 자동 배포와 어떻게 다른가요?', a: 'Vercel 자동 배포는 배포만 처리합니다. GitHub Actions는 린트, 테스트, 배포 등 더 세밀한 파이프라인을 구성할 수 있습니다.' },
      { q: 'YAML 파일은 어디에 만드나요?', a: '프로젝트 루트의 .github/workflows/ 폴더에 .yml 파일을 만들면 됩니다.' },
      { q: '워크플로우가 실패하면 어떻게 하나요?', a: 'GitHub 저장소 → Actions 탭에서 실행 결과와 상세 로그를 확인할 수 있습니다.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <GithubActionsContent />
    </>
  );
}
