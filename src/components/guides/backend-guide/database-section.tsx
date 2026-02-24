'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';

const tableRows = [
  { id: 1, name: '홍길동', email: 'hong@example.com', plan: 'Pro' },
  { id: 2, name: '김영희', email: 'kim@example.com', plan: 'Free' },
  { id: 3, name: '이철수', email: 'lee@example.com', plan: 'Pro' },
];

const dbTypes = [
  {
    name: '관계형 DB (SQL)',
    emoji: '📊',
    desc: '표(테이블) 형태로 데이터를 저장. 엑셀과 비슷한 구조. 데이터 간 관계를 정확하게 정의.',
    examples: 'PostgreSQL, MySQL, SQLite',
    use: '사용자 정보, 주문, 거래 등 정형 데이터',
    color: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30',
  },
  {
    name: '비관계형 DB (NoSQL)',
    emoji: '📦',
    desc: 'JSON 문서, Key-Value, 그래프 등 유연한 구조. 스키마 변경이 자유롭고 대용량에 유리.',
    examples: 'MongoDB, Redis, DynamoDB',
    use: '채팅 메시지, 로그, 캐시, 비정형 데이터',
    color: 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30',
  },
];

const sqlExample = `-- 사용자 테이블 생성
CREATE TABLE users (
  id   SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE
);

-- 데이터 조회
SELECT name, email
FROM users
WHERE plan = 'Pro';`;

export function DatabaseSection() {
  return (
    <section id="database" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">데이터베이스란?</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          앱의 모든 데이터를 저장하고 꺼내오는 창고입니다.
          회원 정보, 게시글, 주문 내역… 앱을 껐다 켜도 데이터가 남아 있는 이유가 DB 덕분입니다.
        </p>
      </ScrollReveal>

      {/* 테이블 비유 */}
      <ScrollReveal delay={0.1}>
        <div className="max-w-2xl mb-10">
          <div className="text-sm font-medium text-muted-foreground mb-3">
            💡 DB = 엑셀과 비슷한 표 구조 (관계형 DB 기준)
          </div>
          <div className="rounded-xl border overflow-hidden bg-card">
            <div className="bg-muted px-4 py-2 border-b flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-muted-foreground">users</span>
              <span className="text-[10px] text-muted-foreground">테이블</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left px-4 py-2 text-xs font-semibold text-muted-foreground">id</th>
                    <th className="text-left px-4 py-2 text-xs font-semibold text-muted-foreground">name</th>
                    <th className="text-left px-4 py-2 text-xs font-semibold text-muted-foreground">email</th>
                    <th className="text-left px-4 py-2 text-xs font-semibold text-muted-foreground">plan</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row, i) => (
                    <tr key={row.id} className={i < tableRows.length - 1 ? 'border-b' : ''}>
                      <td className="px-4 py-2 font-mono text-xs text-muted-foreground">{row.id}</td>
                      <td className="px-4 py-2 text-xs font-medium">{row.name}</td>
                      <td className="px-4 py-2 text-xs text-muted-foreground">{row.email}</td>
                      <td className="px-4 py-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          row.plan === 'Pro'
                            ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {row.plan}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            → 행(Row) = 한 명의 사용자 · 열(Column) = 속성(이름, 이메일, 플랜…)
          </div>
        </div>
      </ScrollReveal>

      {/* DB 종류 */}
      <ScrollReveal delay={0.15}>
        <h3 className="text-lg font-semibold mb-4">DB 종류: SQL vs NoSQL</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-2xl">
          {dbTypes.map((db) => (
            <div key={db.name} className={`rounded-xl border p-5 ${db.color}`}>
              <div className="text-2xl mb-2">{db.emoji}</div>
              <div className="font-semibold text-sm mb-1">{db.name}</div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{db.desc}</p>
              <div className="text-xs mb-1">
                <span className="text-muted-foreground">예: </span>
                <code className="font-mono">{db.examples}</code>
              </div>
              <div className="text-xs text-muted-foreground">📌 {db.use}</div>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* SQL 맛보기 */}
      <ScrollReveal delay={0.2}>
        <h3 className="text-lg font-semibold mb-3">SQL 맛보기</h3>
        <div className="max-w-lg">
          <div className="rounded-lg border bg-muted/50">
            <div className="px-4 py-2 border-b">
              <span className="text-xs text-muted-foreground font-mono">SQL Query</span>
            </div>
            <pre className="p-4 text-xs font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap">
              {sqlExample}
            </pre>
          </div>
          <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
            Supabase나 Firebase 같은 BaaS를 쓰면 SQL을 직접 쓰지 않아도 됩니다. 하지만 원리를 알면 디버깅이 훨씬 쉬워집니다.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
