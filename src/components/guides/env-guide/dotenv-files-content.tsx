'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FolderOpen, ShieldAlert, CheckCircle2, ArrowDown } from 'lucide-react';

const fileTypes = [
  {
    name: '.env',
    desc: '기본값 파일. 모든 환경에서 적용됩니다. 실제 시크릿을 넣지 마세요.',
    gitSafe: false,
    usage: '기본값 · 공통 설정',
    example: 'NODE_ENV=development\nNEXT_TELEMETRY_DISABLED=1',
    color: 'border-gray-200 dark:border-gray-700',
    badge: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300',
  },
  {
    name: '.env.local',
    desc: '로컬 전용 파일. .gitignore에 자동 포함됩니다. 실제 API 키를 여기에 넣으세요.',
    gitSafe: false,
    gitBlock: true,
    usage: '로컬 개발용 실제 키',
    example: 'SUPABASE_ANON_KEY=eyJh...\nOPENAI_API_KEY=sk-...',
    color: 'border-blue-200 dark:border-blue-800',
    badge: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300',
  },
  {
    name: '.env.example',
    desc: '팀원용 템플릿. 어떤 변수가 필요한지 보여주는 용도. 실제 값은 넣지 않습니다.',
    gitSafe: true,
    usage: '팀 공유 · 문서화',
    example: 'SUPABASE_ANON_KEY=your-anon-key-here\nOPENAI_API_KEY=your-openai-key',
    color: 'border-green-200 dark:border-green-800',
    badge: 'bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300',
  },
  {
    name: '.env.production',
    desc: '프로덕션 전용 기본값. Vercel 같은 플랫폼에서는 대시보드로 관리하는 게 더 안전합니다.',
    gitSafe: false,
    usage: '프로덕션 기본값',
    example: 'NEXT_PUBLIC_APP_URL=https://myapp.com\nLOG_LEVEL=error',
    color: 'border-orange-200 dark:border-orange-800',
    badge: 'bg-orange-100 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300',
  },
];

const priorityOrder = [
  { name: '.env.local', desc: '가장 높은 우선순위 (로컬 전용)' },
  { name: '.env.development', desc: 'npm run dev 시 적용' },
  { name: '.env.production', desc: 'npm run build 시 적용' },
  { name: '.env', desc: '가장 낮은 우선순위 (기본값)' },
];

const gitignoreCode = `# .gitignore — 아래 줄이 있는지 확인하세요
.env
.env.local
.env.*.local`;

const exampleFileCode = `# .env.example — 이 파일은 GitHub에 올려도 됩니다
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
OPENAI_API_KEY=your-openai-key
DATABASE_URL=your-database-url`;

export function DotenvFilesContent() {
  return (
    <div className="py-6 space-y-0">
      {/* 헤더 */}
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <FolderOpen className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">.env 파일 관리</h1>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          Next.js 프로젝트에는 여러 종류의 .env 파일이 있습니다.
          각 파일의 역할과 차이를 이해하면 환경변수 관리가 훨씬 쉬워집니다.
        </p>
      </ScrollReveal>

      {/* 파일 종류 비교 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">파일 종류와 역할</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            각 파일은 적용 범위와 보안 수준이 다릅니다. GitHub에 올려도 되는지 반드시 확인하세요.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
          {fileTypes.map((file) => (
            <ScrollReveal key={file.name} delay={0.05}>
              <div className={`rounded-xl border p-5 h-full flex flex-col ${file.color}`}>
                <div className="flex items-start justify-between mb-3">
                  <code className="text-sm font-bold font-mono">{file.name}</code>
                  <div className="flex gap-1.5 flex-wrap justify-end">
                    {file.gitBlock && (
                      <Badge variant="secondary" className="text-[10px] bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300">
                        자동 gitignore
                      </Badge>
                    )}
                    {file.gitSafe ? (
                      <Badge variant="secondary" className="text-[10px] bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300">
                        GitHub 업로드 가능
                      </Badge>
                    ) : (
                      !file.gitBlock && (
                        <Badge variant="secondary" className="text-[10px] bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300">
                          주의 필요
                        </Badge>
                      )
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3 flex-1">{file.desc}</p>
                <div className="mb-3">
                  <span className="text-[10px] text-muted-foreground">용도: </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${file.badge}`}>{file.usage}</span>
                </div>
                <div className="rounded-md border bg-background/60">
                  <pre className="p-3 text-[10px] font-mono overflow-x-auto leading-relaxed">{file.example}</pre>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 우선순위 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">우선순위 — 어떤 파일이 이기나요?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            같은 변수명이 여러 파일에 있을 때, Next.js는 아래 순서대로 적용합니다.
            위에 있는 파일이 이깁니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-sm space-y-2">
            {priorityOrder.map((item, i) => (
              <div key={item.name} className="flex flex-col items-center">
                <div className={`w-full flex items-center gap-3 p-3 rounded-lg border ${
                  i === 0
                    ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800'
                    : 'bg-card'
                }`}>
                  <span className={`text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                    i === 0 ? 'bg-blue-500 text-white' : 'bg-muted text-muted-foreground'
                  }`}>{i + 1}</span>
                  <div>
                    <code className="text-xs font-mono font-semibold">{item.name}</code>
                    <div className="text-[10px] text-muted-foreground">{item.desc}</div>
                  </div>
                </div>
                {i < priorityOrder.length - 1 && (
                  <ArrowDown className="h-4 w-4 text-muted-foreground/40 my-0.5" />
                )}
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* 보안 경고 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">보안 — 절대 올리면 안 되는 것</h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <Card className="border-red-500/50 bg-red-500/5 max-w-2xl mb-6">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <ShieldAlert className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-600 dark:text-red-400 mb-1">
                    .env 파일을 GitHub에 올리면 수 초 내에 해킹당합니다
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    봇이 GitHub 공개 저장소를 실시간으로 스캔합니다.
                    AWS 키가 노출되면 수백만 원의 요금 폭탄을 맞은 실제 사례가 있습니다.
                    반드시 <code className="font-mono text-xs bg-muted px-1 rounded">.gitignore</code>에
                    .env 파일을 추가하세요.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="max-w-2xl">
            <div className="rounded-lg border bg-muted/50">
              <div className="px-4 py-2 border-b flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-mono">.gitignore</span>
                <Badge variant="secondary" className="text-[10px]">필수 확인</Badge>
              </div>
              <pre className="p-4 text-sm font-mono overflow-x-auto leading-relaxed">{gitignoreCode}</pre>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* .env.example 실천 가이드 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">.env.example 작성법</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            실제 값 대신 설명이나 더미 값을 넣은 템플릿 파일입니다.
            팀원이 프로젝트를 클론했을 때 어떤 환경변수가 필요한지 바로 알 수 있습니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  올바른 .env.example
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border bg-muted/50">
                  <pre className="p-3 text-[10px] font-mono overflow-x-auto leading-relaxed">{exampleFileCode}</pre>
                </div>
                <p className="text-[10px] text-green-600 dark:text-green-400 mt-2">
                  GitHub에 올려도 안전
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">팀원이 해야 할 것</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  {[
                    { step: '1', text: '.env.example을 복사해서 .env.local 생성' },
                    { step: '2', text: '각 항목에 실제 키 값 입력' },
                    { step: '3', text: 'npm run dev 실행' },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-3">
                      <span className="text-xs font-bold w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        {item.step}
                      </span>
                      <span className="text-xs text-muted-foreground leading-relaxed">{item.text}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-md border bg-muted/50">
                  <pre className="p-3 text-[10px] font-mono leading-relaxed">{`cp .env.example .env.local`}</pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
