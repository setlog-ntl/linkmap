'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Badge } from '@/components/ui/badge';
import { Component } from 'lucide-react';

const popularComponents = [
  { name: 'Button', desc: '다양한 variant(default, outline, ghost, destructive)와 size 지원', usage: '가장 많이 사용' },
  { name: 'Card', desc: 'CardHeader, CardContent, CardFooter로 구성. 정보 그룹핑에 사용', usage: '레이아웃 필수' },
  { name: 'Dialog', desc: '모달 팝업. Trigger와 Content로 구성. 확인/입력 폼에 적합', usage: '인터랙션' },
  { name: 'Input', desc: '텍스트 입력 필드. Label, FormMessage와 함께 사용', usage: '폼 필수' },
  { name: 'Select', desc: '드롭다운 선택. Trigger, Content, Item으로 구성', usage: '폼 선택' },
  { name: 'Badge', desc: '상태 표시 태그. variant로 색상 변경', usage: '상태 표시' },
  { name: 'Toast (Sonner)', desc: '하단 알림 메시지. toast() 함수로 호출', usage: '알림' },
  { name: 'Tabs', desc: '탭 네비게이션. TabsList, TabsTrigger, TabsContent로 구성', usage: '콘텐츠 분리' },
  { name: 'Dropdown Menu', desc: '우클릭 또는 버튼 메뉴. 계층 구조 지원', usage: '메뉴' },
  { name: 'Separator', desc: '수평/수직 구분선. 섹션 사이 구분에 사용', usage: '구분' },
];

const installSteps = [
  {
    step: 1,
    title: '초기 설정',
    code: 'npx shadcn@latest init',
    desc: 'components.json, CSS 변수, utils.ts가 자동 생성됩니다. 프로젝트당 한 번만 실행합니다.',
  },
  {
    step: 2,
    title: '컴포넌트 추가',
    code: 'npx shadcn@latest add button\nnpx shadcn@latest add card dialog input',
    desc: '필요한 컴포넌트를 하나씩 또는 여러 개 한 번에 추가합니다. src/components/ui/ 폴더에 코드가 복사됩니다.',
  },
  {
    step: 3,
    title: '커스터마이즈',
    code: '// src/components/ui/button.tsx를 직접 수정\n// 프로젝트에 맞게 variant, size 등을 추가/변경 가능',
    desc: '복사된 코드이므로 자유롭게 수정할 수 있습니다. npm 패키지와 달리 제약이 없습니다.',
  },
];

const radixPrimitives = [
  { name: 'Dialog', desc: '모달/팝업의 열기·닫기, 오버레이, 포커스 트랩 등 로직 처리' },
  { name: 'Popover', desc: '버튼 클릭 시 팝업, 위치 자동 계산, 외부 클릭 닫기' },
  { name: 'Tooltip', desc: '호버 시 말풍선, 지연 시간, 위치 자동 조정' },
  { name: 'Accordion', desc: '접기/펼치기 애니메이션, 키보드 네비게이션' },
  { name: 'Select', desc: '드롭다운 위치 계산, 키보드 탐색, 스크린 리더 대응' },
];

export function ComponentsContent() {
  return (
    <div className="py-6 space-y-0">
      {/* 헤더 */}
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Component className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">컴포넌트 라이브러리</h1>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          shadcn/ui는 &quot;복사해서 쓰는&quot; 컴포넌트 컬렉션입니다.
          npm 패키지가 아니라 코드를 프로젝트에 직접 넣기 때문에 자유롭게 수정할 수 있습니다.
        </p>
      </ScrollReveal>

      {/* shadcn/ui란? */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">shadcn/ui란?</h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl mb-8">
            <div className="rounded-xl border bg-card p-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📦</span>
                  <div>
                    <div className="font-medium text-sm">일반 UI 라이브러리</div>
                    <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      npm install로 설치.<br />
                      node_modules에 숨겨짐.<br />
                      커스터마이즈 제한적.
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✂️</span>
                  <div>
                    <div className="font-medium text-sm">shadcn/ui</div>
                    <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      CLI로 코드 복사.<br />
                      내 프로젝트에 직접 존재.<br />
                      자유롭게 수정 가능.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 설치 방법 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">설치 방법</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            3단계로 shadcn/ui를 프로젝트에 추가합니다.
          </p>
        </ScrollReveal>

        <div className="space-y-4 mb-8 max-w-2xl">
          {installSteps.map((item, idx) => (
            <ScrollReveal key={item.step} delay={idx * 0.08}>
              <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
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
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 자주 쓰는 컴포넌트 10개 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">자주 쓰는 컴포넌트 10개</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            실무에서 가장 많이 사용하는 shadcn/ui 컴포넌트입니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl space-y-2">
            {popularComponents.map((comp, i) => (
              <div key={comp.name} className="rounded-lg border bg-card shadow-sm p-3 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <code className="text-sm font-mono font-bold">{comp.name}</code>
                    <Badge variant="secondary" className="text-[9px]">{comp.usage}</Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{comp.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Radix UI Primitives */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">Radix UI Primitives</h2>
          <p className="text-muted-foreground mb-4 max-w-2xl text-sm">
            shadcn/ui는 내부적으로 <strong className="text-foreground">Radix UI</strong>를 기반으로 합니다.
            Radix는 스타일 없이 동작과 접근성만 제공하는 &quot;헤드리스(Headless)&quot; 컴포넌트입니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl rounded-xl border bg-card shadow-sm overflow-hidden mb-6">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-2 px-3 font-semibold text-muted-foreground">Radix Primitive</th>
                  <th className="text-left py-2 px-3 font-semibold text-muted-foreground">자동 처리해주는 것</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {radixPrimitives.map((p) => (
                  <tr key={p.name} className="border-b last:border-b-0">
                    <td className="py-2 px-3 font-medium text-foreground">
                      <code className="text-[10px] font-mono">{p.name}</code>
                    </td>
                    <td className="py-2 px-3">{p.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 rounded-lg bg-muted/50 border max-w-2xl">
            <p className="text-xs text-muted-foreground">
              💡 <strong className="text-foreground">핵심:</strong> shadcn/ui = Radix UI(동작) + Tailwind CSS(스타일).
              Radix가 키보드 네비게이션, 스크린 리더, 포커스 관리를 처리하므로 접근성 걱정 없이 스타일만 신경 쓰면 됩니다.
            </p>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
