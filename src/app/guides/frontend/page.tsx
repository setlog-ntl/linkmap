import type { Metadata } from 'next';
import { FrontendGuide } from '@/components/guides/frontend-guide';

export const metadata: Metadata = {
  title: '프론트엔드란? — 바이브 코더 가이드 | Linkmap',
  description:
    '브라우저에서 실행되는 모든 것 — HTML·CSS·JavaScript부터 React·Next.js까지 초보자 눈높이로 설명합니다.',
  keywords: ['프론트엔드', 'HTML', 'CSS', 'JavaScript', 'React', '컴포넌트', 'CSR', 'SSR', '초보자'],
};

export default function FrontendGuidePage() {
  return <FrontendGuide />;
}
