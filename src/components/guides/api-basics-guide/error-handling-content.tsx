'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert } from 'lucide-react';

const statusCodes = [
  { code: '400', name: 'Bad Request', meaning: '요청 형식이 잘못됨', action: '요청 바디, 파라미터 확인', emoji: '📝', color: 'text-yellow-600 dark:text-yellow-400' },
  { code: '401', name: 'Unauthorized', meaning: '인증이 필요하거나 만료됨', action: '로그인 상태 확인, 토큰 갱신', emoji: '🔒', color: 'text-orange-600 dark:text-orange-400' },
  { code: '403', name: 'Forbidden', meaning: '권한이 부족함', action: '접근 권한 확인, 관리자에게 문의', emoji: '🚫', color: 'text-red-600 dark:text-red-400' },
  { code: '404', name: 'Not Found', meaning: '요청한 리소스가 없음', action: 'URL 오타 확인, 리소스 존재 여부 확인', emoji: '🔍', color: 'text-gray-600 dark:text-gray-400' },
  { code: '409', name: 'Conflict', meaning: '충돌 (이미 존재하는 리소스)', action: '중복 데이터 확인', emoji: '⚡', color: 'text-purple-600 dark:text-purple-400' },
  { code: '422', name: 'Unprocessable Entity', meaning: '유효성 검사 실패', action: '필수 필드, 데이터 형식 확인', emoji: '📋', color: 'text-pink-600 dark:text-pink-400' },
  { code: '429', name: 'Too Many Requests', meaning: 'Rate Limit 초과', action: '잠시 후 재시도 (지수 백오프)', emoji: '🚦', color: 'text-amber-600 dark:text-amber-400' },
  { code: '500', name: 'Internal Server Error', meaning: '서버 내부 오류', action: '서버 로그 확인, 잠시 후 재시도', emoji: '🔥', color: 'text-red-600 dark:text-red-400' },
  { code: '503', name: 'Service Unavailable', meaning: '서비스 일시 중단', action: '서버 상태 확인, 잠시 후 재시도', emoji: '🛑', color: 'text-red-600 dark:text-red-400' },
];

const backoffSteps = [
  { attempt: '1차', delay: '1초', total: '1초' },
  { attempt: '2차', delay: '2초', total: '3초' },
  { attempt: '3차', delay: '4초', total: '7초' },
  { attempt: '4차', delay: '8초', total: '15초' },
  { attempt: '5차', delay: '16초', total: '31초' },
];

