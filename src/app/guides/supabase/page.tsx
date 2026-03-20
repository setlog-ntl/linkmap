import type { Metadata } from 'next';
import { SupabaseGuide } from '@/components/guides/supabase-guide';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: 'Supabase 시작 가이드 | Linkmap',
  description:
    'Supabase 계정 생성부터 Next.js 연동, 인증, 데이터베이스, RLS 설정까지 단계별로 안내합니다.',
  keywords: ['Supabase', 'PostgreSQL', 'BaaS', 'Auth', 'RLS', 'Next.js', '연동', '가이드', 'Linkmap'],
};

export const revalidate = false;

export default function SupabaseGuidePage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'supabase',
    title: 'Supabase 시작 가이드',
    description: 'Supabase 계정 생성부터 Next.js 연동, 인증, 데이터베이스, RLS 설정까지 단계별로 안내합니다.',
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <SupabaseGuide />
    </>
  );
}
