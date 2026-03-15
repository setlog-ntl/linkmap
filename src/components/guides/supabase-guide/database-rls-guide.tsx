'use client';

import { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const sections = [
  { id: 'overview', label: '개요' },
  { id: 'table', label: '테이블 생성' },
  { id: 'rls', label: 'RLS 활성화' },
  { id: 'policies', label: '정책 작성' },
  { id: 'clients', label: '3종 클라이언트' },
  { id: 'pitfalls', label: '주의사항' },
] as const;

export function SupabaseDatabaseRlsGuide() {
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
            <Badge variant="secondary">Supabase</Badge>
            <Badge variant="outline">보안</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            데이터베이스 + RLS
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Supabase에서 테이블을 생성하고 RLS(Row Level Security)를 활성화하는 방법을 설명합니다.
            정책 작성 방법과 상황에 맞는 3종 클라이언트(Browser/Server/Admin) 선택 기준도 다룹니다.
          </p>
          <div className="flex flex-wrap gap-2 mt-6 text-sm text-muted-foreground">
            <span>설정 약 5분</span>
            <span>·</span>
            <span>프로젝트 설정 선행 필요</span>
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
          <h2 className="text-2xl font-bold mb-4">RLS란?</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            RLS(Row Level Security)는 데이터베이스 행(row) 단위로 접근 권한을 제어하는 PostgreSQL 기능입니다.
            Supabase에서 <code className="bg-muted px-1.5 py-0.5 rounded text-xs">anon</code> 키(공개 키)를 사용하더라도
            RLS 정책이 있으면 사용자는 자신의 데이터만 볼 수 있습니다.
          </p>
          <Card className="bg-card shadow-sm border-amber-200 dark:border-amber-800">
            <CardContent className="p-4">
              <p className="font-semibold text-sm mb-1">RLS 없이 테이블을 만들면?</p>
              <p className="text-sm text-muted-foreground">
                anon 키를 아는 누구나(=누구나) 모든 행에 접근할 수 있습니다.
                새 테이블을 만들 때 <strong>반드시 RLS를 활성화</strong>해야 합니다.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* 테이블 생성 */}
        <section id="table">
          <h2 className="text-2xl font-bold mb-4">테이블 생성</h2>
          <p className="text-muted-foreground text-sm mb-4">
            Supabase 대시보드의 Table Editor 또는 SQL Editor에서 테이블을 만들 수 있습니다.
            SQL 방식이 더 정밀하게 제어할 수 있어 권장합니다.
          </p>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">SQL Editor로 테이블 생성</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`-- posts 테이블 생성 예시
CREATE TABLE posts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  content     TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Table Editor UI로 생성 (초보자 권장)</h3>
              <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1.5 leading-relaxed">
                <li>Supabase 대시보드 → Table Editor → New table</li>
                <li>테이블 이름, 컬럼 정의</li>
                <li><strong>Enable Row Level Security (RLS)</strong> 체크박스 반드시 체크</li>
                <li>Save 클릭</li>
              </ol>
            </div>
          </div>
        </section>

        {/* RLS 활성화 */}
        <section id="rls">
          <h2 className="text-2xl font-bold mb-4">RLS 활성화</h2>
          <p className="text-muted-foreground text-sm mb-4">
            SQL로 이미 테이블을 만들었다면 RLS를 별도로 활성화합니다.
            Table Editor에서 만들었다면 체크박스로 이미 활성화되어 있을 수 있습니다.
          </p>
          <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`-- RLS 활성화
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- RLS 상태 확인 (pg_tables로 조회)
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';`}
          </pre>
          <Card className="bg-card shadow-sm border-blue-200 dark:border-blue-800 mt-4">
            <CardContent className="p-4">
              <p className="font-semibold text-sm mb-1">RLS 활성화 후 정책이 없으면?</p>
              <p className="text-sm text-muted-foreground">
                RLS를 활성화하면 정책이 없는 경우 기본값으로 <strong>모든 접근이 차단</strong>됩니다.
                아래에서 정책을 추가해야 데이터에 접근할 수 있습니다.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* 정책 작성 */}
        <section id="policies">
          <h2 className="text-2xl font-bold mb-4">RLS 정책 작성</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">기본 CRUD 정책 (본인 데이터만)</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`-- 본인 데이터만 조회
