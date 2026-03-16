'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Triangle } from 'lucide-react';

const setupSteps = [
  {
    step: 1,
    title: 'Vercel 가입',
    detail: 'vercel.com에 접속해서 "Sign Up" 클릭 → "Continue with GitHub"를 선택하면 GitHub 계정으로 바로 가입됩니다.',
    tip: 'GitHub 연동으로 가입하면 나중에 저장소 연결이 훨씬 쉽습니다.',
  },
  {
    step: 2,
    title: 'New Project 생성',
    detail: '대시보드에서 "Add New..." → "Project" 클릭. 연결된 GitHub 계정의 저장소 목록이 표시됩니다.',
    tip: '저장소가 안 보이면 "Adjust GitHub App Permissions"를 클릭해서 권한을 추가하세요.',
  },
  {
    step: 3,
    title: 'GitHub 저장소 선택',
    detail: '배포할 저장소 옆의 "Import" 버튼을 클릭합니다. 모노레포라면 Root Directory를 지정할 수 있습니다.',
    tip: null,
  },
  {
    step: 4,
    title: '프레임워크 자동 감지',
    detail: 'Vercel이 package.json을 분석해서 Next.js, React, Vue 등을 자동으로 감지합니다. Build Command와 Output Directory가 자동 설정됩니다.',
    tip: 'Next.js 프로젝트면 대부분 기본값 그대로 사용하면 됩니다.',
  },
  {
    step: 5,
    title: '환경변수 등록',
    detail: '"Environment Variables" 섹션을 펼쳐서 필요한 키를 등록합니다. .env.local 파일의 내용을 여기에 넣으면 됩니다.',
    tip: 'NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY 등 필수 변수를 빠뜨리지 마세요.',
  },
  {
    step: 6,
    title: 'Deploy 클릭!',
    detail: '"Deploy" 버튼을 클릭하면 빌드가 시작됩니다. 보통 1~3분이면 완료되고, 고유 URL이 생성됩니다.',
    tip: '배포 완료 후 "Visit" 버튼으로 바로 확인할 수 있습니다.',
  },
];

const envVarTypes = [
  {
    env: 'Production',
    desc: '실제 서비스에 적용되는 환경변수',
    example: '실제 API 키, 실제 DB URL',
    color: 'bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300',
  },
  {
    env: 'Preview',
    desc: 'PR Preview 배포에 적용되는 환경변수',
    example: '테스트용 API 키, 스테이징 DB URL',
    color: 'bg-yellow-100 dark:bg-yellow-900/60 text-yellow-700 dark:text-yellow-300',
  },
  {
    env: 'Development',
    desc: 'vercel dev 명령어 실행 시 적용',
    example: '로컬 개발용 키 (거의 사용 안 함)',
    color: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
  },
];

const commonErrors = [
  {
    error: 'Build failed',
    emoji: '🔴',
    cause: '코드에 에러가 있거나 환경변수가 누락된 경우',
    solutions: [
      '먼저 로컬에서 npm run build를 실행해서 에러 확인',
      'Vercel 대시보드에서 빌드 로그(Build Logs) 확인',
      '환경변수가 모두 등록되어 있는지 확인',
    ],
  },
  {
    error: '환경변수 누락 에러',
    emoji: '🟡',
    cause: '.env.local에는 있지만 Vercel에 등록하지 않은 경우',
    solutions: [
      'Settings → Environment Variables에서 누락된 변수 추가',
      'NEXT_PUBLIC_ 접두사가 필요한 변수인지 확인',
      '추가 후 Redeploy 실행 (Deployments → ... → Redeploy)',
    ],
  },
  {
    error: '404 Not Found',
    emoji: '🟠',
    cause: '페이지 라우팅 설정 문제 또는 next.config.js 오류',
    solutions: [
      'next.config.js (또는 .mjs/.ts)의 설정 확인',
      'app/ 또는 pages/ 폴더 구조가 올바른지 확인',
      '동적 라우트([id]) 폴더명에 오타가 없는지 확인',
    ],
  },
  {
    error: 'API 라우트 500 에러',
    emoji: '🔵',
    cause: '서버 측 코드 에러 또는 외부 서비스 연결 실패',
    solutions: [
      'Functions 탭에서 서버리스 함수 로그 확인',
      '외부 API URL이 올바른지 확인 (localhost 아닌지)',
      '서버 전용 환경변수가 등록되어 있는지 확인',
    ],
  },
];

