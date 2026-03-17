'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Badge } from '@/components/ui/badge';

const httpMethods = [
  { method: 'GET', desc: '데이터 조회 (읽기)', example: '사용자 목록 가져오기', emoji: '📖', color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-50 dark:bg-green-950/30' },
  { method: 'POST', desc: '데이터 생성 (쓰기)', example: '새 게시글 작성', emoji: '✏️', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-50 dark:bg-blue-950/30' },
  { method: 'PUT', desc: '데이터 전체 수정', example: '프로필 전체 업데이트', emoji: '🔄', color: 'text-yellow-600 dark:text-yellow-400', bgColor: 'bg-yellow-50 dark:bg-yellow-950/30' },
  { method: 'PATCH', desc: '데이터 일부 수정', example: '이름만 변경', emoji: '🩹', color: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-50 dark:bg-orange-950/30' },
  { method: 'DELETE', desc: '데이터 삭제', example: '게시글 삭제', emoji: '🗑️', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-50 dark:bg-red-950/30' },
];

const requestParts = [
  { part: 'URL', desc: '어디로 보낼지 (주소)', example: 'https://api.example.com/users', emoji: '🔗' },
  { part: 'Method', desc: '무엇을 할지 (동작)', example: 'GET, POST, PUT, DELETE', emoji: '🎯' },
  { part: 'Headers', desc: '부가 정보 (메타데이터)', example: 'Content-Type: application/json', emoji: '📋' },
  { part: 'Body', desc: '보낼 데이터 (내용)', example: '{ "name": "홍길동" }', emoji: '📦' },
];

const statusCodeRanges = [
  {
    range: '2xx',
    meaning: '성공',
    emoji: '✅',
    color: 'border-green-200 dark:border-green-800',
    bgColor: 'bg-green-50 dark:bg-green-950/30',
    textColor: 'text-green-700 dark:text-green-300',
    codes: [
      { code: '200', desc: 'OK — 요청 성공' },
      { code: '201', desc: 'Created — 새 리소스 생성됨' },
      { code: '204', desc: 'No Content — 성공, 응답 본문 없음' },
    ],
  },
  {
    range: '3xx',
    meaning: '리다이렉트',
    emoji: '↪️',
    color: 'border-blue-200 dark:border-blue-800',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    textColor: 'text-blue-700 dark:text-blue-300',
    codes: [
      { code: '301', desc: 'Moved Permanently — URL이 영구 변경됨' },
      { code: '302', desc: 'Found — 일시적 리다이렉트' },
      { code: '304', desc: 'Not Modified — 캐시된 버전 사용' },
    ],
  },
  {
    range: '4xx',
    meaning: '클라이언트 에러',
    emoji: '⚠️',
    color: 'border-yellow-200 dark:border-yellow-800',
    bgColor: 'bg-yellow-50 dark:bg-yellow-950/30',
    textColor: 'text-yellow-700 dark:text-yellow-300',
    codes: [
      { code: '400', desc: 'Bad Request — 잘못된 요청' },
      { code: '401', desc: 'Unauthorized — 인증 필요' },
      { code: '403', desc: 'Forbidden — 권한 없음' },
      { code: '404', desc: 'Not Found — 리소스 없음' },
      { code: '429', desc: 'Too Many Requests — 요청 과다' },
    ],
  },
  {
    range: '5xx',
    meaning: '서버 에러',
    emoji: '🔥',
    color: 'border-red-200 dark:border-red-800',
    bgColor: 'bg-red-50 dark:bg-red-950/30',
    textColor: 'text-red-700 dark:text-red-300',
    codes: [
      { code: '500', desc: 'Internal Server Error — 서버 내부 오류' },
      { code: '502', desc: 'Bad Gateway — 게이트웨이 오류' },
      { code: '503', desc: 'Service Unavailable — 서비스 일시 중단' },
    ],
  },
];

export function HttpBasicsSection() {
  return (
    <section id="http-basics" className="scroll-mt-24 py-12 md:py-16">
      {/* HTTP 메서드 */}
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">HTTP 기초</h2>
        <p className="text-muted-foreground mb-4 max-w-2xl leading-relaxed">
          API 통신은 <strong className="text-foreground">HTTP(HyperText Transfer Protocol)</strong> 위에서
          이루어집니다. 웹 브라우저가 웹 페이지를 불러올 때 쓰는 바로 그 프로토콜입니다.
        </p>
      </ScrollReveal>

      {/* HTTP 메서드 표 */}
      <ScrollReveal delay={0.1}>
        <h3 className="text-lg font-semibold mb-4">HTTP 메서드 5가지</h3>
        <div className="max-w-2xl overflow-x-auto mb-10">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3 font-semibold text-muted-foreground">메서드</th>
                <th className="text-left py-2 px-3 font-semibold text-muted-foreground">설명</th>
                <th className="text-left py-2 px-3 font-semibold text-muted-foreground">예시</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {httpMethods.map((m) => (
                <tr key={m.method} className="border-b">
                  <td className="py-2 px-3">
                    <Badge variant="secondary" className={`text-[10px] font-mono ${m.bgColor} ${m.color}`}>
                      {m.emoji} {m.method}
                    </Badge>
                  </td>
                  <td className="py-2 px-3 font-medium text-foreground">{m.desc}</td>
                  <td className="py-2 px-3">{m.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ScrollReveal>

      {/* 요청 구조 */}
      <ScrollReveal delay={0.15}>
        <h3 className="text-lg font-semibold mb-4">요청(Request)의 구조</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-2xl">
          API 요청은 4가지 요소로 구성됩니다. 편지에 비유하면 주소(URL), 목적(Method), 봉투(Headers), 내용물(Body)입니다.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mb-6">
          {requestParts.map((part, idx) => (
            <div key={part.part} className="rounded-lg border bg-card shadow-sm p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{part.emoji}</span>
                <span className="text-sm font-bold">{part.part}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{part.desc}</p>
              <code className="text-[10px] font-mono bg-muted px-2 py-1 rounded block">{part.example}</code>
            </div>
          ))}
        </div>

        <div className="p-3 rounded-lg bg-muted/50 border max-w-2xl mb-10">
          <p className="text-xs text-muted-foreground">
            💡 <strong className="text-foreground">참고:</strong> GET 요청에는 보통 Body가 없습니다.
            데이터를 보내야 할 때는 POST, PUT, PATCH를 사용합니다.
          </p>
        </div>
      </ScrollReveal>

      {/* 응답 구조 — 상태 코드 */}
      <ScrollReveal delay={0.2}>
        <h3 className="text-lg font-semibold mb-4">응답(Response) 상태 코드</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-2xl">
          서버는 응답과 함께 3자리 숫자(상태 코드)를 보냅니다. 첫 번째 자리가 의미를 결정합니다.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
          {statusCodeRanges.map((range) => (
            <div key={range.range} className={`rounded-xl border p-5 ${range.color}`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{range.emoji}</span>
                <div>
                  <div className="font-bold text-sm">{range.range}</div>
                  <div className={`text-[10px] font-medium ${range.textColor}`}>{range.meaning}</div>
                </div>
              </div>
              <div className="space-y-1.5">
                {range.codes.map((c) => (
                  <div key={c.code} className="flex items-start gap-2 text-xs">
                    <code className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded shrink-0 font-bold">{c.code}</code>
                    <span className="text-muted-foreground">{c.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
