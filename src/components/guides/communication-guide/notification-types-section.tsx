'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Badge } from '@/components/ui/badge';

const notificationTypes = [
  {
    name: '이메일 (Email)',
    icon: '📧',
    subtitle: '가장 보편적인 알림 채널',
    desc: '회원가입 확인, 비밀번호 재설정, 결제 영수증 등 공식적인 알림에 적합합니다. 사용자가 나중에 다시 확인할 수 있다는 장점이 있습니다.',
    services: ['Resend', 'SendGrid', 'AWS SES', 'Mailgun'],
    bestFor: '공식 알림, 영수증, 뉴스레터',
    speed: '수 초 ~ 수 분',
    tag: '공식 알림',
    tagColor: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300',
    color: 'border-blue-200 dark:border-blue-800',
  },
  {
    name: 'SMS / 문자',
    icon: '💬',
    subtitle: '가장 높은 확인율',
    desc: '2단계 인증(OTP), 긴급 알림에 주로 사용합니다. 이메일보다 확인율이 높지만 발송 비용이 있어 꼭 필요한 경우에만 사용합니다.',
    services: ['Twilio', 'NHN Cloud', 'Aligo', 'CoolSMS'],
    bestFor: 'OTP 인증, 긴급 알림, 예약 확인',
    speed: '수 초',
    tag: '인증 · 긴급',
    tagColor: 'bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300',
    color: 'border-green-200 dark:border-green-800',
  },
  {
    name: '푸시 알림 (Push)',
    icon: '🔔',
    subtitle: '브라우저·모바일 즉시 알림',
    desc: '앱이 닫혀있어도 알림을 받을 수 있습니다. 새 메시지, 업데이트, 프로모션 등 실시간 알림에 적합합니다.',
    services: ['FCM', 'OneSignal', 'Novu', 'Knock'],
    bestFor: '새 메시지 알림, 업데이트, 리마인더',
    speed: '즉시 (1초 이내)',
    tag: '실시간 · 리치',
    tagColor: 'bg-orange-100 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300',
    color: 'border-orange-200 dark:border-orange-800',
  },
  {
    name: '실시간 메시징 (Realtime)',
    icon: '⚡',
    subtitle: '양방향 실시간 통신',
    desc: 'WebSocket을 통해 서버와 클라이언트가 즉시 데이터를 주고받습니다. 채팅, 라이브 대시보드, 협업 도구에 필수입니다.',
    services: ['Supabase Realtime', 'Pusher', 'Ably', 'Socket.IO'],
    bestFor: '채팅, 실시간 대시보드, 협업 편집',
    speed: '즉시 (밀리초)',
    tag: '양방향 · 저지연',
    tagColor: 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300',
    color: 'border-purple-200 dark:border-purple-800',
  },
];

export function NotificationTypesSection() {
  return (
    <section id="notification-types" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">알림의 4가지 종류</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          사용자에게 메시지를 전달하는 방법은 크게 4가지입니다.
          각각 장단점이 다르므로 상황에 맞게 조합하여 사용합니다.
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {notificationTypes.map((n, idx) => (
          <ScrollReveal key={n.name} delay={idx * 0.08}>
            <div className={`rounded-xl border p-5 h-full flex flex-col ${n.color}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{n.icon}</span>
                  <div>
                    <div className="font-bold text-sm">{n.name}</div>
                    <div className="text-[10px] text-muted-foreground">{n.subtitle}</div>
                  </div>
                </div>
                <Badge variant="secondary" className={`text-[10px] shrink-0 ${n.tagColor}`}>
                  {n.tag}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{n.desc}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {n.services.map((svc) => (
                  <span key={svc} className="text-[10px] px-1.5 py-0.5 rounded bg-background/60 border font-mono">{svc}</span>
                ))}
              </div>
              <div className="mt-auto space-y-2">
                <div>
                  <div className="text-[10px] text-muted-foreground mb-1">적합한 용도</div>
                  <span className="text-[10px] font-medium">{n.bestFor}</span>
                </div>
                <div className="flex gap-4 text-[10px] text-muted-foreground pt-2 border-t border-current/10">
                  <span>전달 속도: {n.speed}</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal delay={0.3}>
        <div className="p-3 rounded-lg bg-muted/50 border max-w-2xl">
          <p className="text-xs text-muted-foreground">
            💡 <strong className="text-foreground">초보자 팁:</strong> 처음에는 이메일(Resend) 하나만
            연동해도 충분합니다. 서비스가 성장하면 푸시 알림과 실시간 메시징을 추가하세요.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
