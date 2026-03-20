import type { Metadata } from 'next';
import { SupabaseDatabaseRlsGuide } from '@/components/guides/supabase-guide/database-rls-guide';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: 'Supabase 데이터베이스 + RLS 보안 설정 | Linkmap',
  description:
    'Supabase에서 테이블 생성, RLS 활성화, 정책(Policy) 작성 방법을 설명합니다. Browser/Server/Admin 3종 클라이언트 선택 기준 포함.',
  keywords: ['Supabase RLS', 'Row Level Security', '테이블 생성', '정책', 'Supabase 클라이언트', 'PostgreSQL'],
};

export const revalidate = false;

export default function SupabaseDatabaseRlsPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'supabase/database-rls',
    title: 'Supabase 데이터베이스 + RLS 보안 설정',
    description: 'Supabase 테이블 생성, RLS 활성화, 정책 작성. Browser/Server/Admin 3종 클라이언트 선택 기준.',
    faqs: [
      { q: 'RLS를 활성화했는데 데이터가 조회되지 않아요', a: 'RLS 활성화 후 정책이 없으면 모든 접근이 차단됩니다. SELECT 정책을 추가하거나 Supabase 대시보드 Table Editor에서 정책을 확인하세요.' },
      { q: 'Admin 클라이언트를 쓰면 RLS를 항상 우회하나요?', a: '네, SERVICE_ROLE_KEY를 사용하는 Admin 클라이언트는 RLS를 무시합니다. 관리자 작업에만 사용하고 절대 클라이언트에 노출하지 마세요.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <SupabaseDatabaseRlsGuide />
    </>
  );
}
