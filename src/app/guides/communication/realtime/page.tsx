import type { Metadata } from 'next';
import { RealtimeContent } from '@/components/guides/communication-guide/realtime-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: '실시간 메시징 — WebSocket·Supabase Realtime·Pusher 비교 | Linkmap',
  description:
    'WebSocket의 원리와 Supabase Realtime, Pusher를 비교하여 실시간 기능 구현 방법을 초보자 눈높이로 설명합니다.',
  keywords: ['WebSocket', 'Supabase Realtime', 'Pusher', '실시간', 'SSE', '채팅', '라이브 업데이트'],
};

export default function RealtimePage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'communication/realtime',
    title: '실시간 메시징 — WebSocket·Supabase Realtime·Pusher 비교',
    description: 'WebSocket의 원리와 Supabase Realtime, Pusher를 비교하여 실시간 기능 구현 방법을 설명합니다.',
    faqs: [
      { q: 'WebSocket과 HTTP의 차이는?', a: 'HTTP는 요청-응답 방식으로 클라이언트가 매번 요청해야 하지만, WebSocket은 연결을 유지하며 서버가 먼저 데이터를 보낼 수 있습니다.' },
      { q: 'Supabase Realtime은 무료인가요?', a: '무료 플랜에서 최대 200개 동시 연결을 지원합니다. 소규모 프로젝트에 충분합니다.' },
      { q: 'SSE와 WebSocket 중 뭘 써야 하나요?', a: '서버→클라이언트 단방향 알림이면 SSE가 간단하고, 양방향 통신(채팅 등)이 필요하면 WebSocket을 사용하세요.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <RealtimeContent />
    </>
  );
}
