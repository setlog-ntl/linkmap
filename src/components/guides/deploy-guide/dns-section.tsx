'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';

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
  { type: 'A', desc: '도메인 → IPv4 주소 연결', example: 'my-app.com → 76.76.21.21', use: '기본 도메인 연결' },
  { type: 'CNAME', desc: '도메인 → 다른 도메인으로 연결', example: 'www → my-app.vercel.app', use: 'Vercel·Cloudflare 연결 시' },
  { type: 'TXT', desc: '텍스트 정보 저장', example: '"v=spf1 include:..."', use: '소유권 인증, 이메일 설정' },
  { type: 'MX', desc: '이메일 수신 서버 지정', example: '→ mail.google.com', use: 'Gmail 커스텀 도메인' },
];

export function DnsSection() {
  return (
    <section id="dns" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">DNS란?</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          DNS(Domain Name System)는 인터넷의 전화번호부입니다.
          사람이 읽는 도메인 이름(my-app.com)을 컴퓨터가 이해하는 IP 주소(76.76.21.21)로 변환해줍니다.
        </p>
      </ScrollReveal>

      {/* DNS 동작 흐름 */}
      <ScrollReveal delay={0.1}>
        <h3 className="text-lg font-semibold mb-4">URL 입력 후 무슨 일이 벌어질까?</h3>
        <div className="overflow-x-auto pb-2 mb-10">
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

      {/* DNS 레코드 종류 */}
      <ScrollReveal delay={0.15}>
        <h3 className="text-lg font-semibold mb-4">DNS 레코드 종류</h3>
        <div className="max-w-2xl rounded-xl border overflow-hidden bg-card">
          <div className="bg-muted px-4 py-2 border-b text-xs font-semibold text-muted-foreground grid grid-cols-4 gap-2">
            <div>타입</div>
            <div>역할</div>
            <div>예시</div>
            <div>언제 쓰나</div>
          </div>
          {dnsRecords.map((r, i) => (
            <div key={r.type} className={`grid grid-cols-4 gap-2 px-4 py-3 text-xs ${i < dnsRecords.length - 1 ? 'border-b' : ''}`}>
              <div className="font-mono font-bold text-primary">{r.type}</div>
              <div className="text-muted-foreground">{r.desc}</div>
              <div className="font-mono text-[10px] text-muted-foreground">{r.example}</div>
              <div className="text-muted-foreground">{r.use}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 rounded-lg bg-muted/50 border max-w-2xl">
          <p className="text-xs text-muted-foreground">
            💡 Vercel·Cloudflare 배포 시 대시보드에서 <strong className="text-foreground">CNAME 또는 A 레코드</strong>를 추가하라고 안내합니다. 해당 값을 도메인 등록 업체의 DNS 설정에 붙여넣으면 됩니다.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
