'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';

const deploySteps = [
  {
    step: 1,
    emoji: '✍️',
    title: '코드 작성',
    detail: 'VS Code에서 코드 작성\nlocalhost:3000 으로 확인',
    env: '로컬 환경',
    color: 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700',
    envColor: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
  },
  {
    step: 2,
    emoji: '📦',
    title: 'Git 커밋 & 푸시',
    detail: 'git add . && git commit\ngit push origin main',
    env: 'GitHub 저장소',
    color: 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800',
    envColor: 'bg-orange-100 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300',
  },
  {
    step: 3,
    emoji: '🔨',
    title: '자동 빌드',
    detail: 'npm run build 실행\n코드 → 정적 파일 변환',
    env: 'CI/CD (Vercel 등)',
    color: 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800',
    envColor: 'bg-yellow-100 dark:bg-yellow-900/60 text-yellow-700 dark:text-yellow-300',
  },
  {
    step: 4,
    emoji: '🌐',
    title: '서버 업로드',
    detail: '빌드 결과물을 CDN·서버에 배포\n환경변수 자동 적용',
    env: '프로덕션 서버',
    color: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
    envColor: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300',
  },
  {
    step: 5,
    emoji: '🎉',
    title: '서비스 오픈',
    detail: 'my-app.com 에서 라이브\n전 세계 접속 가능',
    env: '사용자 접속',
    color: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800',
    envColor: 'bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300',
  },
];

const platforms = [
  {
    name: 'Vercel',
    emoji: '▲',
    desc: 'Next.js 제작사. GitHub 연결 후 push하면 자동 배포. 도메인 연결도 매우 쉬움.',
    bestFor: 'Next.js 프로젝트',
    free: '무료 플랜 충분',
    color: 'border-neutral-200 dark:border-neutral-700',
  },
  {
    name: 'Cloudflare Pages',
    emoji: '☁️',
    desc: '전 세계 300개 이상 엣지 서버. Workers와 연계해 풀스택 배포 가능. 무료 한도가 넉넉함.',
    bestFor: '서버리스 · 글로벌 서비스',
    free: '무료 플랜 매우 넉넉',
    color: 'border-orange-200 dark:border-orange-800',
  },
  {
    name: 'Railway',
    emoji: '🚂',
    desc: '서버 앱(Express, FastAPI 등) 배포에 강력. Dockerfile 지원. DB도 함께 배포 가능.',
    bestFor: '백엔드 서버 앱',
    free: '무료 $5 크레딧/월',
    color: 'border-purple-200 dark:border-purple-800',
  },
];

const envChecklist = [
  { item: '.env.local 파일의 키를 배포 플랫폼 환경변수에 추가했나?', critical: true },
  { item: 'NEXT_PUBLIC_ 접두사가 필요한 키에만 붙어 있나?', critical: true },
  { item: 'API URL이 localhost:3000이 아닌 실제 도메인을 가리키나?', critical: true },
  { item: 'DB의 CORS 설정에 내 도메인이 허용되어 있나?', critical: false },
  { item: 'Supabase Site URL이 배포 URL로 업데이트되어 있나?', critical: false },
];

export function DeployFlowSection() {
  return (
    <section id="deploy-flow" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">배포 파이프라인</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          코드 작성부터 실제 서비스까지 어떤 단계를 거치는지 전체 흐름을 파악해보세요.
          Vercel 같은 플랫폼은 2~5단계를 자동으로 처리해줍니다.
        </p>
      </ScrollReveal>

      {/* 배포 파이프라인 */}
      <ScrollReveal delay={0.1}>
        <div className="overflow-x-auto pb-2 mb-10">
          <div className="flex items-stretch gap-0 min-w-max">
            {deploySteps.map((s, i) => (
              <div key={s.step} className="flex items-stretch">
                <div className={`rounded-xl border p-4 w-40 flex flex-col items-center text-center gap-2 ${s.color}`}>
                  <div className="text-2xl">{s.emoji}</div>
                  <div className="text-xs font-bold">{s.title}</div>
                  <div className="text-[10px] text-muted-foreground leading-relaxed whitespace-pre-line">{s.detail}</div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium mt-auto ${s.envColor}`}>
                    {s.env}
                  </span>
                </div>
                {i < deploySteps.length - 1 && (
                  <div className="flex items-center px-1">
                    <svg className="w-5 h-4 text-muted-foreground/40" viewBox="0 0 20 16" fill="none">
                      <path d="M0 8h14m0 0-5-4m5 4-5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* 플랫폼 비교 */}
      <ScrollReveal delay={0.15}>
        <h3 className="text-lg font-semibold mb-4">배포 플랫폼 비교</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {platforms.map((p) => (
            <div key={p.name} className={`rounded-xl border p-5 ${p.color}`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl font-bold">{p.emoji}</span>
                <span className="font-bold text-sm">{p.name}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{p.desc}</p>
              <div className="space-y-1">
                <div className="text-[10px]">
                  <span className="text-muted-foreground">최적: </span>
                  <span className="font-medium">{p.bestFor}</span>
                </div>
                <div className="text-[10px]">
                  <span className="text-muted-foreground">무료: </span>
                  <span className="text-green-600 dark:text-green-400 font-medium">{p.free}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* 배포 체크리스트 */}
      <ScrollReveal delay={0.2}>
        <h3 className="text-lg font-semibold mb-4">배포 전 체크리스트</h3>
        <div className="max-w-xl space-y-2">
          {envChecklist.map((item) => (
            <div key={item.item} className="flex items-start gap-3 text-sm">
              <span className={`mt-0.5 shrink-0 ${item.critical ? 'text-red-500' : 'text-muted-foreground'}`}>
                {item.critical ? '⚠️' : '✓'}
              </span>
              <span className={item.critical ? 'font-medium' : 'text-muted-foreground'}>{item.item}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 rounded-lg bg-muted/50 border max-w-xl">
          <p className="text-xs text-muted-foreground">
            💡 배포 후 에러의 80%는 <strong className="text-foreground">환경변수 누락</strong>입니다.
            환경변수 가이드도 함께 확인해보세요.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
