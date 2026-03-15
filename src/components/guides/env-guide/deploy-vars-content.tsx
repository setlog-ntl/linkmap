'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Rocket, AlertTriangle, Eye, EyeOff } from 'lucide-react';

const platforms = [
  {
    name: 'Vercel',
    emoji: '▲',
    color: 'border-neutral-200 dark:border-neutral-700',
    badge: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300',
    uiPath: 'Dashboard → 프로젝트 선택 → Settings → Environment Variables',
    cliCommand: 'vercel env add VARIABLE_NAME',
    tip: 'Preview / Development / Production 세 환경을 별도로 설정할 수 있습니다.',
    docsUrl: 'https://vercel.com/docs/environment-variables',
    uiSteps: [
      'Vercel 대시보드에서 프로젝트 선택',
      'Settings 탭 → Environment Variables',
      'Name에 변수명, Value에 실제 값 입력',
      '환경 선택 (Production / Preview / Development)',
      'Save 클릭',
    ],
  },
  {
    name: 'Cloudflare Workers',
    emoji: '☁️',
    color: 'border-orange-200 dark:border-orange-800',
    badge: 'bg-orange-100 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300',
    uiPath: 'Dashboard → Workers & Pages → 프로젝트 선택 → Settings → Variables and Secrets',
    cliCommand: 'npx wrangler secret put VARIABLE_NAME',
    tip: 'wrangler.toml에 [vars]로 일반 변수, wrangler secret으로 시크릿을 구분해서 관리합니다.',
    docsUrl: 'https://developers.cloudflare.com/workers/configuration/secrets/',
    uiSteps: [
      'Cloudflare 대시보드 → Workers & Pages',
      '배포된 Worker 선택',
      'Settings → Variables and Secrets',
      '+ Add variable 클릭',
      '변수명과 값 입력 후 Save',
    ],
  },
];

const nextPublicRules = [
  {
    prefix: 'NEXT_PUBLIC_',
    where: '브라우저 + 서버',
    example: 'NEXT_PUBLIC_SUPABASE_URL',
    safe: true,
    desc: '브라우저 번들에 포함됩니다. 공개해도 괜찮은 값만 사용하세요.',
  },
  {
    prefix: '(없음)',
    where: '서버 전용',
    example: 'SUPABASE_SERVICE_ROLE_KEY',
    safe: false,
    desc: '서버에서만 접근 가능합니다. API 키, DB 비밀번호 등 민감정보에 사용하세요.',
  },
];

const commonMistakes = [
  {
    mistake: 'NEXT_PUBLIC_SECRET_KEY처럼 시크릿에 NEXT_PUBLIC_ 붙이기',
    why: 'NEXT_PUBLIC_ 접두사가 붙으면 브라우저 소스코드에 값이 그대로 노출됩니다.',
    fix: '시크릿은 NEXT_PUBLIC_ 없이 서버 전용으로만 사용하세요.',
    severity: 'high',
  },
  {
    mistake: '배포 후 환경변수를 추가했는데 반영이 안 됨',
    why: '환경변수 변경 후 재배포(Redeploy)를 하지 않으면 이전 빌드가 그대로 사용됩니다.',
    fix: '환경변수 저장 후 반드시 재배포를 실행하세요.',
    severity: 'medium',
  },
  {
    mistake: 'localhost:3000을 하드코딩한 URL이 배포 환경에서 작동 안 함',
    why: '배포 환경에서는 localhost 주소가 존재하지 않습니다.',
    fix: 'NEXT_PUBLIC_APP_URL 환경변수로 처리하고 배포 URL을 플랫폼에 등록하세요.',
    severity: 'medium',
  },
  {
    mistake: 'Supabase Site URL이 localhost로 설정된 채 배포',
    why: '소셜 로그인 콜백이 localhost를 가리켜 인증이 실패합니다.',
    fix: 'Supabase 대시보드 → Authentication → URL Configuration에서 배포 URL로 변경하세요.',
    severity: 'high',
  },
];