export function ErrorHandlingContent() {
  return (
    <div className="py-6 space-y-0">
      {/* 헤더 */}
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <ShieldAlert className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">에러 핸들링</h1>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          API 호출은 언제든 실패할 수 있습니다. 상태 코드의 의미를 이해하고,
          에러를 우아하게 처리하는 방법을 배워봅니다.
        </p>
      </ScrollReveal>

      {/* 상태 코드별 의미와 대응 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">상태 코드별 의미와 대응</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            자주 만나는 에러 코드와 각각의 대응 방법을 정리했습니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-3xl overflow-x-auto mb-8">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-semibold text-muted-foreground">코드</th>
                  <th className="text-left py-2 px-3 font-semibold text-muted-foreground">의미</th>
                  <th className="text-left py-2 px-3 font-semibold text-muted-foreground">대응 방법</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {statusCodes.map((sc) => (
                  <tr key={sc.code} className="border-b">
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-1.5">
                        <span>{sc.emoji}</span>
                        <code className={`font-mono font-bold text-[11px] ${sc.color}`}>{sc.code}</code>
                      </div>
                      <div className="text-[9px] text-muted-foreground mt-0.5">{sc.name}</div>
                    </td>
                    <td className="py-2 px-3 font-medium text-foreground">{sc.meaning}</td>
                    <td className="py-2 px-3">{sc.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollReveal>
      </section>

      {/* try/catch + response.ok */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">try/catch + response.ok 패턴</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            fetch 에러 핸들링의 핵심은 <strong className="text-foreground">두 가지 에러</strong>를 모두 처리하는 것입니다:
            네트워크 에러(try/catch)와 HTTP 에러(response.ok).
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden max-w-3xl mb-6">
            <div className="bg-muted/50 px-5 py-4 overflow-x-auto">
              <pre className="text-[11px] font-mono leading-relaxed text-muted-foreground whitespace-pre">{`async function fetchWithErrorHandling(url: string) {
  try {
    const response = await fetch(url);

    // HTTP 에러 체크 (4xx, 5xx)
    if (!response.ok) {
      // 상태 코드별 분기 처리
      if (response.status === 401) {
        // 인증 만료 → 로그인 페이지로 이동
        window.location.href = '/login';
        return;
      }
      if (response.status === 429) {
        // Rate Limit → 잠시 후 재시도
        throw new Error('요청이 너무 많습니다. 잠시 후 다시 시도해주세요.');
      }
      // 그 외 에러
      const errorBody = await response.json().catch(() => null);
      throw new Error(
        errorBody?.message ?? \`HTTP \${response.status}: \${response.statusText}\`
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      // 네트워크 에러 (인터넷 끊김, DNS 실패 등)
      throw new Error('네트워크 연결을 확인해주세요.');
    }
    throw error; // 위에서 throw한 에러 재전달
  }
}`}</pre>
            </div>
            <div className="px-5 py-3 border-t">
              <p className="text-[10px] text-muted-foreground">
                💡 <strong className="text-foreground">핵심:</strong> fetch는 네트워크 에러에서만 reject합니다.
                404, 500 같은 HTTP 에러는 정상 응답으로 처리되므로 <code className="font-mono bg-muted px-1 rounded">response.ok</code>를 반드시 확인하세요.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* 에러 타입 비교 */}
        <ScrollReveal delay={0.15}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mb-6">
            <div className="rounded-xl border border-red-200 dark:border-red-800 p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🌐</span>
                <span className="font-bold text-sm">네트워크 에러</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">try/catch로 잡힘</p>
              <div className="space-y-1 text-[10px] text-muted-foreground">
                <p>- 인터넷 연결 끊김</p>
                <p>- DNS 조회 실패</p>
                <p>- 서버에 도달하지 못함</p>
                <p>- CORS 에러</p>
              </div>
            </div>
            <div className="rounded-xl border border-yellow-200 dark:border-yellow-800 p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">📡</span>
                <span className="font-bold text-sm">HTTP 에러</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">response.ok로 체크</p>
              <div className="space-y-1 text-[10px] text-muted-foreground">
                <p>- 400 Bad Request</p>
                <p>- 401 Unauthorized</p>
                <p>- 404 Not Found</p>
                <p>- 500 Internal Server Error</p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 재시도 전략 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">재시도 전략 (지수 백오프)</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            일시적 에러(429, 500, 503)는 잠시 후 재시도하면 성공할 수 있습니다.
            <strong className="text-foreground"> 지수 백오프(Exponential Backoff)</strong>는 재시도 간격을 점점 늘려가는 전략입니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl mb-6">
            <div className="rounded-xl border bg-card shadow-sm p-5">
              <h4 className="text-xs font-bold mb-3">재시도 간격 (지수 백오프)</h4>
              <div className="flex items-end gap-2">
                {backoffSteps.map((step, i) => (
                  <div key={step.attempt} className="flex-1 text-center">
                    <div
                      className="bg-primary/20 rounded-t mx-auto mb-1"
                      style={{ width: '100%', height: `${(i + 1) * 16}px` }}
                    />
                    <div className="text-[10px] font-bold">{step.delay}</div>
                    <div className="text-[9px] text-muted-foreground">{step.attempt}</div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground text-center mt-3">
                간격을 점점 넓혀서 서버에 부담을 줄입니다
              </p>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden max-w-3xl mb-6">
            <div className="px-5 py-3 border-b">
              <span className="text-xs font-semibold">지수 백오프 구현 예시</span>
            </div>
            <div className="bg-muted/50 px-5 py-4 overflow-x-auto">
              <pre className="text-[11px] font-mono leading-relaxed text-muted-foreground whitespace-pre">{`async function fetchWithRetry(
  url: string,
  options?: RequestInit,
  maxRetries = 3,
) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      // 재시도 가능한 에러인지 확인
      if (response.status === 429 || response.status >= 500) {
        if (attempt < maxRetries) {
          // 지수 백오프: 1초, 2초, 4초...
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      }

      if (!response.ok) {
        throw new Error(\`HTTP \${response.status}\`);
      }

      return await response.json();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}`}</pre>
            </div>
            <div className="px-5 py-3 border-t">
              <p className="text-[10px] text-muted-foreground">
                💡 429(Rate Limit)와 5xx(서버 에러)만 재시도합니다. 400, 401, 404 같은 클라이언트 에러는 재시도해도 같은 결과이므로 즉시 실패 처리합니다.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
