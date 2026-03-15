'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GitBranch } from 'lucide-react';

const cicdSteps = [
  {
    step: 1,
    icon: '✍️',
    title: '코드 작성',
    detail: 'VS Code에서 기능 개발\nlocalhost:3000 으로 테스트',
    color: 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700',
    badge: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
    env: '로컬',
  },
  {
    step: 2,
    icon: '📦',
    title: 'Git Push',
    detail: 'git commit & push\nGitHub에 코드 업로드',
    color: 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800',
    badge: 'bg-orange-100 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300',
    env: 'GitHub',
  },
  {
    step: 3,
    icon: '🔍',
    title: 'CI — 자동 검사',
    detail: 'lint, typecheck, 테스트\n오류 발견 시 알림',
    color: 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800',
    badge: 'bg-yellow-100 dark:bg-yellow-900/60 text-yellow-700 dark:text-yellow-300',
    env: 'GitHub Actions',
  },
  {
    step: 4,
    icon: '🔨',
    title: '자동 빌드',
    detail: 'npm run build\n코드 → 정적 파일 변환',
    color: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
    badge: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300',
    env: 'CI/CD 서버',
  },
  {
    step: 5,
    icon: '🚀',
    title: 'CD — 자동 배포',
    detail: '빌드 결과를 서버에 업로드\n환경변수 자동 적용',
    color: 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800',
    badge: 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300',
    env: '프로덕션',
  },
  {
    step: 6,
    icon: '🎉',
    title: '서비스 오픈',
    detail: 'myapp.com 라이브\n전 세계 접속 가능',
    color: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800',
    badge: 'bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300',
    env: '사용자',
  },
];

const simpleWorkflow = `# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]   # main 브랜치에 push될 때 실행

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: 코드 체크아웃
        uses: actions/checkout@v4

      - name: Node.js 설정
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: 의존성 설치
        run: npm ci

      - name: 타입 검사
        run: npm run typecheck

      - name: 린트 검사
        run: npm run lint

      - name: 빌드
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: \${{ secrets.SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: \${{ secrets.SUPABASE_ANON_KEY }}

      # Vercel 배포 (예시)
      - name: Vercel 배포
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: \${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: \${{ secrets.VERCEL_PROJECT_ID }}`;

const githubSecrets = [
  { key: 'SUPABASE_URL', value: 'Supabase 프로젝트 URL' },
  { key: 'SUPABASE_ANON_KEY', value: 'Supabase 익명 키' },
  { key: 'VERCEL_TOKEN', value: 'Vercel API 토큰' },
];

const cicdBenefits = [
  {
    title: '실수 방지',
    desc: '실수로 버그 있는 코드를 배포하기 전에 자동으로 검사합니다.',
    icon: '🛡️',
  },
  {
    title: '빠른 배포',
    desc: 'git push 하나로 전체 배포 과정이 자동 실행됩니다. 수동 작업 불필요.',
    icon: '⚡',
  },
  {
    title: '팀 협업',
    desc: '팀원이 코드를 올리면 자동으로 리뷰 환경(Preview)이 생성됩니다.',
    icon: '👥',
  },
  {
    title: '롤백 용이',
    desc: '문제 발생 시 이전 버전으로 즉시 되돌릴 수 있습니다.',
    icon: '↩️',
  },
];

const vercelAutoDeploySteps = [
  'Vercel 대시보드에서 GitHub 저장소 연결',
  'main 브랜치 push → Vercel이 자동 감지',
  '자동으로 빌드 + 배포 실행 (약 1~2분)',
  '배포 완료 후 URL 생성 및 알림',
  'PR 생성 시마다 Preview URL 자동 생성',
];

