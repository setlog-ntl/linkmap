'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Play, RefreshCw, Trash2, FolderPlus } from 'lucide-react';

const essentialCommands = [
  {
    icon: Download,
    cmd: 'npm install',
    alias: 'npm i',
    desc: '패키지를 설치합니다. 이름 없이 실행하면 package.json의 모든 패키지를 설치합니다.',
    example: 'npm install react',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
  },
  {
    icon: Play,
    cmd: 'npm run',
    alias: null,
    desc: 'package.json의 scripts에 정의된 명령어를 실행합니다.',
    example: 'npm run dev',
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-950/30',
  },
  {
    icon: RefreshCw,
    cmd: 'npm update',
    alias: null,
    desc: '설치된 패키지를 최신 허용 버전으로 업데이트합니다.',
    example: 'npm update react',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50 dark:bg-yellow-950/30',
  },
  {
    icon: Trash2,
    cmd: 'npm uninstall',
    alias: 'npm un',
    desc: '설치된 패키지를 삭제하고 package.json에서도 제거합니다.',
    example: 'npm uninstall lodash',
    color: 'text-red-500',
    bgColor: 'bg-red-50 dark:bg-red-950/30',
  },
  {
    icon: FolderPlus,
    cmd: 'npm init',
    alias: 'npm init -y',
    desc: '새 프로젝트의 package.json을 생성합니다. -y를 붙이면 기본값으로 바로 생성.',
    example: 'npm init -y',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950/30',
  },
];

const scriptsExample = `{
  "scripts": {
    "dev": "next dev",           // npm run dev → 개발 서버 실행
    "build": "next build",       // npm run build → 배포용 빌드
    "start": "next start",       // npm run start → 프로덕션 서버
    "lint": "eslint .",          // npm run lint → 코드 검사
    "test": "vitest"             // npm run test → 테스트 실행
  }
}`;

export function EssentialsSection() {
  return (
    <section id="essentials" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">필수 지식</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          이 5가지 명령어만 알면 패키지 매니저를 사용할 수 있습니다.
        </p>
      </ScrollReveal>

      {/* 핵심 명령어 5개 카드 */}
      <ScrollReveal delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10 max-w-4xl">
          {essentialCommands.map((c) => {
            const Icon = c.icon;
            return (
              <Card key={c.cmd} className="border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${c.bgColor}`}>
                      <Icon className={`h-4 w-4 ${c.color}`} />
                    </div>
                    <div>
                      <code className="font-mono text-xs">{c.cmd}</code>
                      {c.alias && (
                        <span className="text-[10px] text-muted-foreground ml-1.5">({c.alias})</span>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">{c.desc}</p>
                  <div className="rounded bg-muted/50 px-3 py-2">
                    <code className="text-[10px] font-mono text-primary">{c.example}</code>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollReveal>

      {/* npm scripts 예시 */}
      <ScrollReveal delay={0.15}>
        <h3 className="text-lg font-semibold mb-3">npm scripts 간단 예시</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-2xl">
          package.json의 <code className="text-xs bg-muted px-1 rounded font-mono">scripts</code> 필드에
          자주 쓰는 명령어를 등록해두면 <code className="text-xs bg-muted px-1 rounded font-mono">npm run 이름</code>으로
          간단히 실행할 수 있습니다.
        </p>

        <div className="max-w-xl mb-6">
          <div className="rounded-lg border bg-muted/50">
            <div className="px-4 py-2 border-b">
              <span className="text-xs text-muted-foreground font-mono">package.json (scripts 부분)</span>
            </div>
            <pre className="p-4 text-[10px] font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap">
              {scriptsExample}
            </pre>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-muted/50 border max-w-2xl">
          <p className="text-xs text-muted-foreground">
            💡 <strong className="text-foreground">팁:</strong>{' '}
            <code className="text-xs bg-muted px-1 rounded font-mono">dev</code>,{' '}
            <code className="text-xs bg-muted px-1 rounded font-mono">start</code>,{' '}
            <code className="text-xs bg-muted px-1 rounded font-mono">test</code>는
            <code className="text-xs bg-muted px-1 rounded font-mono">npm dev</code>,{' '}
            <code className="text-xs bg-muted px-1 rounded font-mono">npm start</code>,{' '}
            <code className="text-xs bg-muted px-1 rounded font-mono">npm test</code>처럼{' '}
            <code className="text-xs bg-muted px-1 rounded font-mono">run</code> 없이 실행할 수 있습니다.
            나머지는 <code className="text-xs bg-muted px-1 rounded font-mono">npm run 이름</code> 형식입니다.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