export function VercelDeployContent() {
  return (
    <div className="py-6 space-y-0">
      {/* 헤더 */}
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Triangle className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Vercel 배포 가이드</h1>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          Vercel은 Next.js를 만든 회사에서 제공하는 배포 플랫폼입니다.
          GitHub 저장소를 연결하면 코드를 push할 때마다 자동으로 배포됩니다.
        </p>
      </ScrollReveal>

      {/* Vercel이란? */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">Vercel이란?</h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mb-8">
            {[
              { icon: '⚡', title: '자동 배포', desc: 'git push 하면 자동으로 빌드 + 배포. 수동 작업 제로.' },
              { icon: '👀', title: 'Preview URL', desc: 'PR(Pull Request)마다 미리보기 URL이 자동 생성됩니다.' },
              { icon: '🌐', title: '글로벌 CDN', desc: '전 세계 엣지 서버에서 서비스되어 어디서든 빠릅니다.' },
              { icon: '🔒', title: '무료 SSL', desc: 'HTTPS(보안 연결)가 자동으로 설정됩니다.' },
            ].map((item) => (
              <div key={item.title} className="rounded-lg border bg-card shadow-sm p-4">
                <div className="text-xl mb-2">{item.icon}</div>
                <div className="text-sm font-semibold mb-1">{item.title}</div>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* 단계별 가이드 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">가입 + GitHub 연결 + 첫 배포</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            6단계만 따라하면 5분 안에 첫 배포를 완료할 수 있습니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl space-y-4 mb-8">
            {setupSteps.map((s) => (
              <div key={s.step} className="rounded-lg border bg-card shadow-sm p-4">
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0 font-bold mt-0.5">
                    {s.step}
                  </span>
                  <div className="flex-1">
                    <div className="text-sm font-semibold mb-1">{s.title}</div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{s.detail}</p>
                    {s.tip && (
                      <div className="mt-2 px-2 py-1.5 rounded bg-muted/50 text-[10px] text-muted-foreground">
                        💡 {s.tip}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Preview 배포 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">Preview 배포란?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            Vercel의 가장 강력한 기능 중 하나입니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <Card className="max-w-2xl mb-8">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                GitHub에서 PR(Pull Request)을 생성하면 Vercel이 자동으로 해당 브랜치의 코드를 빌드해서
                별도의 URL을 만들어줍니다. 이 URL로 실제 배포 전에 변경 사항을 미리 확인할 수 있습니다.
              </p>

              <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                <div className="flex items-center gap-3 text-xs">
                  <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[10px]">main</Badge>
                  <span className="text-muted-foreground">→ my-app.vercel.app (프로덕션)</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 text-[10px]">PR #42</Badge>
                  <span className="text-muted-foreground">→ my-app-pr42.vercel.app (Preview)</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 text-[10px]">PR #43</Badge>
                  <span className="text-muted-foreground">→ my-app-pr43.vercel.app (Preview)</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-4">
                🏠 <strong className="text-foreground">비유:</strong> 새 메뉴를 정식 오픈하기 전에
                시식 코너(Preview URL)에서 먼저 맛보는 것과 같습니다.
              </p>
            </CardContent>
          </Card>
        </ScrollReveal>
      </section>

      {/* 커스텀 도메인 연결 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">커스텀 도메인 연결</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            Vercel에서 제공하는 <code className="bg-muted px-1 rounded font-mono text-[10px]">.vercel.app</code> 도메인 대신
            나만의 도메인을 사용할 수 있습니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl space-y-3 mb-8">
            {[
              { step: 1, text: 'Vercel 대시보드 → 프로젝트 선택 → Settings → Domains' },
              { step: 2, text: '도메인 입력 (예: my-app.com) → Add 클릭' },
              { step: 3, text: 'Vercel이 안내하는 DNS 레코드를 도메인 관리 사이트에 추가' },
              { step: 4, text: 'DNS 전파 대기 (보통 5분~1시간) → SSL 자동 설정 완료' },
            ].map((s) => (
              <div key={s.step} className="flex items-start gap-3 text-sm rounded-lg border bg-card shadow-sm p-3">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-[10px] flex items-center justify-center shrink-0 font-bold">
                  {s.step}
                </span>
                <span className="text-muted-foreground text-xs">{s.text}</span>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* 환경변수 관리 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">환경변수 관리</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            Vercel에서는 환경별로 다른 변수를 설정할 수 있습니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl space-y-3 mb-6">
            {envVarTypes.map((v) => (
              <Card key={v.env}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Badge variant="secondary" className={`text-[10px] ${v.color}`}>{v.env}</Badge>
                    <span className="text-xs text-muted-foreground font-normal">{v.desc}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[10px] text-muted-foreground">예시: {v.example}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-muted/50 border max-w-2xl mb-8">
            <p className="text-xs text-muted-foreground">
              ⚠️ <strong className="text-foreground">주의:</strong> 환경변수를 변경한 후에는
              반드시 Redeploy를 해야 적용됩니다.
              Deployments → 최신 배포의 &quot;...&quot; → Redeploy를 클릭하세요.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* 흔한 에러와 해결법 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">흔한 에러와 해결법</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            Vercel 배포 중 자주 만나는 에러와 해결 방법을 정리했습니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl space-y-4">
            {commonErrors.map((err) => (
              <div key={err.error} className="rounded-lg border bg-card shadow-sm p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{err.emoji}</span>
                  <span className="font-semibold text-sm">{err.error}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  <strong className="text-foreground">원인:</strong> {err.cause}
                </p>
                <div className="space-y-1.5">
                  {err.solutions.map((sol, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className="text-primary shrink-0">✓</span>
                      <span>{sol}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* FAQ */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">자주 묻는 질문</h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl space-y-3">
            {[
              { q: 'Vercel은 무료인가요?', a: '개인 프로젝트는 무료 플랜(Hobby)으로 충분합니다. 월 100GB 대역폭, 빌드 6000분이 제공됩니다. 상용 프로젝트는 Pro 플랜($20/월)을 권장합니다.' },
              { q: 'Vercel 없이도 Next.js를 배포할 수 있나요?', a: '네. Cloudflare Pages, Railway, AWS 등 다른 플랫폼에서도 배포할 수 있습니다. 다만 Vercel이 가장 쉽고 최적화되어 있습니다.' },
              { q: '배포된 사이트를 되돌릴 수 있나요?', a: '네. Vercel 대시보드 → Deployments에서 이전 배포를 선택하고 "Promote to Production"을 클릭하면 즉시 롤백됩니다.' },
              { q: 'Vercel과 GitHub를 연결하면 보안상 문제가 없나요?', a: 'Vercel은 GitHub OAuth를 통해 최소 권한만 요청합니다. 필요한 저장소만 선택적으로 접근 권한을 부여할 수 있습니다.' },
            ].map((faq) => (
              <div key={faq.q} className="rounded-lg border bg-card shadow-sm p-4">
                <div className="text-sm font-medium mb-2">Q. {faq.q}</div>
                <p className="text-xs text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
