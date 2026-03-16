'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

const hostingTypes = [
  {
    name: '정적 호스팅',
    emoji: '📄',
    subtitle: 'Static Hosting',
    desc: '미리 빌드된 HTML/CSS/JS 파일을 그대로 전송합니다. 가장 빠르고 저렴합니다.',
    examples: ['GitHub Pages', 'Netlify', 'Cloudflare Pages'],
    tag: '블로그·포트폴리오',
    tagColor: 'bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300',
    color: 'border-green-200 dark:border-green-800',
  },
  {
    name: '동적 호스팅 (PaaS)',
    emoji: '🚀',
    subtitle: 'Platform as a Service',
    desc: '서버가 요청마다 페이지를 실시간 생성합니다. Git push 하나로 배포 완료.',
    examples: ['Vercel', 'Railway', 'Render'],
    tag: 'Next.js·풀스택',
    tagColor: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300',
    color: 'border-blue-200 dark:border-blue-800',
  },
  {
    name: '서버리스',
    emoji: '⚡',
    subtitle: 'Serverless / Edge',
    desc: '항상 켜진 서버 없이, 요청이 올 때만 함수가 실행됩니다. 전 세계 엣지에서 응답.',
    examples: ['Cloudflare Workers', 'AWS Lambda', 'Vercel Functions'],
    tag: 'API·엣지',
    tagColor: 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300',
    color: 'border-purple-200 dark:border-purple-800',
  },
  {
    name: '전통 서버 (VPS)',
    emoji: '🖥️',
    subtitle: 'Virtual Private Server',
    desc: '가상 서버를 빌려 직접 운영합니다. 최고의 자유도, 최대의 관리 부담.',
    examples: ['AWS EC2', 'DigitalOcean', 'Vultr'],
    tag: '고급·완전 제어',
    tagColor: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300',
    color: 'border-gray-200 dark:border-gray-700',
  },
];

const flowSteps = [
  {
    question: 'Next.js 프로젝트인가요?',
    yes: 'Vercel 또는 Cloudflare',
    no: '다음 질문으로',
  },
  {
    question: '정적 사이트 (HTML만)?',
    yes: 'GitHub Pages 또는 Netlify',
    no: '다음 질문으로',
  },
  {
    question: '백엔드 서버가 필요한가요?',
    yes: 'Railway 또는 Render',
    no: '다음 질문으로',
  },
  {
    question: '서버를 완전히 제어해야 하나요?',
    yes: 'VPS (DigitalOcean, AWS EC2)',
    no: 'Vercel 무료 플랜부터 시작!',
  },
];

export function HostingOverviewSection() {
  return (
    <section id="hosting-overview" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">호스팅 유형 미리보기</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          서버를 직접 관리할 필요 없이 코드만 올리면 되는 서비스들이 있습니다.
          프로젝트에 맞는 호스팅 유형을 빠르게 살펴보세요.
        </p>
      </ScrollReveal>

      {/* 호스팅 유형 4가지 카드 */}
      <ScrollReveal delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {hostingTypes.map((h) => (
            <div key={h.name} className={`rounded-xl border p-5 ${h.color}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{h.emoji}</span>
                  <div>
                    <div className="font-bold text-sm">{h.name}</div>
                    <div className="text-[10px] text-muted-foreground">{h.subtitle}</div>
                  </div>
                </div>
                <Badge variant="secondary" className={`text-[10px] shrink-0 ${h.tagColor}`}>
                  {h.tag}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{h.desc}</p>
              <div className="flex flex-wrap gap-1">
                {h.examples.map((ex) => (
                  <span
                    key={ex}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-background/60 border font-mono"
                  >
                    {ex}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* 의사결정 플로우차트 */}
      <ScrollReveal delay={0.15}>
        <h3 className="text-lg font-semibold mb-4">🧭 나에게 맞는 호스팅은?</h3>
        <div className="max-w-xl">
          <div className="rounded-xl border bg-card shadow-sm p-5 space-y-0">
            {flowSteps.map((step, idx) => (
              <div key={step.question}>
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium mb-2">{step.question}</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="px-3 py-2 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                        <span className="text-green-600 dark:text-green-400 font-semibold">
                          YES →{' '}
                        </span>
                        <span className="text-foreground">{step.yes}</span>
                      </div>
                      <div className="px-3 py-2 rounded-lg bg-muted/50 border">
                        <span className="text-muted-foreground font-semibold">NO → </span>
                        <span className="text-muted-foreground">{step.no}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {idx < flowSteps.length - 1 && (
                  <div className="ml-3.5 flex items-center py-2">
                    <div className="w-px h-4 bg-border" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* 더 알아보기 */}
      <ScrollReveal delay={0.2}>
        <div className="mt-8 max-w-xl">
          <div className="rounded-lg border bg-primary/5 p-4 flex items-center justify-between">
            <div className="text-sm">
              <span className="font-medium">각 호스팅 유형을 더 자세히 알고 싶다면?</span>
              <span className="text-muted-foreground ml-1">→ 서브가이드에서 상세 비교</span>
            </div>
            <ArrowRight className="h-4 w-4 text-primary shrink-0" />
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
