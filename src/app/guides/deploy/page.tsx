import type { Metadata } from 'next';
import { DeployGuide } from '@/components/guides/deploy-guide';

export const metadata: Metadata = {
  title: '도메인·배포·서버란? — 바이브 코더 가이드 | Linkmap',
  description:
    '내 컴퓨터에서 전 세계로 — 도메인·DNS·서버·CDN·배포 파이프라인 개념을 초보자 눈높이로 설명합니다.',
  keywords: ['도메인', 'DNS', '배포', '서버', 'CDN', '호스팅', 'Vercel', 'Cloudflare', '초보자'],
};

export default function DeployGuidePage() {
  return <DeployGuide />;
}
