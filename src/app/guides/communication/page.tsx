import type { Metadata } from 'next';
import { CommunicationGuide } from '@/components/guides/communication-guide';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: '커뮤니케이션 가이드 — 바이브 코더 가이드 | Linkmap',
  description:
    '이메일, SMS, 푸시 알림, 실시간 메시징 등 알림 서비스 연동 방법을 초보자 눈높이로 설명합니다.',
  keywords: ['이메일', 'SMS', '푸시 알림', 'WebSocket', 'Resend', 'SendGrid', 'FCM', '초보자'],
};

export default function CommunicationGuidePage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'communication',
    title: '커뮤니케이션 가이드 — 바이브 코더 가이드',
    description: '이메일, SMS, 푸시 알림, 실시간 메시징 등 알림 서비스 연동 방법을 초보자 눈높이로 설명합니다.',
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <CommunicationGuide />
    </>
  );
}
