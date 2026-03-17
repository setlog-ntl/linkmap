'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock } from 'lucide-react';

const corsErrors = [
  {
    error: 'Access to fetch at \'...\' from origin \'...\' has been blocked by CORS policy: No \'Access-Control-Allow-Origin\' header',
    cause: '서버에 CORS 헤더가 설정되지 않음',
    solution: '서버(API) 응답에 Access-Control-Allow-Origin 헤더 추가',
  },
  {
    error: 'CORS policy: Response to preflight request doesn\'t pass access control check',
    cause: 'OPTIONS 요청(Preflight)에 대한 응답이 없음',
    solution: 'OPTIONS 메서드에 대한 핸들러 추가, 허용 메서드·헤더 명시',
  },
  {
    error: 'CORS policy: The value of the \'Access-Control-Allow-Credentials\' header must be \'true\'',
    cause: '쿠키를 포함한 요청인데 credentials 설정이 안 됨',
    solution: 'Access-Control-Allow-Credentials: true 추가, Origin을 * 대신 명시',
  },
  {
    error: 'CORS policy: The \'Access-Control-Allow-Origin\' header has a value that is not equal to the supplied origin',
    cause: '요청 Origin과 서버 허용 Origin이 다름',
    solution: '서버의 허용 Origin 목록에 요청 도메인 추가',
  },
];

const corsSolutions = [
  {
    title: 'Next.js API Route에서 설정',
    code: `// next.config.js
module.exports = {
  async headers() {
    return [{
      source: "/api/:path*",
      headers: [
        { key: "Access-Control-Allow-Origin", value: "https://myapp.com" },
        { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE,OPTIONS" },
        { key: "Access-Control-Allow-Headers", value: "Content-Type,Authorization" },
      ],
    }];
  },
};`,
  },
  {
    title: 'API Route 핸들러에서 직접 설정',
    code: `// src/app/api/example/route.ts
const ALLOWED_ORIGINS = ["https://myapp.com", "https://staging.myapp.com"];

export async function OPTIONS(req: Request) {
  const origin = req.headers.get("origin") ?? "";
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
  };
  if (ALLOWED_ORIGINS.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return new Response(null, { status: 204, headers });
}`,
  },
  {
    title: 'Cloudflare Workers에서 설정',
    code: `// 미들웨어에서 CORS 헤더 추가
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://myapp.com",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
};

// OPTIONS 요청 처리
if (request.method === "OPTIONS") {
  return new Response(null, { headers: corsHeaders });
}`,
  },
];

