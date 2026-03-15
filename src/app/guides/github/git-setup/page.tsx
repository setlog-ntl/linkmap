import type { Metadata } from 'next';
import { GitSetupGuide } from '@/components/guides/github-guide/git-setup-guide';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: 'Git 설치 + GitHub 가입 가이드 | Linkmap',
  description:
    'Git 설치(Windows/Mac/Linux), GitHub 가입, SSH 키 설정, git config 기본 설정을 단계별로 안내합니다.',
  keywords: ['Git 설치', 'GitHub 가입', 'SSH 키', 'git config', '초보자', '개발 환경 설정'],
};

export default function GitSetupPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'github/git-setup',
    title: 'Git 설치 + GitHub 가입 가이드',
    description: 'Git 설치(Windows/Mac/Linux), GitHub 가입, SSH 키 설정, git config 기본 설정을 단계별로 안내합니다.',
    faqs: [
      { q: 'SSH 키 설정 없이 GitHub를 사용할 수 있나요?', a: 'Personal Access Token을 사용하면 HTTPS 방식으로도 가능합니다. 하지만 매번 토큰을 입력해야 하므로 SSH 키 설정을 권장합니다.' },
      { q: 'git config를 잘못 설정했으면 어떻게 하나요?', a: '동일한 명령으로 덮어쓸 수 있습니다. git config --global user.email "새이메일"처럼 다시 실행하면 됩니다.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <GitSetupGuide />
    </>
  );
}
