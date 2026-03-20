import type { Metadata } from 'next';
import { SupabaseProjectSetupGuide } from '@/components/guides/supabase-guide/project-setup-guide';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: 'Supabase 프로젝트 생성 + 환경변수 설정 | Linkmap',
  description:
    'Supabase 계정 생성, 프로젝트 만들기, URL·ANON_KEY·SERVICE_ROLE_KEY 3개 환경변수를 Next.js에 설정하는 방법을 안내합니다.',
  keywords: ['Supabase', '프로젝트 생성', 'SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SERVICE_ROLE_KEY', '환경변수'],
};

export const revalidate = false;

export default function SupabaseProjectSetupPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'supabase/project-setup',
    title: 'Supabase 프로젝트 생성 + 환경변수 설정',
    description: 'Supabase 계정 생성, 프로젝트 만들기, 3개 환경변수(URL, ANON_KEY, SERVICE_ROLE_KEY) 설정.',
    faqs: [
      { q: 'SERVICE_ROLE_KEY를 NEXT_PUBLIC_으로 설정해도 되나요?', a: '절대 안 됩니다. SERVICE_ROLE_KEY는 RLS를 우회하는 슈퍼 키입니다. NEXT_PUBLIC_ 없이 서버 전용으로만 사용하세요.' },
      { q: 'Supabase 무료 플랜의 제한은 무엇인가요?', a: '프로젝트 2개, DB 500MB, 월 5만 MAU, 스토리지 1GB입니다. 비활성 프로젝트는 7일 후 일시 중지됩니다.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <SupabaseProjectSetupGuide />
    </>
  );
}
