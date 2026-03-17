import type { Metadata } from 'next';
import { PushContent } from '@/components/guides/communication-guide/push-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: '푸시 알림 연동 — FCM·OneSignal 비교 | Linkmap',
  description:
    'FCM과 OneSignal을 비교하고, 웹 푸시 흐름과 서비스 워커 개념을 초보자 눈높이로 설명합니다.',
  keywords: ['푸시 알림', 'FCM', 'OneSignal', 'Web Push', '서비스 워커', 'Service Worker', '모바일 푸시'],
};

export default function PushPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'communication/push',
    title: '푸시 알림 연동 — FCM·OneSignal 비교',
    description: 'FCM과 OneSignal을 비교하고, 웹 푸시 흐름과 서비스 워커 개념을 설명합니다.',
    faqs: [
      { q: 'FCM과 OneSignal의 차이는?', a: 'FCM은 Google에서 제공하는 무료 서비스로 직접 구현이 필요하고, OneSignal은 대시보드와 세그먼트 기능이 내장된 올인원 솔루션입니다.' },
      { q: '서비스 워커가 뭔가요?', a: '브라우저 백그라운드에서 실행되는 스크립트입니다. 앱이 닫혀있어도 푸시 알림을 수신할 수 있게 해줍니다.' },
      { q: '웹 푸시는 모바일에서도 되나요?', a: 'Android Chrome에서는 완벽 지원됩니다. iOS Safari는 16.4부터 PWA로 설치된 앱에서 지원합니다.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <PushContent />
    </>
  );
}
