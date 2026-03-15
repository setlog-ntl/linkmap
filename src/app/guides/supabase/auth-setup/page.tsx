import type { Metadata } from 'next';
import { SupabaseAuthSetupGuide } from '@/components/guides/supabase-guide/auth-setup-guide';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: 'Supabase 인증(Auth) 설정 — Google·Kakao 로그인 | Linkmap',
  description:
    'Supabase Auth로 Google OAuth와 Kakao 로그인을 설정하는 방법. Site URL, Redirect URL, Next.js 미들웨어, 콜백 라우트 포함.',
  keywords: ['Supabase Auth', 'Google 로그인', 'Kakao 로그인', 'OAuth', '미들웨어', '소셜 로그인', 'Next.js'],
};

export default function SupabaseAuthSetupPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'supabase/auth-setup',
    title: 'Supabase 인증(Auth) 설정 — Google·Kakao 로그인',
    description: 'Supabase Auth로 Google OAuth와 Kakao 로그인 설정. Site URL, Redirect URL, Next.js 미들웨어, 콜백 라우트.',
    faqs: [
      { q: 'redirect_uri_mismatch 오류가 발생해요', a: 'Google Cloud Console 또는 Supabase Authentication → URL Configuration에서 콜백 URL이 정확히 등록되어 있는지 확인하세요.' },
      { q: '서버에서 getSession() 대신 getUser()를 써야 하는 이유는?', a: 'getSession()은 쿠키를 그대로 신뢰하므로 위조될 수 있습니다. 서버에서 사용자 검증 시 Supabase 서버와 통신하는 getUser()를 사용하세요.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <SupabaseAuthSetupGuide />
    </>
  );
}
