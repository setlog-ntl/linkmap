import type { Metadata } from 'next';
import { AuthGuide } from '@/components/guides/auth-guide';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: '인증 가이드 — 두 가지만 알면 됩니다 | Linkmap',
  description:
    'Linkmap의 앱 로그인과 서비스 연동, 두 가지 인증 레이어를 쉽게 이해하세요. 구글·카카오 로그인 설정 가이드 포함.',
  keywords: ['인증', 'OAuth', 'API Key', '로그인', '서비스 연동', '가이드', '초보자', 'Linkmap', '구글 로그인', '카카오 로그인'],
};

export const revalidate = false;

export default function AuthGuidePage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'auth',
    title: '인증 가이드 — 두 가지만 알면 됩니다',
    description: 'Linkmap의 앱 로그인과 서비스 연동, 두 가지 인증 레이어를 쉽게 이해하세요.',
    faqs: [
      { q: 'GitHub 로그인이 안 돼요', a: 'Supabase 대시보드 → Authentication → Providers에서 GitHub을 활성화했는지 확인하세요.' },
      { q: '리다이렉트 오류가 발생해요', a: 'Supabase URL Configuration에서 사이트 URL과 Redirect URLs가 올바르게 설정되어 있는지 확인하세요.' },
      { q: '앱 로그인과 서비스 연동 GitHub은 뭐가 다른가요?', a: '앱 로그인은 Linkmap 인증용이고, 서비스 연동은 프로젝트에서 레포/시크릿 관리를 위한 연결입니다.' },
      { q: 'API Key는 안전하게 저장되나요?', a: 'Linkmap은 모든 API Key를 AES-256-GCM 알고리즘으로 암호화해 저장합니다.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <AuthGuide />
    </>
  );
}
