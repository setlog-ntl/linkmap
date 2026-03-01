import type { Metadata } from 'next';
import { SupabaseGuide } from '@/components/guides/supabase-guide';

export const metadata: Metadata = {
  title: 'Supabase 시작 가이드 | Linkmap',
  description:
    'Supabase 계정 생성부터 Next.js 연동, 인증, 데이터베이스, RLS 설정까지 단계별로 안내합니다.',
  keywords: ['Supabase', 'PostgreSQL', 'BaaS', 'Auth', 'RLS', 'Next.js', '연동', '가이드', 'Linkmap'],
};

export default function SupabaseGuidePage() {
  return <SupabaseGuide />;
}
