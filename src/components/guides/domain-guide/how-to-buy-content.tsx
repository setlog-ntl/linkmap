'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';

const buySteps = [
  {
    step: 1,
    title: '도메인 이름 정하기',
    emoji: '💡',
    desc: '내 프로젝트나 브랜드에 맞는 이름을 정합니다.',
    detail: '짧고 기억하기 쉬운 이름이 좋습니다. 여러 후보를 미리 준비하세요.',
    color: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
  },
  {
    step: 2,
    title: '등록 업체 선택하기',
    emoji: '🏪',
    desc: '가비아, Namecheap, Cloudflare 중 상황에 맞는 곳을 선택합니다.',
    detail: '.kr이 필요하면 가비아, 글로벌 서비스라면 Cloudflare를 추천합니다.',
    color: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800',
  },
  {
    step: 3,
    title: '사용 가능 여부 확인 & 구매',
    emoji: '🔍',
    desc: '원하는 이름을 검색해서 사용 가능한지 확인한 뒤 결제합니다.',
    detail: '이미 사용 중이면 다른 TLD(.dev, .app)를 시도하거나 이름을 변경하세요.',
    color: 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800',
  },
  {
    step: 4,
    title: '네임서버 설정하기',
    emoji: '⚙️',
    desc: '구매한 도메인이 내 서버(Vercel, Cloudflare 등)를 가리키도록 설정합니다.',
    detail: '호스팅 업체에서 안내하는 네임서버 주소를 도메인 관리 페이지에서 입력하면 됩니다.',
    color: 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800',
  },
];

const namingTips = [
  { tip: '짧게 (15자 이내)', good: 'linkmap.dev', bad: 'my-awesome-link-mapping-tool.com', icon: '📏' },
  { tip: '발음하기 쉽게', good: 'vercel.com', bad: 'vrcl-xyz.com', icon: '🗣️' },
  { tip: '하이픈(-) 피하기', good: 'myapp.com', bad: 'my-cool-app.com', icon: '➖' },
  { tip: '숫자 피하기', good: 'coolsite.dev', bad: 'c00lsite123.com', icon: '🔢' },
  { tip: '철자가 명확하게', good: 'pixel.app', bad: 'pixcel.app', icon: '✏️' },
  { tip: '확장 가능한 이름', good: 'notion.so', bad: 'notionnotesapp.com', icon: '📐' },
];

const priceComparison = [
  { tld: '.com', gabia: '₩14,000~', namecheap: '$8.88', cloudflare: '$10.44' },
  { tld: '.io', gabia: '₩55,000~', namecheap: '$25.88', cloudflare: '$33.98' },
  { tld: '.dev', gabia: '₩16,500~', namecheap: '$11.98', cloudflare: '$10.18' },
  { tld: '.app', gabia: '₩22,000~', namecheap: '$14.58', cloudflare: '$11.18' },
  { tld: '.kr', gabia: '₩17,600', namecheap: '—', cloudflare: '—' },
];

const postBuyChecklist = [
  { item: '이메일 인증 완료', desc: 'ICANN 인증 메일을 확인하세요 (15일 내 미인증 시 정지)', done: false },
  { item: '네임서버 변경', desc: '호스팅 업체 네임서버로 설정 (전파에 최대 48시간)', done: false },
  { item: 'WHOIS 프라이버시', desc: '개인정보 보호 서비스 활성화', done: false },
  { item: '자동 갱신 설정', desc: '만료 방지를 위해 자동 결제 연결', done: false },
  { item: 'Transfer Lock', desc: '도메인 무단 이전 방지 잠금', done: false },
  { item: 'SSL 인증서 확인', desc: 'HTTPS 접속 가능 여부 확인', done: false },
];

const faqs = [
  {
    q: '도메인 구매 후 바로 사이트가 열리나요?',
    a: '아니요. 도메인을 구매한 뒤 서버와 연결하는 DNS 설정이 필요합니다. 설정 후 전파까지 최대 48시간이 걸릴 수 있지만, 보통 몇 분 ~ 몇 시간이면 됩니다.',
  },
  {
    q: '도메인을 다른 업체로 이전할 수 있나요?',
    a: '네. 등록 후 60일이 지나면 다른 Registrar로 이전(Transfer)할 수 있습니다. Auth Code를 발급받아 새 업체에 입력하면 됩니다.',
  },
  {
    q: '무료 도메인도 있나요?',
    a: 'Freenom(.tk, .ml 등)이 있지만, 신뢰도가 낮고 SEO에 불리합니다. 진지한 프로젝트라면 유료 도메인을 추천합니다. GitHub Student Pack에서 무료 .me 도메인을 받을 수도 있습니다.',
  },
  {
    q: '도메인 갱신 안 하면 어떻게 되나요?',
    a: '만료 후 약 30~45일간 복구 기간(Redemption Period)이 있고, 이 기간이 지나면 누구나 구매할 수 있게 됩니다. 유명 도메인은 도메인 브로커가 선점하기도 합니다.',
  },
];

