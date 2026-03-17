'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Badge } from '@/components/ui/badge';

const shadcnSteps = [
  {
    step: 1,
    title: '프로젝트 초기화',
    code: 'npx shadcn@latest init',
    desc: 'tailwind.config, globals.css, utils.ts 등을 자동 설정합니다.',
  },
  {
    step: 2,
    title: '컴포넌트 추가',
    code: 'npx shadcn@latest add button card input',
    desc: '필요한 컴포넌트만 골라서 추가합니다. 코드가 프로젝트에 직접 복사됩니다.',
  },
  {
    step: 3,
    title: '바로 사용',
    code: "import { Button } from '@/components/ui/button';\n\n<Button variant=\"default\">저장하기</Button>",
    desc: '추가한 컴포넌트를 import해서 바로 사용합니다.',
  },
];

const cardLayoutCode = `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div class="rounded-xl border bg-card shadow-sm p-6">
    <h3 class="text-lg font-bold mb-2">카드 제목</h3>
    <p class="text-sm text-muted-foreground mb-4">
      카드 설명 텍스트가 여기에 들어갑니다.
    </p>
    <Button variant="default" size="sm">자세히 보기</Button>
  </div>
  {/* 같은 구조로 카드 반복 */}
</div>`;

const recommendedStack = [
  { name: 'Tailwind CSS', role: '스타일링', desc: '유틸리티 클래스로 빠른 스타일링' },
  { name: 'shadcn/ui', role: '컴포넌트', desc: '버튼, 카드, 다이얼로그 등 기본 UI' },
  { name: 'lucide-react', role: '아이콘', desc: '깔끔한 라인 아이콘 800개+' },
  { name: 'next-themes', role: '다크 모드', desc: '시스템·수동 다크 모드 전환' },
];

export function QuickStartSection() {
  return (
    <section id="quick-start" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">빠르게 시작하기</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          <strong className="text-foreground">Tailwind CSS + shadcn/ui</strong> 조합이면
          디자이너 없이도 깔끔한 UI를 빠르게 만들 수 있습니다.
        </p>
      </ScrollReveal>

      {/* 추천 조합 */}
      <ScrollReveal delay={0.1}>
        <h3 className="text-lg font-semibold mb-4">추천 스택</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10 max-w-2xl">
          {recommendedStack.map((item) => (
            <div key={item.name} className="rounded-lg border bg-card shadow-sm p-4 flex items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold">{item.name}</span>
                  <Badge variant="secondary" className="text-[10px]">{item.role}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* shadcn/ui 설치 단계 */}
      <ScrollReveal delay={0.15}>
        <h3 className="text-lg font-semibold mb-4">shadcn/ui 설치 3단계</h3>
        <div className="space-y-4 mb-10 max-w-2xl">
          {shadcnSteps.map((item) => (
            <div key={item.step} className="rounded-xl border bg-card shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b bg-muted/50 flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                  {item.step}
                </span>
                <span className="text-sm font-semibold">{item.title}</span>
              </div>
              <div className="p-4">
                <pre className="text-xs overflow-x-auto mb-2">
                  <code className="text-muted-foreground">{item.code}</code>
                </pre>
                <p className="text-[10px] text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* 실전 카드 레이아웃 */}
      <ScrollReveal delay={0.2}>
        <h3 className="text-lg font-semibold mb-4">실전: 카드 그리드 레이아웃</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-2xl">
          Tailwind의 <code className="text-[11px] bg-muted px-1 rounded font-mono">grid</code>와
          shadcn/ui 스타일을 조합하면 반응형 카드 레이아웃을 쉽게 만들 수 있습니다.
        </p>
        <div className="max-w-2xl rounded-xl border bg-card shadow-sm overflow-hidden mb-6">
          <div className="px-4 py-3 border-b bg-muted/50 flex items-center justify-between">
            <span className="text-sm font-semibold">반응형 카드 그리드</span>
            <span className="text-[10px] text-muted-foreground">모바일 1열 → 태블릿 2열 → 데스크톱 3열</span>
          </div>
          <pre className="p-4 text-xs overflow-x-auto">
            <code className="text-muted-foreground">{cardLayoutCode}</code>
          </pre>
        </div>

        <div className="p-3 rounded-lg bg-muted/50 border max-w-2xl">
          <p className="text-xs text-muted-foreground">
            💡 <strong className="text-foreground">다음 단계:</strong> 각 하위 가이드에서 Tailwind CSS 클래스 상세,
            shadcn/ui 컴포넌트 활용, 반응형 레이아웃 실전 예제를 더 깊이 다룹니다.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
