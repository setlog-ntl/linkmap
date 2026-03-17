'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Badge } from '@/components/ui/badge';

const managers = [
  {
    name: 'npm',
    emoji: '📦',
    tagline: 'Node.js 기본 패키지 매니저',
    desc: 'Node.js와 함께 자동 설치되는 기본 패키지 매니저. 별도 설치 없이 바로 사용할 수 있고, 가장 많은 레퍼런스가 있습니다.',
    pros: ['Node.js에 기본 포함', '가장 풍부한 문서', '200만+ 패키지 레지스트리', '초보자 친화적'],
    cons: ['yarn/pnpm보다 느린 설치 속도', 'node_modules 디스크 사용량 큼'],
    lockFile: 'package-lock.json',
    installCmd: 'npm install',
    color: 'border-red-200 dark:border-red-800',
    highlight: true,
  },
  {
    name: 'yarn',
    emoji: '🧶',
    tagline: 'Facebook이 만든 빠른 대안',
    desc: 'npm의 속도와 안정성 문제를 해결하기 위해 Facebook이 만들었습니다. 병렬 설치로 npm보다 빠르고, Plug\'n\'Play(PnP) 모드를 지원합니다.',
    pros: ['npm보다 빠른 설치', '오프라인 캐시 지원', 'Workspaces 기능 우수', 'PnP 모드 지원'],
    cons: ['별도 설치 필요', 'PnP 모드 호환성 이슈', 'v1과 v4 차이가 큼'],
    lockFile: 'yarn.lock',
    installCmd: 'yarn',
    color: 'border-blue-200 dark:border-blue-800',
    highlight: false,
  },
  {
    name: 'pnpm',
    emoji: '🏎️',
    tagline: '디스크 절약 + 최고 속도',
    desc: '심볼릭 링크를 활용해 디스크 공간을 획기적으로 절약합니다. 여러 프로젝트에서 같은 패키지를 공유하므로 설치도 가장 빠릅니다.',
    pros: ['가장 빠른 설치 속도', '디스크 공간 60% 이상 절약', 'strict 모드 (유령 의존성 방지)', 'Monorepo 최적화'],
    cons: ['별도 설치 필요', '일부 라이브러리 호환성 이슈', '초보자에게 다소 생소'],
    lockFile: 'pnpm-lock.yaml',
    installCmd: 'pnpm install',
    color: 'border-yellow-200 dark:border-yellow-800',
    highlight: false,
  },
];

const comparisonTable = [
  { label: '설치 속도', npm: '보통', yarn: '빠름', pnpm: '가장 빠름' },
  { label: '디스크 사용량', npm: '큼', yarn: '큼', pnpm: '작음 (심볼릭 링크)' },
  { label: 'Lock 파일', npm: 'package-lock.json', yarn: 'yarn.lock', pnpm: 'pnpm-lock.yaml' },
  { label: '설치 명령어', npm: 'npm install', yarn: 'yarn', pnpm: 'pnpm install' },
  { label: '실행 명령어', npm: 'npm run dev', yarn: 'yarn dev', pnpm: 'pnpm dev' },
  { label: '기본 제공', npm: 'Node.js 포함', yarn: '별도 설치', pnpm: '별도 설치' },
  { label: 'Monorepo', npm: 'Workspaces', yarn: 'Workspaces', pnpm: 'Workspaces (최적화)' },
];

const recommendations = [
  {
    question: '처음 배우는 초보자라면?',
    answer: 'npm',
    emoji: '📦',
    reason: '별도 설치 없이 바로 사용. 대부분의 튜토리얼이 npm 기준입니다.',
  },
  {
    question: '팀 프로젝트를 시작한다면?',
    answer: 'pnpm',
    emoji: '🏎️',
    reason: '빠른 설치 + 디스크 절약 + 유령 의존성 방지로 안정적입니다.',
  },
  {
    question: '기존 프로젝트에 참여한다면?',
    answer: '프로젝트의 lock 파일을 따르세요',
    emoji: '🔒',
    reason: 'lock 파일이 yarn.lock이면 yarn, pnpm-lock.yaml이면 pnpm을 사용합니다.',
  },
];