export function HowToBuyContent() {
  return (
    <div className="py-6 space-y-0">
      {/* 헤더 */}
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <ShoppingCart className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">도메인 구매 방법</h1>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          도메인 이름 짓기부터 구매, 초기 설정까지 — 처음 도메인을 구매하는 분을 위한 단계별 가이드입니다.
        </p>
      </ScrollReveal>

      {/* 구매 단계 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-6">도메인 구매 4단계</h2>
        </ScrollReveal>

        <div className="space-y-4 max-w-2xl mb-10">
          {buySteps.map((s, idx) => (
            <ScrollReveal key={s.step} delay={idx * 0.08}>
              <div className={`rounded-xl border p-5 ${s.color}`}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-background/80 flex items-center justify-center shrink-0 border">
                    <span className="text-xl">{s.emoji}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="text-[10px]">Step {s.step}</Badge>
                      <span className="font-bold text-sm">{s.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-1">{s.desc}</p>
                    <p className="text-[10px] text-muted-foreground">{s.detail}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 좋은 도메인 이름 짓는 팁 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">좋은 도메인 이름 짓는 팁</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            좋은 도메인 이름은 기억하기 쉽고, 타이핑하기 편하며, 브랜드를 잘 표현합니다.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mb-8">
          {namingTips.map((t, idx) => (
            <ScrollReveal key={t.tip} delay={idx * 0.06}>
              <div className="rounded-lg border bg-card p-4 h-full">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{t.icon}</span>
                  <span className="font-semibold text-sm">{t.tip}</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-green-500 shrink-0">✓</span>
                    <code className="font-mono text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/30 px-1.5 py-0.5 rounded">
                      {t.good}
                    </code>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-red-400 shrink-0">✗</span>
                    <code className="font-mono text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 px-1.5 py-0.5 rounded line-through">
                      {t.bad}
                    </code>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 가격 비교표 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">업체별 도메인 가격 비교</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            같은 TLD라도 업체마다 가격이 다릅니다. 연간 등록 비용 기준입니다. (갱신 가격은 다를 수 있음)
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl rounded-xl border overflow-hidden bg-card">
            <div className="bg-muted px-4 py-2 border-b text-xs font-semibold text-muted-foreground grid grid-cols-4 gap-2">
              <div>TLD</div>
              <div>가비아</div>
              <div>Namecheap</div>
              <div>Cloudflare</div>
            </div>
            {priceComparison.map((p, i) => (
              <div key={p.tld} className={`grid grid-cols-4 gap-2 px-4 py-3 text-xs ${i < priceComparison.length - 1 ? 'border-b' : ''}`}>
                <div className="font-mono font-bold text-primary">{p.tld}</div>
                <div className="font-mono text-muted-foreground">{p.gabia}</div>
                <div className="font-mono text-muted-foreground">{p.namecheap}</div>
                <div className="font-mono text-muted-foreground">{p.cloudflare}</div>
              </div>
            ))}
          </div>
          <div className="max-w-2xl mt-3 p-3 rounded-lg bg-muted/50 border">
            <p className="text-xs text-muted-foreground">
              💡 Cloudflare Registrar는 원가에 판매하므로 갱신 가격도 동일합니다.
              다른 업체는 첫 해 할인 후 갱신 시 가격이 오를 수 있으니 확인하세요.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* 구매 후 체크리스트 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">구매 후 체크리스트 ✅</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            도메인을 구매했다면 아래 항목을 하나씩 확인하세요.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="space-y-2 max-w-2xl">
            {postBuyChecklist.map((c, idx) => (
              <div key={c.item} className="rounded-lg border bg-card p-3 flex items-start gap-3">
                <div className="w-5 h-5 rounded border-2 border-muted-foreground/30 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[10px] text-muted-foreground">{idx + 1}</span>
                </div>
                <div>
                  <div className="text-sm font-medium">{c.item}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{c.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* FAQ */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-6">자주 묻는 질문 💬</h2>
        </ScrollReveal>

        <div className="space-y-3 max-w-2xl">
          {faqs.map((f, idx) => (
            <ScrollReveal key={idx} delay={idx * 0.06}>
              <div className="rounded-xl border bg-card p-5">
                <div className="font-medium text-sm mb-2 flex items-start gap-2">
                  <span className="text-primary font-bold shrink-0">Q.</span>
                  {f.q}
                </div>
                <div className="text-xs text-muted-foreground leading-relaxed flex items-start gap-2">
                  <span className="font-bold shrink-0 text-foreground">A.</span>
                  {f.a}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
