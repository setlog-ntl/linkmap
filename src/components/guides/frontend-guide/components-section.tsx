'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Card, CardContent } from '@/components/ui/card';

const componentExample = `// Button.tsx — 재사용 가능한 버튼 컴포넌트
function Button({ label, onClick }) {
  return (
    <button onClick={onClick}>
      {label}
    </button>
  );
}

// 어디서든 재사용 가능
<Button label="저장" onClick={handleSave} />
<Button label="취소" onClick={handleCancel} />
<Button label="삭제" onClick={handleDelete} />`;

const compositionExample = `// 페이지는 컴포넌트를 조립해서 완성
function ProfilePage() {
  return (
    <Layout>          {/* 전체 레이아웃 */}
      <Header />      {/* 상단 네비게이션 */}
      <ProfileCard    {/* 프로필 카드 */}
        name="홍길동"
        avatar="/me.jpg"
      />
      <PostList />    {/* 게시글 목록 */}
      <Footer />      {/* 하단 정보 */}
    </Layout>
  );
}`;

export function ComponentsSection() {
  return (
    <section id="components" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">컴포넌트란?</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          React와 같은 현대 프레임워크는 UI를 <strong>컴포넌트</strong>라는 작은 블록으로 쪼개서 만듭니다.
          한 번 만들면 어디서든 재사용할 수 있습니다.
        </p>
      </ScrollReveal>

      {/* 레고 비유 도식 */}
      <ScrollReveal delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* 레고 단품 = 컴포넌트 */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl mb-3">🧱</div>
              <h3 className="font-semibold mb-2">컴포넌트 = 레고 블록</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                하나의 컴포넌트는 특정 기능을 가진 UI 조각입니다.
                버튼, 카드, 입력창, 모달 등이 모두 독립된 컴포넌트입니다.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Button', 'Card', 'Input', 'Modal', 'Header', 'Avatar'].map((name) => (
                  <span key={name} className="text-xs px-2.5 py-1 rounded-md bg-primary/10 text-primary font-mono font-medium">
                    &lt;{name} /&gt;
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 레고 조립 = 페이지 */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl mb-3">🏠</div>
              <h3 className="font-semibold mb-2">페이지 = 레고 완성품</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                컴포넌트를 조립해서 완전한 페이지를 만듭니다.
                같은 컴포넌트를 여러 페이지에서 재사용할 수 있습니다.
              </p>
              {/* 미니 페이지 레이아웃 */}
              <div className="rounded-lg border bg-muted/30 p-3 space-y-1.5 text-[10px] font-mono">
                <div className="rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-1">&lt;Header /&gt;</div>
                <div className="rounded bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-2 py-1">&lt;ProfileCard /&gt;</div>
                <div className="rounded bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-2 py-1">&lt;PostList /&gt;</div>
                <div className="rounded bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 px-2 py-1">&lt;Footer /&gt;</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollReveal>

      {/* 코드 예시 */}
      <ScrollReveal delay={0.15}>
        <h3 className="text-lg font-semibold mb-4">코드로 보기</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted-foreground mb-2 font-medium">컴포넌트 정의 · 재사용</div>
            <div className="rounded-lg border bg-muted/50">
              <div className="px-4 py-2 border-b">
                <span className="text-xs text-muted-foreground font-mono">Button.tsx</span>
              </div>
              <pre className="p-4 text-xs font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap">
                {componentExample}
              </pre>
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-2 font-medium">컴포넌트 조립으로 페이지 완성</div>
            <div className="rounded-lg border bg-muted/50">
              <div className="px-4 py-2 border-b">
                <span className="text-xs text-muted-foreground font-mono">ProfilePage.tsx</span>
              </div>
              <pre className="p-4 text-xs font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap">
                {compositionExample}
              </pre>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
