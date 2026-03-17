'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Badge } from '@/components/ui/badge';

const paymentSteps = [
  {
    step: 1,
    icon: '🛒',
    title: '주문 생성',
    detail: '고객이 상품을 선택하고\n결제 버튼을 클릭',
    color: 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700',
    badge: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
  },
  {
    step: 2,
    icon: '💳',
    title: '결제 수단 선택',
    detail: '카드, 계좌이체, 간편결제 등\n결제 수단을 선택',
    color: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
    badge: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300',
  },
  {
    step: 3,
    icon: '🏦',
    title: 'PG사 중계',
    detail: 'PG사가 카드사/은행에\n승인 요청을 전달',
    color: 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800',
    badge: 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300',
  },
  {
    step: 4,
    icon: '🏧',
    title: '승인 처리',
    detail: '카드사/은행이 잔액 확인 후\n승인 또는 거절',
    color: 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800',
    badge: 'bg-yellow-100 dark:bg-yellow-900/60 text-yellow-700 dark:text-yellow-300',
  },
  {
    step: 5,
    icon: '✅',
    title: '결제 완료',
    detail: '승인 결과를 PG사 → 내 서버로\n웹훅/콜백 전달',
    color: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800',
    badge: 'bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300',
  },
];

const pgRole = [
  {
    title: '결제 수단 통합',
    desc: '카드, 계좌이체, 가상계좌, 간편결제(카카오페이, 네이버페이) 등 다양한 결제 수단을 하나의 API로 제공합니다.',
    icon: '🔗',
  },
  {
    title: '보안 처리',
    desc: '카드 번호, CVC 등 민감 정보를 안전하게 처리합니다. 가맹점은 카드 정보를 직접 다루지 않아도 됩니다.',
    icon: '🔒',
  },
  {
    title: '정산 관리',
    desc: '결제 금액에서 수수료를 제외한 금액을 가맹점에 정산합니다. 보통 결제일 기준 D+2~7일 후 입금됩니다.',
    icon: '💰',
  },
  {
    title: '분쟁 처리',
    desc: '환불, 취소, 부분 취소 등의 기능을 API로 제공합니다. 차지백(분쟁) 발생 시 중재 역할도 합니다.',
    icon: '⚖️',
  },
];

const paymentMethods = [
  {
    name: '신용/체크카드',
    icon: '💳',
    desc: '가장 보편적인 결제 수단. 국내 전자상거래의 약 70%를 차지합니다.',
    example: 'Visa, Mastercard, 국내 카드사',
    color: 'border-blue-200 dark:border-blue-800',
  },
  {
    name: '계좌이체',
    icon: '🏧',
    desc: '은행 계좌에서 직접 이체. 실시간으로 결제가 완료됩니다.',
    example: '은행 앱 인증 → 즉시 이체',
    color: 'border-green-200 dark:border-green-800',
  },
  {
    name: '가상계좌',
    icon: '🔢',
    desc: '일회용 계좌번호 발급 → 고객이 입금. 입금 확인이 비동기(웹훅)로 처리됩니다.',
    example: '무통장 입금과 유사',
    color: 'border-yellow-200 dark:border-yellow-800',
  },
  {
    name: '간편결제',
    icon: '📱',
    desc: '카카오페이, 네이버페이, 토스페이 등. 앱 인증만으로 간편하게 결제합니다.',
    example: '카카오페이, 네이버페이, 페이코',
    color: 'border-purple-200 dark:border-purple-800',
  },
];

export function PaymentFlowSection() {
  return (
    <section id="payment-flow" className="scroll-mt-24 py-12 md:py-16">
      {/* 온라인 결제란? */}
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">온라인 결제란?</h2>
        <p className="text-muted-foreground mb-4 max-w-2xl leading-relaxed">
          <strong className="text-foreground">온라인 결제</strong>란 인터넷을 통해 상품이나 서비스의 대금을
          지불하는 과정입니다. 이 과정에서 <strong className="text-foreground">PG사(Payment Gateway)</strong>가
          가맹점과 카드사/은행 사이에서 중계 역할을 합니다.
        </p>
        <div className="max-w-2xl mb-10">
          <div className="rounded-lg border bg-card shadow-sm p-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              🏪 <strong className="text-foreground">실생활 비유:</strong> 마트에서 카드로 결제할 때
              카드 단말기(PG사)가 내 카드사에 &quot;이 사람 잔액 있나요?&quot;라고 물어보고,
              승인이 나면 결제가 완료됩니다. 온라인에서는 이 과정이 API로 이루어집니다.
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* 결제 흐름 5단계 */}
      <ScrollReveal delay={0.1}>
        <h3 className="text-lg font-semibold mb-4">결제 처리 5단계</h3>
        <div className="overflow-x-auto pb-2 mb-10">
          <div className="flex items-stretch gap-0 min-w-max">
            {paymentSteps.map((s, i) => (
              <div key={s.step} className="flex items-stretch">
                <div className={`rounded-xl border p-4 w-36 flex flex-col items-center text-center gap-2 ${s.color}`}>
                  <div className="text-2xl">{s.icon}</div>
                  <div className="text-xs font-bold leading-tight">{s.title}</div>
                  <div className="text-[10px] text-muted-foreground leading-relaxed whitespace-pre-line flex-1">{s.detail}</div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium mt-auto ${s.badge}`}>
                    Step {s.step}
                  </span>
                </div>
                {i < paymentSteps.length - 1 && (
                  <div className="flex items-center px-0.5">
                    <svg className="w-5 h-4 text-muted-foreground/40" viewBox="0 0 20 16" fill="none">
                      <path d="M0 8h14m0 0-5-4m5 4-5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* PG사 역할 */}
      <ScrollReveal delay={0.15}>
        <h3 className="text-lg font-semibold mb-2">PG사는 무슨 일을 하나요?</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-2xl">
          PG(Payment Gateway)사는 가맹점(내 서비스)과 금융기관 사이에서 결제를 중계하는 회사입니다.
          직접 카드사와 계약하지 않아도 PG사 하나만 연동하면 다양한 결제 수단을 제공할 수 있습니다.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mb-10">
          {pgRole.map((item) => (
            <div key={item.title} className="rounded-lg border bg-card p-4">
              <div className="text-xl mb-2">{item.icon}</div>
              <div className="text-sm font-semibold mb-1">{item.title}</div>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* 결제 수단 종류 */}
      <ScrollReveal delay={0.2}>
        <h3 className="text-lg font-semibold mb-4">결제 수단 종류</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
          {paymentMethods.map((m) => (
            <div key={m.name} className={`rounded-xl border p-5 ${m.color}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{m.icon}</span>
                <span className="font-bold text-sm">{m.name}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-2">{m.desc}</p>
              <div className="text-[10px] text-muted-foreground">
                <span className="font-medium text-foreground">예시: </span>{m.example}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-3 rounded-lg bg-muted/50 border max-w-2xl">
          <p className="text-xs text-muted-foreground">
            💡 <strong className="text-foreground">초보자 팁:</strong> 처음에는 카드 결제만 지원해도 충분합니다.
            서비스가 성장하면 간편결제와 가상계좌를 추가하세요.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
