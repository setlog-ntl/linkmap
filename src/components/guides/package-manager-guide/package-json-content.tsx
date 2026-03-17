'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileJson } from 'lucide-react';

const packageJsonExample = `{
  "name": "my-app",               // 프로젝트 이름
  "version": "1.0.0",             // 현재 버전
  "private": true,                // npm 공개 방지
  "scripts": {                    // 실행 명령어 모음
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint ."
  },
  "dependencies": {               // 앱 실행에 필요한 패키지
    "next": "15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {            // 개발 시에만 필요한 패키지
    "typescript": "^5.7.0",
    "eslint": "^9.0.0",
    "@types/react": "^19.0.0"
  }
}`;

const depsComparison = [
  {
    type: 'dependencies',
    label: '앱 실행용',
    desc: '앱이 실제로 동작하는 데 필요한 패키지. 빌드된 결과물에 포함됩니다.',
    examples: ['react', 'next', 'zustand', '@supabase/supabase-js', 'zod'],
    installCmd: 'npm install react',
    color: 'border-green-200 dark:border-green-800',
    badge: 'bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300',
  },
  {
    type: 'devDependencies',
    label: '개발 전용',
    desc: '개발 과정에서만 필요한 패키지. 빌드된 결과물에는 포함되지 않습니다.',
    examples: ['typescript', 'eslint', 'prettier', 'vitest', '@types/react'],
    installCmd: 'npm install -D typescript',
    color: 'border-yellow-200 dark:border-yellow-800',
    badge: 'bg-yellow-100 dark:bg-yellow-900/60 text-yellow-700 dark:text-yellow-300',
  },
];

const semverTable = [
  {
    notation: '^1.2.3',
    name: '캐럿 (^)',
    range: '1.2.3 ~ 1.x.x',
    desc: 'major 버전 고정, minor·patch 업데이트 허용. 가장 많이 사용됩니다.',
    example: '^1.2.3 → 1.2.3, 1.3.0, 1.9.9 가능 / 2.0.0 불가',
    color: 'bg-green-50 dark:bg-green-950/30',
  },
  {
    notation: '~1.2.3',
    name: '틸드 (~)',
    range: '1.2.3 ~ 1.2.x',
    desc: 'major·minor 버전 고정, patch 업데이트만 허용. 더 보수적입니다.',
    example: '~1.2.3 → 1.2.3, 1.2.9 가능 / 1.3.0 불가',
    color: 'bg-yellow-50 dark:bg-yellow-950/30',
  },
  {
    notation: '1.2.3',
    name: '고정 버전',
    range: '1.2.3만',
    desc: '정확히 이 버전만 설치. 가장 안전하지만 보안 패치를 수동으로 해야 합니다.',
    example: '1.2.3 → 1.2.3만 가능',
    color: 'bg-red-50 dark:bg-red-950/30',
  },
];

const semverParts = [
  { part: 'Major', version: '2', desc: '호환 안 되는 큰 변경', color: 'text-red-500' },
  { part: 'Minor', version: '1', desc: '호환되는 새 기능 추가', color: 'text-yellow-500' },
  { part: 'Patch', version: '3', desc: '버그 수정', color: 'text-green-500' },
];

const lockFiles = [
  { pm: 'npm', file: 'package-lock.json', desc: 'npm이 자동 생성·관리' },
  { pm: 'yarn', file: 'yarn.lock', desc: 'yarn이 자동 생성·관리' },
  { pm: 'pnpm', file: 'pnpm-lock.yaml', desc: 'pnpm이 자동 생성·관리' },
];

