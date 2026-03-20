import type { Metadata } from 'next';
import { CicdContent } from '@/components/guides/deploy-guide/cicd-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: 'CI/CD 배포 파이프라인 — GitHub Actions 가이드 | Linkmap',
  description:
    'CI/CD 개념과 GitHub Actions를 사용한 자동 배포 파이프라인 구축 방법. Vercel 자동 배포와 GitHub Actions YAML 예시를 포함합니다.',
  keywords: ['CI/CD', 'GitHub Actions', '자동 배포', 'Vercel', '배포 파이프라인', '지속적 통합', '초보자'],
};

export const revalidate = false;

export default function CicdPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'deploy/cicd',
    title: 'CI/CD 배포 파이프라인 — GitHub Actions',
    description: 'CI/CD 개념과 GitHub Actions를 사용한 자동 배포 파이프라인 구축.',
    faqs: [
      { q: 'CI/CD가 꼭 필요한가요?', a: '작은 프로젝트는 Vercel 자동 배포만으로 충분합니다. 팀으로 개발하거나 코드 품질 검사가 필요하다면 GitHub Actions를 추가하세요.' },
      { q: 'GitHub Actions는 무료인가요?', a: '공개 저장소는 완전 무료, 비공개 저장소는 월 2000분 무료입니다. 대부분의 프로젝트에 충분합니다.' },
      { q: 'Vercel에 연결하면 자동 배포가 되나요?', a: '네. GitHub 저장소를 Vercel에 연결하면 main 브랜치 push 시 자동 배포, PR 생성 시 Preview URL 생성이 모두 자동으로 됩니다.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <CicdContent />
    </>
  );
}
