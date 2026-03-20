import type { Metadata } from 'next';
import { KakaoGuideContent } from '@/components/guides/auth-guide/kakao/kakao-guide-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: '카카오 로그인 설정 가이드 — 스크린샷 포함 6단계 | Linkmap',
  description:
    '카카오 개발자 콘솔에서 앱을 만들고 Supabase OIDC Provider로 연결하는 6단계 설정 가이드. 스크린샷과 어노테이션으로 따라하기 쉽게 설명합니다.',
  keywords: ['카카오 로그인', '카카오 OAuth', 'Supabase OIDC', '소셜 로그인', '설정 가이드', '카카오 개발자'],
};

export const revalidate = false;

export default function KakaoGuidePage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'auth/kakao',
    title: '카카오 로그인 설정 가이드',
    description: '카카오 개발자 콘솔에서 앱을 만들고 Supabase OIDC Provider로 연결하는 6단계 설정 가이드.',
    faqs: [
      { q: 'KOE006 Redirect URI 불일치 오류가 발생해요', a: '카카오 개발자 콘솔의 Redirect URI가 실제 요청의 redirect_uri와 정확히 일치하는지 확인하세요.' },
      { q: '이메일 정보가 넘어오지 않아요', a: '비즈 앱 전환 후 동의항목에서 이메일을 필수 동의로 변경하세요.' },
      { q: 'OpenID Connect 토큰 오류가 발생해요', a: '카카오 로그인 설정에서 OpenID Connect가 활성화되어 있는지 확인하고, Supabase에서 Skip nonce check를 ON으로 설정하세요.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <KakaoGuideContent />
    </>
  );
}
