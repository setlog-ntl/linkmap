'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap } from 'lucide-react';

const httpVsWebSocket = [
  {
    type: 'HTTP (요청-응답)',
    emoji: '📬',
    desc: '클라이언트가 매번 서버에 요청해야 합니다. 새 데이터가 있는지 알 수 없어서 주기적으로 물어봐야 합니다 (폴링).',
    analogy: '우체통을 직접 확인하러 가는 것',
    flow: ['클라이언트 → 요청', '서버 → 응답', '연결 종료', '(반복...)'],
    color: 'border-gray-200 dark:border-gray-700',
  },
  {
    type: 'WebSocket (양방향)',
    emoji: '📞',
    desc: '한번 연결하면 서버와 클라이언트가 자유롭게 데이터를 주고받습니다. 서버가 먼저 데이터를 보낼 수 있습니다.',
    analogy: '전화처럼 연결 상태를 유지하는 것',
    flow: ['핸드셰이크 (연결)', '서버 ↔ 클라이언트', '실시간 양방향 통신', '연결 유지'],
    color: 'border-primary/30',
  },
];

const sseVsWs = [
  { feature: '방향', sse: '서버 → 클라이언트 (단방향)', ws: '양방향' },
  { feature: '프로토콜', sse: 'HTTP', ws: 'WebSocket (ws://)' },
  { feature: '재연결', sse: '자동 재연결 내장', ws: '직접 구현 필요' },
  { feature: '브라우저 지원', sse: '모든 브라우저', ws: '모든 브라우저' },
  { feature: '적합한 용도', sse: '알림 피드, 실시간 로그', ws: '채팅, 게임, 협업' },
  { feature: '복잡도', sse: '낮음 (EventSource API)', ws: '중간 (WebSocket API)' },
];

const platforms = [
  {
    name: 'Supabase Realtime',
    tagline: 'PostgreSQL 변경을 실시간으로 구독',
    pros: ['DB 변경 자동 감지 (Postgres Changes)', 'Presence (접속 상태) 지원', 'Broadcast (방 기반 메시징)', '무료 200 동시 연결'],
    cons: ['Supabase 종속', '커스텀 이벤트 유연성 제한'],
    bestFor: 'Supabase 사용 프로젝트',
    free: '200 동시 연결',
    highlight: true,
    color: 'border-green-200 dark:border-green-800',
  },
  {
    name: 'Pusher',
    tagline: '실시간 메시징의 업계 표준',
    pros: ['안정적인 인프라', 'Channels/Presence/Triggers', '다양한 SDK 지원', '쉬운 설정'],
    cons: ['무료 한도 적음', '트래픽 많으면 비용 높음'],
    bestFor: '범용 실시간 기능',
    free: '200K 메시지/일, 100 연결',
    highlight: false,
    color: 'border-purple-200 dark:border-purple-800',
  },
  {
    name: 'Ably',
    tagline: '엔터프라이즈급 실시간 플랫폼',
    pros: ['99.999% 가동률 보장', '메시지 순서 보장', '글로벌 엣지 네트워크', '히스토리/재생 기능'],
    cons: ['무료 한도 제한적', '학습 곡선 존재'],
    bestFor: '높은 안정성이 필요한 서비스',
    free: '6M 메시지/월, 200 연결',
    highlight: false,
    color: 'border-blue-200 dark:border-blue-800',
  },
];

const supabaseExample = `// Supabase Realtime 구독 예시
import { createBrowserClient } from '@/lib/supabase/client';

const supabase = createBrowserClient();

// DB 변경 실시간 구독
const channel = supabase
  .channel('messages')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: 'room_id=eq.123',
    },
    (payload) => {
      // 새 메시지가 DB에 추가되면 즉시 실행
      setMessages(prev => [...prev, payload.new]);
    }
  )
  .subscribe();

// 컴포넌트 언마운트 시 구독 해제
return () => {
  supabase.removeChannel(channel);
};`;

