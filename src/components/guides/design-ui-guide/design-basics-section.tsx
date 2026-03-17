'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Badge } from '@/components/ui/badge';

const colorTokens = [
  { name: 'Primary', desc: '주요 액션·버튼·링크', example: 'bg-blue-600', hex: '#2563EB', textColor: 'text-white' },
  { name: 'Secondary', desc: '보조 정보·배지·태그', example: 'bg-gray-100', hex: '#F3F4F6', textColor: 'text-gray-900' },
  { name: 'Neutral', desc: '배경·테두리·텍스트', example: 'bg-gray-900', hex: '#111827', textColor: 'text-white' },
  { name: 'Success', desc: '성공·완료·저장', example: 'bg-green-500', hex: '#22C55E', textColor: 'text-white' },
  { name: 'Danger', desc: '삭제·오류·경고', example: 'bg-red-500', hex: '#EF4444', textColor: 'text-white' },
];

const typographyScale = [
  { size: 'text-4xl', px: '36px', usage: '페이지 제목 (h1)', weight: 'font-bold' },
  { size: 'text-2xl', px: '24px', usage: '섹션 제목 (h2)', weight: 'font-bold' },
  { size: 'text-lg', px: '18px', usage: '소제목 (h3)', weight: 'font-semibold' },
  { size: 'text-base', px: '16px', usage: '본문 텍스트', weight: 'font-normal' },
  { size: 'text-sm', px: '14px', usage: '보조 텍스트', weight: 'font-normal' },
  { size: 'text-xs', px: '12px', usage: '캡션·라벨', weight: 'font-medium' },
];

const spacingUnits = [
  { value: '1', px: '4px', visual: 'w-1' },
  { value: '2', px: '8px', visual: 'w-2' },
  { value: '4', px: '16px', visual: 'w-4' },
  { value: '6', px: '24px', visual: 'w-6' },
  { value: '8', px: '32px', visual: 'w-8' },
  { value: '12', px: '48px', visual: 'w-12' },
  { value: '16', px: '64px', visual: 'w-16' },
];

export function DesignBasicsSection() {
  return (
    <section id="design-basics" className="scroll-mt-24 py-12 md:py-16">
      {/* 디자인 기초란? */}
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">디자인 기초</h2>
        <p className="text-muted-foreground mb-4 max-w-2xl leading-relaxed">
          <strong className="text-foreground">디자인 토큰(Design Token)</strong>이란 색상, 폰트, 여백 등
          UI의 기본 재료를 정의한 값입니다. 토큰을 먼저 정하면 일관된 디자인을 쉽게 유지할 수 있습니다.
        </p>
        <div className="max-w-2xl mb-10">
          <div className="rounded-lg border bg-card shadow-sm p-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              🏠 <strong className="text-foreground">실생활 비유:</strong> 집을 지을 때 벽돌, 페인트, 타일을
              먼저 고르듯이 UI를 만들 때도 색상, 폰트, 여백이라는 &quot;재료&quot;를 먼저 정합니다.
              이 재료들을 <strong className="text-foreground">디자인 토큰</strong>이라고 부릅니다.
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* 색상 */}
      <ScrollReveal delay={0.1}>
        <h3 className="text-lg font-semibold mb-4">1. 색상 (Color)</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-2xl">
          UI에 필요한 색상은 보통 5가지 역할로 나뉩니다.
          각 역할에 맞는 색상을 정해두면 버튼, 배지, 경고 메시지 등을 일관되게 만들 수 있습니다.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-10 max-w-4xl">
          {colorTokens.map((color) => (
            <div key={color.name} className="rounded-xl border bg-card shadow-sm overflow-hidden">
              <div className={`h-16 ${color.example} flex items-center justify-center`}>
                <span className={`text-xs font-mono font-bold ${color.textColor}`}>{color.hex}</span>
              </div>
              <div className="p-3">
                <div className="text-sm font-bold">{color.name}</div>
                <div className="text-[10px] text-muted-foreground">{color.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* 타이포그래피 */}
      <ScrollReveal delay={0.15}>
        <h3 className="text-lg font-semibold mb-4">2. 타이포그래피 (Typography)</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-2xl">
          글자 크기에 일정한 스케일을 두면 정보의 중요도를 시각적으로 구분할 수 있습니다.
          Tailwind는 미리 정의된 크기 클래스를 제공합니다.
        </p>
        <div className="max-w-2xl rounded-xl border bg-card shadow-sm overflow-hidden mb-10">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left py-2 px-3 font-semibold text-muted-foreground">미리보기</th>
                <th className="text-left py-2 px-3 font-semibold text-muted-foreground">클래스</th>
                <th className="text-left py-2 px-3 font-semibold text-muted-foreground">크기</th>
                <th className="text-left py-2 px-3 font-semibold text-muted-foreground">용도</th>
              </tr>
            </thead>
            <tbody>
              {typographyScale.map((t) => (
                <tr key={t.size} className="border-b last:border-b-0">
                  <td className="py-2 px-3">
                    <span className={`${t.size} ${t.weight}`}>Aa</span>
                  </td>
                  <td className="py-2 px-3">
                    <code className="text-[10px] bg-muted px-1 rounded font-mono">{t.size}</code>
                  </td>
                  <td className="py-2 px-3 text-muted-foreground">{t.px}</td>
                  <td className="py-2 px-3 text-muted-foreground">{t.usage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ScrollReveal>

      {/* 여백 (Spacing) */}
      <ScrollReveal delay={0.2}>
        <h3 className="text-lg font-semibold mb-4">3. 여백 (Spacing)</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-2xl">
          Tailwind는 <strong className="text-foreground">4px 단위</strong> 시스템을 사용합니다.
          <code className="text-[11px] bg-muted px-1 rounded font-mono mx-1">p-4</code>는 16px,
          <code className="text-[11px] bg-muted px-1 rounded font-mono mx-1">m-8</code>은 32px입니다.
        </p>

        <div className="max-w-2xl space-y-2 mb-6">
          {spacingUnits.map((s) => (
            <div key={s.value} className="flex items-center gap-3">
              <code className="text-[10px] font-mono text-muted-foreground w-8 text-right">{s.value}</code>
              <div className={`h-4 ${s.visual} bg-primary/60 rounded-sm`} />
              <span className="text-[10px] text-muted-foreground">{s.px}</span>
            </div>
          ))}
        </div>

        <div className="max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card shadow-sm p-4">
            <div className="text-sm font-semibold mb-2">Padding (안쪽 여백)</div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              요소 <strong className="text-foreground">내부</strong>의 여백입니다.
              버튼 안의 텍스트와 테두리 사이 공간을 조절할 때 사용합니다.
            </p>
            <code className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded mt-2 inline-block">
              p-4 px-6 py-2
            </code>
          </div>
          <div className="rounded-lg border bg-card shadow-sm p-4">
            <div className="text-sm font-semibold mb-2">Margin (바깥 여백)</div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              요소 <strong className="text-foreground">외부</strong>의 여백입니다.
              카드와 카드 사이의 간격을 조절할 때 사용합니다.
            </p>
            <code className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded mt-2 inline-block">
              m-4 mx-auto mb-6
            </code>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-muted/50 border max-w-2xl">
          <p className="text-xs text-muted-foreground">
            💡 <strong className="text-foreground">초보자 팁:</strong> 요소 사이 간격에는
            <code className="text-[10px] bg-muted px-1 rounded font-mono mx-1">gap</code>을 사용하세요.
            <code className="text-[10px] bg-muted px-1 rounded font-mono mx-1">flex gap-4</code>로 자식 요소 사이 간격을 한 번에 설정할 수 있습니다.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
