import type { Metadata } from 'next';
import { GoogleGuideContent } from '@/components/guides/auth-guide/google/google-guide-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: '구글 로그인 설정 가이드 — 스크린샷 포함 7단계 | Linkmap',
  description:
    'Google Cloud Console에서 OAuth 클라이언트를 만들고 Supabase에 연결하는 7단계 설정 가이드. 스크린샷과 어노테이션으로 따라하기 쉽게 설명합니다.',
  keywords: ['구글 로그인', 'Google OAuth', 'Supabase', '소셜 로그인', '설정 가이드', 'Google Cloud Console'],
};

export const revalidate = false;

export default function GoogleGuidePage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'auth/google',
    title: '구글 로그인 설정 가이드',
    description: 'Google Cloud Console에서 OAuth 클라이언트를 만들고 Supabase에 연결하는 7단계 설정 가이드.',
    faqs: [
      { q: 'redirect_uri_mismatch 오류가 발생해요', a: 'Google Cloud Console의 승인된 리디렉션 URI에 Supabase 콜백 URL이 정확히 등록되어 있는지 확인하세요.' },
      { q: '이메일이 null로 저장되어요', a: 'OAuth 동의 화면에서 email 스코프가 추가되어 있는지 확인하세요.' },
      { q: '"이 앱은 차단됨" 경고가 나타나요', a: 'OAuth 동의 화면이 테스트 모드일 때 나타납니다. 테스트 사용자를 추가하거나 프로덕션에 게시하세요.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <GoogleGuideContent />
    </>
  );
}
