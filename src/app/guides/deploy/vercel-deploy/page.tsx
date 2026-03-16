import type { Metadata } from 'next';
import { VercelDeployContent } from '@/components/guides/deploy-guide/vercel-deploy-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: 'Vercel 배포 가이드 — 가입부터 첫 배포까지 | Linkmap',
  description:
    'Vercel 가입, GitHub 연결, 환경변수 설정, 커스텀 도메인 연결까지. Next.js 프로젝트를 Vercel에 배포하는 전체 과정을 단계별로 안내합니다.',
  keywords: ['Vercel', '배포', 'Next.js', 'GitHub 연동', 'Preview URL', '환경변수', '커스텀 도메인', '초보자'],
};

export default function VercelDeployPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'deploy/vercel-deploy',
    title: 'Vercel 배포 가이드 — 가입부터 첫 배포까지',
    description: 'Vercel 가입, GitHub 연결, 환경변수 설정, 커스텀 도메인 연결까지 단계별 안내.',
    faqs: [
      { q: 'Vercel은 무료인가요?', a: '개인 프로젝트는 무료 플랜(Hobby)으로 충분합니다. 월 100GB 대역폭, 빌드 6000분이 제공됩니다.' },
      { q: 'Vercel 없이도 Next.js를 배포할 수 있나요?', a: '네. Cloudflare Pages, Railway 등에서도 가능하지만 Vercel이 가장 쉽습니다.' },
      { q: '배포된 사이트를 되돌릴 수 있나요?', a: '네. Deployments에서 이전 배포를 선택하고 Promote to Production을 클릭하면 즉시 롤백됩니다.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <VercelDeployContent />
    </>
  );
}
