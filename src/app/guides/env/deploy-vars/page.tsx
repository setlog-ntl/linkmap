import type { Metadata } from 'next';
import { DeployVarsContent } from '@/components/guides/env-guide/deploy-vars-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: '배포 환경변수 설정 — Vercel · Cloudflare 가이드 | Linkmap',
  description:
    'Vercel, Cloudflare에서 환경변수를 등록하는 방법과 NEXT_PUBLIC_ 접두사 규칙, 배포 후 흔한 실수를 설명합니다.',
  keywords: ['배포 환경변수', 'Vercel 환경변수', 'Cloudflare', 'NEXT_PUBLIC', '환경변수 설정', '배포'],
};

export default function DeployVarsPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'env/deploy-vars',
    title: '배포 환경변수 설정 — Vercel · Cloudflare',
    description: 'Vercel, Cloudflare에서 환경변수를 등록하는 방법과 NEXT_PUBLIC_ 규칙.',
    faqs: [
      { q: 'NEXT_PUBLIC_ 접두사는 왜 필요한가요?', a: 'NEXT_PUBLIC_이 붙은 변수는 브라우저 번들에 포함됩니다. 공개해도 괜찮은 값(API URL, 익명 키)에만 사용하고, 시크릿에는 절대 붙이지 마세요.' },
      { q: '환경변수를 추가했는데 반영이 안 돼요', a: '환경변수 저장 후 반드시 재배포(Redeploy)를 실행해야 합니다. 이전 빌드는 새 변수를 모릅니다.' },
      { q: '배포 후 소셜 로그인이 안 돼요', a: 'Supabase Authentication → URL Configuration에서 Site URL과 Redirect URLs를 배포 도메인으로 변경했는지 확인하세요.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <DeployVarsContent />
    </>
  );
}