export function PackageJsonContent() {
  return (
    <div className="py-6 space-y-0">
      {/* 헤더 */}
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <FileJson className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">package.json 이해하기</h1>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          package.json은 프로젝트의 신분증입니다.
          어떤 패키지를 쓰는지, 어떤 명령어를 실행할 수 있는지 모두 여기에 적혀 있습니다.
        </p>
      </ScrollReveal>

      {/* package.json 구조 도식 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">전체 구조</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            일반적인 Next.js 프로젝트의 package.json 구조입니다. 각 필드의 역할을 주석으로 설명했습니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl mb-8">
            <div className="rounded-lg border bg-muted/50">
              <div className="px-4 py-2 border-b">
                <span className="text-xs text-muted-foreground font-mono">package.json</span>
              </div>
              <pre className="p-4 text-[10px] font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap">
                {packageJsonExample}
              </pre>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* dependencies vs devDependencies */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">dependencies vs devDependencies</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            패키지를 설치할 때 어디에 넣어야 할지 헷갈린다면, &quot;이 패키지가 빌드된 앱에서도 필요한가?&quot;를 생각해보세요.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mb-8">
            {depsComparison.map((dep) => (
              <Card key={dep.type} className={dep.color}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Badge variant="secondary" className={`text-[10px] ${dep.badge}`}>{dep.label}</Badge>
                    <code className="font-mono text-xs">{dep.type}</code>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">{dep.desc}</p>
                  <div className="space-y-1.5 mb-3">
                    {dep.examples.map((ex) => (
                      <div key={ex} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span className="text-primary">-</span><code className="font-mono text-[10px]">{ex}</code>
                      </div>
                    ))}
                  </div>
                  <div className="rounded bg-muted/50 px-3 py-2">
                    <code className="text-[10px] font-mono text-primary">{dep.installCmd}</code>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Semver 버전 표기 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">버전 표기법 (Semver)</h2>
          <p className="text-muted-foreground mb-4 max-w-2xl text-sm">
            패키지 버전은 <strong className="text-foreground">Major.Minor.Patch</strong> 형식으로 표기합니다.
          </p>
        </ScrollReveal>

        {/* 버전 구조 도식 */}
        <ScrollReveal delay={0.1}>
          <div className="max-w-md mb-8">
            <div className="rounded-xl border bg-card shadow-sm p-5">
              <div className="text-center mb-4">
                <span className="text-3xl font-mono font-bold">
                  <span className="text-red-500">2</span>
                  <span className="text-muted-foreground">.</span>
                  <span className="text-yellow-500">1</span>
                  <span className="text-muted-foreground">.</span>
                  <span className="text-green-500">3</span>
                </span>
              </div>
              <div className="space-y-2">
                {semverParts.map((p) => (
                  <div key={p.part} className="flex items-center gap-3 text-xs">
                    <span className={`font-mono font-bold w-6 text-center ${p.color}`}>{p.version}</span>
                    <span className="font-semibold w-12">{p.part}</span>
                    <span className="text-muted-foreground">{p.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* ^, ~, 고정 비교 */}
        <ScrollReveal delay={0.15}>
          <h3 className="text-lg font-semibold mb-4">^, ~, 고정 버전 비교</h3>
          <div className="max-w-2xl overflow-x-auto mb-8">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-semibold text-muted-foreground">표기</th>
                  <th className="text-left py-2 px-3 font-semibold">이름</th>
                  <th className="text-left py-2 px-3 font-semibold">허용 범위</th>
                  <th className="text-left py-2 px-3 font-semibold">설명</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {semverTable.map((row) => (
                  <tr key={row.notation} className={`border-b ${row.color}`}>
                    <td className="py-2 px-3 font-mono font-bold text-foreground">{row.notation}</td>
                    <td className="py-2 px-3 font-medium">{row.name}</td>
                    <td className="py-2 px-3">{row.range}</td>
                    <td className="py-2 px-3">{row.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="max-w-2xl space-y-2 mb-8">
            {semverTable.map((row) => (
              <div key={row.notation} className="p-2 rounded bg-muted/50 text-[10px] text-muted-foreground">
                <code className="font-mono font-bold text-foreground">{row.notation}</code> → {row.example}
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Lock 파일의 역할 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">Lock 파일의 역할</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            Lock 파일은 설치된 패키지의 <strong className="text-foreground">정확한 버전</strong>을 기록합니다.
            이 파일이 있으면 누가, 언제 설치하든 동일한 버전이 설치됩니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-md mb-6">
            <div className="rounded-xl border bg-card shadow-sm p-5">
              <h3 className="text-sm font-semibold mb-3">패키지 매니저별 Lock 파일</h3>
              <div className="space-y-2">
                {lockFiles.map((lf) => (
                  <div key={lf.pm} className="flex items-center gap-3 text-xs rounded border bg-muted/30 px-3 py-2">
                    <span className="font-semibold w-12">{lf.pm}</span>
                    <code className="font-mono text-primary text-[10px] bg-primary/10 px-1.5 py-0.5 rounded">{lf.file}</code>
                    <span className="text-muted-foreground text-[10px]">{lf.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="p-3 rounded-lg bg-muted/50 border max-w-2xl">
            <p className="text-xs text-muted-foreground">
              💡 <strong className="text-foreground">핵심 규칙:</strong> Lock 파일은 반드시 Git에 커밋하세요.
              node_modules는 Git에 올리지 않지만, lock 파일은 반드시 올려야 팀원 모두 동일한 환경에서 개발할 수 있습니다.
            </p>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
