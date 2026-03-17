'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Badge } from '@/components/ui/badge';
import { KeyRound } from 'lucide-react';

const authMethods = [
  {
    name: 'API Key',
    subtitle: '가장 간단한 인증',
    emoji: '🔑',
    desc: '서비스에서 발급받은 고정 문자열을 요청에 포함합니다. 만료 없이 계속 사용 가능하지만, 유출 시 바로 악용될 수 있습니다.',
    security: '낮음',
    complexity: '매우 쉬움',
    useCase: '서버 간 통신, 공개 API, 개발용',
    color: 'border-yellow-200 dark:border-yellow-800',
    tagColor: 'bg-yellow-100 dark:bg-yellow-900/60 text-yellow-700 dark:text-yellow-300',
  },
  {
    name: 'Bearer Token',
    subtitle: '로그인 기반 인증',
    emoji: '🎫',
    desc: '로그인 후 서버가 발급하는 임시 토큰입니다. 만료 시간이 있어 API Key보다 안전합니다. JWT(JSON Web Token)가 대표적입니다.',
    security: '중간',
    complexity: '보통',
    useCase: '사용자 인증이 필요한 앱, SPA',
    color: 'border-blue-200 dark:border-blue-800',
    tagColor: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300',
  },
  {
    name: 'OAuth 2.0',
    subtitle: '제3자 인증 위임',
    emoji: '🛡️',
    desc: '사용자가 비밀번호를 직접 공유하지 않고, Google/GitHub 같은 제3자에게 인증을 위임합니다. "GitHub으로 로그인" 버튼이 대표적입니다.',
    security: '높음',
    complexity: '복잡',
    useCase: '소셜 로그인, 제3자 API 접근',
    color: 'border-green-200 dark:border-green-800',
    tagColor: 'bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300',
  },
];

const comparisonTable = [
  { feature: '보안성', apiKey: '낮음', bearer: '중간', oauth: '높음' },
  { feature: '구현 복잡도', apiKey: '매우 쉬움', bearer: '보통', oauth: '복잡' },
  { feature: '만료 여부', apiKey: '없음 (수동 갱신)', bearer: '있음 (자동 만료)', oauth: '있음 (자동 갱신)' },
  { feature: '사용자 인증', apiKey: '불가', bearer: '가능', oauth: '가능' },
  { feature: '유출 시 위험', apiKey: '높음 (즉시 악용)', bearer: '중간 (만료까지)', oauth: '낮음 (토큰 무효화 가능)' },
  { feature: '대표 서비스', apiKey: 'OpenAI, 기상청', bearer: 'Supabase, Firebase', oauth: 'Google, GitHub, Kakao' },
];

const oauthFlow = [
  { step: '1', emoji: '👤', label: '사용자', desc: '"GitHub으로 로그인" 클릭' },
  { step: '2', emoji: '🔗', label: '리다이렉트', desc: 'GitHub 로그인 페이지로 이동' },
  { step: '3', emoji: '✅', label: 'GitHub 승인', desc: '사용자가 권한 허용' },
  { step: '4', emoji: '📬', label: '콜백', desc: 'Authorization Code를 앱에 전달' },
  { step: '5', emoji: '🎫', label: '토큰 발급', desc: '앱이 Code로 Access Token 요청' },
  { step: '6', emoji: '📡', label: 'API 호출', desc: 'Token으로 GitHub API 호출' },
];

