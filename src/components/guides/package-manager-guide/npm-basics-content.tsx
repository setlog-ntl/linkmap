'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Terminal } from 'lucide-react';

const installOptions = [
  {
    flag: '--save-dev (-D)',
    cmd: 'npm install -D eslint',
    desc: '개발 시에만 필요한 패키지를 devDependencies에 설치합니다. 빌드·린트·테스트 도구가 해당됩니다.',
    example: 'ESLint, Prettier, TypeScript, Vitest',
    color: 'border-yellow-200 dark:border-yellow-800',
    badge: 'bg-yellow-100 dark:bg-yellow-900/60 text-yellow-700 dark:text-yellow-300',
  },
  {
    flag: '-g (global)',
    cmd: 'npm install -g vercel',
    desc: '시스템 전역에 설치합니다. 터미널 어디서든 사용할 수 있는 CLI 도구에 적합합니다.',
    example: 'vercel, netlify-cli, create-react-app',
    color: 'border-blue-200 dark:border-blue-800',
    badge: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300',
  },
  {
    flag: '--legacy-peer-deps',
    cmd: 'npm install --legacy-peer-deps',
    desc: 'peer dependency 충돌을 무시하고 설치합니다. 에러가 날 때 임시 해결책으로 사용합니다.',
    example: 'ERESOLVE 에러 발생 시 사용',
    color: 'border-red-200 dark:border-red-800',
    badge: 'bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300',
  },
];

const installVsCi = [
  {
    cmd: 'npm install',
    when: '개발 중, 새 패키지 추가 시',
    behavior: 'package.json 기준 설치, lock 파일 업데이트 가능',
    useCase: '일상적인 개발',
    color: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
  },
  {
    cmd: 'npm ci',
    when: 'CI/CD, 팀원 환경 세팅',
    behavior: 'lock 파일 기준 정확히 설치, node_modules 삭제 후 재설치',
    useCase: '깨끗하고 재현 가능한 설치',
    color: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800',
  },
];

const npmRunExamples = [
  { cmd: 'npm run dev', desc: '개발 서버를 실행합니다 (핫 리로드 포함)' },
  { cmd: 'npm run build', desc: '프로덕션용 빌드를 생성합니다' },
  { cmd: 'npm run lint', desc: '코드 스타일을 검사합니다 (ESLint)' },
  { cmd: 'npm test', desc: '테스트를 실행합니다 (run 생략 가능)' },
  { cmd: 'npm start', desc: '프로덕션 서버를 실행합니다 (run 생략 가능)' },
];

const npxExamples = [
  {
    cmd: 'npx create-next-app@latest',
    desc: 'Next.js 프로젝트 생성',
    detail: '설치 없이 최신 버전의 create-next-app을 실행합니다.',
  },
  {
    cmd: 'npx shadcn@latest add button',
    desc: 'shadcn/ui 컴포넌트 추가',
    detail: 'shadcn CLI를 일회성으로 실행하여 Button 컴포넌트를 추가합니다.',
  },
  {
    cmd: 'npx tsc --noEmit',
    desc: 'TypeScript 타입 검사',
    detail: '프로젝트에 설치된 TypeScript로 타입 검사만 실행합니다.',
  },
];

export function NpmBasicsContent() {
  return (
    <div className="py-6 space-y-0">
      {/* 헤더 */}
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Terminal className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">npm 기본 명령어</h1>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          npm의 핵심 명령어와 옵션을 예시와 함께 설명합니다.
          이 명령어들만 알면 대부분의 상황을 해결할 수 있습니다.
        </p>
      </ScrollReveal>

      {/* install 옵션 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">npm install 옵션</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            <code className="text-xs font-mono bg-muted px-1 rounded">npm install</code>은 가장 자주 쓰는 명령어입니다.
            옵션에 따라 설치 위치와 방식이 달라집니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="space-y-4 max-w-2xl mb-8">
            {installOptions.map((opt) => (
              <div key={opt.flag} className={`rounded-xl border p-5 ${opt.color}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className={`text-[10px] ${opt.badge}`}>{opt.flag}</Badge>
                </div>
                <div className="rounded bg-muted/50 px-3 py-2 mb-3">
                  <code className="text-xs font-mono text-primary">{opt.cmd}</code>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-2">{opt.desc}</p>
                <div className="text-[10px] text-muted-foreground">
                  <span className="font-medium text-foreground">예시: </span>{opt.example}
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* npm install vs npm ci */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">npm install vs npm ci</h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mb-8">
            {installVsCi.map((item) => (
              <Card key={item.cmd} className={item.color}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">
                    <code className="font-mono">{item.cmd}</code>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-xs">
                    <span className="text-muted-foreground">언제: </span>
                    <span className="font-medium">{item.when}</span>
                  </div>
                  <div className="text-xs">
                    <span className="text-muted-foreground">동작: </span>
                    <span>{item.behavior}</span>
                  </div>
                  <div className="text-xs">
                    <span className="text-muted-foreground">용도: </span>
                    <span className="font-medium text-primary">{item.useCase}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* npm run 커스텀 스크립트 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">npm run 커스텀 스크립트</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            package.json의 scripts에 등록된 명령어를 실행합니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="space-y-2 max-w-xl mb-8">
            {npmRunExamples.map((ex) => (
              <div key={ex.cmd} className="flex items-center gap-3 text-xs rounded border bg-card px-3 py-2.5">
                <code className="font-mono text-primary bg-primary/10 px-2 py-0.5 rounded text-[10px] shrink-0 min-w-[120px]">
                  {ex.cmd}
                </code>
                <span className="text-muted-foreground">{ex.desc}</span>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* npx 설명 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">npx란?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            <code className="text-xs font-mono bg-muted px-1 rounded">npx</code>는 패키지를 설치하지 않고
            일회성으로 실행할 때 사용합니다. 프로젝트 생성 도구나 CLI를 한 번만 쓸 때 편리합니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="space-y-4 max-w-2xl mb-8">
            {npxExamples.map((ex) => (
              <div key={ex.cmd} className="rounded-lg border bg-card p-4">
                <div className="rounded bg-muted/50 px-3 py-2 mb-2">
                  <code className="text-xs font-mono text-primary">{ex.cmd}</code>
                </div>
                <div className="text-sm font-medium mb-1">{ex.desc}</div>
                <p className="text-xs text-muted-foreground">{ex.detail}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="p-3 rounded-lg bg-muted/50 border max-w-2xl">
            <p className="text-xs text-muted-foreground">
              💡 <strong className="text-foreground">npx vs npm:</strong> npm은 패키지를 &quot;설치&quot;하고,
              npx는 패키지를 &quot;실행&quot;합니다. 자주 쓰는 도구는 npm install -g로 설치하고,
              한 번만 쓰는 도구는 npx로 실행하세요.
            </p>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
