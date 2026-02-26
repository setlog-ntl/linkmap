import type { Metadata } from 'next';
import { GuidesHub } from '@/components/guides/guides-hub';

export const metadata: Metadata = {
  title: '가이드 — 바이브 코딩 개념부터 서비스 설정까지 | Linkmap',
  description:
    '환경변수, 인증, 프론트엔드, 백엔드, 배포 등 핵심 개념과 GitHub, Cloudflare, OpenAI 서비스 설정 가이드를 제공합니다.',
  keywords: ['가이드', '바이브 코딩', '환경변수', 'GitHub', 'Cloudflare', 'OpenAI', '초보자', 'Linkmap'],
};

export default function GuidesPage() {
  return <GuidesHub />;
}
