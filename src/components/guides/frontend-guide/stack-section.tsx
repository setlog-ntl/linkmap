'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';

const stacks = [
  {
    name: 'HTML / CSS / JS',
    emoji: '🌐',
    level: '기초',
    desc: '모든 프론트엔드의 뿌리. 브라우저가 직접 이해하는 언어.',
    tags: ['웹 표준', '기초 필수'],
    color: 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800',
  },
  {
    name: 'React',
    emoji: '⚛️',
    level: '핵심',
    desc: 'Meta가 만든 UI 라이브러리. 컴포넌트 기반. 전 세계에서 가장 많이 씀.',
    tags: ['컴포넌트', 'JSX', 'Hooks'],
    color: 'bg-cyan-50 dark:bg-cyan-950/30 border-cyan-200 dark:border-cyan-800',
  },
  {
    name: 'Next.js',
    emoji: '▲',
    level: '추천',
    desc: 'React 위에 올라가는 풀스택 프레임워크. SSR·SSG·API Routes 내장.',
    tags: ['App Router', 'SSR/SSG', 'Vercel'],
    color: 'bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700',
  },
  {
    name: 'Tailwind CSS',
    emoji: '🎨',
    level: '필수',
    desc: '유틸리티 클래스로 CSS를 작성하는 방식. 빠르고 일관된 스타일링.',
    tags: ['유틸리티 클래스', 'JIT'],
    color: 'bg-sky-50 dark:bg-sky-950/30 border-sky-200 dark:border-sky-800',
  },
  {
    name: 'TypeScript',
    emoji: '🔷',
    level: '권장',
    desc: 'JavaScript에 타입을 추가한 언어. 버그를 미리 잡고 코드 완성도를 높임.',
    tags: ['타입 안전', '자동완성'],
    color: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
  },
  {
    name: 'shadcn/ui',
    emoji: '🧩',
    level: '실전',
    desc: '복사 붙여넣기 방식의 컴포넌트 모음. AI 코드와 잘 어울림.',
    tags: ['Radix UI', 'Tailwind'],
    color: 'bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-800',
  },
];

const levelColors: Record<string, string> = {
  기초: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
  핵심: 'bg-cyan-100 dark:bg-cyan-900/60 text-cyan-700 dark:text-cyan-300',
  추천: 'bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300',
  필수: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300',
  권장: 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300',
  실전: 'bg-orange-100 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300',
};

export function StackSection() {
  return (
    <section id="stack" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">대표 프론트엔드 스택</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          AI 코드 생성에서 가장 많이 등장하는 기술들입니다.
          이름과 역할만 알아도 코드를 읽는 게 훨씬 쉬워집니다.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stacks.map((s) => (
            <div key={s.name} className={`rounded-xl border p-5 ${s.color}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{s.emoji}</span>
                  <span className="font-bold text-sm">{s.name}</span>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${levelColors[s.level]}`}>
                  {s.level}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{s.desc}</p>
              <div className="flex flex-wrap gap-1">
                {s.tags.map((tag) => (
                  <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-background/60 border">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <div className="mt-8 rounded-lg border bg-muted/30 p-5 max-w-2xl">
          <h3 className="font-semibold text-sm mb-2">🚀 바이브 코딩 추천 조합</h3>
          <div className="flex flex-wrap gap-2">
            {['Next.js', 'TypeScript', 'Tailwind CSS', 'shadcn/ui'].map((t) => (
              <span key={t} className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                {t}
              </span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
            이 조합은 AI가 코드를 가장 잘 생성하고, 문서가 풍부하며, 취업 시장에서도 높은 수요를 갖습니다.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