export function RealtimeContent() {
  return (
    <div className="py-6 space-y-0">
      {/* 헤더 */}
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">실시간 메시징</h1>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          WebSocket의 원리를 이해하고, Supabase Realtime과 Pusher를 비교하여
          프로젝트에 맞는 실시간 기능을 구현하세요.
        </p>
      </ScrollReveal>

      {/* HTTP vs WebSocket */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">HTTP vs WebSocket</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            실시간 통신을 이해하려면 먼저 HTTP와 WebSocket의 차이를 알아야 합니다.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-3xl">
          {httpVsWebSocket.map((item, idx) => (
            <ScrollReveal key={item.type} delay={idx * 0.08}>
              <div className={`rounded-xl border p-5 h-full ${item.color}`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{item.emoji}</span>
                  <div className="font-bold text-sm">{item.type}</div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{item.desc}</p>
                <div className="rounded-lg bg-muted/50 p-3 mb-3">
                  <div className="text-[10px] text-muted-foreground italic">{item.analogy}</div>
                </div>
                <div className="space-y-1.5">
                  {item.flow.map((step, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span className="w-4 h-4 rounded-full bg-background/50 text-[9px] flex items-center justify-center shrink-0 font-bold border">
                        {i + 1}
                      </span>
                      <span className="text-muted-foreground">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* SSE vs WebSocket */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">SSE vs WebSocket</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            Server-Sent Events(SSE)는 서버에서 클라이언트로만 데이터를 보내는 단방향 방식입니다.
            양방향이 필요 없다면 SSE가 더 간단합니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-3xl overflow-x-auto mb-8">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-semibold text-muted-foreground">항목</th>
                  <th className="text-left py-2 px-3 font-semibold">SSE</th>
                  <th className="text-left py-2 px-3 font-semibold">WebSocket</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {sseVsWs.map((row) => (
                  <tr key={row.feature} className="border-b">
                    <td className="py-2 px-3 font-medium text-foreground">{row.feature}</td>
                    <td className="py-2 px-3">{row.sse}</td>
                    <td className="py-2 px-3">{row.ws}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollReveal>
      </section>

      {/* 플랫폼 비교 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">실시간 서비스 비교</h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-4xl">
            {platforms.map((p) => (
              <div key={p.name} className={`rounded-xl border p-5 bg-card shadow-sm ${p.color} ${p.highlight ? 'ring-2 ring-primary/20' : ''}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm">{p.name}</span>
                  {p.highlight && (
                    <Badge variant="secondary" className="text-[9px] bg-primary/10 text-primary">추천</Badge>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground mb-3">{p.tagline}</p>

                <div className="space-y-3 mb-3">
                  <div>
                    <div className="text-[10px] font-semibold text-green-600 dark:text-green-400 mb-1">장점</div>
                    <div className="space-y-1">
                      {p.pros.map((pro) => (
                        <div key={pro} className="text-[10px] text-muted-foreground flex items-start gap-1">
                          <span className="text-green-500 shrink-0">+</span>
                          <span>{pro}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold text-red-500 mb-1">단점</div>
                    <div className="space-y-1">
                      {p.cons.map((con) => (
                        <div key={con} className="text-[10px] text-muted-foreground flex items-start gap-1">
                          <span className="text-red-400 shrink-0">-</span>
                          <span>{con}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t space-y-1">
                  <div className="text-[10px]">
                    <span className="text-muted-foreground">최적: </span>
                    <span className="font-medium">{p.bestFor}</span>
                  </div>
                  <div className="text-[10px]">
                    <span className="text-muted-foreground">무료: </span>
                    <span className="text-green-600 dark:text-green-400 font-medium">{p.free}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Supabase Realtime 코드 예시 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">Supabase Realtime 코드 예시</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            Supabase를 사용 중이라면 별도 서비스 없이 DB 변경을 실시간으로 구독할 수 있습니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl rounded-lg bg-muted/50 border p-4 overflow-x-auto">
            <pre className="text-[11px] font-mono text-muted-foreground whitespace-pre leading-relaxed">
              {supabaseExample}
            </pre>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="mt-6 p-3 rounded-lg bg-muted/50 border max-w-2xl">
            <p className="text-xs text-muted-foreground">
              💡 <strong className="text-foreground">결론:</strong> Supabase를 이미 사용 중이라면{' '}
              <strong className="text-foreground">Supabase Realtime</strong>이 가장 간단합니다.
              독립적인 실시간 서비스가 필요하면 Pusher, 엔터프라이즈급이면 Ably를 고려하세요.
            </p>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
