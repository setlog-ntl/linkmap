'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail } from 'lucide-react';

const emailTypes = [
  {
    type: '트랜잭셔널 이메일',
    emoji: '🔐',
    desc: '사용자 행동에 의해 자동 발송됩니다. 비밀번호 재설정, 결제 확인, 가입 인증 등이 해당됩니다.',
    examples: ['비밀번호 재설정', '이메일 인증', '결제 영수증', '배송 알림'],
    needConsent: false,
    priority: '높음 (즉시 발송)',
  },
  {
    type: '마케팅 이메일',
    emoji: '📢',
    desc: '프로모션, 뉴스레터 등 사업적 목적으로 대량 발송됩니다. 반드시 수신 동의와 수신 거부 링크가 필요합니다.',
    examples: ['주간 뉴스레터', '할인 프로모션', '신기능 안내', '이벤트 초대'],
    needConsent: true,
    priority: '보통 (예약 발송 가능)',
  },
];

const platforms = [
  {
    name: 'Resend',
    tagline: '개발자 친화적 이메일 API',
    pros: ['React Email로 템플릿 작성', 'TypeScript 네이티브 지원', 'API가 간결하고 직관적', '무료 100건/일'],
    cons: ['마케팅 이메일 기능 제한적', '대량 발송 시 비용 높음'],
    bestFor: '트랜잭셔널 이메일, 스타트업',
    free: '100건/일, 1개 도메인',
    highlight: true,
    color: 'border-neutral-200 dark:border-neutral-700',
  },
  {
    name: 'SendGrid',
    tagline: 'Twilio의 대규모 이메일 플랫폼',
    pros: ['대량 발송에 최적화', '마케팅 이메일 대시보드', '이메일 분석/통계 강력', '무료 100건/일'],
    cons: ['API가 다소 복잡', '설정 단계가 많음'],
    bestFor: '마케팅 이메일, 대량 발송',
    free: '100건/일',
    highlight: false,
    color: 'border-blue-200 dark:border-blue-800',
  },
  {
    name: 'AWS SES',
    tagline: 'Amazon의 저비용 대용량 이메일',
    pros: ['매우 저렴한 가격 ($0.10/1000건)', 'AWS 생태계 통합', '높은 발송 한도'],
    cons: ['초기 설정 복잡 (샌드박스 해제)', '관리 콘솔 UI 불편'],
    bestFor: '대용량 발송, AWS 사용자',
    free: 'EC2에서 62,000건/월',
    highlight: false,
    color: 'border-orange-200 dark:border-orange-800',
  },
];

const codeExample = `// Resend로 이메일 보내기 (API Route)
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { email, name } = await request.json();

  const { data, error } = await resend.emails.send({
    from: 'MyApp <noreply@myapp.com>',
    to: email,
    subject: \`\${name}님, 가입을 환영합니다!\`,
    html: \`
      <h1>환영합니다, \${name}님!</h1>
      <p>MyApp에 가입해주셔서 감사합니다.</p>
      <a href="https://myapp.com/dashboard">
        시작하기
      </a>
    \`,
  });

  if (error) {
    return Response.json({ error }, { status: 400 });
  }
  return Response.json({ data });
}`;

export function EmailContent() {
  return (
    <div className="py-6 space-y-0">
      {/* 헤더 */}
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">이메일 알림 연동</h1>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          이메일은 가장 보편적인 알림 채널입니다. 트랜잭셔널 이메일과 마케팅 이메일의 차이를 이해하고,
          Resend와 SendGrid를 비교하여 프로젝트에 맞는 서비스를 선택하세요.
        </p>
      </ScrollReveal>

      {/* 이메일 유형 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">트랜잭셔널 vs 마케팅 이메일</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            이메일은 목적에 따라 두 가지로 나뉩니다. 법적 요구사항이 다르므로 반드시 구분하세요.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-3xl">
          {emailTypes.map((et, idx) => (
            <ScrollReveal key={et.type} delay={idx * 0.08}>
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{et.emoji}</span>
                    <CardTitle className="text-sm">{et.type}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-muted-foreground leading-relaxed">{et.desc}</p>
                  <div className="flex flex-wrap gap-1">
                    {et.examples.map((ex) => (
                      <span key={ex} className="text-[10px] px-1.5 py-0.5 rounded bg-muted border">{ex}</span>
                    ))}
                  </div>
                  <div className="pt-2 border-t space-y-1 text-[10px] text-muted-foreground">
                    <div>수신 동의 필요: <span className={et.needConsent ? 'text-red-500 font-medium' : 'text-green-600 font-medium'}>{et.needConsent ? '필수' : '불필요'}</span></div>
                    <div>발송 우선순위: {et.priority}</div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 플랫폼 비교 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">이메일 서비스 비교</h2>
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

      {/* 코드 예시 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">기본 코드 예시</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            Resend를 사용하여 Next.js API Route에서 이메일을 보내는 예시입니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl rounded-lg bg-muted/50 border p-4 overflow-x-auto">
            <pre className="text-[11px] font-mono text-muted-foreground whitespace-pre leading-relaxed">
              {codeExample}
            </pre>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="mt-6 p-3 rounded-lg bg-muted/50 border max-w-2xl">
            <p className="text-xs text-muted-foreground">
              💡 <strong className="text-foreground">결론:</strong> 초보자라면 <strong className="text-foreground">Resend</strong>를
              추천합니다. API가 간결하고 TypeScript 지원이 좋으며, React Email로 아름다운 템플릿을 쉽게 만들 수 있습니다.
            </p>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
