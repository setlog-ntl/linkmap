import type { Metadata } from 'next';
import { VercelGuide } from '@/components/guides/vercel-guide';

export const metadata: Metadata = {
  title: 'Vercel 배포 가이드 | Linkmap',
  description:
    'Vercel 계정 생성부터 GitHub 연동, 환경변수 설정, 커스텀 도메인 연결까지 단계별로 안내합니다.',
  keywords: ['Vercel', '배포', 'CI/CD', '프리뷰', '환경변수', 'Next.js', '가이드', 'Linkmap'],
};

export default function VercelGuidePage() {
  return <VercelGuide />;
}