CREATE POLICY "users can view own posts"
  ON posts FOR SELECT
  USING (auth.uid() = user_id);

-- 본인 데이터만 삽입 (user_id를 내 ID로 강제)
CREATE POLICY "users can insert own posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 본인 데이터만 수정
CREATE POLICY "users can update own posts"
  ON posts FOR UPDATE
  USING (auth.uid() = user_id);

-- 본인 데이터만 삭제
CREATE POLICY "users can delete own posts"
  ON posts FOR DELETE
  USING (auth.uid() = user_id);`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">공개 데이터 조회 정책</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`-- 공개된 게시글은 누구나 조회 가능
CREATE POLICY "anyone can view published posts"
  ON posts FOR SELECT
  USING (is_published = true);

-- 본인 게시글은 비공개도 조회 가능
CREATE POLICY "authors can view own posts"
  ON posts FOR SELECT
  USING (auth.uid() = user_id);`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">정책 확인 및 삭제</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`-- 정책 목록 조회
SELECT * FROM pg_policies WHERE tablename = 'posts';

-- 정책 삭제
DROP POLICY "users can view own posts" ON posts;`}
              </pre>
            </div>
          </div>
        </section>

        {/* 3종 클라이언트 */}
        <section id="clients">
          <h2 className="text-2xl font-bold mb-4">3종 클라이언트 선택 기준</h2>
          <p className="text-muted-foreground text-sm mb-4">
            상황에 따라 올바른 클라이언트를 사용해야 보안과 기능이 정상 동작합니다.
          </p>
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border rounded-lg overflow-hidden">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 font-medium">클라이언트</th>
                    <th className="text-left p-3 font-medium">사용 위치</th>
                    <th className="text-left p-3 font-medium">RLS 적용</th>
                    <th className="text-left p-3 font-medium">용도</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[
                    { client: 'Browser Client', where: '클라이언트 컴포넌트', rls: '적용됨', use: '일반 CRUD, 실시간 구독' },
                    { client: 'Server Client', where: '서버 컴포넌트, API Route', rls: '적용됨', use: '서버 렌더링, 인증 검증' },
                    { client: 'Admin Client', where: 'API Route (서버 전용)', rls: '우회됨', use: '관리자 작업, 감사 로그' },
                  ].map((r) => (
                    <tr key={r.client} className="hover:bg-muted/50">
                      <td className="p-3 font-mono text-xs">{r.client}</td>
                      <td className="p-3 text-muted-foreground">{r.where}</td>
                      <td className="p-3">{r.rls}</td>
                      <td className="p-3 text-muted-foreground">{r.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Admin Client 초기화 (SERVICE_ROLE_KEY 사용)</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`// src/lib/supabase/admin.ts
// 절대 클라이언트 컴포넌트에서 import하면 안 됩니다
import { createClient } from '@supabase/supabase-js'

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,  // 서버 전용
  )
}`}
              </pre>
            </div>
          </div>
        </section>

        {/* 주의사항 */}
        <section id="pitfalls">
          <h2 className="text-2xl font-bold mb-4">자주 하는 실수</h2>
          <div className="space-y-4">
            {[
              {
                title: '❌ RLS 없이 테이블 생성',
                bad: 'CREATE TABLE profiles (\n  id UUID PRIMARY KEY,\n  data TEXT\n);\n# RLS 미활성화 → 누구나 전체 접근 가능',
                good: 'CREATE TABLE profiles (\n  id UUID PRIMARY KEY,\n  data TEXT\n);\nALTER TABLE profiles ENABLE ROW LEVEL SECURITY;\nCREATE POLICY ...;',
                desc: 'RLS 없이 테이블을 만들면 anon 키를 가진 누구나(=사실상 공개) 전체 데이터에 접근할 수 있습니다.',
              },
              {
                title: '❌ Admin Client를 클라이언트 컴포넌트에서 사용',
                bad: `'use client'
import { createAdminClient } from '@/lib/supabase/admin'
// SERVICE_ROLE_KEY가 브라우저에 노출됨!`,
                good: `// API Route에서만 사용
// src/app/api/admin/route.ts
import { createAdminClient } from '@/lib/supabase/admin'`,
                desc: 'Admin Client는 SERVICE_ROLE_KEY를 사용하므로 절대 클라이언트 컴포넌트에서 임포트하면 안 됩니다. 서버(API Route)에서만 사용하세요.',
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
