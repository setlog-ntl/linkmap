import type { Metadata } from 'next';
import { WebVulnerabilitiesContent } from '@/components/guides/security-guide/web-vulnerabilities-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: '웹 취약점 기초 — 보안 기초 가이드 | Linkmap',
  description:
    'XSS, CSRF, SQL Injection 등 웹 취약점의 원리와 방어 방법을 쉽게 설명합니다.',
  keywords: ['XSS', 'CSRF', 'SQL Injection', '웹 취약점', '입력 검증', 'Zod', '보안'],
};

export const revalidate = false;

export default function WebVulnerabilitiesPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'security/web-vulnerabilities',
    title: '웹 취약점 기초 — 보안 기초 가이드',
    description: 'XSS, CSRF, SQL Injection 등 웹 취약점의 원리와 방어 방법을 쉽게 설명합니다.',
    faqs: [
      { q: 'XSS 공격은 어떻게 막나요?', a: '사용자 입력을 HTML에 직접 삽입하지 않고, React의 자동 이스케이프를 활용합니다. dangerouslySetInnerHTML은 절대 사용하지 않는 것이 원칙입니다.' },
      { q: 'SQL Injection은 Supabase에서도 발생하나요?', a: 'Supabase 클라이언트 라이브러리는 기본적으로 파라미터화된 쿼리를 사용하므로 SQL Injection에 안전합니다. 추가로 RLS 정책을 설정하면 이중 보호됩니다.' },
      { q: 'CSRF 토큰은 꼭 필요한가요?', a: 'SPA에서 API를 호출할 때는 SameSite 쿠키 설정만으로도 CSRF를 방어할 수 있습니다. 전통적인 폼 기반 서버라면 CSRF 토큰이 필수입니다.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <WebVulnerabilitiesContent />
    </>
  );
}
