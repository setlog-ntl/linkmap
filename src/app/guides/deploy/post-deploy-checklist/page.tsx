import type { Metadata } from 'next';
import { PostDeployChecklistContent } from '@/components/guides/deploy-guide/post-deploy-checklist-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: '배포 후 첫 점검 체크리스트 — 배포 가이드 | Linkmap',
  description:
    '배포 직후 도메인·HTTPS·환경변수·에러 모니터링·성능을 12가지 항목으로 점검하는 인터랙티브 체크리스트. 초보자가 놓치기 쉬운 부분을 짚어줍니다.',
  keywords: ['배포 후 점검', '배포 체크리스트', '환경변수 확인', 'HTTPS 확인', '배포 에러', '바이브코딩 배포'],
};

export const revalidate = false;

export default function PostDeployChecklistPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'deploy/post-deploy-checklist',
    parentSlug: 'deploy',
    title: '배포 후 첫 점검 체크리스트 — 배포 가이드',
    description: '배포 직후 도메인·HTTPS·환경변수·에러·성능을 점검하는 인터랙티브 체크리스트.',
    faqs: [
      { q: '배포했는데 기능이 작동하지 않아요. 무엇부터 확인하나요?', a: '대부분 환경변수 문제입니다. 배포 플랫폼 대시보드에 모든 환경변수가 등록됐는지, 변수명 오타가 없는지, 추가 후 재배포를 트리거했는지 순서대로 확인하세요.' },
      { q: '로컬에서는 되는데 배포본에서만 안 됩니다. 왜인가요?', a: '가장 흔한 원인은 로컬 .env의 값이 배포 플랫폼에 등록되지 않은 경우입니다. 그다음으로는 HTTPS/CORS 차이, 빌드 환경 차이를 확인합니다.' },
      { q: '배포 후 꼭 확인해야 할 최소 항목은?', a: '실제 URL 접속, HTTPS 적용(자물쇠), 핵심 기능(로그인·결제·AI) 작동, 콘솔 에러 없음, 모바일 화면 정상 — 이 5가지만 확인해도 큰 사고를 막을 수 있습니다.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <PostDeployChecklistContent />
    </>
  );
}
