import type { Metadata } from 'next';
import { AuthGuide } from '@/components/guides/auth-guide';

export const metadata: Metadata = {
  title: '인증 가이드 — 두 가지만 알면 됩니다 | Linkmap',
  description:
    'Linkmap의 앱 로그인과 서비스 연동, 두 가지 인증 레이어를 쉽게 이해하세요. 초보자용 시각 가이드.',
  keywords: ['인증', 'OAuth', 'API Key', '로그인', '서비스 연동', '가이드', '초보자', 'Linkmap'],
};

export default function AuthGuidePage() {
  return <AuthGuide />;
}
