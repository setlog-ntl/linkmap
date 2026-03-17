'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Badge } from '@/components/ui/badge';

const traditionalVsVibe = [
  {
    type: '전통적 코딩',
    emoji: '📚',
    method: '프로그래밍 언어를 직접 학습',
    steps: ['문법·알고리즘 공부 (수 개월)', '코드를 한 줄씩 직접 작성', '에러를 Stack Overflow에서 검색', '디버깅 → 수정 → 반복'],
    timeToFirst: '수 주 ~ 수 개월',
    tagColor: 'bg-gray-50 dark:bg-gray-950/30 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800',
  },
  {
    type: '바이브코딩',
    emoji: '🎵',
    method: 'AI에게 자연어로 설명',
    steps: ['만들고 싶은 것을 말로 설명', 'AI가 코드를 생성', '결과를 확인하고 수정 요청', '대화하며 반복 개선'],
    timeToFirst: '수 분 ~ 수 시간',
    tagColor: 'bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
  },
];

const workflowSteps = [
  {
    step: 1,
    icon: '💬',
    title: '자연어로 설명',
    detail: '"로그인 페이지를 만들어줘.\n이메일과 비밀번호 입력 필드가 필요해."',
    color: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
    badge: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300',
  },
  {
    step: 2,
    icon: '⚡',
    title: 'AI가 코드 생성',
    detail: 'AI가 React 컴포넌트,\n스타일, 유효성 검사를 한 번에 생성',
    color: 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800',
    badge: 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300',
  },
  {
    step: 3,
    icon: '🔄',
    title: '수정 요청',
    detail: '"비밀번호 표시/숨기기 토글을\n추가해줘. 색상은 파란색으로."',
    color: 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800',
    badge: 'bg-orange-100 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300',
  },
  {
    step: 4,
    icon: '🎉',
    title: '반복 완성',
    detail: '대화를 반복하며\n원하는 결과물로 발전',
    color: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800',
    badge: 'bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300',
  },
];

const prosAndCautions = [
  {
    title: '빠른 프로토타이핑',
    desc: '아이디어를 몇 시간 만에 동작하는 앱으로 만들 수 있습니다.',
    icon: '🚀',
    type: 'pro' as const,
  },
  {
    title: '학습 곡선 완화',
    desc: '프로그래밍 문법을 몰라도 AI가 코드를 작성해 줍니다.',
    icon: '📉',
    type: 'pro' as const,
  },
  {
    title: '코드 이해 필요',
    desc: 'AI가 만든 코드를 검증하려면 기본적인 코드 읽기 능력이 필요합니다.',
    icon: '👀',
    type: 'caution' as const,
  },
  {
    title: '보안 주의',
    desc: 'AI가 생성한 코드에 보안 취약점이 있을 수 있습니다. 반드시 검토하세요.',
    icon: '🛡️',
    type: 'caution' as const,
  },
];

export function VibeCodingSection() {
  return (
    <section id="vibe-coding" className="scroll-mt-24 py-12 md:py-16">
      {/* 바이브코딩이란? */}
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">바이브코딩이란?</h2>
        <p className="text-muted-foreground mb-4 max-w-2xl leading-relaxed">
          <strong className="text-foreground">바이브코딩(Vibe Coding)</strong>은 AI에게 자연어로 원하는 기능을 설명하면
          AI가 코드를 작성해 주는 새로운 개발 방식입니다.
        </p>
        <div className="max-w-2xl mb-10">
          <div className="rounded-lg border bg-card shadow-sm p-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">한마디로:</strong> 프로그래밍 언어 대신
              한국어(또는 영어)로 AI와 대화하며 코드를 만드는 것입니다.
              마치 시니어 개발자에게 업무를 지시하는 것과 비슷합니다.
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* 전통적 코딩 vs 바이브코딩 */}
      <ScrollReveal delay={0.1}>
        <h3 className="text-lg font-semibold mb-4">전통적 코딩 vs 바이브코딩</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 max-w-3xl">
          {traditionalVsVibe.map((item) => (
            <div key={item.type} className={`rounded-xl border p-5 ${item.tagColor}`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{item.emoji}</span>
                <div>
                  <div className="font-bold text-sm">{item.type}</div>
                  <div className="text-[10px] text-muted-foreground">{item.method}</div>
                </div>
              </div>
              <div className="space-y-1.5 mb-3">
                {item.steps.map((step, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className="w-4 h-4 rounded-full bg-background/50 text-[9px] flex items-center justify-center shrink-0 font-bold">
                      {i + 1}
                    </span>
                    <span className="text-muted-foreground">{step}</span>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-current/10 text-xs">
                <span className="text-muted-foreground">첫 결과물까지: </span>
                <span className="font-semibold">{item.timeToFirst}</span>
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* 바이브코딩 워크플로우 */}
      <ScrollReveal delay={0.15}>
        <h3 className="text-lg font-semibold mb-2">바이브코딩 워크플로우</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-2xl">
          바이브코딩은 아래 4단계를 반복하는 과정입니다. 한 번에 완벽한 결과를 기대하기보다 대화를 통해 점진적으로 개선합니다.
        </p>

        <div className="overflow-x-auto pb-2 mb-8">
          <div className="flex items-stretch gap-0 min-w-max">
            {workflowSteps.map((s, i) => (
              <div key={s.step} className="flex items-stretch">
                <div className={`rounded-xl border p-4 w-40 flex flex-col items-center text-center gap-2 ${s.color}`}>
                  <div className="text-2xl">{s.icon}</div>
                  <div className="text-xs font-bold leading-tight">{s.title}</div>
                  <div className="text-[10px] text-muted-foreground leading-relaxed whitespace-pre-line flex-1">{s.detail}</div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium mt-auto ${s.badge}`}>
                    Step {s.step}
                  </span>
                </div>
                {i < workflowSteps.length - 1 && (
                  <div className="flex items-center px-0.5">
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

      {/* 장점 / 주의점 */}
      <ScrollReveal delay={0.2}>
        <h3 className="text-lg font-semibold mb-4">장점과 주의점</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
          {prosAndCautions.map((item) => (
            <div key={item.title} className="rounded-lg border bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{item.icon}</span>
                <Badge
                  variant="secondary"
                  className={`text-[10px] ${
                    item.type === 'pro'
                      ? 'bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300'
                      : 'bg-yellow-100 dark:bg-yellow-900/60 text-yellow-700 dark:text-yellow-300'
                  }`}
                >
                  {item.type === 'pro' ? '장점' : '주의'}
                </Badge>
              </div>
              <div className="text-sm font-semibold mb-1">{item.title}</div>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 p-3 rounded-lg bg-muted/50 border max-w-2xl">
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">핵심 원칙:</strong> AI가 만든 코드를 맹신하지 마세요.
            항상 결과를 확인하고, 이상한 부분은 AI에게 &quot;왜 이렇게 했는지&quot; 물어보세요.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
