'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Badge } from '@/components/ui/badge';

const domainRegistrars = [
  {
    name: 'Gabia (가비아)',
    emoji: '🇰🇷',
    desc: '국내 최대 도메인 등록 업체. 한국어 고객 지원과 한국 결제 수단을 지원합니다.',
    price: '.com 연 14,000원~',
    pros: ['한국어 지원', '한국 결제 (카드/계좌이체)', '.kr 도메인 등록 필수', '전화 상담 가능'],
    cons: ['글로벌 대비 가격이 높음', '관리 UI가 복잡한 편'],
    badge: '.kr 필수',
    badgeColor: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300',
    color: 'border-blue-200 dark:border-blue-800',
  },
  {
    name: 'Namecheap',
    emoji: '🌐',
    desc: '저렴하고 신뢰할 수 있는 글로벌 도메인 등록 업체. WhoisGuard(개인정보 보호)가 무료입니다.',
    price: '.com 연 $9~',
    pros: ['저렴한 가격', 'WhoisGuard 무료', '직관적인 관리 UI', '다양한 TLD 지원'],
    cons: ['영어 UI', '해외 결제 필요', '한국 지원 없음'],
    badge: '가성비',
    badgeColor: 'bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300',
    color: 'border-green-200 dark:border-green-800',
  },
  {
    name: 'Cloudflare Registrar',
    emoji: '☁️',
    desc: '도매가(원가)로 도메인을 판매합니다. Cloudflare DNS/CDN과 자연스럽게 통합됩니다.',
    price: '.com 연 $10.44',
    pros: ['원가 판매 (마진 0)', 'CDN/DNS 자동 통합', 'DNSSEC 무료', 'DDoS 보호 포함'],
    cons: ['영어 UI', 'Cloudflare 계정 필수', '일부 TLD 미지원'],
    badge: '추천',
    badgeColor: 'bg-orange-100 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300',
    color: 'border-orange-200 dark:border-orange-800',
  },
];

const decisionTree = [
  {
    question: '.kr 도메인이 필요한가요?',
    yes: { answer: '가비아', emoji: '🇰🇷', reason: '.kr은 국내 업체만 등록 가능' },
    no: { next: true },
  },
  {
    question: '이미 Cloudflare를 사용하고 있나요?',
    yes: { answer: 'Cloudflare Registrar', emoji: '☁️', reason: 'DNS + CDN + 도메인을 한 곳에서 관리' },
    no: { next: true },
  },
  {
    question: '한국어 지원이 필요한가요?',
    yes: { answer: '가비아', emoji: '🇰🇷', reason: '한국어 고객센터 + 국내 결제' },
    no: { answer: 'Cloudflare 또는 Namecheap', emoji: '🌐', reason: '원가 판매 또는 가성비' },
  },
];

const postPurchaseChecklist = [
  { step: '1', task: '네임서버(NS) 설정', desc: '호스팅 업체의 네임서버로 변경 (예: Cloudflare, Vercel)', icon: '🔧' },
  { step: '2', task: 'SSL 인증서 확인', desc: 'HTTPS 활성화 여부 확인 (Cloudflare/Vercel은 자동 발급)', icon: '🔒' },
  { step: '3', task: 'DNS 레코드 추가', desc: 'A 또는 CNAME 레코드로 서버 연결', icon: '📋' },
  { step: '4', task: '도메인 잠금 설정', desc: 'Transfer Lock 활성화로 무단 이전 방지', icon: '🛡️' },
  { step: '5', task: '자동 갱신 활성화', desc: '만료 방지를 위해 자동 결제 설정', icon: '🔄' },
  { step: '6', task: 'WHOIS 프라이버시', desc: '개인정보 보호 활성화 (등록자 정보 숨기기)', icon: '👤' },
];

export function RegistrarsSection() {
  return (
    <section id="registrars" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">도메인 구매처 비교</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          도메인은 등록 대행 업체(Registrar)를 통해 구매합니다.
          업체마다 가격, 부가 기능, 지원 언어가 다릅니다.
        </p>
      </ScrollReveal>

      {/* 구매처 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mb-10">
        {domainRegistrars.map((r, idx) => (
          <ScrollReveal key={r.name} delay={idx * 0.08}>
            <div className={`rounded-xl border p-5 h-full flex flex-col ${r.color}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{r.emoji}</span>
                  <span className="font-bold text-sm">{r.name}</span>
                </div>
                <Badge variant="secondary" className={`text-[10px] shrink-0 ${r.badgeColor}`}>
                  {r.badge}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{r.desc}</p>
              <span className="text-[10px] bg-muted px-2 py-0.5 rounded font-mono mb-3 w-fit">{r.price}</span>

              <div className="mt-auto space-y-3">
                <div>
                  <div className="text-[10px] text-muted-foreground mb-1 font-semibold">장점</div>
                  <div className="space-y-1">
                    {r.pros.map((p) => (
                      <div key={p} className="text-[10px] flex items-start gap-1">
                        <span className="text-green-500 shrink-0">✓</span>
                        <span className="text-muted-foreground">{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground mb-1 font-semibold">단점</div>
                  <div className="space-y-1">
                    {r.cons.map((c) => (
                      <div key={c} className="text-[10px] flex items-start gap-1">
                        <span className="text-red-400 shrink-0">✗</span>
                        <span className="text-muted-foreground">{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* 의사결정 트리 */}
      <ScrollReveal delay={0.15}>
        <h3 className="text-lg font-semibold mb-4">어디서 사야 할까? 의사결정 트리</h3>
        <div className="max-w-2xl space-y-3 mb-10">
          {decisionTree.map((d, i) => (
            <div key={i} className="rounded-xl border bg-card p-4">
              <div className="font-medium text-sm mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                  Q{i + 1}
                </span>
                {d.question}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-green-50/50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 p-2.5">
                  <div className="text-[10px] font-bold text-green-600 dark:text-green-400 mb-1">예 →</div>
                  <div className="text-xs font-medium flex items-center gap-1">
                    <span>{d.yes.emoji}</span> {d.yes.answer}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{d.yes.reason}</div>
                </div>
                <div className="rounded-lg bg-muted/50 border p-2.5">
                  <div className="text-[10px] font-bold text-muted-foreground mb-1">아니오 →</div>
                  {d.no.next ? (
                    <div className="text-xs text-muted-foreground">다음 질문으로 ↓</div>
                  ) : (
                    <>
                      <div className="text-xs font-medium flex items-center gap-1">
                        <span>{d.no.emoji}</span> {d.no.answer}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{d.no.reason}</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* 구매 후 체크리스트 */}
      <ScrollReveal delay={0.2}>
        <h3 className="text-lg font-semibold mb-4">도메인 구매 후 해야 할 일 ✅</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl">
          {postPurchaseChecklist.map((c) => (
            <div key={c.step} className="rounded-lg border bg-card p-3 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-sm">{c.icon}</span>
              </div>
              <div>
                <div className="text-xs font-medium">
                  <span className="text-primary font-bold mr-1">{c.step}.</span>
                  {c.task}
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{c.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
