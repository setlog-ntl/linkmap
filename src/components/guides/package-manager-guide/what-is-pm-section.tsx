'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Badge } from '@/components/ui/badge';

const analogies = [
  {
    emoji: '📱',
    concept: '앱스토어',
    pm: '패키지 매니저',
    desc: '앱스토어에서 앱을 검색하고 설치하듯, 패키지 매니저로 라이브러리를 검색하고 설치합니다.',
  },
  {
    emoji: '📂',
    concept: '앱 목록',
    pm: 'package.json',
    desc: '스마트폰에 설치된 앱 목록처럼, package.json은 프로젝트에 설치된 패키지 목록입니다.',
  },
  {
    emoji: '💾',
    concept: '앱 데이터',
    pm: 'node_modules',
    desc: '앱이 차지하는 저장 공간처럼, node_modules 폴더에 실제 패키지 파일이 저장됩니다.',
  },
];

const whyNpm = [
  { title: 'Node.js에 기본 포함', desc: 'Node.js를 설치하면 npm이 자동으로 함께 설치됩니다.' },
  { title: '가장 큰 레지스트리', desc: '200만 개 이상의 패키지가 등록된 세계 최대 패키지 저장소입니다.' },
  { title: '풍부한 자료', desc: '가장 오래되고 많이 사용되어 검색하면 답이 바로 나옵니다.' },
  { title: '표준 도구', desc: '대부분의 튜토리얼과 문서가 npm 기준으로 작성되어 있습니다.' },
];

export function WhatIsPmSection() {
  return (
    <section id="what-is-pm" className="scroll-mt-24 py-12 md:py-16">
      {/* 패키지 매니저란? */}
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">패키지 매니저란?</h2>
        <p className="text-muted-foreground mb-4 max-w-2xl leading-relaxed">
          <strong className="text-foreground">패키지 매니저</strong>는 다른 개발자가 만든 코드(패키지, 라이브러리)를
          쉽게 설치하고 관리해주는 도구입니다. 직접 코드를 다운로드하고 복사할 필요 없이,
          명령어 한 줄이면 됩니다.
        </p>
        <div className="max-w-2xl mb-10">
          <div className="rounded-lg border bg-card shadow-sm p-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              📱 <strong className="text-foreground">실생활 비유:</strong> 스마트폰의 앱스토어와 같습니다.
              앱스토어에서 앱을 검색하고 &quot;설치&quot; 버튼을 누르듯,
              패키지 매니저에서 <code className="text-xs bg-muted px-1 rounded font-mono">npm install react</code>를
              입력하면 React가 설치됩니다.
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* 비유 카드 */}
      <ScrollReveal delay={0.1}>
        <h3 className="text-lg font-semibold mb-4">앱스토어 비유로 이해하기</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 max-w-3xl">
          {analogies.map((a) => (
            <div key={a.concept} className="rounded-xl border bg-card shadow-sm p-5">
              <div className="text-2xl mb-2">{a.emoji}</div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-[10px]">{a.concept}</Badge>
                <span className="text-[10px] text-muted-foreground">=</span>
                <Badge variant="outline" className="text-[10px]">{a.pm}</Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* node_modules 설명 */}
      <ScrollReveal delay={0.15}>
        <h3 className="text-lg font-semibold mb-2">node_modules 폴더란?</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-2xl">
          <code className="text-xs bg-muted px-1 rounded font-mono">npm install</code>을 실행하면
          프로젝트 폴더에 <code className="text-xs bg-muted px-1 rounded font-mono">node_modules</code> 폴더가 생깁니다.
          여기에 설치한 패키지의 실제 코드가 저장됩니다.
        </p>

        <div className="max-w-md mb-8">
          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="text-xs font-mono space-y-1 text-muted-foreground">
              <div className="text-foreground font-semibold">my-project/</div>
              <div className="pl-4">├── node_modules/ <span className="text-primary">← 설치된 패키지 (Git 제외)</span></div>
              <div className="pl-4">├── package.json <span className="text-primary">← 패키지 목록</span></div>
              <div className="pl-4">├── package-lock.json <span className="text-primary">← 정확한 버전 기록</span></div>
              <div className="pl-4">└── src/</div>
            </div>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-muted/50 border max-w-2xl mb-10">
          <p className="text-xs text-muted-foreground">
            💡 <strong className="text-foreground">중요:</strong> node_modules는 Git에 올리지 않습니다.
            <code className="text-xs bg-muted px-1 rounded font-mono">.gitignore</code>에 추가하고,
            다른 팀원은 <code className="text-xs bg-muted px-1 rounded font-mono">npm install</code>로 다시 설치합니다.
          </p>
        </div>
      </ScrollReveal>

      {/* npm이 가장 대중적인 이유 */}
      <ScrollReveal delay={0.2}>
        <h3 className="text-lg font-semibold mb-4">npm이 가장 대중적인 이유</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
          {whyNpm.map((item) => (
            <div key={item.title} className="rounded-lg border bg-card p-4">
              <div className="text-sm font-semibold mb-1">{item.title}</div>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
