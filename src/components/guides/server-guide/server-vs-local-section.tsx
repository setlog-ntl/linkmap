'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';

const comparisonRows = [
  { label: '가동 시간', local: '내가 켤 때만', server: '24시간 / 365일', icon: '⏰' },
  { label: '접속 범위', local: 'localhost (내 PC만)', server: '전 세계 어디서든', icon: '🌍' },
  { label: 'IP 주소', local: '유동 IP (매번 바뀜)', server: '고정 IP (항상 동일)', icon: '📍' },
  { label: '성능', local: '내 PC 사양 그대로', server: '필요에 따라 선택/확장 가능', icon: '💪' },
  { label: '비용', local: '전기세만 (사실상 무료)', server: '월 $0 ~ $50+', icon: '💰' },
  { label: '관리', local: '내가 직접 (OS 업데이트 등)', server: '자동화 or 직접 선택', icon: '🔧' },
  { label: '보안', local: '방화벽·공유기 뒤에 숨음', server: 'DDoS 방어·SSL 인증서 제공', icon: '🔒' },
  { label: '안정성', local: '정전·재부팅 시 서비스 중단', server: '무중단 운영 (failover)', icon: '🛡️' },
];

export function ServerVsLocalSection() {
  return (
    <section id="server-vs-local" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">내 컴퓨터 vs 서버</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          개발할 때 <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">npm run dev</code>로
          띄운 앱은 localhost에서만 돌아갑니다.
          이걸 전 세계가 접속할 수 있게 하려면 서버가 필요합니다.
        </p>
      </ScrollReveal>

      {/* 비교표 */}
      <ScrollReveal delay={0.1}>
        <div className="max-w-2xl mb-10">
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            {/* 헤더 */}
            <div className="grid grid-cols-3 text-sm font-semibold border-b">
              <div className="p-3 bg-muted/30">항목</div>
              <div className="p-3 bg-muted/30 text-center">💻 내 컴퓨터</div>
              <div className="p-3 bg-primary/5 text-center">🌐 서버</div>
            </div>
            {/* 행 */}
            {comparisonRows.map((row, idx) => (
              <div
                key={row.label}
                className={`grid grid-cols-3 text-xs ${idx < comparisonRows.length - 1 ? 'border-b' : ''}`}
              >
                <div className="p-3 flex items-center gap-1.5 font-medium">
                  <span>{row.icon}</span>
                  <span>{row.label}</span>
                </div>
                <div className="p-3 text-muted-foreground text-center flex items-center justify-center">
                  {row.local}
                </div>
                <div className="p-3 text-center bg-primary/[0.02] flex items-center justify-center font-medium">
                  {row.server}
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* localhost 설명 */}
      <ScrollReveal delay={0.15}>
        <div className="max-w-2xl mb-10">
          <div className="rounded-xl border bg-card shadow-sm p-5">
            <h3 className="font-semibold mb-3 text-sm">🔍 localhost란?</h3>
            <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
              <p>
                <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-foreground">localhost</code>는
                &ldquo;내 컴퓨터 자기 자신&rdquo;을 가리키는 특별한 주소입니다.
                IP로는 <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-foreground">127.0.0.1</code>과 같습니다.
              </p>
              <p>
                개발 서버를 <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-foreground">localhost:3000</code>에서
                띄우면, 같은 컴퓨터의 브라우저에서만 접속할 수 있습니다.
                옆자리 동료도, 같은 Wi-Fi에 연결된 폰도 접속할 수 없습니다.
              </p>
              <p className="font-medium text-foreground">
                → 외부에서 접속하려면 반드시 &ldquo;서버에 배포&rdquo;해야 합니다.
              </p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* 왜 내 컴퓨터로 서비스하면 안 되나? */}
      <ScrollReveal delay={0.2}>
        <div className="max-w-2xl">
          <div className="rounded-xl border bg-card shadow-sm p-5">
            <h3 className="font-semibold mb-3 text-sm">❓ 왜 내 컴퓨터로 서비스하면 안 되나요?</h3>
            <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
              <div className="flex items-start gap-2">
                <span className="text-base shrink-0">1️⃣</span>
                <div>
                  <span className="font-medium text-foreground">안정성 문제</span> — 컴퓨터를 끄거나
                  재부팅하면 서비스가 중단됩니다. 정전이라도 나면 끝입니다.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-base shrink-0">2️⃣</span>
                <div>
                  <span className="font-medium text-foreground">보안 위험</span> — 외부에서 내 컴퓨터로
                  직접 접속을 허용하면, 해킹 공격에 노출됩니다. 개인 파일까지 위험해질 수 있습니다.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-base shrink-0">3️⃣</span>
                <div>
                  <span className="font-medium text-foreground">IP 문제</span> — 가정용 인터넷은
                  IP가 수시로 바뀝니다(유동 IP). 도메인을 연결해도 IP가 바뀌면 접속이 끊깁니다.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-base shrink-0">4️⃣</span>
                <div>
                  <span className="font-medium text-foreground">속도·대역폭 한계</span> — 가정용
                  인터넷 업로드 속도는 느립니다. 동시 접속자가 늘면 금방 느려집니다.
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 rounded-lg bg-primary/5 text-xs text-foreground">
              💡 결론: 개발·테스트는 내 컴퓨터에서, 실제 서비스는 반드시 전문 서버(호스팅)에서 운영하세요.
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
