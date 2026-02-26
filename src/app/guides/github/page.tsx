import type { Metadata } from 'next';
import { GitHubSetupGuide } from '@/components/guides/github-setup-guide';

export const metadata: Metadata = {
  title: 'GitHub 빠른 설정 가이드 | Linkmap',
  description:
    '바이브 코딩을 시작하기 위한 GitHub 설정 가이드. 가입부터 첫 저장소 생성까지 5단계로 안내합니다.',
  keywords: ['GitHub', '깃허브', '가이드', '바이브 코딩', '초보자', 'Git 설치', '저장소 만들기'],
};

export default function GitHubGuidePage() {
  return <GitHubSetupGuide />;
}
