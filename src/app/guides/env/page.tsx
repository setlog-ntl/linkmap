import type { Metadata } from 'next';
import { EnvGuide } from '@/components/guides/env-guide';

export const metadata: Metadata = {
  title: '환경변수 완전 정복 — 바이브 코더 가이드 | Linkmap',
  description:
    'AI가 만든 코드를 배포하려면 꼭 알아야 할 환경변수(.env) 개념을 초보자 눈높이에서 쉽게 설명합니다.',
  keywords: ['환경변수', '.env', 'API Key', 'NEXT_PUBLIC', '배포', '가이드', '초보자', 'Linkmap'],
};

export default function EnvGuidePage() {
  return <EnvGuide />;
}
