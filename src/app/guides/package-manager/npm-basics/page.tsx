import type { Metadata } from 'next';
import { NpmBasicsContent } from '@/components/guides/package-manager-guide/npm-basics-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: 'npm 기본 명령어 — 패키지 매니저 가이드 | Linkmap',
  description:
    'npm install, update, run, scripts 등 필수 npm 명령어를 예시와 함께 설명합니다.',
  keywords: ['npm install', 'npm run', 'npx', 'npm scripts', '패키지 설치', '초보자'],
};

export default function NpmBasicsPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'package-manager/npm-basics',
    title: 'npm 기본 명령어 — 패키지 매니저 가이드',
    description: 'npm install, update, run, scripts 등 필수 npm 명령어를 예시와 함께 설명합니다.',
    faqs: [
      {
        q: 'npm install과 npm ci의 차이가 뭔가요?',
        a: 'npm install은 package.json 기준으로 설치하고 lock 파일을 업데이트합니다. npm ci는 lock 파일 기준으로 정확히 설치하며, CI/CD 환경에서 권장됩니다.',
      },
      {
        q: 'npx는 언제 사용하나요?',
        a: '설치 없이 패키지를 일회성으로 실행할 때 사용합니다. 예: npx create-next-app@latest',
      },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <NpmBasicsContent />
    </>
  );
}