export function ComparisonSection() {
  return (
    <section id="comparison" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">npm vs yarn vs pnpm</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          세 가지 패키지 매니저의 특징을 비교합니다.
          어떤 것을 선택할지 결정하는 데 도움이 됩니다.
        </p>
      </ScrollReveal>

      {/* 매니저 카드 */}
      <ScrollReveal delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 max-w-4xl">
          {managers.map((m) => (
            <div key={m.name} className={`rounded-xl border p-5 bg-card shadow-sm ${m.color} ${m.highlight ? 'ring-2 ring-primary/20' : ''}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{m.emoji}</span>
                <span className="font-bold text-sm">{m.name}</span>
                {m.highlight && (
                  <Badge variant="secondary" className="text-[9px] bg-primary/10 text-primary">추천</Badge>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground mb-3">{m.tagline}</p>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{m.desc}</p>

              <div className="space-y-3 mb-3">
                <div>
                  <div className="text-[10px] font-semibold text-green-600 dark:text-green-400 mb-1">장점</div>
                  <div className="space-y-1">
                    {m.pros.map((pro) => (
                      <div key={pro} className="text-[10px] text-muted-foreground flex items-start gap-1">
                        <span className="text-green-500 shrink-0">+</span>
                        <span>{pro}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-red-500 mb-1">단점</div>
                  <div className="space-y-1">
                    {m.cons.map((con) => (
                      <div key={con} className="text-[10px] text-muted-foreground flex items-start gap-1">
                        <span className="text-red-400 shrink-0">-</span>
                        <span>{con}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t space-y-1">
                <div className="text-[10px]">
                  <span className="text-muted-foreground">Lock 파일: </span>
                  <code className="font-mono bg-muted px-1 rounded text-[10px]">{m.lockFile}</code>
                </div>
                <div className="text-[10px]">
                  <span className="text-muted-foreground">설치: </span>
                  <code className="font-mono bg-muted px-1 rounded text-[10px]">{m.installCmd}</code>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* 비교표 */}
      <ScrollReveal delay={0.15}>
        <h3 className="text-lg font-semibold mb-4">한눈에 비교</h3>
        <div className="max-w-4xl overflow-x-auto mb-10">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3 font-semibold text-muted-foreground">항목</th>
                <th className="text-left py-2 px-3 font-semibold">📦 npm</th>
                <th className="text-left py-2 px-3 font-semibold">🧶 yarn</th>
                <th className="text-left py-2 px-3 font-semibold">🏎️ pnpm</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {comparisonTable.map((row) => (
                <tr key={row.label} className="border-b">
                  <td className="py-2 px-3 font-medium text-foreground">{row.label}</td>
                  <td className="py-2 px-3">{row.npm}</td>
                  <td className="py-2 px-3">{row.yarn}</td>
                  <td className="py-2 px-3">{row.pnpm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ScrollReveal>

      {/* 추천 */}
      <ScrollReveal delay={0.2}>
        <h3 className="text-lg font-semibold mb-4">어떤 걸 써야 할까?</h3>
        <div className="max-w-2xl space-y-3 mb-6">
          {recommendations.map((item) => (
            <div key={item.question} className="rounded-lg border bg-card shadow-sm p-4">
              <div className="text-sm font-medium mb-2">Q. {item.question}</div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{item.emoji}</span>
                <span className="text-sm font-bold text-primary">{item.answer}</span>
              </div>
              <p className="text-xs text-muted-foreground">{item.reason}</p>
            </div>
          ))}
        </div>

        <div className="p-3 rounded-lg bg-muted/50 border max-w-2xl">
          <p className="text-xs text-muted-foreground">
            💡 <strong className="text-foreground">결론:</strong> 처음이라면 <strong className="text-foreground">npm</strong>으로 시작하세요.
            프로젝트가 커지거나 팀으로 일하게 되면 <strong className="text-foreground">pnpm</strong>으로 전환을 고려해보세요.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
