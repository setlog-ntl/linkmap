'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell } from 'lucide-react';

const pushFlow = [
  { step: '1', emoji: '👤', label: '사용자가 알림 허용', desc: '브라우저가 권한 팝업을 표시합니다' },
  { step: '2', emoji: '🔑', label: '구독 토큰 발급', desc: '푸시 서비스(FCM)가 고유 토큰을 생성합니다' },
  { step: '3', emoji: '💾', label: '서버에 토큰 저장', desc: 'API로 토큰을 DB에 저장합니다' },
  { step: '4', emoji: '📡', label: '서버가 푸시 요청', desc: 'FCM API에 메시지와 토큰을 전달합니다' },
  { step: '5', emoji: '🔔', label: '사용자에게 알림 표시', desc: '서비스 워커가 알림을 표시합니다' },
];

const platforms = [
  {
    name: 'FCM (Firebase Cloud Messaging)',
    tagline: 'Google의 무료 푸시 알림 서비스',
    pros: ['완전 무료 (발송 수 제한 없음)', 'Android/iOS/Web 모두 지원', 'Firebase 생태계 통합', '토픽 기반 대량 발송'],
    cons: ['직접 구현해야 할 부분이 많음', '대시보드 UI가 복잡', '세그먼트 기능 제한적'],
    bestFor: '무료로 직접 구현하고 싶은 개발자',
    free: '완전 무료',
    highlight: false,
    color: 'border-orange-200 dark:border-orange-800',
  },
  {
    name: 'OneSignal',
    tagline: '올인원 푸시 알림 플랫폼',
    pros: ['대시보드에서 쉽게 발송', '사용자 세그먼트 기능', 'A/B 테스트 내장', 'SDK 설치 간편'],
    cons: ['무료 플랜 기능 제한', '유료 플랜 비용 높음', 'FCM보다 지연 가능'],
    bestFor: '비개발자도 알림을 관리해야 하는 팀',
    free: '무제한 모바일, 웹 10,000명',
    highlight: true,
    color: 'border-neutral-200 dark:border-neutral-700',
  },
  {
    name: 'Novu',
    tagline: '오픈소스 알림 인프라',
    pros: ['이메일+푸시+SMS 통합', '오픈소스 (셀프 호스팅 가능)', '알림 센터 위젯 제공', 'React 컴포넌트'],
    cons: ['상대적으로 신생 서비스', '문서가 부족한 부분 있음'],
    bestFor: '멀티채널 알림을 하나로 관리',
    free: '30,000건/월',
    highlight: false,
    color: 'border-purple-200 dark:border-purple-800',
  },
];

const serviceWorkerCode = `// public/sw.js (서비스 워커)
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon-192.png',
      badge: '/badge-72.png',
      data: { url: data.url },
    })
  );
});

// 알림 클릭 시 해당 페이지로 이동
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});`;

export function PushContent() {
  return (
    <div className="py-6 space-y-0">
      {/* 헤더 */}
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">푸시 알림 연동</h1>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          푸시 알림은 앱이 닫혀있어도 사용자에게 메시지를 전달할 수 있는 강력한 채널입니다.
          웹 푸시의 동작 원리와 FCM, OneSignal을 비교합니다.
        </p>
      </ScrollReveal>

      {/* 웹 푸시 흐름 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">웹 푸시 동작 흐름</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            웹 푸시 알림은 5단계를 거쳐 사용자에게 전달됩니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl space-y-3 mb-8">
            {pushFlow.map((f) => (
              <div key={f.step} className="rounded-lg border bg-card p-4 flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                  {f.step}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{f.emoji}</span>
                    <span className="text-sm font-bold">{f.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* 서비스 워커 개념 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">서비스 워커란?</h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl mb-6">
            <div className="rounded-xl border bg-card p-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🌐</span>
                  <div>
                    <div className="font-medium text-sm">일반 JavaScript</div>
                    <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      브라우저 탭이 열려있을 때만 실행됩니다.
                      탭을 닫으면 멈춥니다.
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚙️</span>
                  <div>
                    <div className="font-medium text-sm">서비스 워커</div>
                    <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      브라우저 백그라운드에서 독립 실행됩니다.
                      탭이 닫혀있어도 푸시 수신 가능.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="max-w-2xl rounded-lg bg-muted/50 border p-4 overflow-x-auto mb-6">
            <pre className="text-[11px] font-mono text-muted-foreground whitespace-pre leading-relaxed">
              {serviceWorkerCode}
            </pre>
          </div>
        </ScrollReveal>
      </section>

      {/* 플랫폼 비교 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">푸시 서비스 비교</h2>
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

        <ScrollReveal delay={0.15}>
          <div className="p-3 rounded-lg bg-muted/50 border max-w-2xl">
            <p className="text-xs text-muted-foreground">
              💡 <strong className="text-foreground">결론:</strong> 직접 구현 역량이 있다면 <strong className="text-foreground">FCM</strong>(무료),
              대시보드 관리가 필요하다면 <strong className="text-foreground">OneSignal</strong>을 추천합니다.
              멀티채널 통합이 목표라면 Novu도 좋은 선택입니다.
            </p>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
