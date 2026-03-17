'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

const cronExamples = [
  { expr: '* * * * *', meaning: '매분 실행', note: '테스트용으로만 사용' },
  { expr: '0 * * * *', meaning: '매시 정각', note: '시간당 1회' },
  { expr: '0 9 * * *', meaning: '매일 오전 9시', note: '일간 리포트' },
  { expr: '0 9 * * 1', meaning: '매주 월요일 9시', note: '주간 리포트' },
  { expr: '0 0 1 * *', meaning: '매월 1일 자정', note: '월간 정산' },
  { expr: '0 2 * * 0', meaning: '매주 일요일 새벽 2시', note: 'DB 백업' },
];

const cronFields = [
  { field: '분', range: '0-59', example: '30' },
  { field: '시', range: '0-23', example: '9' },
  { field: '일', range: '1-31', example: '*' },
  { field: '월', range: '1-12', example: '*' },
  { field: '요일', range: '0-6 (일=0)', example: '1 (월)' },
];

const platforms = [
  {
    name: 'Vercel Cron Jobs',
    icon: '▲',
    desc: 'vercel.json에 cron 표현식을 설정하면 자동으로 API Route를 호출합니다. Next.js와 가장 쉽게 연동됩니다.',
    pros: ['설정이 간단', 'Next.js 네이티브', '무료 플랜 지원'],
    cons: ['무료 플랜 1일 1회 제한', '실행 시간 10초 제한(Hobby)'],
    config: `// vercel.json
{
  "crons": [{
    "path": "/api/cron/daily-report",
    "schedule": "0 9 * * *"
  }]
}`,
    tag: '가장 쉬움',
    tagColor: 'bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300',
    color: 'border-green-200 dark:border-green-800',
  },
  {
    name: 'Inngest',
    icon: '⚡',
    desc: '이벤트 기반 워크플로우 엔진입니다. cron 스케줄링은 물론 이벤트 체이닝, 재시도, 동시성 제어까지 지원합니다.',
    pros: ['이벤트 체이닝', '자동 재시도', '실행 로그 대시보드'],
    cons: ['별도 SDK 설치', '학습 곡선'],
    config: `// inngest function 예시
export const dailyReport = inngest.createFunction(
  { id: 'daily-report' },
  { cron: '0 9 * * *' },
  async ({ step }) => {
    const data = await step.run('fetch-data', async () => {
      return await fetchSalesData();
    });
    await step.run('send-report', async () => {
      return await sendEmail(data);
    });
  }
);`,
    tag: '워크플로우',
    tagColor: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300',
    color: 'border-blue-200 dark:border-blue-800',
  },
  {
    name: 'Trigger.dev',
    icon: '🎯',
    desc: '장기 실행 백그라운드 작업에 특화된 플랫폼입니다. 서버리스 환경에서도 30분 이상의 작업을 안정적으로 실행할 수 있습니다.',
    pros: ['장기 실행 지원', 'TypeScript 네이티브', '서버리스 호환'],
    cons: ['비교적 새로운 도구', 'Pro 플랜 필요(일부 기능)'],
    config: `// trigger.dev 예시
export const weeklyBackup = task({
  id: 'weekly-backup',
  run: async () => {
    // 30분 이상 걸리는 작업도 OK
    await backupDatabase();
    await uploadToS3();
    await notifyTeam();
  },
});`,
    tag: '장기 실행',
    tagColor: 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300',
    color: 'border-purple-200 dark:border-purple-800',
  },
];

