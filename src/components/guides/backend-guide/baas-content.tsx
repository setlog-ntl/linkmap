'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CloudCog } from 'lucide-react';

const withoutBaas = [
  '서버 컴퓨터 직접 운영 또는 임대 (AWS EC2 등)',
  '인증 시스템 직접 구현 (JWT, 세션, 토큰 관리)',
  '데이터베이스 설치 및 마이그레이션 관리',
  '보안 패치, 스케일링 직접 대응',
  '백엔드 API 전부 직접 작성',
];

const withBaas = [
  '회원 가입·로그인 SDK 3줄로 구현',
  'DB 브라우저 UI(GUI)로 바로 관리',
  '소셜 로그인 (Google, GitHub) 기본 제공',
  '자동 스케일링 + 보안 관리 포함',
  '파일 스토리지, 실시간 기능 기본 내장',
];

const baasOptions = [
  {
    name: 'Supabase',
    icon: '⚡',
    subtitle: 'PostgreSQL 기반 오픈소스',
    desc: 'Firebase의 오픈소스 대안. PostgreSQL을 사용하므로 SQL에 익숙하다면 최적입니다. 자체 서버에 호스팅도 가능합니다.',
    features: ['PostgreSQL DB', 'Auth (소셜 로그인)', 'Storage', 'Edge Functions', 'Realtime Subscriptions'],
    tag: 'SQL · 오픈소스 · 추천',
    color: 'border-emerald-200 dark:border-emerald-800',
    badge: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300',
    free: '무료 2개 프로젝트',
    recommend: true,
  },
  {
    name: 'Firebase',
    icon: '🔥',
    subtitle: 'Google이 만든 NoSQL 기반',
    desc: 'Google의 BaaS 서비스. NoSQL(Firestore) 기반으로 유연하지만 SQL보다 복잡한 쿼리에 제약이 있습니다.',
    features: ['Firestore (NoSQL)', 'Authentication', 'Storage', 'Cloud Functions', 'Hosting'],
    tag: 'NoSQL · Google 생태계',
    color: 'border-orange-200 dark:border-orange-800',
    badge: 'bg-orange-100 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300',
    free: '무료 Spark 플랜',
    recommend: false,
  },
  {
    name: 'Pocketbase',
    icon: '📦',
    subtitle: '경량 자체 호스팅 BaaS',
    desc: '단일 실행 파일로 돌아가는 초경량 BaaS. 자체 서버에서 운영하고 싶을 때 적합합니다.',
    features: ['SQLite DB', 'Auth', 'File Storage', 'REST API 자동 생성', '자체 호스팅'],
    tag: '경량 · 자체 호스팅',
    color: 'border-purple-200 dark:border-purple-800',
    badge: 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300',
    free: '완전 무료 (자체 서버)',
    recommend: false,
  },
];

const supabaseCode = `import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// 1. 소셜 로그인 (Google)
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: { redirectTo: 'https://myapp.com/auth/callback' }
});

// 2. 현재 사용자 가져오기
const { data: { user } } = await supabase.auth.getUser();

// 3. 데이터 조회
const { data: posts } = await supabase
  .from('posts')
  .select('*')
  .eq('user_id', user.id)
  .order('created_at', { ascending: false });

// 4. 데이터 저장
await supabase
  .from('posts')
  .insert({ title: '새 글', content: '안녕하세요', user_id: user.id });`;

const whenToUseBaas = [
  { condition: 'MVP · 프로토타입 빠르게 만들기', answer: 'BaaS 강력 추천', good: true },
  { condition: '팀에 백엔드 개발자가 없을 때', answer: 'BaaS 강력 추천', good: true },
  { condition: '초기 스타트업 · 사이드 프로젝트', answer: 'BaaS 추천', good: true },
  { condition: '월 수십만 명 이상의 대규모 트래픽', answer: '직접 서버 또는 BaaS 엔터프라이즈', good: false },
  { condition: '완전한 커스텀 비즈니스 로직 필요', answer: '직접 백엔드 고려', good: false },
];

