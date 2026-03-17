'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Badge } from '@/components/ui/badge';
import { Smartphone } from 'lucide-react';

const mobileFirstSteps = [
  { step: 1, title: '모바일 먼저', desc: '기본 스타일 = 모바일용. 접두사 없이 작성합니다.', code: 'text-sm p-4 flex flex-col gap-2' },
  { step: 2, title: '태블릿 확장', desc: 'md: 접두사로 태블릿 이상에서 레이아웃 변경.', code: 'md:text-base md:p-6 md:flex-row md:gap-4' },
  { step: 3, title: '데스크톱 최적화', desc: 'lg: 접두사로 넓은 화면에 맞게 최적화.', code: 'lg:text-lg lg:p-8 lg:gap-6' },
];

const flexPatterns = [
  {
    name: '가로 정렬 (기본)',
    code: '<div class="flex items-center gap-2">\n  <Avatar />\n  <span>사용자 이름</span>\n</div>',
    desc: '아이콘 + 텍스트, 아바타 + 이름 등 한 줄 배치',
  },
  {
    name: '양쪽 정렬',
    code: '<div class="flex items-center justify-between">\n  <h2>제목</h2>\n  <Button>액션</Button>\n</div>',
    desc: '헤더, 리스트 아이템에서 양 끝 배치',
  },
  {
    name: '세로 쌓기',
    code: '<div class="flex flex-col gap-4">\n  <Card />\n  <Card />\n  <Card />\n</div>',
    desc: '카드, 폼 필드 등을 세로로 쌓기',
  },
  {
    name: '줄바꿈 허용',
    code: '<div class="flex flex-wrap gap-2">\n  <Badge>React</Badge>\n  <Badge>Next.js</Badge>\n  <Badge>TypeScript</Badge>\n</div>',
    desc: '태그, 뱃지 등이 한 줄에 안 들어가면 다음 줄로',
  },
];

const gridPatterns = [
  {
    name: '반응형 카드 그리드',
    code: '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">\n  <Card />\n  <Card />\n  <Card />\n</div>',
    desc: '모바일 1열 → 태블릿 2열 → 데스크톱 3열',
  },
  {
    name: '사이드바 레이아웃',
    code: '<div class="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">\n  <aside>사이드바</aside>\n  <main>메인 콘텐츠</main>\n</div>',
    desc: '모바일에서는 세로, 태블릿 이상에서 사이드바 + 메인',
  },
  {
    name: '컬럼 span',
    code: '<div class="grid grid-cols-2 gap-4">\n  <div class="col-span-2">전체 너비</div>\n  <div>왼쪽 절반</div>\n  <div>오른쪽 절반</div>\n</div>',
    desc: 'col-span으로 여러 열을 차지하는 요소 배치',
  },
];

const practicalLayouts = [
  {
    name: '사이드바 + 메인',
    desc: '관리자 대시보드, 설정 페이지 등에 사용',
    code: `<div class="flex min-h-screen">
  {/* 사이드바: 모바일에서 숨김 */}
  <aside class="hidden md:flex md:w-64 flex-col border-r p-4">
    <nav class="flex flex-col gap-1">
      <a href="#">메뉴 1</a>
      <a href="#">메뉴 2</a>
    </nav>
  </aside>
  {/* 메인 콘텐츠 */}
  <main class="flex-1 p-4 md:p-8">
    <h1>대시보드</h1>
  </main>
</div>`,
  },
  {
    name: '카드 그리드',
    desc: '상품 목록, 프로젝트 목록, 갤러리 등에 사용',
    code: `<div class="max-w-6xl mx-auto px-4">
  <h1 class="text-2xl font-bold mb-6">프로젝트 목록</h1>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {/* 카드 반복 */}
    <div class="rounded-xl border bg-card shadow-sm p-6">
      <h3 class="font-bold mb-2">프로젝트 이름</h3>
      <p class="text-sm text-muted-foreground">설명</p>
    </div>
  </div>
</div>`,
  },
  {
    name: '반응형 네비게이션',
    desc: '모바일에서 햄버거 메뉴, 데스크톱에서 가로 메뉴',
    code: `<header class="border-b">
  <div class="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
    <span class="font-bold">Logo</span>
    {/* 데스크톱 메뉴 */}
    <nav class="hidden md:flex items-center gap-6">
      <a href="#">기능</a>
      <a href="#">가격</a>
      <a href="#">문서</a>
      <Button>시작하기</Button>
    </nav>
    {/* 모바일 햄버거 */}
    <button class="md:hidden">
      <MenuIcon />
    </button>
  </div>
</header>`,
  },
];

