'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Badge } from '@/components/ui/badge';

const categories = [
  {
    name: '에러 추적',
    emoji: '🐛',
    subtitle: 'Error Tracking',
    desc: '프로덕션에서 발생하는 에러를 자동으로 수집하고, 스택 트레이스와 사용자 환경 정보를 함께 기록합니다.',
    tools: [
      {
        name: 'Sentry',
        tagline: '에러 추적의 표준',
        free: '월 5,000 이벤트',
        pros: ['자동 에러 수집 + 알림', '소스맵으로 원본 코드 추적', 'Next.js 공식 지원'],
        highlight: true,
      },
      {
        name: 'LogRocket',
        tagline: '세션 리플레이',
        free: '월 1,000 세션',
        pros: ['사용자 화면 녹화', '에러 전후 맥락 확인', 'Redux/Zustand 상태 추적'],
        highlight: false,
      },
    ],
    color: 'border-red-200 dark:border-red-800',
    tagColor: 'bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300',
  },
  {
    name: '웹 분석',
    emoji: '📊',
    subtitle: 'Web Analytics',
    desc: '사용자가 어디서 왔는지, 어떤 페이지를 보는지, 어디서 이탈하는지를 데이터로 파악합니다.',
    tools: [
      {
        name: 'Google Analytics (GA4)',
        tagline: '가장 많이 쓰는 무료 분석',
        free: '완전 무료',
        pros: ['풍부한 리포트', '이벤트 트래킹', 'Google Ads 연동'],
        highlight: true,
      },
      {
        name: 'Plausible',
        tagline: '프라이버시 우선 분석',
        free: '월 $9~ (오픈소스 셀프호스팅 무료)',
        pros: ['쿠키 불필요 (GDPR 준수)', '1KB 미만 스크립트', '깔끔한 대시보드'],
        highlight: false,
      },
    ],
    color: 'border-blue-200 dark:border-blue-800',
    tagColor: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300',
  },
  {
    name: '피처 플래그',
    emoji: '🚩',
    subtitle: 'Feature Flags',
    desc: '새 기능을 배포하되, 특정 사용자에게만 점진적으로 공개하거나 A/B 테스트를 진행합니다.',
    tools: [
      {
        name: 'LaunchDarkly',
        tagline: '피처 플래그의 표준',
        free: '14일 무료 체험',
        pros: ['세밀한 타겟팅', '실시간 플래그 전환', '다국어 SDK'],
        highlight: false,
      },
      {
        name: 'Vercel Feature Flags',
        tagline: 'Next.js 네이티브 통합',
        free: 'Vercel Pro 포함',
        pros: ['Edge에서 즉시 평가', 'Next.js 미들웨어 통합', '설정 간편'],
        highlight: true,
      },
    ],
    color: 'border-purple-200 dark:border-purple-800',
    tagColor: 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300',
  },
];

export function ToolsOverviewSection() {
  return (
    <section id="tools-overview" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">모니터링 도구 소개</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          모니터링 도구는 크게 3가지 카테고리로 나뉩니다.
          프로젝트 규모와 목적에 따라 필요한 도구를 선택하세요.
        </p>
      </ScrollReveal>

      <div className="space-y-8 max-w-4xl">
        {categories.map((cat, catIdx) => (
          <ScrollReveal key={cat.name} delay={catIdx * 0.1}>
            <div className={`rounded-xl border p-6 ${cat.color}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{cat.emoji}</span>
                <span className="font-bold">{cat.name}</span>
                <Badge variant="secondary" className={`text-[10px] ${cat.tagColor}`}>
                  {cat.subtitle}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">{cat.desc}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {cat.tools.map((tool) => (
                  <div
                    key={tool.name}
                    className={`rounded-lg border bg-background/50 p-4 ${tool.highlight ? 'ring-2 ring-primary/20' : ''}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-bold">{tool.name}</span>
                      {tool.highlight && (
                        <Badge variant="secondary" className="text-[9px] bg-primary/10 text-primary">추천</Badge>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground mb-2">{tool.tagline}</p>
                    <div className="space-y-1 mb-3">
                      {tool.pros.map((pro) => (
                        <div key={pro} className="text-[10px] text-muted-foreground flex items-start gap-1">
                          <span className="text-green-500 shrink-0">+</span>
                          <span>{pro}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 border-t text-[10px]">
                      <span className="text-muted-foreground">무료: </span>
                      <span className="text-green-600 dark:text-green-400 font-medium">{tool.free}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
