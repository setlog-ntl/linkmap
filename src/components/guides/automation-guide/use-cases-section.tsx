'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Badge } from '@/components/ui/badge';

const useCases = [
  {
    title: '주문 알림 자동 발송',
    emoji: '🛒',
    type: '이벤트 기반',
    typeColor: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300',
    desc: '쇼핑몰에서 주문이 들어오면 자동으로 주문 확인 이메일을 보내고, 재고를 차감하고, Slack으로 팀에 알립니다.',
    flow: ['주문 완료', '→ Webhook 트리거', '→ 이메일 발송 + 재고 차감 + Slack 알림'],
    tools: ['Stripe Webhook', 'SendGrid', 'Slack API'],
    color: 'border-blue-200 dark:border-blue-800',
  },
  {
    title: '정기 리포트 생성',
    emoji: '📊',
    type: '시간 기반',
    typeColor: 'bg-yellow-100 dark:bg-yellow-900/60 text-yellow-700 dark:text-yellow-300',
    desc: '매일 아침 9시에 전날 매출 데이터를 집계하고, 보기 좋은 리포트를 만들어 이메일로 보냅니다.',
    flow: ['매일 09:00 (cron)', '→ DB에서 데이터 집계', '→ PDF 생성 + 이메일 발송'],
    tools: ['Vercel Cron', 'Supabase', 'Resend'],
    color: 'border-yellow-200 dark:border-yellow-800',
  },
  {
    title: 'SNS 자동 포스팅',
    emoji: '📱',
    type: '외부 연동',
    typeColor: 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300',
    desc: '블로그에 새 글을 발행하면 자동으로 카카오톡 채널, 인스타그램, 트위터에 요약과 링크를 게시합니다.',
    flow: ['블로그 발행', '→ 각 SNS API 호출', '→ 자동 포스팅 + 결과 로깅'],
    tools: ['카카오 API', 'Instagram Graph API', 'Twitter API'],
    color: 'border-purple-200 dark:border-purple-800',
  },
  {
    title: '데이터 동기화',
    emoji: '🔄',
    type: '이벤트 + 시간',
    typeColor: 'bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300',
    desc: '고객 정보가 업데이트되면 CRM, 이메일 마케팅 도구, 스프레드시트에 실시간 동기화합니다. 야간에는 전체 데이터 정합성 검증을 실행합니다.',
    flow: ['데이터 변경', '→ 실시간 Webhook 동기화', '+ 매일 02:00 전체 검증'],
    tools: ['Database Webhook', 'Google Sheets API', 'Inngest'],
    color: 'border-green-200 dark:border-green-800',
  },
];

export function UseCasesSection() {
  return (
    <section id="use-cases" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">실전 활용 사례</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl text-sm leading-relaxed">
          실제 프로젝트에서 자동화가 어떻게 사용되는지 4가지 사례를 살펴봅니다.
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
        {useCases.map((uc, idx) => (
          <ScrollReveal key={uc.title} delay={idx * 0.08}>
            <div className={`rounded-xl border bg-card shadow-sm p-5 h-full flex flex-col ${uc.color}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{uc.emoji}</span>
                  <div className="font-bold text-sm">{uc.title}</div>
                </div>
                <Badge variant="secondary" className={`text-[10px] shrink-0 ${uc.typeColor}`}>
                  {uc.type}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{uc.desc}</p>

              {/* 흐름 */}
              <div className="rounded-lg bg-muted/50 p-3 mb-3">
                <div className="text-[10px] font-semibold text-muted-foreground mb-1.5">자동화 흐름</div>
                <div className="space-y-1">
                  {uc.flow.map((step, i) => (
                    <div key={i} className="text-xs text-muted-foreground">
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              {/* 사용 도구 */}
              <div className="mt-auto">
                <div className="flex flex-wrap gap-1">
                  {uc.tools.map((tool) => (
                    <span key={tool} className="text-[10px] px-1.5 py-0.5 rounded bg-background/60 border font-mono">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* 초보자 팁 */}
      <ScrollReveal delay={0.4}>
        <div className="mt-8 p-3 rounded-lg bg-muted/50 border max-w-2xl">
          <p className="text-xs text-muted-foreground">
            💡 <strong className="text-foreground">초보자 팁:</strong> 처음에는 가장 간단한 &quot;시간 기반 자동화&quot;부터 시작하세요.
            Vercel Cron으로 매일 한 번 실행되는 간단한 작업을 만들어보면 자동화의 감을 잡을 수 있습니다.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