export function HttpsCorsContent() {
  return (
    <div className="py-6 space-y-0">
      {/* 헤더 */}
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Lock className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">HTTPS와 CORS</h1>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          HTTPS는 데이터 암호화, CORS는 브라우저 보안 정책입니다.
          둘 다 웹 서비스의 필수 요소이지만 초보자가 자주 헤매는 부분이기도 합니다.
        </p>
      </ScrollReveal>

      {/* HTTPS 섹션 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">HTTPS란?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            HTTP에 SSL/TLS 암호화를 추가한 프로토콜입니다.
            브라우저와 서버 사이의 통신을 암호화하여 제3자가 데이터를 훔쳐볼 수 없게 합니다.
          </p>
        </ScrollReveal>

        {/* SSL/TLS 동작 도식 */}
        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl rounded-xl border bg-card shadow-sm p-5 mb-6">
            <h3 className="text-sm font-bold mb-4 text-center">SSL/TLS 연결 과정 (간략)</h3>
            <div className="space-y-3">
              {[
                { step: '1', emoji: '👋', label: '브라우저 → 서버', desc: '"안전한 연결을 원합니다" (Client Hello)' },
                { step: '2', emoji: '📜', label: '서버 → 브라우저', desc: '"이게 내 SSL 인증서입니다" (Server Hello + Certificate)' },
                { step: '3', emoji: '🔑', label: '브라우저', desc: '인증서 검증 후 암호화 키 교환 (Key Exchange)' },
                { step: '4', emoji: '🔒', label: '양방향', desc: '이후 모든 데이터가 암호화되어 전송됩니다' },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                    {item.step}
                  </div>
                  <div className="flex items-start gap-2 flex-1">
                    <span className="text-lg shrink-0">{item.emoji}</span>
                    <div>
                      <div className="text-xs font-medium">{item.label}</div>
                      <div className="text-[10px] text-muted-foreground">{item.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* 자동 SSL */}
        <ScrollReveal delay={0.15}>
          <div className="max-w-2xl">
            <h3 className="text-sm font-bold mb-3">자동 SSL 인증서 발급</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { name: 'Vercel', desc: '배포 시 자동 발급·갱신', badge: '설정 불필요' },
                { name: 'Cloudflare', desc: '도메인 연결 시 자동 적용', badge: '설정 불필요' },
                { name: "Let's Encrypt", desc: '무료 인증서, 직접 서버용', badge: '직접 설정' },
              ].map((provider) => (
                <Card key={provider.name}>
                  <CardHeader className="pb-1">
                    <CardTitle className="text-xs flex items-center justify-between">
                      {provider.name}
                      <Badge variant="secondary" className="text-[9px]">{provider.badge}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[10px] text-muted-foreground">{provider.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-lg bg-muted/50 border">
              <p className="text-xs text-muted-foreground">
                <strong className="text-foreground">초보자 팁:</strong> Vercel이나 Cloudflare를 사용하면
                SSL 인증서를 직접 관리할 필요가 없습니다. 배포하면 자동으로 HTTPS가 적용됩니다.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* CORS 섹션 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">CORS란?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            <strong className="text-foreground">Cross-Origin Resource Sharing</strong> — 브라우저가 다른 출처(origin)의 리소스를
            요청할 때 적용되는 보안 정책입니다. 같은 출처가 아니면 기본적으로 차단됩니다.
          </p>
        </ScrollReveal>

        {/* 동일 출처 정책 설명 */}
        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl rounded-xl border bg-card shadow-sm p-5 mb-6">
            <h3 className="text-sm font-bold mb-3">동일 출처 정책 (Same-Origin Policy)</h3>
            <p className="text-xs text-muted-foreground mb-3">
              &quot;출처(Origin)&quot;는 <strong className="text-foreground">프로토콜 + 도메인 + 포트</strong>의 조합입니다.
              하나라도 다르면 &quot;다른 출처&quot;로 판단됩니다.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-1.5 px-2 font-semibold">요청 출처</th>
                    <th className="text-left py-1.5 px-2 font-semibold">대상</th>
                    <th className="text-left py-1.5 px-2 font-semibold">결과</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b">
                    <td className="py-1.5 px-2"><code className="text-[10px] font-mono">https://myapp.com</code></td>
                    <td className="py-1.5 px-2"><code className="text-[10px] font-mono">https://myapp.com/api</code></td>
                    <td className="py-1.5 px-2 text-green-600 dark:text-green-400 font-medium">같은 출처 (허용)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-1.5 px-2"><code className="text-[10px] font-mono">https://myapp.com</code></td>
                    <td className="py-1.5 px-2"><code className="text-[10px] font-mono">https://api.myapp.com</code></td>
                    <td className="py-1.5 px-2 text-red-500 font-medium">다른 출처 (차단)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-1.5 px-2"><code className="text-[10px] font-mono">http://localhost:3000</code></td>
                    <td className="py-1.5 px-2"><code className="text-[10px] font-mono">http://localhost:8080</code></td>
                    <td className="py-1.5 px-2 text-red-500 font-medium">다른 출처 (포트 다름)</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-2"><code className="text-[10px] font-mono">http://myapp.com</code></td>
                    <td className="py-1.5 px-2"><code className="text-[10px] font-mono">https://myapp.com</code></td>
                    <td className="py-1.5 px-2 text-red-500 font-medium">다른 출처 (프로토콜 다름)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </ScrollReveal>

        {/* CORS 에러 발생 시나리오 */}
        <ScrollReveal delay={0.15}>
          <div className="max-w-2xl mb-6">
            <h3 className="text-sm font-bold mb-3">CORS 에러가 발생하는 상황</h3>
            <div className="rounded-xl border bg-card shadow-sm p-5">
              <div className="grid grid-cols-3 gap-4 text-center text-xs mb-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-xl">🖥️</div>
                  <div className="font-medium">내 사이트</div>
                  <code className="text-[10px] font-mono text-muted-foreground">myapp.com</code>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center text-xl">🚫</div>
                  <div className="font-medium text-red-500">브라우저가 차단</div>
                  <div className="text-[10px] text-red-500">CORS Error!</div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-xl">🌐</div>
                  <div className="font-medium">외부 API</div>
                  <code className="text-[10px] font-mono text-muted-foreground">api.other.com</code>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center leading-relaxed">
                브라우저에서 다른 도메인의 API를 직접 호출하면 CORS 에러가 발생합니다.
                <br />이는 <strong className="text-foreground">브라우저의 보안 기능</strong>이지, 서버 문제가 아닙니다.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* 해결법 3가지 */}
        <ScrollReveal delay={0.2}>
          <div className="max-w-3xl mb-6">
            <h3 className="text-sm font-bold mb-3">CORS 해결법</h3>
            <div className="space-y-4">
              {corsSolutions.map((sol, idx) => (
                <div key={sol.title}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {idx + 1}
                    </div>
                    <span className="text-xs font-semibold">{sol.title}</span>
                  </div>
                  <pre className="text-[10px] sm:text-xs bg-muted/50 border rounded-xl p-4 overflow-x-auto leading-relaxed">
                    <code>{sol.code}</code>
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* CORS 에러 메시지 매핑 표 */}
        <ScrollReveal delay={0.25}>
          <div className="max-w-3xl">
            <h3 className="text-sm font-bold mb-3">흔한 CORS 에러와 해결 방법</h3>
            <div className="space-y-3">
              {corsErrors.map((item) => (
                <Card key={item.error}>
                  <CardHeader className="pb-1">
                    <CardTitle className="text-[10px] font-mono text-red-500 dark:text-red-400 leading-snug break-all">
                      {item.error}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-muted-foreground">원인: </span>
                        <span className="text-foreground">{item.cause}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">해결: </span>
                        <span className="text-foreground font-medium">{item.solution}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-6 p-3 rounded-lg bg-muted/50 border">
              <p className="text-xs text-muted-foreground">
                <strong className="text-foreground">핵심 기억:</strong> CORS 에러는 <strong className="text-foreground">서버에서</strong> 해결해야 합니다.
                프론트엔드 코드에서는 해결할 수 없습니다. 서버의 응답 헤더에 허용 출처를 추가하세요.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
