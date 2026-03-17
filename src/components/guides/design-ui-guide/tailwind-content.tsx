'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Badge } from '@/components/ui/badge';
import { Paintbrush } from 'lucide-react';

const utilityCategories = [
  {
    category: '레이아웃',
    classes: [
      { name: 'flex', desc: 'Flexbox 컨테이너' },
      { name: 'grid', desc: 'Grid 컨테이너' },
      { name: 'hidden', desc: '숨김 처리' },
      { name: 'block', desc: '블록 요소' },
    ],
  },
  {
    category: '색상',
    classes: [
      { name: 'bg-blue-600', desc: '배경색' },
      { name: 'text-white', desc: '글자색' },
      { name: 'border-gray-200', desc: '테두리색' },
      { name: 'bg-primary', desc: '테마 배경색' },
    ],
  },
  {
    category: '크기',
    classes: [
      { name: 'w-full', desc: '너비 100%' },
      { name: 'h-screen', desc: '화면 높이' },
      { name: 'max-w-xl', desc: '최대 너비 제한' },
      { name: 'min-h-0', desc: '최소 높이 제거' },
    ],
  },
  {
    category: '테두리',
    classes: [
      { name: 'rounded-lg', desc: '둥근 모서리' },
      { name: 'border', desc: '테두리 추가' },
      { name: 'shadow-sm', desc: '작은 그림자' },
      { name: 'ring-2', desc: '포커스 링' },
    ],
  },
  {
    category: '효과',
    classes: [
      { name: 'opacity-50', desc: '반투명' },
      { name: 'transition-colors', desc: '색상 전환 애니메이션' },
      { name: 'hover:bg-blue-700', desc: '호버 시 배경색 변경' },
      { name: 'cursor-pointer', desc: '포인터 커서' },
    ],
  },
];

const breakpoints = [
  { prefix: '(기본)', minWidth: '0px', target: '모바일', desc: '접두사 없이 작성 = 모든 화면에 적용' },
  { prefix: 'sm:', minWidth: '640px', target: '큰 모바일', desc: '640px 이상에서 적용' },
  { prefix: 'md:', minWidth: '768px', target: '태블릿', desc: '768px 이상에서 적용' },
  { prefix: 'lg:', minWidth: '1024px', target: '노트북', desc: '1024px 이상에서 적용' },
  { prefix: 'xl:', minWidth: '1280px', target: '데스크톱', desc: '1280px 이상에서 적용' },
  { prefix: '2xl:', minWidth: '1536px', target: '큰 모니터', desc: '1536px 이상에서 적용' },
];

const frequentCombos = [
  { name: '중앙 정렬 컨테이너', code: 'max-w-4xl mx-auto px-4' },
  { name: '플렉스 가로 정렬', code: 'flex items-center gap-2' },
  { name: '플렉스 세로 정렬', code: 'flex flex-col gap-4' },
  { name: '양쪽 정렬', code: 'flex items-center justify-between' },
  { name: '카드 스타일', code: 'rounded-xl border bg-card shadow-sm p-6' },
  { name: '버튼 기본', code: 'bg-primary text-primary-foreground px-4 py-2 rounded-lg' },
  { name: '뱃지/태그', code: 'text-xs px-2 py-0.5 rounded-full bg-muted' },
  { name: '입력 필드', code: 'w-full rounded-md border px-3 py-2 text-sm' },
  { name: '호버 효과', code: 'hover:bg-muted transition-colors cursor-pointer' },
  { name: '텍스트 줄임', code: 'truncate max-w-[200px]' },
];