export function ApiAuthContent() {
  return (
    <div className="py-6 space-y-0">
      {/* 헤더 */}
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <KeyRound className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">API 인증 방식</h1>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          API에 &quot;나는 허가된 사용자입니다&quot;를 증명하는 3가지 방법을 비교합니다.
          프로젝트 상황에 맞는 인증 방식을 선택하세요.
        </p>
      </ScrollReveal>

      {/* 인증 방식 3가지 카드 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">인증 방식 3가지</h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mb-8">
          {authMethods.map((auth, idx) => (
            <ScrollReveal key={auth.name} delay={idx * 0.08}>
              <div className={`rounded-xl border p-5 h-full flex flex-col ${auth.color}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{auth.emoji}</span>
                  <div>
                    <div className="font-bold text-sm">{auth.name}</div>
                    <div className="text-[10px] text-muted-foreground">{auth.subtitle}</div>
                  </div>
                </div>
                <Badge variant="secondary" className={`text-[9px] self-start mt-1 mb-3 ${auth.tagColor}`}>
                  보안: {auth.security}
                </Badge>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{auth.desc}</p>
                <div className="mt-auto pt-3 border-t space-y-1">
                  <div className="text-[10px]">
                    <span className="text-muted-foreground">복잡도: </span>
                    <span className="font-medium">{auth.complexity}</span>
                  </div>
                  <div className="text-[10px]">
                    <span className="text-muted-foreground">활용: </span>
                    <span className="font-medium">{auth.useCase}</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* API Key 사용법 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">API Key 사용법</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            API Key를 전달하는 두 가지 방법입니다. Header 방식이 더 안전합니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mb-6">
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b flex items-center gap-2">
                <Badge variant="secondary" className="text-[10px] bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300">추천</Badge>
                <span className="text-xs font-semibold">Header 방식</span>
              </div>
              <div className="bg-muted/50 px-5 py-4 overflow-x-auto">
                <pre className="text-[11px] font-mono leading-relaxed text-muted-foreground whitespace-pre">{`// Header에 API Key 포함
const res = await fetch(url, {
  headers: {
    'X-API-Key': process.env.API_KEY!,
  },
});`}</pre>
              </div>
            </div>
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b flex items-center gap-2">
                <Badge variant="secondary" className="text-[10px]">간편</Badge>
                <span className="text-xs font-semibold">Query Parameter 방식</span>
              </div>
              <div className="bg-muted/50 px-5 py-4 overflow-x-auto">
                <pre className="text-[11px] font-mono leading-relaxed text-muted-foreground whitespace-pre">{`// URL에 API Key 포함
// (로그에 노출될 수 있어 비추천)
const url =
  'https://api.example.com/data'
  + '?api_key=YOUR_KEY';

const res = await fetch(url);`}</pre>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Bearer Token 사용법 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">Bearer Token 사용법</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            로그인 후 받은 토큰을 Authorization 헤더에 담아 보냅니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden max-w-3xl mb-6">
            <div className="bg-muted/50 px-5 py-4 overflow-x-auto">
              <pre className="text-[11px] font-mono leading-relaxed text-muted-foreground whitespace-pre">{`// 1. 로그인하여 토큰 받기
const loginRes = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'mypassword',
  }),
});
const { token } = await loginRes.json();

// 2. 토큰으로 API 호출
const dataRes = await fetch('/api/protected/data', {
  headers: {
    'Authorization': \`Bearer \${token}\`,
  },
});
const data = await dataRes.json();`}</pre>
            </div>
            <div className="px-5 py-3 border-t">
              <p className="text-[10px] text-muted-foreground">
                💡 <strong className="text-foreground">Bearer</strong>는 &quot;이 토큰의 소유자(bearer)에게 접근 권한을 부여합니다&quot;라는 의미입니다.
                반드시 <code className="font-mono bg-muted px-1 rounded">Bearer </code>(공백 포함)를 앞에 붙여야 합니다.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* OAuth 2.0 흐름 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">OAuth 2.0 흐름</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            OAuth는 복잡해 보이지만, 핵심은 &quot;사용자가 제3자에게 권한을 위임&quot;하는 것입니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-3xl mb-6">
            <div className="rounded-xl border bg-card shadow-sm p-5">
              <h4 className="text-xs font-bold mb-4">OAuth 2.0 Authorization Code Flow</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {oauthFlow.map((item) => (
                  <div key={item.step} className="text-center">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg mx-auto mb-1.5">
                      {item.emoji}
                    </div>
                    <div className="text-[10px] font-bold mb-0.5">
                      <span className="text-primary mr-1">{item.step}.</span>{item.label}
                    </div>
                    <div className="text-[9px] text-muted-foreground leading-tight">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="p-3 rounded-lg bg-muted/50 border max-w-2xl mb-8">
            <p className="text-xs text-muted-foreground">
              💡 <strong className="text-foreground">초보자 팁:</strong> Supabase Auth를 사용하면 OAuth 구현이 매우 간단합니다.
              <code className="font-mono bg-muted px-1 rounded text-[10px]">supabase.auth.signInWithOAuth</code> 한 줄이면
              Google, GitHub 로그인이 완성됩니다.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* 비교 표 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">한눈에 비교</h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-3xl overflow-x-auto mb-6">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-semibold text-muted-foreground">항목</th>
                  <th className="text-left py-2 px-3 font-semibold">🔑 API Key</th>
                  <th className="text-left py-2 px-3 font-semibold">🎫 Bearer Token</th>
                  <th className="text-left py-2 px-3 font-semibold">🛡️ OAuth 2.0</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {comparisonTable.map((row) => (
                  <tr key={row.feature} className="border-b">
                    <td className="py-2 px-3 font-medium text-foreground">{row.feature}</td>
                    <td className="py-2 px-3">{row.apiKey}</td>
                    <td className="py-2 px-3">{row.bearer}</td>
                    <td className="py-2 px-3">{row.oauth}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="p-3 rounded-lg bg-muted/50 border max-w-2xl">
            <p className="text-xs text-muted-foreground">
              💡 <strong className="text-foreground">결론:</strong> 서버 간 통신이나 개발 테스트에는 <strong className="text-foreground">API Key</strong>,
              사용자 로그인이 필요한 앱에는 <strong className="text-foreground">Bearer Token</strong>,
              소셜 로그인에는 <strong className="text-foreground">OAuth 2.0</strong>을 사용하세요.
              API Key는 반드시 환경변수로 관리하고, 클라이언트에 절대 노출하지 마세요.
            </p>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
