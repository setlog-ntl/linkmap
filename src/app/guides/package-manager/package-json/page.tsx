import type { Metadata } from 'next';
import { PackageJsonContent } from '@/components/guides/package-manager-guide/package-json-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: 'package.json 이해하기 — 패키지 매니저 가이드 | Linkmap',
  description:
    'dependencies vs devDependencies, 버전 표기법(semver ^/~), scripts 설정 방법.',
  keywords: ['package.json', 'dependencies', 'devDependencies', 'semver', 'lock 파일', '초보자'],
};

export default function PackageJsonPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'package-manager/package-json',
    title: 'package.json 이해하기 — 패키지 매니저 가이드',
    description: 'dependencies vs devDependencies, 버전 표기법(semver ^/~), scripts 설정 방법.',
    faqs: [
      {
        q: 'dependencies와 devDependencies 차이가 뭔가요?',
        a: 'dependencies는 앱 실행에 필요한 패키지, devDependencies는 개발 시에만 필요한 패키지입니다. 예: React는 dependencies, ESLint는 devDependencies.',
      },
      {
        q: 'lock 파일은 왜 필요한가요?',
        a: '팀원 모두가 동일한 버전의 패키지를 설치하도록 보장합니다. lock 파일 없이는 설치 시점에 따라 다른 버전이 설치될 수 있습니다.',
      },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <PackageJsonContent />
    </>
  );
}
