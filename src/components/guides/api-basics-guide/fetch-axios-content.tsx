'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Badge } from '@/components/ui/badge';
import { Globe } from 'lucide-react';

const fetchVsAxios = [
  { feature: '설치', fetch: '불필요 (브라우저 내장)', axios: 'npm install axios' },
  { feature: 'JSON 변환', fetch: '수동 (response.json())', axios: '자동 (response.data)' },
  { feature: '에러 처리', fetch: 'response.ok 수동 체크', axios: '4xx/5xx 자동 throw' },
  { feature: '요청 취소', fetch: 'AbortController', axios: 'CancelToken / AbortController' },
  { feature: '인터셉터', fetch: '없음 (직접 구현)', axios: '내장 지원' },
  { feature: '타임아웃', fetch: 'AbortController + setTimeout', axios: 'timeout 옵션' },
  { feature: 'Next.js 호환', fetch: '완벽 (캐싱 옵션 내장)', axios: '사용 가능 (캐싱 수동)' },
];

export function FetchAxiosContent() {
  return (
    <div className="py-6 space-y-0">
      {/* 헤더 */}
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Globe className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">HTTP 요청 보내기</h1>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          JavaScript에서 API를 호출하는 두 가지 방법, <strong className="text-foreground">fetch</strong>와{' '}
          <strong className="text-foreground">axios</strong>를 비교하고 실전 사용법을 알아봅니다.
        </p>
      </ScrollReveal>

      {/* fetch GET 기본 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">fetch() 기본 사용법</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            fetch는 브라우저에 내장된 HTTP 요청 함수입니다. 별도 설치 없이 바로 사용할 수 있습니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden max-w-3xl mb-6">
            <div className="px-5 py-3 border-b flex items-center gap-2">
              <Badge variant="secondary" className="text-[10px] bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300">GET</Badge>
              <span className="text-xs font-semibold">데이터 조회하기</span>
            </div>
            <div className="bg-muted/50 px-5 py-4 overflow-x-auto">
              <pre className="text-[11px] font-mono leading-relaxed text-muted-foreground whitespace-pre">{`// 기본 GET 요청
const response = await fetch('https://api.example.com/users');
const data = await response.json();
console.log(data);
// [{ id: 1, name: "홍길동" }, { id: 2, name: "김철수" }]`}</pre>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden max-w-3xl mb-6">
            <div className="px-5 py-3 border-b flex items-center gap-2">
              <Badge variant="secondary" className="text-[10px] bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">POST</Badge>
              <span className="text-xs font-semibold">데이터 생성하기</span>
            </div>
            <div className="bg-muted/50 px-5 py-4 overflow-x-auto">
              <pre className="text-[11px] font-mono leading-relaxed text-muted-foreground whitespace-pre">{`// POST 요청 — 새 사용자 생성
const response = await fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: '홍길동',
    email: 'hong@example.com',
  }),
});

const newUser = await response.json();
// { id: 3, name: "홍길동", email: "hong@example.com" }`}</pre>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Headers 설정 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">Headers 설정</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            Headers는 요청에 대한 부가 정보를 담습니다. 데이터 형식과 인증 정보를 서버에 알려줍니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden max-w-3xl mb-6">
            <div className="bg-muted/50 px-5 py-4 overflow-x-auto">
              <pre className="text-[11px] font-mono leading-relaxed text-muted-foreground whitespace-pre">{`const response = await fetch('https://api.example.com/data', {
  method: 'POST',
  headers: {
    // 서버에게 "JSON 형식으로 보냅니다" 알림
    'Content-Type': 'application/json',
    // 인증 토큰 전달
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIs...',
    // 커스텀 헤더
    'X-API-Key': 'my-api-key-123',
  },
  body: JSON.stringify({ message: 'Hello' }),
});`}</pre>
            </div>
            <div className="px-5 py-3 border-t">
              <div className="text-[10px] text-muted-foreground space-y-1">
                <p><strong className="text-foreground">Content-Type</strong> — 보내는 데이터 형식 (JSON, form-data 등)</p>
                <p><strong className="text-foreground">Authorization</strong> — 인증 정보 (토큰, API Key)</p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* async/await 패턴 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">async/await 패턴</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            fetch는 Promise를 반환하므로 async/await로 깔끔하게 처리할 수 있습니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden max-w-3xl mb-6">
            <div className="bg-muted/50 px-5 py-4 overflow-x-auto">
              <pre className="text-[11px] font-mono leading-relaxed text-muted-foreground whitespace-pre">{`// async/await 패턴 (권장)
async function getUsers() {
  try {
    const response = await fetch('/api/users');

    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
    }

    const users = await response.json();
    return users;
  } catch (error) {
    // 네트워크 에러 또는 위에서 throw한 에러
    console.error('API 호출 실패:', error);
    throw error;
  }
}

// 사용
const users = await getUsers();`}</pre>
            </div>
            <div className="px-5 py-3 border-t">
              <p className="text-[10px] text-muted-foreground">
                💡 <strong className="text-foreground">주의:</strong> fetch는 4xx/5xx 에러에서도 reject하지 않습니다.
                <strong className="text-foreground"> response.ok</strong>를 반드시 체크하세요.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* fetch vs axios 비교 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">fetch vs axios 비교</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            fetch는 브라우저 내장, axios는 외부 라이브러리입니다. 프로젝트에 맞는 것을 선택하세요.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-3xl overflow-x-auto mb-6">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-semibold text-muted-foreground">항목</th>
                  <th className="text-left py-2 px-3 font-semibold">fetch</th>
                  <th className="text-left py-2 px-3 font-semibold">axios</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {fetchVsAxios.map((row) => (
                  <tr key={row.feature} className="border-b">
                    <td className="py-2 px-3 font-medium text-foreground">{row.feature}</td>
                    <td className="py-2 px-3">{row.fetch}</td>
                    <td className="py-2 px-3">{row.axios}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="p-3 rounded-lg bg-muted/50 border max-w-2xl">
            <p className="text-xs text-muted-foreground">
              💡 <strong className="text-foreground">결론:</strong> Next.js 프로젝트에서는{' '}
              <strong className="text-foreground">fetch</strong>를 추천합니다.
              Next.js가 fetch를 확장하여 캐싱, 재검증 등을 기본 지원하기 때문입니다.
              백엔드 전용 프로젝트나 복잡한 HTTP 로직이 필요하면 axios도 좋은 선택입니다.
            </p>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
