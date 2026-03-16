'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Badge } from '@/components/ui/badge';
import { Globe } from 'lucide-react';

const dnsSteps = [
  {
    step: 1,
    emoji: '🧑‍💻',
    actor: '사용자',
    action: 'my-app.com 입력',
    detail: '브라우저 주소창에 URL 입력',
    color: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
  },
  {
    step: 2,
    emoji: '🔍',
    actor: 'DNS 리졸버',
    action: '캐시 확인 / 조회 시작',
    detail: '인터넷 서비스 제공자(ISP) 또는 8.8.8.8',
    color: 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800',
  },
  {
    step: 3,
    emoji: '🌐',
    actor: 'DNS 서버',
    action: 'IP 주소 반환',
    detail: 'my-app.com → 76.76.21.21',
    color: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800',
  },
  {
    step: 4,
    emoji: '⚡',
    actor: '브라우저',
    action: '서버에 접속',
    detail: 'IP로 실제 서버와 통신 시작',
    color: 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800',
  },
  {
    step: 5,
    emoji: '🖥️',
    actor: '서버',
    action: '페이지 응답',
    detail: 'HTML · CSS · JS 전송',
    color: 'bg-pink-50 dark:bg-pink-950/30 border-pink-200 dark:border-pink-800',
  },
];

const dnsRecords = [
  { type: 'A', desc: '도메인 → IPv4 주소 연결', example: 'my-app.com → 76.76.21.21', use: '기본 도메인 연결', difficulty: '기본' },
  { type: 'AAAA', desc: '도메인 → IPv6 주소 연결', example: 'my-app.com → 2606:4700::1', use: '차세대 IP 주소 대응', difficulty: '선택' },
  { type: 'CNAME', desc: '도메인 → 다른 도메인으로 연결', example: 'www → my-app.vercel.app', use: 'Vercel·Cloudflare 연결 시', difficulty: '기본' },
  { type: 'TXT', desc: '텍스트 정보 저장', example: '"v=spf1 include:..."', use: '소유권 인증, 이메일 설정', difficulty: '자주 사용' },
  { type: 'MX', desc: '이메일 수신 서버 지정', example: '→ mail.google.com', use: 'Gmail 커스텀 도메인', difficulty: '이메일 필요 시' },
  { type: 'NS', desc: '네임서버 지정', example: '→ ns1.cloudflare.com', use: 'DNS 서버 변경 시', difficulty: '초기 설정' },
];

const vercelSteps = [
  { step: '1', text: 'Vercel 대시보드 → Settings → Domains', detail: '프로젝트 설정에서 도메인 메뉴 선택' },
  { step: '2', text: '도메인 이름 입력 (예: my-app.com)', detail: 'Add 버튼 클릭' },
  { step: '3', text: 'Vercel이 안내하는 DNS 레코드 확인', detail: 'A 레코드: 76.76.21.21 또는 CNAME: cname.vercel-dns.com' },
  { step: '4', text: '도메인 등록 업체의 DNS 관리에서 레코드 추가', detail: '가비아/Cloudflare의 DNS 설정 페이지' },
  { step: '5', text: '전파 대기 후 SSL 자동 발급', detail: '보통 몇 분 내 완료, 최대 48시간' },
];

const cloudflareSteps = [
  { step: '1', text: 'Cloudflare 가입 → Add a Site', detail: '무료 플랜으로 충분' },
  { step: '2', text: '도메인 이름 입력', detail: 'Cloudflare가 기존 DNS 레코드를 자동 스캔' },
  { step: '3', text: 'Cloudflare가 제공하는 네임서버 확인', detail: '예: aria.ns.cloudflare.com, chad.ns.cloudflare.com' },
  { step: '4', text: '도메인 등록 업체에서 네임서버 변경', detail: '기존 NS를 Cloudflare NS로 교체' },
  { step: '5', text: 'Cloudflare에서 DNS 레코드 관리', detail: '이후 모든 DNS 레코드는 Cloudflare에서 추가/수정' },
];

const ttlExplain = [
  { ttl: '자동 / 300초', desc: '5분마다 갱신 — 변경 사항이 빠르게 반영', use: '개발/테스트 환경' },
  { ttl: '3600초 (1시간)', desc: '1시간마다 갱신 — 일반적인 설정', use: '운영 서비스 기본값' },
  { ttl: '86400초 (24시간)', desc: '하루에 한 번 갱신 — 안정적인 서비스', use: '변경이 거의 없는 레코드' },
];

