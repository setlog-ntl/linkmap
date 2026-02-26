import type { Metadata } from 'next';
import { BackendGuide } from '@/components/guides/backend-guide';

export const metadata: Metadata = {
  title: '백엔드란? — 바이브 코더 가이드 | Linkmap',
  description:
    '사용자 눈에는 보이지 않지만 앱을 돌아가게 하는 서버·API·데이터베이스 개념을 초보자 눈높이로 설명합니다.',
  keywords: ['백엔드', 'API', '데이터베이스', 'REST', 'Supabase', 'Firebase', 'BaaS', '서버', '초보자'],
};

export default function BackendGuidePage() {
  return <BackendGuide />;
}
