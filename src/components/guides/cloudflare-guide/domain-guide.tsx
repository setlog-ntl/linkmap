'use client';

import { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const sections = [
  { id: 'overview', label: '개요' },
  { id: 'signup', label: '가입' },
  { id: 'add-domain', label: '도메인 추가' },
  { id: 'nameservers', label: '네임서버 변경' },
  { id: 'ssl', label: 'SSL 설정' },
  { id: 'pitfalls', label: '주의사항' },
] as const;

export function CloudflareDomainGuide() {
  const [activeSection, setActiveSection] = useState<string>('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { rootMargin: '-30% 0px -60% 0px' },
    );
    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    for (const el of els) observerRef.current.observe(el);
    return () => observerRef.current?.disconnect();
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div>
      <section className="py-12 md:py-20 border-b">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary">Cloudflare</Badge>
            <Badge variant="outline">도메인</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            계정 생성 + 도메인 연결
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Cloudflare에 가입하고 구매한 도메인을 연결하는 방법을 설명합니다.
            네임서버를 Cloudflare로 변경하면 DNS 관리, 자동 SSL, DDoS 보호를 무료로 사용할 수 있습니다.
          </p>
          <div className="flex flex-wrap gap-2 mt-6 text-sm text-muted-foreground">
            <span>설정 약 10분 (DNS 전파 최대 48시간)</span>
            <span>·</span>
            <span>무료 플랜 제공</span>
            <span>·</span>
            <span>
              <a href="https://dash.cloudflare.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
                dash.cloudflare.com
              </a>
            </span>
          </div>
        </div>
      </section>

      <nav className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeSection === s.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="max-w-3xl py-10 space-y-16">

        {/* 개요 */}
        <section id="overview">
          <h2 className="text-2xl font-bold mb-4">Cloudflare로 도메인을 관리하는 이유</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Cloudflare는 전 세계 300개 이상의 데이터 센터를 통해 DNS를 제공합니다.
            도메인 등록 업체(가비아, 후이즈 등)의 기본 DNS 대신 Cloudflare를 사용하면
            더 빠른 응답, 자동 HTTPS, 보안 헤더, DDoS 보호를 무료로 받을 수 있습니다.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: 'Anycast DNS', desc: '전 세계 가장 가까운 서버에서 DNS 응답 — 빠른 연결' },
              { label: '자동 SSL/TLS', desc: 'HTTPS 인증서 자동 발급 및 갱신 (무료)' },
              { label: 'DDoS 보호', desc: 'L3/L4/L7 DDoS 공격 자동 차단' },
              { label: 'Analytics', desc: '트래픽·봇·위협 통계 무료 제공' },
            ].map((m) => (
              <Card key={m.label} className="bg-card shadow-sm">
                <CardContent className="p-4">
                  <p className="font-semibold text-sm">{m.label}</p>
                  <p className="text-sm text-muted-foreground mt-1">{m.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 가입 */}
        <section id="signup">
          <h2 className="text-2xl font-bold mb-4">Cloudflare 가입</h2>
          <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-2 leading-relaxed">
            <li>
              <a href="https://dash.cloudflare.com/sign-up" target="_blank" rel="noopener noreferrer" className="underline">
                dash.cloudflare.com/sign-up
              </a>에 접속
            </li>
            <li>이메일 주소와 비밀번호 입력 후 <strong>Create Account</strong></li>
            <li>이메일 인증 링크 클릭</li>
            <li>무료(Free) 플랜 선택 — 일반 웹사이트에는 충분합니다</li>
          </ol>
        </section>

        {/* 도메인 추가 */}
        <section id="add-domain">
          <h2 className="text-2xl font-bold mb-4">도메인 추가</h2>
          <p className="text-muted-foreground text-sm mb-4">
            가비아, 후이즈, Namecheap 등에서 구매한 도메인을 Cloudflare에 추가합니다.
          </p>
          <div className="space-y-4">
            <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-2 leading-relaxed">
              <li>Cloudflare 대시보드 우측 상단 <strong>Add a domain</strong> 클릭</li>
              <li>구매한 도메인 입력 (예: my-app.com)</li>
              <li><strong>Continue</strong> 클릭 — Cloudflare가 기존 DNS 레코드를 자동 스캔</li>
              <li>스캔된 DNS 레코드 확인 후 <strong>Continue</strong></li>
              <li>플랜 선택: <strong>Free</strong> 선택 후 Continue</li>
              <li>Cloudflare가 제공하는 네임서버 2개를 복사 (다음 단계에서 사용)</li>
            </ol>
            <Card className="bg-card shadow-sm border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <p className="font-semibold text-sm mb-1">네임서버 예시</p>
                <pre className="bg-muted rounded p-2 text-xs font-mono">
{`alex.ns.cloudflare.com
lisa.ns.cloudflare.com`}
                </pre>
                <p className="text-sm text-muted-foreground mt-2">
                  계정마다 고유한 네임서버가 할당됩니다. 위는 예시이며 실제 값은 다릅니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 네임서버 변경 */}
        <section id="nameservers">
          <h2 className="text-2xl font-bold mb-4">도메인 등록 업체에서 네임서버 변경</h2>
          <p className="text-muted-foreground text-sm mb-4">
            도메인을 구매한 업체의 관리 페이지에서 네임서버를 Cloudflare가 제공한 값으로 변경합니다.
          </p>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">가비아(Gabia)의 경우</h3>
              <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1.5 leading-relaxed">
                <li>gabia.com 로그인 → My가비아 → 도메인 관리</li>
                <li>해당 도메인 선택 → 네임서버 관리</li>
                <li>1차/2차 네임서버를 Cloudflare 제공 값으로 변경</li>
                <li>저장 후 적용까지 최대 48시간 대기</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Namecheap의 경우</h3>
              <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1.5 leading-relaxed">
                <li>namecheap.com 로그인 → Domain List</li>
                <li>해당 도메인 Manage 클릭</li>
                <li>Nameservers 드롭다운에서 <strong>Custom DNS</strong> 선택</li>
                <li>Cloudflare 네임서버 2개 입력 후 체크 클릭</li>
              </ol>
            </div>
            <Card className="bg-card shadow-sm border-amber-200 dark:border-amber-800">
              <CardContent className="p-4">
                <p className="font-semibold text-sm mb-1">DNS 전파 시간</p>
                <p className="text-sm text-muted-foreground">
                  네임서버 변경 후 전파에 최소 수 분에서 최대 48시간이 걸립니다.
                  Cloudflare 대시보드에서 <strong>Active</strong> 상태가 되면 완료입니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* SSL 설정 */}
        <section id="ssl">
          <h2 className="text-2xl font-bold mb-4">SSL/TLS 설정</h2>
          <p className="text-muted-foreground text-sm mb-4">
            Cloudflare는 무료 SSL 인증서를 자동 발급합니다.
            SSL 모드를 올바르게 설정해야 HTTPS가 정상 동작합니다.
          </p>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">SSL 모드 선택</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border rounded-lg overflow-hidden">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-3 font-medium">모드</th>
                      <th className="text-left p-3 font-medium">설명</th>
                      <th className="text-left p-3 font-medium">권장 상황</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {[
                      { mode: 'Flexible', desc: 'Cloudflare ↔ 서버 간 암호화 없음', recommend: '테스트용 (비권장)' },
                      { mode: 'Full', desc: '서버에 자체 서명 인증서 사용 가능', recommend: '서버에 인증서 있는 경우' },
                      { mode: 'Full (Strict)', desc: '서버에 유효한 CA 인증서 필요', recommend: '프로덕션 권장' },
                    ].map((r) => (
                      <tr key={r.mode} className="hover:bg-muted/50">
                        <td className="p-3 font-mono text-xs">{r.mode}</td>
                        <td className="p-3 text-muted-foreground">{r.desc}</td>
                        <td className="p-3">{r.recommend}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">항상 HTTPS 사용 설정</h3>
              <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1.5 leading-relaxed">
                <li>Cloudflare 대시보드 → 해당 도메인 선택</li>
                <li>왼쪽 메뉴 <strong>SSL/TLS</strong> → <strong>Edge Certificates</strong></li>
                <li><strong>Always Use HTTPS</strong> 토글 활성화</li>
                <li><strong>Automatic HTTPS Rewrites</strong> 토글 활성화</li>
              </ol>
            </div>
          </div>
        </section>

        {/* 주의사항 */}
        <section id="pitfalls">
          <h2 className="text-2xl font-bold mb-4">자주 하는 실수</h2>
          <div className="space-y-4">
            {[
              {
                title: '❌ SSL 모드를 Flexible로 유지',
                bad: 'SSL 모드: Flexible\n# 서버에서 HTTPS 리다이렉트 시 무한 루프 발생',
                good: 'SSL 모드: Full 또는 Full (Strict)\n# 서버에 인증서가 있는 경우 Full (Strict) 권장',
                desc: 'Flexible 모드에서 서버가 HTTP → HTTPS 리다이렉트를 설정하면 무한 루프가 발생합니다. 반드시 Full 이상으로 설정하세요.',
              },
              {
                title: '❌ Cloudflare 프록시를 비활성화한 채 사용',
                bad: 'DNS 레코드의 프록시 상태: DNS only (회색 구름)\n# Cloudflare 보호 기능 미적용',
                good: 'DNS 레코드의 프록시 상태: Proxied (주황 구름)\n# CDN, DDoS 보호, SSL 모두 적용',
                desc: 'DNS 레코드의 프록시 아이콘이 회색(DNS only)이면 Cloudflare의 기능이 적용되지 않습니다. 주황색(Proxied)으로 설정하세요.',
              },
            ].map((p) => (
              <Card key={p.title} className="bg-card shadow-sm">
                <CardContent className="p-5 space-y-3">
                  <p className="font-semibold">{p.title}</p>
                  <p className="text-sm text-muted-foreground">{p.desc}</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-destructive font-medium mb-1">나쁜 예</p>
                      <pre className="bg-muted rounded p-3 text-xs font-mono overflow-x-auto whitespace-pre-wrap">{p.bad}</pre>
                    </div>
                    <div>
                      <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">좋은 예</p>
                      <pre className="bg-muted rounded p-3 text-xs font-mono overflow-x-auto whitespace-pre-wrap">{p.good}</pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
