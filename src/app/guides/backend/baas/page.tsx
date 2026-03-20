import type { Metadata } from 'next';
import { BaasContent } from '@/components/guides/backend-guide/baas-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: 'BaaS 활용하기 — Supabase vs Firebase 비교 | Linkmap',
  description:
    'Backend as a Service(BaaS) 개념과 Supabase, Firebase 비교. 백엔드 없이 인증·DB·스토리지를 빠르게 구축하는 방법을 설명합니다.',
  keywords: ['BaaS', 'Supabase', 'Firebase', '백엔드', '인증', '데이터베이스', '바이브 코딩', '초보자'],
};

export const revalidate = false;

export default function BaasPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'backend/baas',
    title: 'BaaS 활용하기 — Supabase vs Firebase',
    description: 'BaaS 개념과 Supabase, Firebase 비교. 백엔드 없이 인증·DB를 구축하는 방법.',
    faqs: [
      { q: 'BaaS와 직접 서버 중 무엇을 선택해야 하나요?', a: 'MVP나 초기 프로젝트라면 BaaS를 강력 추천합니다. 개발 속도가 10배 이상 빠르고, 무료 플랜으로도 수만 명의 사용자를 처리할 수 있습니다.' },
      { q: 'Supabase와 Firebase 중 무엇이 더 좋나요?', a: 'SQL에 익숙하거나 오픈소스를 선호한다면 Supabase, Google 생태계를 선호한다면 Firebase를 선택하세요. 바이브 코딩에는 Supabase를 추천합니다.' },
      { q: 'BaaS는 대규모 서비스에서도 쓸 수 있나요?', a: 'Supabase는 스타트업부터 대기업까지 사용합니다. 초기에는 무료 플랜으로 시작하고, 트래픽이 증가하면 유료 플랜으로 업그레이드하면 됩니다.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <BaasContent />
    </>
  );
}