const commonMistakes = [
  {
    mistake: 'DNS 변경 후 바로 접속이 안 돼요',
    solution: 'DNS 전파에는 시간이 필요합니다. 보통 몇 분 ~ 최대 48시간. 브라우저 캐시를 삭제하고 시크릿 모드로 확인해보세요.',
    icon: '⏱️',
  },
  {
    mistake: 'CNAME과 A 레코드를 동시에 설정했어요',
    solution: '같은 이름(@)에 CNAME과 A를 동시에 넣으면 충돌합니다. 루트 도메인에는 A 레코드, www에는 CNAME을 사용하세요.',
    icon: '⚠️',
  },
  {
    mistake: 'www 있을 때와 없을 때 다르게 보여요',
    solution: 'www.my-app.com과 my-app.com은 별도 레코드입니다. 둘 다 설정하고, 한쪽에서 리다이렉트를 설정하세요.',
    icon: '🔀',
  },
  {
    mistake: 'SSL 인증서 오류가 나요',
    solution: 'DNS 전파가 완료된 후 SSL이 자동 발급됩니다. Cloudflare 사용 시 SSL/TLS → Full(strict) 모드를 확인하세요.',
    icon: '🔒',
  },
  {
    mistake: '이전 사이트가 계속 보여요 (캐시)',
    solution: 'DNS 캐시 문제입니다. 터미널에서 "ipconfig /flushdns" (Windows) 또는 "sudo dscacheutil -flushcache" (Mac)를 실행하세요.',
    icon: '🗑️',
  },
];

const faqs = [
  {
    q: 'DNS 레코드를 잘못 설정하면 사이트가 망가지나요?',
    a: '기존 레코드를 삭제하지 않고 추가하면 괜찮습니다. 잘못 설정해도 TTL이 지나면 수정이 반영됩니다. 실수가 걱정되면 TTL을 짧게(300초) 설정하세요.',
  },
  {
    q: 'Vercel과 Cloudflare를 동시에 쓸 수 있나요?',
    a: '네. Cloudflare DNS에서 Vercel 서버를 가리키는 CNAME 레코드를 추가하면 됩니다. Cloudflare의 프록시(주황색 구름)를 끄고 DNS only로 설정하는 것이 일반적입니다.',
  },
  {
    q: 'DNS 전파 상태를 확인하는 방법이 있나요?',
    a: 'dnschecker.org에서 전 세계 DNS 전파 상태를 실시간으로 확인할 수 있습니다. 또는 터미널에서 "nslookup my-app.com" 명령어로 확인하세요.',
  },
  {
    q: 'TTL을 0으로 설정하면 더 빠른가요?',
    a: 'TTL 0은 캐시하지 않겠다는 의미이지만, 실제로는 ISP나 리졸버가 최소 30~60초 캐시합니다. 불필요하게 0으로 설정하면 DNS 서버 부하만 늘어납니다.',
  },
];

