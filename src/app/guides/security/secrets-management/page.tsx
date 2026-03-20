import type { Metadata } from 'next';
import { SecretsManagementContent } from '@/components/guides/security-guide/secrets-management-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: '시크릿 관리 — 보안 기초 가이드 | Linkmap',
  description:
    '.env 파일 보호, API 키 로테이션, 환경별 시크릿 분리 방법.',
  keywords: ['시크릿 관리', '.env', 'API 키', '환경변수', '키 로테이션', '보안'],
};

export const revalidate = false;

export default function SecretsManagementPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'security/secrets-management',
    title: '시크릿 관리 — 보안 기초 가이드',
    description: '.env 파일 보호, API 키 로테이션, 환경별 시크릿 분리 방법.',
    faqs: [
      { q: '.env 파일은 왜 커밋하면 안 되나요?', a: '.env에는 API 키, DB 비밀번호 등 민감 정보가 들어있어 GitHub에 올라가면 누구나 볼 수 있습니다. 봇이 자동으로 스캔해서 악용하는 사례도 많습니다.' },
      { q: 'API 키를 얼마나 자주 교체해야 하나요?', a: '최소 90일마다 로테이션을 권장합니다. 키가 노출된 것으로 의심되면 즉시 교체하세요.' },
      { q: '.env.example은 왜 필요한가요?', a: '팀원이 어떤 환경변수가 필요한지 알 수 있도록 키 이름만 적은 템플릿 파일입니다. 실제 값은 비워두고 커밋합니다.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <SecretsManagementContent />
    </>
  );
}
