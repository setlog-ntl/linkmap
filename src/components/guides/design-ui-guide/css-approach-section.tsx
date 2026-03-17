'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Badge } from '@/components/ui/badge';

const cssApproaches = [
  {
    name: 'Vanilla CSS',
    emoji: '📝',
    desc: '순수 CSS 파일을 직접 작성합니다. 모든 웹 브라우저가 기본 지원하지만 클래스 이름 충돌, 파일 관리가 어렵습니다.',
    pros: ['별도 설치 불필요', '브라우저 기본 지원'],
    cons: ['클래스 이름 충돌 위험', '파일이 점점 커짐', '재사용 어려움'],
    difficulty: '중간',
    tagColor: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
    color: 'border-gray-200 dark:border-gray-700',
  },
  {
    name: 'CSS Modules',
    emoji: '📦',
    desc: '컴포넌트별로 CSS 파일을 분리하고, 클래스 이름이 자동으로 고유해집니다. Next.js에서 기본 지원합니다.',
    pros: ['클래스 충돌 없음', 'Next.js 기본 지원', '컴포넌트 단위 관리'],
    cons: ['CSS 작성량 여전히 많음', '동적 스타일 불편', '파일 수가 많아짐'],
    difficulty: '중간',
    tagColor: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300',
    color: 'border-blue-200 dark:border-blue-800',
  },
  {
    name: 'Tailwind CSS',
    emoji: '🌊',
    desc: 'HTML에 직접 유틸리티 클래스를 넣어 스타일링합니다. CSS 파일을 거의 작성하지 않아도 되고 빌드 시 사용한 클래스만 남겨 파일 크기가 작습니다.',
    pros: ['CSS 파일 거의 불필요', '빌드 결과 매우 작음', '디자인 시스템 내장', '다크 모드·반응형 간편'],
    cons: ['HTML이 길어질 수 있음', '초반 학습 곡선'],
    difficulty: '쉬움',
    tagColor: 'bg-cyan-100 dark:bg-cyan-900/60 text-cyan-700 dark:text-cyan-300',
    color: 'border-cyan-200 dark:border-cyan-800',
    recommended: true,
  },
];

const tailwindReasons = [
  {
    emoji: '⚡',
    title: '개발 속도',
    desc: 'CSS 파일을 오가지 않고 HTML에서 바로 스타일링. 별도 클래스 이름을 고민할 필요가 없습니다.',
  },
  {
    emoji: '📏',
    title: '일관된 디자인',
    desc: '4px 단위 간격, 정해진 색상 팔레트 등 디자인 시스템이 기본 내장되어 있습니다.',
  },
  {
    emoji: '🌙',
    title: '다크 모드 + 반응형',
    desc: 'dark:, sm:, md: 접두사만 붙이면 다크 모드와 반응형이 끝납니다. 별도 미디어 쿼리 불필요.',
  },
];

const tailwindExamples = [
  {
    title: '버튼 만들기',
    code: '<button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">\n  저장하기\n</button>',
    desc: '배경색, 글자색, 여백, 둥근 모서리, 호버 효과를 한 줄로',
  },
  {
    title: '카드 만들기',
    code: '<div class="rounded-xl border bg-card shadow-sm p-6">\n  <h3 class="text-lg font-bold mb-2">제목</h3>\n  <p class="text-sm text-muted-foreground">설명 텍스트</p>\n</div>',
    desc: '테두리, 배경, 그림자, 여백으로 카드 레이아웃 완성',
  },
];

export function CssApproachSection() {
  return (
    <section id="css-approach" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">CSS 접근법</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          웹 스타일링에는 여러 방법이 있습니다. 각 접근법의 장단점을 비교하고,
          왜 <strong className="text-foreground">Tailwind CSS</strong>가 바이브 코딩에 최적인지 알아봅시다.
        </p>
      </ScrollReveal>

      {/* 3가지 접근법 비교 */}
      <ScrollReveal delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 max-w-4xl">
          {cssApproaches.map((item) => (
            <div
              key={item.name}
              className={`rounded-xl border p-5 bg-card shadow-sm ${item.color} ${item.recommended ? 'ring-2 ring-primary/20' : ''}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{item.emoji}</span>
                <span className="font-bold text-sm">{item.name}</span>
                {item.recommended && (
                  <Badge variant="secondary" className="text-[9px] bg-primary/10 text-primary">추천</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{item.desc}</p>
              <div className="space-y-2 mb-3">
                <div>
                  <div className="text-[10px] font-semibold text-green-600 dark:text-green-400 mb-1">장점</div>
                  {item.pros.map((pro) => (
                    <div key={pro} className="text-[10px] text-muted-foreground flex items-start gap-1">
                      <span className="text-green-500 shrink-0">+</span>
                      <span>{pro}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-red-500 mb-1">단점</div>
                  {item.cons.map((con) => (
                    <div key={con} className="text-[10px] text-muted-foreground flex items-start gap-1">
                      <span className="text-red-400 shrink-0">-</span>
                      <span>{con}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-3 border-t border-current/10">
                <Badge variant="secondary" className={`text-[10px] ${item.tagColor}`}>
                  난이도: {item.difficulty}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* Tailwind 추천 이유 */}
      <ScrollReveal delay={0.15}>
        <h3 className="text-lg font-semibold mb-4">Tailwind CSS를 추천하는 이유</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 max-w-3xl">
          {tailwindReasons.map((reason) => (
            <div key={reason.title} className="rounded-xl border bg-card shadow-sm p-5">
              <div className="text-2xl mb-2">{reason.emoji}</div>
              <div className="font-bold text-sm mb-1">{reason.title}</div>
              <p className="text-xs text-muted-foreground leading-relaxed">{reason.desc}</p>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* Tailwind 예시 */}
      <ScrollReveal delay={0.2}>
        <h3 className="text-lg font-semibold mb-4">간단한 Tailwind 예시</h3>
        <div className="space-y-4 max-w-2xl">
          {tailwindExamples.map((ex) => (
            <div key={ex.title} className="rounded-xl border bg-card shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b bg-muted/50 flex items-center justify-between">
                <span className="text-sm font-semibold">{ex.title}</span>
                <span className="text-[10px] text-muted-foreground">{ex.desc}</span>
              </div>
              <pre className="p-4 text-xs overflow-x-auto">
                <code className="text-muted-foreground">{ex.code}</code>
              </pre>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