export function DnsRecordsContent() {
  return (
    <div className="py-6 space-y-0">
      {/* 헤더 */}
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Globe className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">DNS 레코드 설정</h1>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          DNS(Domain Name System)는 인터넷의 전화번호부입니다.
          도메인을 구매한 뒤 실제 서버와 연결하려면 DNS 레코드를 설정해야 합니다.
        </p>
      </ScrollReveal>

      {/* DNS 동작 흐름 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">DNS 동작 흐름</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            브라우저에 주소를 입력하면 뒤에서 어떤 일이 벌어질까요? 5단계로 알아봅니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="overflow-x-auto pb-2 mb-4">
            <div className="flex items-stretch gap-0 min-w-max">
              {dnsSteps.map((s, i) => (
                <div key={s.step} className="flex items-stretch">
                  <div className={`rounded-xl border p-4 w-36 flex flex-col items-center text-center gap-1.5 ${s.color}`}>
                    <div className="text-2xl">{s.emoji}</div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">{s.actor}</div>
                    <div className="text-xs font-medium leading-tight">{s.action}</div>
                    <div className="text-[10px] text-muted-foreground leading-relaxed">{s.detail}</div>
                  </div>
                  {i < dnsSteps.length - 1 && (
                    <div className="flex items-center px-1">
                      <svg className="w-5 h-4 text-muted-foreground/40" viewBox="0 0 20 16" fill="none">
                        <path d="M0 8h14m0 0-5-4m5 4-5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-10">
            ⏱️ 이 과정은 보통 <strong>50ms 미만</strong>(0.05초)에 완료됩니다. 한 번 조회 후엔 캐시에 저장되어 더 빠릅니다.
          </p>
        </ScrollReveal>
      </section>

      {/* DNS 레코드 종류 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">DNS 레코드 종류</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            DNS에는 여러 종류의 레코드가 있습니다. 각 레코드는 서로 다른 역할을 합니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl rounded-xl border overflow-hidden bg-card">
            <div className="bg-muted px-4 py-2 border-b text-xs font-semibold text-muted-foreground grid grid-cols-5 gap-2">
              <div>타입</div>
              <div>역할</div>
              <div>예시</div>
              <div>언제 쓰나</div>
              <div>중요도</div>
            </div>
            {dnsRecords.map((r, i) => (
              <div key={r.type} className={`grid grid-cols-5 gap-2 px-4 py-3 text-xs ${i < dnsRecords.length - 1 ? 'border-b' : ''}`}>
                <div className="font-mono font-bold text-primary">{r.type}</div>
                <div className="text-muted-foreground">{r.desc}</div>
                <div className="font-mono text-[10px] text-muted-foreground break-all">{r.example}</div>
                <div className="text-muted-foreground">{r.use}</div>
                <div>
                  <Badge variant="secondary" className="text-[9px]">{r.difficulty}</Badge>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-muted/50 border max-w-2xl">
            <p className="text-xs text-muted-foreground">
              💡 대부분의 웹 프로젝트에서는 <strong className="text-foreground">A 레코드</strong>와 <strong className="text-foreground">CNAME 레코드</strong>만 알면 충분합니다.
              이메일 서비스를 연결할 때 MX와 TXT가 필요합니다.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* 실전: Vercel에 도메인 연결 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">실전: Vercel에 도메인 연결하기</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            Next.js 프로젝트를 Vercel에 배포한 뒤, 내 도메인을 연결하는 방법입니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="space-y-3 max-w-2xl mb-6">
            {vercelSteps.map((s) => (
              <div key={s.step} className="flex items-start gap-3 rounded-lg border bg-card p-4">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-primary">{s.step}</span>
                </div>
                <div>
                  <div className="text-sm font-medium">{s.text}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{s.detail}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="max-w-2xl rounded-lg bg-muted/50 border p-4 mb-10">
            <div className="text-xs font-semibold mb-2">설정 예시 (가비아 DNS)</div>
            <div className="rounded-lg bg-background border p-3 font-mono text-[11px] space-y-1">
              <div className="flex gap-4">
                <span className="text-muted-foreground w-12">타입</span>
                <span className="text-muted-foreground w-16">이름</span>
                <span className="text-muted-foreground">값</span>
              </div>
              <div className="flex gap-4 text-primary">
                <span className="w-12">A</span>
                <span className="w-16">@</span>
                <span>76.76.21.21</span>
              </div>
              <div className="flex gap-4 text-primary">
                <span className="w-12">CNAME</span>
                <span className="w-16">www</span>
                <span>cname.vercel-dns.com</span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 실전: Cloudflare에 도메인 연결 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">실전: Cloudflare에 도메인 연결하기</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            Cloudflare를 DNS + CDN으로 사용하려면 네임서버를 변경해야 합니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="space-y-3 max-w-2xl mb-6">
            {cloudflareSteps.map((s) => (
              <div key={s.step} className="flex items-start gap-3 rounded-lg border bg-card p-4">
                <div className="w-7 h-7 rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-orange-600 dark:text-orange-400">{s.step}</span>
                </div>
                <div>
                  <div className="text-sm font-medium">{s.text}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{s.detail}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="max-w-2xl p-3 rounded-lg bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800">
            <p className="text-xs text-muted-foreground">
              ☁️ Cloudflare 네임서버를 사용하면 CDN, DDoS 보호, SSL이 자동으로 활성화됩니다.
              무료 플랜으로도 충분합니다.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* TTL 개념 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">TTL (DNS 전파 시간)</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            TTL(Time To Live)은 DNS 레코드를 캐시에 저장하는 시간입니다.
            TTL이 짧으면 변경이 빨리 반영되고, 길면 서버 부하가 줄어듭니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="space-y-2 max-w-2xl mb-6">
            {ttlExplain.map((t) => (
              <div key={t.ttl} className="rounded-lg border bg-card p-4 flex items-start gap-4">
                <code className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-1 rounded shrink-0 mt-0.5">
                  {t.ttl}
                </code>
                <div>
                  <div className="text-sm font-medium">{t.desc}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">추천: {t.use}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="max-w-2xl p-3 rounded-lg bg-muted/50 border">
            <p className="text-xs text-muted-foreground">
              💡 DNS 레코드를 변경할 예정이라면 미리 TTL을 300초(5분)로 낮춰두세요.
              변경 후 빠르게 반영됩니다. 안정화된 후 다시 3600초로 올리면 됩니다.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* 흔한 실수와 해결법 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">흔한 실수와 해결법 🔧</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            DNS 설정에서 자주 발생하는 문제와 해결 방법을 정리했습니다.
          </p>
        </ScrollReveal>

        <div className="space-y-3 max-w-2xl">
          {commonMistakes.map((m, idx) => (
            <ScrollReveal key={idx} delay={idx * 0.06}>
              <div className="rounded-xl border bg-card p-5">
                <div className="flex items-start gap-3">
                  <span className="text-xl shrink-0">{m.icon}</span>
                  <div>
                    <div className="font-medium text-sm mb-1.5 text-red-600 dark:text-red-400">
                      {m.mistake}
                    </div>
                    <div className="text-xs text-muted-foreground leading-relaxed">
                      <span className="font-semibold text-green-600 dark:text-green-400">해결:</span> {m.solution}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
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
