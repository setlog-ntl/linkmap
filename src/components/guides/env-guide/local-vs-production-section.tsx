'use client';

import { useState } from 'react';
import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Monitor, Cloud, ShieldAlert, Copy, Check } from 'lucide-react';

const comparisons = [
  {
    label: '환경변수 위치',
    local: '.env.local 파일',
    production: 'Vercel/Cloudflare 대시보드',
  },
  {
    label: '접근 방법',
    local: '자동 로드 (파일만 있으면 됨)',
    production: '수동 입력 or CLI',
  },
  {
    label: '예시',
    local: '개발용 테스트 키',
    production: '프로덕션 실제 키',
  },
  {
    label: 'PC 꺼지면?',
    local: '앱도 멈춤',
    production: '서비스 계속 동작',
  },
];

const gitignoreCode = `# .gitignore 파일에 아래 줄이 있는지 확인하세요

.env
.env.local
.env.*.local`;

export function LocalVsProductionSection() {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(gitignoreCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="local-vs-production" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">로컬 vs 배포 환경</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          같은 환경변수라도 &quot;어디에서&quot; 실행하느냐에 따라 관리 방법이 다릅니다.
        </p>
      </ScrollReveal>

      {/* 비교 카드 */}
      <ScrollReveal delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-3xl">
          <Card className="border-2 border-blue-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Monitor className="h-5 w-5 text-blue-500" />
                로컬 (개발)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {comparisons.map((c) => (
                <div key={c.label}>
                  <span className="text-xs text-muted-foreground">{c.label}</span>
                  <p className="text-sm font-medium">{c.local}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-2 border-green-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Cloud className="h-5 w-5 text-green-500" />
                배포 (운영)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {comparisons.map((c) => (
                <div key={c.label}>
                  <span className="text-xs text-muted-foreground">{c.label}</span>
                  <p className="text-sm font-medium">{c.production}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </ScrollReveal>

      {/* 경고 카드 */}
      <ScrollReveal delay={0.15}>
        <Card className="border-red-500/50 bg-red-500/5 max-w-3xl mb-8">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <ShieldAlert className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-600 dark:text-red-400 mb-1">
                  .env 파일을 GitHub에 올리면 해킹당합니다
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  GitHub에 API Key가 올라가면 봇이 수 초 내에 탐지합니다.
                  AWS 키가 노출되면 수백만 원의 요금이 발생한 실제 사례도 있습니다.
                  <strong className="text-foreground"> 반드시 .gitignore에 .env를 추가하세요.</strong>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </ScrollReveal>

      {/* .gitignore 확인 코드 */}
      <ScrollReveal delay={0.2}>
        <div className="max-w-2xl">
          <div className="relative rounded-lg border bg-muted/50">
            <div className="flex items-center justify-between px-4 py-2 border-b">
              <span className="text-xs text-muted-foreground font-mono">.gitignore</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={copyCode}
              >
                {copied ? (
                  <><Check className="h-3.5 w-3.5 mr-1" /> 복사됨</>
                ) : (
                  <><Copy className="h-3.5 w-3.5 mr-1" /> 복사</>
                )}
              </Button>
            </div>
            <pre className="p-4 text-sm font-mono overflow-x-auto leading-relaxed">
              {gitignoreCode}
            </pre>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
