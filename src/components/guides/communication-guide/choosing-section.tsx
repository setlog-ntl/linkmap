'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Badge } from '@/components/ui/badge';

const useCases = [
  {
    scenario: '회원가입 환영 메시지',
    recommended: '이메일',
    emoji: '📧',
    reason: '공식적이고, 사용자가 나중에 다시 볼 수 있습니다.',
    services: 'Resend, SendGrid',
  },
  {
    scenario: '2단계 인증 (OTP)',
    recommended: 'SMS',
    emoji: '💬',
    reason: '즉시 확인이 필요하고, 확인율이 가장 높습니다.',
    services: 'Twilio, NHN Cloud',
  },
  {
    scenario: '새 댓글/좋아요 알림',
    recommended: '푸시 알림',
    emoji: '🔔',
    reason: '앱을 보고 있지 않아도 즉시 알려줄 수 있습니다.',
    services: 'FCM, OneSignal',
  },
  {
    scenario: '실시간 채팅',
    recommended: '실시간 메시징',
    emoji: '⚡',
    reason: '밀리초 단위의 양방향 통신이 필수입니다.',
    services: 'Supabase Realtime, Pusher',
  },
  {
    scenario: '결제 완료 알림',
    recommended: '이메일 + 푸시',
    emoji: '📧🔔',
    reason: '영수증은 이메일로, 즉시 알림은 푸시로 보냅니다.',
    services: 'Resend + FCM',
  },
  {
    scenario: '라이브 대시보드',
    recommended: '실시간 메시징',
    emoji: '⚡',
    reason: '데이터가 변경되면 화면에 즉시 반영되어야 합니다.',
    services: 'Supabase Realtime, Ably',
  },
  {
    scenario: '예약 리마인더',
    recommended: 'SMS + 이메일',
    emoji: '💬📧',
    reason: '놓칠 수 없는 알림은 SMS, 상세 내용은 이메일로 보냅니다.',
    services: 'Twilio + Resend',
  },
  {
    scenario: '주간 리포트',
    recommended: '이메일',
    emoji: '📧',
    reason: '정기적인 보고서는 이메일이 가장 적합합니다.',
    services: 'Resend, SendGrid',
  },
];

const comparisonTable = [
  { label: '전달 속도', email: '수 초~분', sms: '수 초', push: '즉시', realtime: '밀리초' },
  { label: '확인율', email: '20~40%', sms: '90%+', push: '50~70%', realtime: '100% (접속 시)' },
  { label: '비용', email: '거의 무료', sms: '건당 과금', push: '무료~저렴', realtime: '연결 수 기반' },
  { label: '양방향', email: '불가', sms: '제한적', push: '불가', realtime: '완전 지원' },
  { label: '오프라인', email: '수신 가능', sms: '수신 가능', push: '대기 후 수신', realtime: '불가' },
  { label: '리치 콘텐츠', email: 'HTML/이미지', sms: '텍스트만', push: '제목+본문+이미지', realtime: 'JSON 데이터' },
];

export function ChoosingSection() {
  return (
    <section id="choosing" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">사용 사례별 추천</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          어떤 상황에서 어떤 알림 채널을 사용해야 할까요?
          아래 표를 참고하여 최적의 조합을 선택하세요.
        </p>
      </ScrollReveal>

      {/* 사용 사례 카드 */}
      <ScrollReveal delay={0.1}>
        <div className="max-w-3xl space-y-3 mb-10">
          {useCases.map((uc) => (
            <div key={uc.scenario} className="rounded-lg border bg-card shadow-sm p-4 flex items-start gap-4">
              <div className="text-xl shrink-0">{uc.emoji}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold">{uc.scenario}</span>
                  <Badge variant="secondary" className="text-[10px]">{uc.recommended}</Badge>
                </div>
                <div className="text-xs text-muted-foreground mb-1">{uc.reason}</div>
                <div className="text-[10px] text-muted-foreground">
                  <span className="font-medium text-foreground">추천 서비스:</span> {uc.services}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* 비교표 */}
      <ScrollReveal delay={0.15}>
        <h3 className="text-lg font-semibold mb-4">채널별 특성 비교</h3>
        <div className="max-w-4xl overflow-x-auto mb-6">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3 font-semibold text-muted-foreground">항목</th>
                <th className="text-left py-2 px-3 font-semibold">📧 이메일</th>
                <th className="text-left py-2 px-3 font-semibold">💬 SMS</th>
                <th className="text-left py-2 px-3 font-semibold">🔔 푸시</th>
                <th className="text-left py-2 px-3 font-semibold">⚡ 실시간</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {comparisonTable.map((row) => (
                <tr key={row.label} className="border-b">
                  <td className="py-2 px-3 font-medium text-foreground">{row.label}</td>
                  <td className="py-2 px-3">{row.email}</td>
                  <td className="py-2 px-3">{row.sms}</td>
                  <td className="py-2 px-3">{row.push}</td>
                  <td className="py-2 px-3">{row.realtime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ScrollReveal>
    </section>
  );
}
