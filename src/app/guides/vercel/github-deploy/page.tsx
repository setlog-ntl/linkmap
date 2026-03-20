import type { Metadata } from 'next';
import { VercelGithubDeployGuide } from '@/components/guides/vercel-guide/github-deploy-guide';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: 'Vercel GitHub 연동 + 첫 배포 가이드 | Linkmap',
  description:
    'Vercel에 GitHub 저장소를 연결하고 첫 배포를 완료하는 방법. 자동 CI/CD 파이프라인과 프리뷰 배포 설정 포함.',
  keywords: ['Vercel 배포', 'GitHub 연동', '자동 배포', '프리뷰 배포', 'CI/CD', 'Next.js 배포', 'Vercel'],
};

export const revalidate = false;

export default function VercelGithubDeployPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'vercel/github-deploy',
    title: 'Vercel GitHub 연동 + 첫 배포 가이드',
    description: 'Vercel에 GitHub 저장소를 연결하고 첫 배포를 완료하는 방법. 자동 CI/CD, 프리뷰 배포 설정.',
    faqs: [
      { q: 'Vercel 배포 후 환경변수가 적용되지 않아요', a: '환경변수를 Vercel 대시보드에서 추가한 후 Redeploy 버튼을 눌러 재배포해야 적용됩니다.' },
      { q: '프리뷰 배포에서 환경변수를 다르게 설정하려면?', a: '환경변수 추가 시 적용 환경을 Preview로 지정하거나 별도 값을 설정할 수 있습니다.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <VercelGithubDeployGuide />
    </>
  );
}
