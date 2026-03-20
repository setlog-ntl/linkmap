import type { Metadata } from 'next';
import { DotenvFilesContent } from '@/components/guides/env-guide/dotenv-files-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: '.env 파일 관리 — 환경변수 가이드 | Linkmap',
  description:
    '.env, .env.local, .env.example, .env.production 파일의 차이와 우선순위, 보안 관리 방법을 초보자 눈높이로 설명합니다.',
  keywords: ['.env', '.env.local', '.env.example', '환경변수 파일', 'gitignore', 'Next.js', '초보자'],
};

export const revalidate = false;

export default function DotenvFilesPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'env/dotenv-files',
    title: '.env 파일 관리 — 환경변수 가이드',
    description: '.env, .env.local, .env.example 파일의 차이와 우선순위, 보안 관리 방법.',
    faqs: [
      { q: '.env.local은 왜 gitignore에 자동으로 추가되나요?', a: 'Next.js가 .env.local을 기본적으로 gitignore하도록 설계되어 있습니다. 실제 API 키 등 민감한 정보를 담기 때문입니다.' },
      { q: '.env.example은 GitHub에 올려도 되나요?', a: '네, 올려야 합니다. 실제 값 대신 설명이나 빈 값을 넣어두면 팀원이 어떤 환경변수가 필요한지 쉽게 알 수 있습니다.' },
      { q: '같은 변수가 여러 파일에 있으면 어떤 게 적용되나요?', a: '.env.local > .env.development > .env.production > .env 순서로 우선순위가 높은 파일이 이깁니다.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <DotenvFilesContent />
    </>
  );
}
