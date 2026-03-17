'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Badge } from '@/components/ui/badge';

const automationTypes = [
  {
    name: '이벤트 기반 (웹훅)',
    icon: '🔔',
    subtitle: 'Webhook / Event-driven',
    desc: '특정 이벤트가 발생하면 즉시 실행됩니다. "결제가 완료되면 영수증 이메일 보내기"처럼 실시간 반응이 필요할 때 사용합니다.',
    examples: ['GitHub 웹훅', 'Stripe 결제 알림', 'Supabase Database Webhook'],
    trigger: '이벤트 발생 시 즉시',
    tag: '실시간 · Push',
    tagColor: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300',
    color: 'border-blue-200 dark:border-blue-800',
    subGuide: '/guides/automation/webhook',
  },
  {
    name: '시간 기반 (cron/스케줄링)',
    icon: '⏰',
    subtitle: 'Cron Job / Scheduling',
    desc: '정해진 시간에 자동 실행됩니다. "매일 아침 9시에 매출 리포트 생성"처럼 주기적인 작업에 사용합니다.',
    examples: ['Vercel Cron Jobs', 'Inngest', 'GitHub Actions 스케줄'],
    trigger: '정해진 시간/주기',
    tag: '정기 실행 · Timer',
    tagColor: 'bg-yellow-100 dark:bg-yellow-900/60 text-yellow-700 dark:text-yellow-300',
    color: 'border-yellow-200 dark:border-yellow-800',
    subGuide: '/guides/automation/scheduling',
  },
  {
    name: '외부 연동 (API)',
    icon: '🔗',
    subtitle: 'API Integration',
    desc: '외부 서비스의 API를 호출하여 데이터를 주고받습니다. "카카오톡으로 알림 보내기", "인스타그램에 자동 포스팅"처럼 서비스 간 연결에 사용합니다.',
    examples: ['카카오 API', 'Instagram API', 'YouTube Data API'],
    trigger: '요청 시 (On-demand)',
    tag: '외부 서비스 · 연동',
    tagColor: 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300',
    color: 'border-purple-200 dark:border-purple-800',
    subGuide: '/guides/automation/sns-api',
  },
];

export function AutomationTypesSection() {
  return (
    <section id="automation-types" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">자동화 유형 3가지</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl text-sm leading-relaxed">
          자동화는 크게 3가지 방식으로 나뉩니다.
          상황에 따라 적절한 방식을 선택하세요.
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl">
        {automationTypes.map((t, idx) => (
          <ScrollReveal key={t.name} delay={idx * 0.08}>
            <div className={`rounded-xl border bg-card shadow-sm p-5 h-full flex flex-col ${t.color}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{t.icon}</span>
                  <div>
                    <div className="font-bold text-sm">{t.name}</div>
                    <div className="text-[10px] text-muted-foreground">{t.subtitle}</div>
                  </div>
                </div>
              </div>
              <Badge variant="secondary" className={`text-[10px] self-start mb-3 ${t.tagColor}`}>
                {t.tag}
              </Badge>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{t.desc}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {t.examples.map((ex) => (
                  <span key={ex} className="text-[10px] px-1.5 py-0.5 rounded bg-background/60 border font-mono">
                    {ex}
                  </span>
                ))}
              </div>
              <div className="mt-auto space-y-2">
                <div className="flex gap-4 text-[10px] text-muted-foreground pt-2 border-t border-current/10">
                  <span>실행 시점: {t.trigger}</span>
                </div>
                <a
                  href={t.subGuide}
                  className="text-xs text-primary hover:underline font-medium inline-block"
                >
                  자세히 보기 →
                </a>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* 비교 요약 */}
      <ScrollReveal delay={0.3}>
        <div className="mt-8 max-w-3xl overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3 font-semibold text-muted-foreground">구분</th>
                <th className="text-left py-2 px-3 font-semibold">🔔 이벤트 기반</th>
                <th className="text-left py-2 px-3 font-semibold">⏰ 시간 기반</th>
                <th className="text-left py-2 px-3 font-semibold">🔗 외부 연동</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b">
                <td className="py-2 px-3 font-medium text-foreground">언제 실행?</td>
                <td className="py-2 px-3">이벤트 발생 즉시</td>
                <td className="py-2 px-3">정해진 시간/주기</td>
                <td className="py-2 px-3">요청 시(On-demand)</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-3 font-medium text-foreground">대표 도구</td>
                <td className="py-2 px-3">Webhook, Pub/Sub</td>
                <td className="py-2 px-3">cron, Inngest</td>
                <td className="py-2 px-3">REST API, SDK</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-3 font-medium text-foreground">적합한 작업</td>
                <td className="py-2 px-3">결제 알림, PR 리뷰</td>
                <td className="py-2 px-3">일간 리포트, 백업</td>
                <td className="py-2 px-3">SNS 포스팅, 메시지</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium text-foreground">난이도</td>
                <td className="py-2 px-3">중간</td>
                <td className="py-2 px-3">쉬움</td>
                <td className="py-2 px-3">중간~어려움</td>
              </tr>
            </tbody>
          </table>
        </div>
      </ScrollReveal>
    </section>
  );
}
