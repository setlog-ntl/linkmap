'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database } from 'lucide-react';

const tableRows = [
  { id: 1, name: '홍길동', email: 'hong@example.com', plan: 'Pro' },
  { id: 2, name: '김영희', email: 'kim@example.com', plan: 'Free' },
  { id: 3, name: '이철수', email: 'lee@example.com', plan: 'Pro' },
];

const dbTypes = [
  {
    name: '관계형 DB (SQL)',
    icon: '📊',
    desc: '표(테이블) 형태로 데이터를 저장합니다. 테이블 간 관계를 정확하게 정의할 수 있어 데이터 일관성이 중요한 서비스에 적합합니다.',
    examples: ['PostgreSQL', 'MySQL', 'SQLite'],
    useCase: '사용자 정보, 주문, 결제, 커머스',
    pros: ['데이터 일관성 보장', '복잡한 쿼리 가능', '트랜잭션 지원'],
    color: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30',
    badge: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300',
  },
  {
    name: '비관계형 DB (NoSQL)',
    icon: '📦',
    desc: 'JSON 문서, Key-Value 등 유연한 구조로 데이터를 저장합니다. 스키마 변경이 자유롭고 대용량 처리에 유리합니다.',
    examples: ['MongoDB', 'Redis', 'DynamoDB'],
    useCase: '채팅, 로그, 캐시, 비정형 데이터',
    pros: ['유연한 스키마', '수평 확장 용이', '빠른 읽기/쓰기'],
    color: 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30',
    badge: 'bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300',
  },
];

const crudExamples = [
  {
    op: 'CREATE',
    desc: '데이터 생성',
    sql: `INSERT INTO users (name, email)
VALUES ('홍길동', 'hong@example.com');`,
    supabase: `await supabase
  .from('users')
  .insert({ name: '홍길동', email: 'hong@example.com' });`,
    color: 'text-green-600 dark:text-green-400',
  },
  {
    op: 'READ',
    desc: '데이터 조회',
    sql: `SELECT name, email
FROM users
WHERE plan = 'Pro';`,
    supabase: `const { data } = await supabase
  .from('users')
  .select('name, email')
  .eq('plan', 'Pro');`,
    color: 'text-blue-600 dark:text-blue-400',
  },
  {
    op: 'UPDATE',
    desc: '데이터 수정',
    sql: `UPDATE users
SET plan = 'Pro'
WHERE id = 1;`,
    supabase: `await supabase
  .from('users')
  .update({ plan: 'Pro' })
  .eq('id', 1);`,
    color: 'text-yellow-600 dark:text-yellow-400',
  },
  {
    op: 'DELETE',
    desc: '데이터 삭제',
    sql: `DELETE FROM users
WHERE id = 1;`,
    supabase: `await supabase
  .from('users')
  .delete()
  .eq('id', 1);`,
    color: 'text-red-600 dark:text-red-400',
  },
];

