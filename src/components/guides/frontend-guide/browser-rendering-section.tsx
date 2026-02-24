'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Card, CardContent } from '@/components/ui/card';

const steps = [
  {
    step: 1,
    emoji: '📝',
    label: 'HTML 파싱',
    desc: '브라우저가 HTML 파일을 읽어 태그를 분석합니다',
    color: 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800',
    labelColor: 'text-orange-700 dark:text-orange-300',
  },
  {
    step: 2,
    emoji: '🌳',
    label: 'DOM 트리 생성',
    desc: '<div>, <p>, <button> 등 요소를 계층 구조로 만듭니다',
    color: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800',
    labelColor: 'text-green-700 dark:text-green-300',
  },
  {
    step: 3,
    emoji: '🎨',
    label: 'CSS 적용',
    desc: '색상·크기·위치 스타일을 각 요소에 입힙니다',
    color: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
    labelColor: 'text-blue-700 dark:text-blue-300',
  },
  {
    step: 4,
    emoji: '📐',
    label: '레이아웃 계산',
    desc: '각 요소가 화면에서 차지할 위치와 크기를 계산합니다',
    color: 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800',
    labelColor: 'text-purple-700 dark:text-purple-300',
  },
  {
    step: 5,
    emoji: '🖼️',
    label: '화면에 그리기',
    desc: '픽셀 단위로 화면에 최종 결과를 그립니다',
    color: 'bg-pink-50 dark:bg-pink-950/30 border-pink-200 dark:border-pink-800',
    labelColor: 'text-pink-700 dark:text-pink-300',
  },
];

const htmlExample = `<div class="card">
  <h1>안녕하세요</h1>
  <button>클릭</button>
</div>`;

const cssExample = `.card {
  padding: 16px;
  border-radius: 8px;
  background: white;
}`;

const jsExample = `button.addEventListener('click', () => {
  alert('클릭했어요!');
});`;

export function BrowserRenderingSection() {
  return (
    <section id="browser-rendering" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">브라우저는 어떻게 화면을 그릴까?</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          URL을 입력하고 엔터를 누르면 브라우저는 아래 과정을 순서대로 실행해서 화면을 만듭니다.
        </p>
      </ScrollReveal>

      {/* 렌더링 파이프라인 */}
      <ScrollReveal delay={0.1}>
        <div className="overflow-x-auto pb-2 mb-10">
          <div className="flex items-stretch gap-0 min-w-max">
            {steps.map((s, i) => (
              <div key={s.step} className="flex items-stretch">
                <div className={`rounded-xl border p-4 w-36 flex flex-col items-center text-center gap-2 ${s.color}`}>
                  <div className="text-2xl">{s.emoji}</div>
                  <div className={`text-xs font-bold ${s.labelColor}`}>{s.label}</div>
                  <div className="text-[10px] text-muted-foreground leading-relaxed">{s.desc}</div>
                </div>
                {i < steps.length - 1 && (
                  <div className="flex items-center px-1">
                    <svg className="w-5 h-4 text-muted-foreground/40" viewBox="0 0 20 16" fill="none">
                      <path d="M0 8h14m0 0-5-4m5 4-5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* HTML · CSS · JS 코드 예시 */}
      <ScrollReveal delay={0.15}>
        <h3 className="text-lg font-semibold mb-4">HTML · CSS · JS 역할 비교</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'HTML — 구조', lang: 'html', code: htmlExample, color: 'border-orange-300 dark:border-orange-700', badge: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300' },
            { title: 'CSS — 스타일', lang: 'css', code: cssExample, color: 'border-blue-300 dark:border-blue-700', badge: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' },
            { title: 'JS — 동작', lang: 'javascript', code: jsExample, color: 'border-yellow-300 dark:border-yellow-700', badge: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300' },
          ].map((item) => (
            <Card key={item.title} className={`border-2 ${item.color}`}>
              <CardContent className="pt-4 pb-4">
                <div className={`inline-block text-xs font-semibold px-2 py-0.5 rounded mb-3 ${item.badge}`}>
                  {item.title}
                </div>
                <pre className="text-xs font-mono bg-muted rounded-lg p-3 overflow-x-auto leading-relaxed whitespace-pre-wrap">
                  {item.code}
                </pre>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <div className="mt-6 p-4 rounded-lg bg-muted/50 border max-w-2xl">
          <p className="text-sm text-muted-foreground">
            💡 <strong className="text-foreground">비유:</strong> HTML은 집의 벽·기둥·창문(뼈대), CSS는 벽지·가구 배치(꾸미기), JavaScript는 문 자동 개폐·조명 제어(동작)입니다.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
