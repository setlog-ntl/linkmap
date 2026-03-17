'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const checklist = [
  {
    phase: '사전 준비',
    icon: '📋',
    items: [
      { task: 'PG사 가입 및 테스트 API 키 발급', required: true },
      { task: '결제할 상품/서비스 가격 정책 확정', required: true },
      { task: '환불/취소 정책 수립', required: true },
      { task: 'webhook 수신 URL 결정', required: false },
    ],
    color: 'border-blue-200 dark:border-blue-800',
  },
  {
    phase: '개발 단계',
    icon: '💻',
    items: [
      { task: '결제 API 라우트 구현 (서버 사이드)', required: true },
      { task: '결제 UI 구현 (클라이언트)', required: true },
      { task: '웹훅 엔드포인트 구현', required: true },
      { task: '결제 상태 관리 (DB 테이블)', required: true },
      { task: '에러 처리 및 사용자 안내 메시지', required: true },
    ],
    color: 'border-purple-200 dark:border-purple-800',
  },
  {
    phase: '테스트 단계',
    icon: '🧪',
    items: [
      { task: '테스트 카드로 결제 성공 확인', required: true },
      { task: '결제 실패 케이스 테스트', required: true },
      { task: '웹훅 수신 및 처리 확인', required: true },
      { task: '환불/취소 테스트', required: true },
      { task: '중복 결제 방지 확인', required: false },
    ],
    color: 'border-green-200 dark:border-green-800',
  },
  {
    phase: '프로덕션 전환',
    icon: '🚀',
    items: [
      { task: '프로덕션 API 키로 교체', required: true },
      { task: '웹훅 URL을 프로덕션 도메인으로 변경', required: true },
      { task: 'API 키를 환경변수로 관리', required: true },
      { task: '소액 실결제 테스트', required: true },
    ],
    color: 'border-orange-200 dark:border-orange-800',
  },
];

const testModeImportance = [
  {
    title: '실제 돈이 빠지지 않음',
    desc: '테스트 모드에서는 실제 카드가 청구되지 않습니다. 마음껏 테스트하세요.',
    icon: '💰',
  },
  {
    title: '모든 시나리오 재현 가능',
    desc: '결제 성공, 실패, 잔액 부족, 카드 만료 등 다양한 상황을 테스트 카드로 재현할 수 있습니다.',
    icon: '🎭',
  },
  {
    title: '웹훅 디버깅 용이',
    desc: 'Stripe CLI나 토스페이먼츠 대시보드에서 웹훅을 수동으로 재전송하며 디버깅할 수 있습니다.',
    icon: '🔍',
  },
  {
    title: '프로덕션과 동일한 API',
    desc: 'API 키만 다를 뿐 동작은 프로덕션과 완전히 동일합니다. 전환 시 코드 변경이 불필요합니다.',
    icon: '🔄',
  },
];

const securityItems = [
  {
    title: 'API 키 관리',
    desc: 'Secret Key는 절대 클라이언트(브라우저)에 노출하면 안 됩니다. 서버 사이드에서만 사용하고, 환경변수로 관리하세요.',
    severity: '필수',
    severityColor: 'bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300',
    icon: '🔑',
  },
  {
    title: 'PCI DSS 준수',
    desc: 'PCI DSS는 카드 정보 보안 표준입니다. Stripe/토스페이먼츠의 결제 위젯을 사용하면 가맹점이 카드 정보를 직접 다루지 않아 PCI DSS 부담이 크게 줄어듭니다.',
    severity: '중요',
    severityColor: 'bg-orange-100 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300',
    icon: '🛡️',
  },
  {
    title: '웹훅 시그니처 검증',
    desc: '웹훅 요청이 실제 PG사에서 온 것인지 시그니처(서명)를 반드시 검증하세요. 검증 없이 처리하면 위조된 결제 완료 이벤트에 속을 수 있습니다.',
    severity: '필수',
    severityColor: 'bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300',
    icon: '✍️',
  },
  {
    title: 'HTTPS 필수',
    desc: '결제 관련 모든 통신은 HTTPS로 암호화되어야 합니다. Vercel, Cloudflare 등 대부분의 호스팅은 기본으로 HTTPS를 제공합니다.',
    severity: '필수',
    severityColor: 'bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300',
    icon: '🔒',
  },
  {
    title: '금액 검증 (서버)',
    desc: '클라이언트에서 보낸 결제 금액을 그대로 믿지 마세요. 서버에서 상품 가격을 다시 조회하여 일치하는지 반드시 검증해야 합니다.',
    severity: '필수',
    severityColor: 'bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300',
    icon: '🧮',
  },
];

export function ImplementationSection() {
  return (
    <section id="implementation" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">결제 연동 구현 가이드</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          결제 연동은 체계적으로 진행해야 합니다. 체크리스트를 따라 순서대로 진행하세요.
        </p>
      </ScrollReveal>

      {/* 연동 체크리스트 */}
      <ScrollReveal delay={0.1}>
        <h3 className="text-lg font-semibold mb-4">연동 체크리스트</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 max-w-4xl">
          {checklist.map((phase) => (
            <Card key={phase.phase} className={phase.color}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <span className="text-lg">{phase.icon}</span>
                  {phase.phase}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {phase.items.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <span className={`shrink-0 mt-0.5 ${item.required ? 'text-primary' : 'text-muted-foreground'}`}>
                        {item.required ? '☐' : '○'}
                      </span>
                      <span className="text-muted-foreground">
                        {item.task}
                        {item.required && (
                          <Badge variant="secondary" className="ml-1 text-[8px] px-1 py-0">필수</Badge>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollReveal>

      {/* 테스트 모드의 중요성 */}
      <ScrollReveal delay={0.15}>
        <h3 className="text-lg font-semibold mb-2">테스트 모드가 왜 중요한가?</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-2xl">
          Stripe와 토스페이먼츠 모두 테스트 모드를 제공합니다.
          <strong className="text-foreground"> 반드시 테스트 모드에서 충분히 검증한 후 프로덕션으로 전환하세요.</strong>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mb-10">
          {testModeImportance.map((item) => (
            <div key={item.title} className="rounded-lg border bg-card p-4">
              <div className="text-xl mb-2">{item.icon}</div>
              <div className="text-sm font-semibold mb-1">{item.title}</div>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* 보안 주의사항 */}
      <ScrollReveal delay={0.2}>
        <h3 className="text-lg font-semibold mb-2">보안 주의사항 (PCI DSS)</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-2xl">
          결제 시스템은 돈과 직결되기 때문에 보안이 가장 중요합니다.
          PCI DSS(Payment Card Industry Data Security Standard)는 카드 정보 보호를 위한 국제 보안 표준입니다.
        </p>
        <div className="space-y-3 max-w-2xl mb-6">
          {securityItems.map((item) => (
            <div key={item.title} className="rounded-lg border bg-card p-4">
              <div className="flex items-start gap-3">
                <span className="text-xl shrink-0">{item.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold">{item.title}</span>
                    <Badge variant="secondary" className={`text-[9px] ${item.severityColor}`}>
                      {item.severity}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 rounded-lg bg-muted/50 border max-w-2xl">
          <p className="text-xs text-muted-foreground">
            💡 <strong className="text-foreground">핵심 요약:</strong> Stripe/토스페이먼츠의 공식 결제 위젯을 사용하면
            카드 정보가 내 서버를 거치지 않아 PCI DSS 부담이 최소화됩니다.
            <strong className="text-foreground"> 절대 카드 번호를 직접 서버에 저장하지 마세요.</strong>
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