export function DeployVarsContent() {
  return (
    <div className="py-6 space-y-0">
      {/* 헤더 */}
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Rocket className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">배포 환경변수 설정</h1>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          로컬에서는 .env.local 파일을 사용하지만, 배포 환경에서는 파일이 없습니다.
          Vercel, Cloudflare 등 배포 플랫폼 대시보드에 직접 등록해야 합니다.
        </p>
      </ScrollReveal>

      {/* NEXT_PUBLIC_ 규칙 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">NEXT_PUBLIC_ 접두사 규칙</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            Next.js에서 환경변수는 두 종류로 나뉩니다. 이 차이를 모르면 보안 사고가 납니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mb-6">
            {nextPublicRules.map((rule) => (
              <Card key={rule.prefix} className={rule.safe ? 'border-blue-200 dark:border-blue-800' : 'border-orange-200 dark:border-orange-800'}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    {rule.safe ? (
                      <Eye className="h-4 w-4 text-blue-500" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-orange-500" />
                    )}
                    <code className="font-mono">{rule.prefix}</code>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-[10px] text-muted-foreground">접근 범위: </span>
                    <span className="text-xs font-medium">{rule.where}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground">예시: </span>
                    <code className="text-[10px] font-mono bg-muted px-1 rounded">{rule.example}</code>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{rule.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="max-w-2xl rounded-lg border bg-muted/50">
            <div className="px-4 py-2 border-b">
              <span className="text-xs text-muted-foreground font-mono">올바른 사용 예시</span>
            </div>
            <pre className="p-4 text-xs font-mono overflow-x-auto leading-relaxed">{`// 브라우저에서 사용 — NEXT_PUBLIC_ 필요
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

// 서버(API Route)에서만 사용 — NEXT_PUBLIC_ 금지
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;`}</pre>
          </div>
        </ScrollReveal>
      </section>

      {/* 플랫폼별 설정 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">플랫폼별 환경변수 등록</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            배포 플랫폼마다 환경변수를 등록하는 위치가 다릅니다.
            UI와 CLI 두 가지 방법을 안내합니다.
          </p>
        </ScrollReveal>

        <div className="space-y-6 max-w-3xl">
          {platforms.map((platform, idx) => (
            <ScrollReveal key={platform.name} delay={idx * 0.1}>
              <div className={`rounded-xl border p-5 ${platform.color}`}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl font-bold">{platform.emoji}</span>
                  <span className="font-bold">{platform.name}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* UI 방법 */}
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground mb-2">대시보드 UI</h4>
                    <div className="space-y-1.5">
                      {platform.uiSteps.map((step, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs">
                          <span className="w-4 h-4 rounded-full bg-background border text-[10px] flex items-center justify-center shrink-0 font-bold text-muted-foreground">{i + 1}</span>
                          <span className="text-muted-foreground leading-relaxed">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CLI 방법 */}
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground mb-2">CLI 명령어</h4>
                    <div className="rounded-md border bg-background/60">
                      <pre className="p-3 text-[10px] font-mono">{platform.cliCommand}</pre>
                    </div>
                    <div className="mt-3 p-3 rounded-md bg-background/40 border">
                      <p className="text-[10px] text-muted-foreground leading-relaxed">
                        💡 {platform.tip}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t">
                  <a
                    href={platform.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-primary hover:underline"
                  >
                    공식 문서 보기 →
                  </a>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 흔한 실수 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">배포 후 자주 하는 실수</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            배포 직후 에러의 80%는 환경변수 문제입니다. 아래 실수를 미리 확인하세요.
          </p>
        </ScrollReveal>

        <div className="space-y-3 max-w-2xl">
          {commonMistakes.map((item, idx) => (
            <ScrollReveal key={idx} delay={idx * 0.05}>
              <div className={`rounded-lg border p-4 ${
                item.severity === 'high'
                  ? 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20'
                  : 'border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-950/20'
              }`}>
                <div className="flex items-start gap-2 mb-2">
                  <AlertTriangle className={`h-4 w-4 mt-0.5 shrink-0 ${
                    item.severity === 'high' ? 'text-red-500' : 'text-yellow-500'
                  }`} />
                  <div className="text-sm font-medium">{item.mistake}</div>
                </div>
                <div className="ml-6 space-y-1">
                  <p className="text-xs text-muted-foreground">{item.why}</p>
                  <p className="text-xs text-foreground font-medium">
                    해결: {item.fix}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.3}>
          <div className="mt-6 max-w-2xl p-4 rounded-lg border bg-muted/30">
            <h3 className="text-sm font-semibold mb-3">배포 전 체크리스트</h3>
            <div className="space-y-2">
              {[
                '.env.local의 모든 키를 배포 플랫폼에 등록했나?',
                'NEXT_PUBLIC_ 접두사가 공개 값에만 붙어 있나?',
                'Supabase URL Configuration이 배포 URL로 변경됐나?',
                'localhost URL이 코드에 하드코딩되어 있지 않나?',
                '환경변수 저장 후 재배포(Redeploy)를 실행했나?',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="text-primary">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