export function DatabaseContent() {
  return (
    <div className="py-6 space-y-0">
      {/* 헤더 */}
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Database className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">데이터베이스 기초</h1>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          앱의 데이터를 저장하고 꺼내오는 창고입니다.
          회원 정보, 게시글, 주문 내역 — 앱을 껐다 켜도 데이터가 남아 있는 이유가 DB 덕분입니다.
        </p>
      </ScrollReveal>

      {/* 테이블 비유 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">DB = 엑셀과 비슷한 표 구조</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            관계형 DB는 데이터를 표(테이블)로 저장합니다.
            행(Row)은 한 건의 데이터, 열(Column)은 데이터의 속성입니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl mb-4">
            <div className="rounded-xl border overflow-hidden bg-card">
              <div className="bg-muted px-4 py-2 border-b flex items-center gap-2">
                <Database className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-mono font-semibold text-muted-foreground">users</span>
                <span className="text-[10px] text-muted-foreground">테이블</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      {['id', 'name', 'email', 'plan'].map((col) => (
                        <th key={col} className="text-left px-4 py-2 text-xs font-semibold text-muted-foreground">
                          {col}
                        </th>
                      ))}
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
            <p className="mt-2 text-xs text-muted-foreground">
              → 행(Row) = 한 명의 사용자 · 열(Column) = 속성(이름, 이메일, 플랜)
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* SQL vs NoSQL */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">SQL vs NoSQL — 어떤 걸 선택할까?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            대부분의 웹 앱에는 관계형 DB(SQL)가 적합합니다.
            Supabase는 PostgreSQL 기반이라 SQL을 사용합니다.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mb-8">
          {dbTypes.map((db, idx) => (
            <ScrollReveal key={db.name} delay={idx * 0.1}>
              <div className={`rounded-xl border p-5 h-full ${db.color}`}>
                <div className="text-2xl mb-2">{db.icon}</div>
                <div className="font-semibold text-sm mb-1">{db.name}</div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{db.desc}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {db.examples.map((ex) => (
                    <code key={ex} className="text-[10px] px-1.5 py-0.5 rounded bg-background/60 border font-mono">{ex}</code>
                  ))}
                </div>
                <div className="text-xs mb-2">
                  <span className="text-muted-foreground">대표 용도: </span>
                  <span className="font-medium">{db.useCase}</span>
                </div>
                <div className="space-y-1">
                  {db.pros.map((p) => (
                    <div key={p} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <span className="text-green-500">✓</span><span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* CRUD */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">CRUD — 데이터 기본 4가지 작업</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            모든 앱의 데이터 처리는 CRUD로 이루어집니다.
            SQL과 Supabase JS SDK로 각각 어떻게 사용하는지 비교합니다.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {crudExamples.map((item, idx) => (
            <ScrollReveal key={item.op} delay={idx * 0.08}>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Badge variant="secondary" className={`text-[10px] font-mono font-bold ${item.color}`}>
                      {item.op}
                    </Badge>
                    {item.desc}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="text-[10px] text-muted-foreground mb-1">SQL</div>
                    <div className="rounded-md border bg-muted/50">
                      <pre className="p-3 text-[10px] font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap">{item.sql}</pre>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground mb-1">Supabase JS SDK</div>
                    <div className="rounded-md border bg-muted/50">
                      <pre className="p-3 text-[10px] font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap">{item.supabase}</pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 스키마 개념 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">스키마(Schema)란?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            DB 테이블의 구조를 미리 정의하는 것입니다.
            어떤 열이 있고, 어떤 타입의 데이터를 저장할지 명시합니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-lg">
            <div className="rounded-lg border bg-muted/50">
              <div className="px-4 py-2 border-b">
                <span className="text-xs text-muted-foreground font-mono">테이블 생성 SQL</span>
              </div>
              <pre className="p-4 text-xs font-mono overflow-x-auto leading-relaxed">{`CREATE TABLE posts (
  id          BIGSERIAL PRIMARY KEY,    -- 자동 증가 ID
  user_id     UUID REFERENCES users,   -- 외래 키 (관계)
  title       TEXT NOT NULL,           -- 제목 (필수)
  content     TEXT,                    -- 내용 (선택)
  created_at  TIMESTAMPTZ DEFAULT NOW() -- 생성 시각
);`}</pre>
            </div>
            <div className="mt-3 space-y-1.5">
              {[
                { term: 'PRIMARY KEY', desc: '각 행을 고유하게 식별하는 열' },
                { term: 'NOT NULL', desc: '비어 있으면 안 되는 필수 값' },
                { term: 'REFERENCES', desc: '다른 테이블과의 관계(외래 키)' },
                { term: 'DEFAULT', desc: '값을 입력하지 않았을 때의 기본값' },
              ].map((item) => (
                <div key={item.term} className="flex items-center gap-2 text-xs">
                  <code className="font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded text-[10px] shrink-0">{item.term}</code>
                  <span className="text-muted-foreground">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
