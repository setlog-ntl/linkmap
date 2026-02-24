'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';

const withoutBaas = [
  '서버 컴퓨터 직접 운영 (AWS EC2 등)',
  '인증 시스템 직접 구현 (JWT, 세션…)',
  '데이터베이스 설치 및 관리',
  '보안 패치, 스케일링 직접 대응',
  '백엔드 API 전부 직접 작성',
];

const withBaas = [
  'Supabase / Firebase 가입 (무료 시작)',
  '인증: 소셜 로그인 3줄로 구현',
  'DB: 브라우저에서 GUI로 관리',
  '자동 스케일링, 보안 관리 포함',
  'JS SDK로 API 대신 직접 호출',
];

const baasOptions = [
  {
    name: 'Supabase',
    emoji: '⚡',
    subtitle: 'PostgreSQL 기반 오픈소스',
    features: ['PostgreSQL DB', '인증/소셜 로그인', '스토리지', 'Edge Functions', 'Realtime'],
    tag: 'SQL 선호 · 오픈소스',
    color: 'border-emerald-200 dark:border-emerald-800',
    badge: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300',
  },
  {
    name: 'Firebase',
    emoji: '🔥',
    subtitle: 'Google이 만든 NoSQL 기반',
    features: ['Firestore (NoSQL)', '인증', '스토리지', 'Cloud Functions', 'Hosting'],
    tag: 'NoSQL 선호 · Google 생태계',
    color: 'border-orange-200 dark:border-orange-800',
    badge: 'bg-orange-100 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300',
  },
  {
    name: 'PlanetScale / Neon',
    emoji: '🌐',
    subtitle: 'DB 전문 클라우드 서비스',
    features: ['MySQL/PostgreSQL 전용', '브랜치 기능', '서버리스 연결', '자동 스케일링'],
    tag: 'DB만 필요할 때',
    color: 'border-purple-200 dark:border-purple-800',
    badge: 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300',
  },
];

const supabaseExample = `import { createClient } from '@supabase/supabase-js';

const supabase = createClient(URL, ANON_KEY);

// 1. 로그인
await supabase.auth.signInWithOAuth({ provider: 'google' });

// 2. 데이터 조회
const { data } = await supabase
  .from('posts')
  .select('*')
  .eq('user_id', userId);

// 3. 데이터 저장
await supabase
  .from('posts')
  .insert({ title: '새 글', content: '...' });`;

export function BaasSection() {
  return (
    <section id="baas" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">BaaS — 백엔드 없이 백엔드 기능 쓰기</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          BaaS(Backend as a Service)는 서버 개발 없이 인증·DB·스토리지 등을 SaaS처럼 빌려 쓰는 서비스입니다.
          바이브 코더에게 가장 강력한 무기입니다.
        </p>
      </ScrollReveal>

      {/* Before/After 비교 */}
      <ScrollReveal delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 max-w-2xl">
          <div className="rounded-xl border border-red-200 dark:border-red-800 p-5 bg-red-50 dark:bg-red-950/30">
            <div className="text-sm font-bold text-red-700 dark:text-red-300 mb-3">❌ BaaS 없이 (전통 방식)</div>
            <div className="space-y-2">
              {withoutBaas.map((item) => (
                <div key={item} className="flex gap-2 text-xs text-muted-foreground">
                  <span className="text-red-400 shrink-0">✗</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-green-200 dark:border-green-800 p-5 bg-green-50 dark:bg-green-950/30">
            <div className="text-sm font-bold text-green-700 dark:text-green-300 mb-3">✅ BaaS 사용 (현대 방식)</div>
            <div className="space-y-2">
              {withBaas.map((item) => (
                <div key={item} className="flex gap-2 text-xs text-muted-foreground">
                  <span className="text-green-500 shrink-0">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* BaaS 옵션 비교 */}
      <ScrollReveal delay={0.15}>
        <h3 className="text-lg font-semibold mb-4">대표 BaaS 비교</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {baasOptions.map((b) => (
            <div key={b.name} className={`rounded-xl border p-5 ${b.color}`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{b.emoji}</span>
                <div>
                  <div className="font-bold text-sm">{b.name}</div>
                  <div className="text-[10px] text-muted-foreground">{b.subtitle}</div>
                </div>
              </div>
              <div className="space-y-1 mb-4">
                {b.features.map((f) => (
                  <div key={f} className="text-xs text-muted-foreground flex gap-1.5">
                    <span>•</span><span>{f}</span>
                  </div>
                ))}
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${b.badge}`}>{b.tag}</span>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* Supabase 코드 예시 */}
      <ScrollReveal delay={0.2}>
        <h3 className="text-lg font-semibold mb-3">Supabase 실제 코드</h3>
        <div className="max-w-lg">
          <div className="rounded-lg border bg-muted/50">
            <div className="px-4 py-2 border-b">
              <span className="text-xs text-muted-foreground font-mono">supabase-example.ts</span>
            </div>
            <pre className="p-4 text-xs font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap">
              {supabaseExample}
            </pre>
          </div>
          <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
            별도 백엔드 서버 없이 클라이언트에서 직접 DB를 읽고 씁니다. 인증도 한 줄이면 충분합니다.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