export function SchedulingContent() {
  return (
    <div className="py-6 space-y-0">
      {/* 헤더 */}
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">cron과 스케줄링</h1>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          정해진 시간에 자동으로 실행되는 시간 기반 자동화.
          cron 문법부터 Vercel Cron Jobs, Inngest, Trigger.dev 비교까지.
        </p>
      </ScrollReveal>

      {/* cron 문법 기초 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">cron 문법 기초</h2>
          <p className="text-muted-foreground mb-4 max-w-2xl text-sm">
            cron 표현식은 <strong className="text-foreground">&quot;분 시 일 월 요일&quot;</strong> 5자리로 구성됩니다.
            <code className="text-[10px] bg-muted px-1 rounded font-mono mx-1">*</code>는 &quot;매번&quot;을 의미합니다.
          </p>
        </ScrollReveal>

        {/* 필드 설명 */}
        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl mb-6">
            <div className="rounded-xl border bg-card shadow-sm p-5">
              <div className="flex items-center justify-between gap-2 mb-3">
                {cronFields.map((f, i) => (
                  <div key={f.field} className="flex flex-col items-center text-center gap-1 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-sm font-mono font-bold">
                      {f.example}
                    </div>
                    <div className="text-xs font-semibold">{f.field}</div>
                    <div className="text-[10px] text-muted-foreground">{f.range}</div>
                    {i < cronFields.length - 1 && (
                      <div className="hidden" />
                    )}
                  </div>
                ))}
              </div>
              <div className="text-center text-xs text-muted-foreground">
                예시: <code className="font-mono bg-muted px-1 rounded">30 9 * * 1</code> = 매주 월요일 오전 9시 30분
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* 자주 쓰는 예시 */}
        <ScrollReveal delay={0.15}>
          <h3 className="text-lg font-semibold mb-3">자주 쓰는 cron 표현식</h3>
          <div className="max-w-2xl overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-semibold">표현식</th>
                  <th className="text-left py-2 px-3 font-semibold">의미</th>
                  <th className="text-left py-2 px-3 font-semibold text-muted-foreground">용도</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {cronExamples.map((c) => (
                  <tr key={c.expr} className="border-b">
                    <td className="py-2 px-3">
                      <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">{c.expr}</code>
                    </td>
                    <td className="py-2 px-3 font-medium text-foreground">{c.meaning}</td>
                    <td className="py-2 px-3">{c.note}</td>
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
          <h2 className="text-xl md:text-2xl font-bold mb-3">스케줄링 플랫폼 비교</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            프로젝트 규모와 요구사항에 따라 적합한 도구를 선택하세요.
          </p>
        </ScrollReveal>

        <div className="space-y-4 max-w-3xl">
          {platforms.map((p, idx) => (
            <ScrollReveal key={p.name} delay={idx * 0.1}>
              <div className={`rounded-xl border bg-card shadow-sm overflow-hidden ${p.color}`}>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{p.icon}</span>
                      <div className="font-bold text-sm">{p.name}</div>
                    </div>
                    <Badge variant="secondary" className={`text-[10px] shrink-0 ${p.tagColor}`}>
                      {p.tag}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">{p.desc}</p>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div>
                      <div className="text-[10px] font-semibold text-green-600 dark:text-green-400 mb-1">장점</div>
                      <div className="space-y-0.5">
                        {p.pros.map((pro) => (
                          <div key={pro} className="text-[10px] text-muted-foreground">+ {pro}</div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-semibold text-red-500 mb-1">단점</div>
                      <div className="space-y-0.5">
                        {p.cons.map((con) => (
                          <div key={con} className="text-[10px] text-muted-foreground">- {con}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                {/* 코드 예시 */}
                <div className="border-t bg-muted/30">
                  <div className="px-4 py-2 border-b bg-muted/50">
                    <span className="text-[10px] text-muted-foreground font-mono">설정 예시</span>
                  </div>
                  <pre className="p-4 overflow-x-auto text-xs leading-relaxed">
                    <code className="text-muted-foreground">{p.config}</code>
                  </pre>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 큐(Queue) 개념 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">큐(Queue) 개념</h2>
          <p className="text-muted-foreground mb-4 max-w-2xl text-sm leading-relaxed">
            스케줄링과 함께 자주 등장하는 개념이 <strong className="text-foreground">큐(Queue)</strong>입니다.
            작업을 줄 세워놓고 하나씩 순서대로 처리하는 방식입니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl rounded-xl border bg-card p-5 mb-4">
            <div className="flex items-center gap-3 mb-4">
              {['이메일 1', '이메일 2', '이메일 3'].map((item, i) => (
                <div key={item} className="flex items-center">
                  <div className="rounded-lg border bg-muted/50 px-3 py-2 text-xs font-medium">{item}</div>
                  {i < 2 && (
                    <svg className="w-6 h-4 text-muted-foreground/40 mx-1" viewBox="0 0 24 16" fill="none">
                      <path d="M0 8h18m0 0-5-4m5 4-5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              ))}
              <svg className="w-6 h-4 text-primary mx-1" viewBox="0 0 24 16" fill="none">
                <path d="M0 8h18m0 0-5-4m5 4-5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="rounded-lg border-2 border-primary bg-primary/10 px-3 py-2 text-xs font-bold text-primary">처리 중</div>
            </div>
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              1,000명에게 이메일을 보낼 때 한꺼번에 보내면 서버가 터집니다.
              <br />큐에 넣고 <strong className="text-foreground">초당 10개씩</strong> 순서대로 처리하면 안전합니다.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="p-3 rounded-lg bg-muted/50 border max-w-2xl">
            <p className="text-xs text-muted-foreground">
              💡 <strong className="text-foreground">초보자 팁:</strong> 처음에는 Vercel Cron Jobs로 시작하세요.
              <code className="text-[10px] bg-background/60 px-1 rounded font-mono mx-1">vercel.json</code>에
              3줄만 추가하면 됩니다. 작업이 복잡해지면 Inngest나 Trigger.dev로 전환하세요.
            </p>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