export function BaasContent() {
  return (
    <div className="py-6 space-y-0">
      {/* 헤더 */}
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <CloudCog className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">BaaS 활용하기</h1>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          BaaS(Backend as a Service)는 백엔드 서버 없이 인증·DB·스토리지 등을 SaaS처럼 빌려 쓰는 서비스입니다.
          바이브 코더에게 가장 강력한 무기로, 혼자서도 풀스택 앱을 만들 수 있게 해줍니다.
        </p>
      </ScrollReveal>

      {/* Before/After 비교 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">BaaS 없이 vs BaaS 사용</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            같은 기능을 구현할 때 필요한 작업량이 완전히 달라집니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mb-8">
            <div className="rounded-xl border border-red-200 dark:border-red-800 p-5 bg-red-50 dark:bg-red-950/30">
              <div className="text-sm font-bold text-red-700 dark:text-red-300 mb-3">BaaS 없이 (전통 방식)</div>
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
              <div className="text-sm font-bold text-green-700 dark:text-green-300 mb-3">BaaS 사용 (현대 방식)</div>
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
      </section>

      {/* BaaS 비교 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">대표 BaaS 비교</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            바이브 코딩에는 Supabase를 가장 추천합니다. PostgreSQL 기반에 오픈소스이며, AI 코드 생성과도 잘 맞습니다.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {baasOptions.map((b, idx) => (
            <ScrollReveal key={b.name} delay={idx * 0.08}>
              <div className={`rounded-xl border p-5 h-full flex flex-col ${b.color}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{b.icon}</span>
                    <div>
                      <div className="font-bold text-sm">{b.name}</div>
                      <div className="text-[10px] text-muted-foreground">{b.subtitle}</div>
                    </div>
                  </div>
                  {b.recommend && (
                    <Badge variant="secondary" className="text-[10px] bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 shrink-0">
                      추천
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{b.desc}</p>
                <div className="space-y-1 mb-3 flex-1">
                  {b.features.map((f) => (
                    <div key={f} className="text-xs text-muted-foreground flex gap-1.5">
                      <span className="text-primary">•</span><span>{f}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-current/10">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${b.badge}`}>{b.tag}</span>
                  <span className="text-[10px] text-muted-foreground">{b.free}</span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Supabase 실제 코드 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">Supabase 실제 코드</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            별도 백엔드 서버 없이 클라이언트에서 직접 로그인·조회·저장이 가능합니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl">
            <div className="rounded-lg border bg-muted/50">
              <div className="px-4 py-2 border-b">
                <span className="text-xs text-muted-foreground font-mono">supabase-usage.ts</span>
              </div>
              <pre className="p-4 text-[10px] font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap">{supabaseCode}</pre>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* BaaS 선택 기준 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">언제 BaaS를 선택할까?</h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl space-y-2">
            {whenToUseBaas.map((item, idx) => (
              <div key={idx} className={`flex items-start gap-3 p-3 rounded-lg border ${
                item.good
                  ? 'bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
                  : 'bg-card'
              }`}>
                <span className={`shrink-0 text-sm ${item.good ? 'text-green-500' : 'text-muted-foreground'}`}>
                  {item.good ? '✓' : '→'}
                </span>
                <div className="flex-1">
                  <div className="text-xs font-medium">{item.condition}</div>
                  <div className={`text-[10px] mt-0.5 ${item.good ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                    {item.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <Card className="max-w-2xl mt-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">핵심 정리</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground leading-relaxed">
                BaaS는 개발 속도와 비용 면에서 압도적으로 유리합니다.
                Supabase 무료 플랜으로 월 수만 명의 사용자를 처리할 수 있습니다.
                처음부터 직접 서버를 구축하는 것보다 BaaS로 빠르게 검증 후,
                필요 시 이전하는 전략이 대부분의 스타트업에서 더 효과적입니다.
              </p>
            </CardContent>
          </Card>
        </ScrollReveal>
      </section>
    </div>
  );
}