export function ResponsiveContent() {
  return (
    <div className="py-6 space-y-0">
      {/* 헤더 */}
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Smartphone className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">반응형 디자인</h1>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          하나의 코드로 모바일부터 데스크톱까지 모든 화면에 대응하는 방법을 알아봅니다.
          모바일 퍼스트 접근법, Flexbox, Grid 레이아웃을 실전 예제로 익혀보세요.
        </p>
      </ScrollReveal>

      {/* 모바일 퍼스트 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">모바일 퍼스트 접근법</h2>
          <p className="text-muted-foreground mb-4 max-w-2xl text-sm">
            <strong className="text-foreground">모바일 화면을 먼저</strong> 만들고,
            큰 화면으로 <strong className="text-foreground">점진적으로 확장</strong>하는 방법입니다.
            Tailwind CSS의 기본 철학이기도 합니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl space-y-3 mb-8">
            {mobileFirstSteps.map((item) => (
              <div key={item.step} className="rounded-xl border bg-card shadow-sm p-4 flex items-start gap-4">
                <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-bold shrink-0">
                  {item.step}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm mb-0.5">{item.title}</div>
                  <p className="text-xs text-muted-foreground mb-2">{item.desc}</p>
                  <code className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded break-all">
                    {item.code}
                  </code>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-muted/50 border max-w-2xl mb-6">
            <p className="text-xs text-muted-foreground">
              💡 <strong className="text-foreground">핵심 원칙:</strong> 접두사 없는 클래스가 모바일 스타일이고,
              <code className="text-[10px] font-mono bg-muted px-1 rounded mx-1">sm:</code>
              <code className="text-[10px] font-mono bg-muted px-1 rounded mx-1">md:</code>
              <code className="text-[10px] font-mono bg-muted px-1 rounded mx-1">lg:</code>는
              &quot;이 크기 <strong className="text-foreground">이상</strong>에서&quot;라는 의미입니다.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* Flexbox 패턴 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">Flexbox 패턴</h2>
          <p className="text-muted-foreground mb-4 max-w-2xl text-sm">
            <strong className="text-foreground">1차원(한 방향)</strong> 배치에 사용합니다.
            가로 한 줄 또는 세로 한 줄로 요소를 정렬할 때 적합합니다.
          </p>
        </ScrollReveal>

        <div className="space-y-4 mb-8 max-w-2xl">
          {flexPatterns.map((pattern, idx) => (
            <ScrollReveal key={pattern.name} delay={idx * 0.08}>
              <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b bg-muted/50 flex items-center justify-between">
                  <span className="text-sm font-semibold">{pattern.name}</span>
                  <span className="text-[10px] text-muted-foreground">{pattern.desc}</span>
                </div>
                <pre className="p-4 text-xs overflow-x-auto">
                  <code className="text-muted-foreground">{pattern.code}</code>
                </pre>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Grid 패턴 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">Grid 패턴</h2>
          <p className="text-muted-foreground mb-4 max-w-2xl text-sm">
            <strong className="text-foreground">2차원(행 + 열)</strong> 배치에 사용합니다.
            카드 그리드, 대시보드 레이아웃 등 복잡한 배치에 적합합니다.
          </p>
        </ScrollReveal>

        <div className="space-y-4 mb-8 max-w-2xl">
          {gridPatterns.map((pattern, idx) => (
            <ScrollReveal key={pattern.name} delay={idx * 0.08}>
              <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b bg-muted/50 flex items-center justify-between">
                  <span className="text-sm font-semibold">{pattern.name}</span>
                  <span className="text-[10px] text-muted-foreground">{pattern.desc}</span>
                </div>
                <pre className="p-4 text-xs overflow-x-auto">
                  <code className="text-muted-foreground">{pattern.code}</code>
                </pre>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 실전 레이아웃 3가지 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">실전 레이아웃 3가지</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            실무에서 자주 사용하는 반응형 레이아웃 패턴입니다. 모바일과 데스크톱에서 각각 어떻게 보이는지 확인하세요.
          </p>
        </ScrollReveal>

        <div className="space-y-6 max-w-3xl">
          {practicalLayouts.map((layout, idx) => (
            <ScrollReveal key={layout.name} delay={idx * 0.1}>
              <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b bg-muted/50 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-semibold">{layout.name}</span>
                    <Badge variant="secondary" className="text-[9px] ml-2">{`패턴 ${idx + 1}`}</Badge>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{layout.desc}</span>
                </div>
                <pre className="p-4 text-xs overflow-x-auto">
                  <code className="text-muted-foreground">{layout.code}</code>
                </pre>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.3}>
          <div className="p-3 rounded-lg bg-muted/50 border max-w-3xl mt-6">
            <p className="text-xs text-muted-foreground">
              💡 <strong className="text-foreground">실전 팁:</strong> 브라우저 개발자 도구(F12)에서
              반응형 모드를 켜면 다양한 화면 크기를 바로 테스트할 수 있습니다.
              Tailwind의 <code className="text-[10px] font-mono bg-muted px-1 rounded">hidden md:flex</code> 패턴으로
              모바일/데스크톱 요소를 쉽게 분리하세요.
            </p>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