export function CicdContent() {
  return (
    <div className="py-6 space-y-0">
      {/* 헤더 */}
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <GitBranch className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">CI/CD 배포 파이프라인</h1>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          CI/CD는 코드 변경 사항을 자동으로 검사하고 배포하는 파이프라인입니다.
          git push 하나로 린트 검사 → 빌드 → 배포까지 자동 처리됩니다.
        </p>
      </ScrollReveal>

      {/* CI/CD 개념 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">CI와 CD란?</h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mb-8">
            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[10px]">CI</Badge>
                  Continuous Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  지속적 통합. 코드를 올릴 때마다 자동으로 검사합니다.
                </p>
                <div className="space-y-1.5">
                  {['타입 검사 (TypeScript)', '코드 스타일 검사 (ESLint)', '단위 테스트 실행', '빌드 가능 여부 확인'].map((item) => (
                    <div key={item} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="text-blue-500">✓</span><span>{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="border-green-200 dark:border-green-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300 text-[10px]">CD</Badge>
                  Continuous Deployment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  지속적 배포. CI 통과 후 자동으로 서버에 배포합니다.
                </p>
                <div className="space-y-1.5">
                  {['빌드 결과물 생성', '서버에 파일 업로드', '환경변수 자동 적용', '배포 완료 알림'].map((item) => (
                    <div key={item} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="text-green-500">✓</span><span>{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>
      </section>

      {/* 파이프라인 흐름 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">전체 파이프라인 흐름</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            git push 한 번으로 이 모든 단계가 자동 실행됩니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="overflow-x-auto pb-2 mb-8">
            <div className="flex items-stretch gap-0 min-w-max">
              {cicdSteps.map((s, i) => (
                <div key={s.step} className="flex items-stretch">
                  <div className={`rounded-xl border p-4 w-36 flex flex-col items-center text-center gap-2 ${s.color}`}>
                    <div className="text-2xl">{s.icon}</div>
                    <div className="text-xs font-bold leading-tight">{s.title}</div>
                    <div className="text-[10px] text-muted-foreground leading-relaxed whitespace-pre-line flex-1">{s.detail}</div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium mt-auto ${s.badge}`}>
                      {s.env}
                    </span>
                  </div>
                  {i < cicdSteps.length - 1 && (
                    <div className="flex items-center px-0.5">
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
      </section>

      {/* CI/CD 장점 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">CI/CD가 왜 필요한가?</h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mb-8">
            {cicdBenefits.map((b, idx) => (
              <div key={b.title} className="rounded-lg border bg-card p-4">
                <div className="text-xl mb-2">{b.icon}</div>
                <div className="text-sm font-semibold mb-1">{b.title}</div>
                <p className="text-xs text-muted-foreground leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Vercel 자동 배포 (가장 쉬운 방법) */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">가장 쉬운 방법: Vercel 자동 배포</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            GitHub Actions 없이도 Vercel에서 자동 배포를 제공합니다.
            Next.js 프로젝트라면 이 방법이 가장 간단합니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <Card className="max-w-xl mb-8">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <span>▲</span> Vercel 연동 시 자동으로 되는 것들
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {vercelAutoDeploySteps.map((step, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] flex items-center justify-center shrink-0 font-bold">
                      {i + 1}
                    </span>
                    <span className="text-muted-foreground">{step}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </section>

      {/* GitHub Actions 워크플로우 예시 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">GitHub Actions 워크플로우</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            더 세밀한 제어가 필요하다면 GitHub Actions를 사용합니다.
            <code className="text-xs font-mono bg-muted px-1 rounded">.github/workflows/</code> 폴더에 YAML 파일을 만들면 됩니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl mb-6">
            <div className="rounded-lg border bg-muted/50">
              <div className="px-4 py-2 border-b">
                <span className="text-xs text-muted-foreground font-mono">.github/workflows/deploy.yml</span>
              </div>
              <pre className="p-4 text-[10px] font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap">
                {simpleWorkflow}
              </pre>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="max-w-2xl">
            <h3 className="text-sm font-semibold mb-3">GitHub Secrets 등록 방법</h3>
            <p className="text-xs text-muted-foreground mb-3">
              워크플로우에서 사용하는 민감한 값은 GitHub 저장소의 Secrets에 등록합니다.<br />
              <strong className="text-foreground">Settings → Secrets and variables → Actions → New repository secret</strong>
            </p>
            <div className="space-y-2">
              {githubSecrets.map((s) => (
                <div key={s.key} className="flex items-center gap-3 text-xs rounded border bg-card px-3 py-2">
                  <code className="font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded text-[10px] shrink-0">{s.key}</code>
                  <span className="text-muted-foreground">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