export function TailwindContent() {
  return (
    <div className="py-6 space-y-0">
      {/* 헤더 */}
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Paintbrush className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Tailwind CSS 시작하기</h1>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          Tailwind CSS의 유틸리티 클래스를 카테고리별로 정리했습니다.
          반응형 접두사, 다크 모드, 자주 쓰는 조합까지 한 번에 익혀보세요.
        </p>
      </ScrollReveal>

      {/* 유틸리티 클래스 카테고리별 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">유틸리티 클래스 분류</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            Tailwind 클래스는 역할별로 분류됩니다. 자주 쓰는 클래스를 카테고리별로 정리했습니다.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 max-w-4xl">
          {utilityCategories.map((cat, idx) => (
            <ScrollReveal key={cat.category} delay={idx * 0.08}>
              <div className="rounded-xl border bg-card shadow-sm p-5 h-full">
                <div className="font-bold text-sm mb-3">
                  <Badge variant="secondary" className="text-[10px]">{cat.category}</Badge>
                </div>
                <div className="space-y-2">
                  {cat.classes.map((cls) => (
                    <div key={cls.name} className="flex items-center gap-2">
                      <code className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded shrink-0">{cls.name}</code>
                      <span className="text-[10px] text-muted-foreground">{cls.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 반응형 접두사 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">반응형 접두사</h2>
          <p className="text-muted-foreground mb-4 max-w-2xl text-sm">
            Tailwind는 <strong className="text-foreground">모바일 퍼스트</strong>입니다.
            기본 스타일은 모바일용이고, 접두사를 붙여 큰 화면에서 스타일을 덮어씁니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-3xl overflow-x-auto mb-6">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-2 px-3 font-semibold text-muted-foreground">접두사</th>
                  <th className="text-left py-2 px-3 font-semibold text-muted-foreground">최소 너비</th>
                  <th className="text-left py-2 px-3 font-semibold text-muted-foreground">대상 기기</th>
                  <th className="text-left py-2 px-3 font-semibold text-muted-foreground">설명</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {breakpoints.map((bp) => (
                  <tr key={bp.prefix} className="border-b last:border-b-0">
                    <td className="py-2 px-3">
                      <code className="text-[10px] font-mono bg-muted px-1 rounded font-bold">{bp.prefix}</code>
                    </td>
                    <td className="py-2 px-3 font-mono text-[10px]">{bp.minWidth}</td>
                    <td className="py-2 px-3 font-medium text-foreground">{bp.target}</td>
                    <td className="py-2 px-3">{bp.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="max-w-2xl rounded-xl border bg-card shadow-sm overflow-hidden mb-6">
            <div className="px-4 py-3 border-b bg-muted/50">
              <span className="text-sm font-semibold">예시: 반응형 글자 크기</span>
            </div>
            <pre className="p-4 text-xs overflow-x-auto">
              <code className="text-muted-foreground">{'<h1 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl">\n  반응형 제목\n</h1>\n\n{/* 모바일: 20px → 큰 모바일: 24px → 태블릿: 30px → 노트북: 36px */}'}</code>
            </pre>
          </div>
        </ScrollReveal>
      </section>

      {/* 다크 모드 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">다크 모드</h2>
          <p className="text-muted-foreground mb-4 max-w-2xl text-sm">
            <code className="text-[11px] bg-muted px-1 rounded font-mono">dark:</code> 접두사를 붙이면
            다크 모드일 때만 적용되는 스타일을 지정할 수 있습니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl rounded-xl border bg-card shadow-sm overflow-hidden mb-6">
            <div className="px-4 py-3 border-b bg-muted/50">
              <span className="text-sm font-semibold">다크 모드 예시</span>
            </div>
            <pre className="p-4 text-xs overflow-x-auto">
              <code className="text-muted-foreground">{'<div class="bg-white dark:bg-gray-900">\n  <h2 class="text-gray-900 dark:text-white">제목</h2>\n  <p class="text-gray-600 dark:text-gray-400">설명</p>\n  <div class="border-gray-200 dark:border-gray-700">\n    라이트/다크 모두 대응\n  </div>\n</div>'}</code>
            </pre>
          </div>

          <div className="p-3 rounded-lg bg-muted/50 border max-w-2xl mb-6">
            <p className="text-xs text-muted-foreground">
              💡 <strong className="text-foreground">팁:</strong> shadcn/ui의 CSS 변수 시스템(
              <code className="text-[10px] font-mono bg-muted px-1 rounded">bg-background</code>,
              <code className="text-[10px] font-mono bg-muted px-1 rounded">text-foreground</code>)을 사용하면
              <code className="text-[10px] font-mono bg-muted px-1 rounded">dark:</code> 접두사 없이도 자동 전환됩니다.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* 자주 쓰는 클래스 조합 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">자주 쓰는 클래스 조합 10가지</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            실무에서 매일 사용하는 Tailwind 클래스 조합입니다. 이 10가지만 외우면 대부분의 레이아웃을 만들 수 있습니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl space-y-2">
            {frequentCombos.map((combo, i) => (
              <div key={combo.name} className="rounded-lg border bg-card shadow-sm p-3 flex items-center gap-4">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium mb-0.5">{combo.name}</div>
                  <code className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded break-all">
                    {combo.code}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
