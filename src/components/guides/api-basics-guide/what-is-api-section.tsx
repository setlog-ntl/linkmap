'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Badge } from '@/components/ui/badge';

const restaurantAnalogy = [
  {
    role: '손님',
    realRole: '클라이언트 (브라우저)',
    emoji: '👤',
    desc: '메뉴를 보고 원하는 음식을 주문합니다.',
    color: 'border-blue-200 dark:border-blue-800',
  },
  {
    role: '웨이터',
    realRole: 'API',
    emoji: '🤵',
    desc: '손님의 주문을 받아 주방에 전달하고, 완성된 음식을 가져다 줍니다.',
    color: 'border-primary/30',
  },
  {
    role: '주방',
    realRole: '서버 (백엔드)',
    emoji: '👨‍🍳',
    desc: '주문에 따라 음식을 만들어 웨이터에게 건넵니다.',
    color: 'border-green-200 dark:border-green-800',
  },
];

const restVsGraphql = [
  {
    name: 'REST API',
    subtitle: '가장 널리 쓰이는 방식',
    desc: 'URL마다 하나의 리소스를 다룹니다. GET /users, POST /users처럼 HTTP 메서드로 동작을 구분합니다.',
    pros: ['이해하기 쉬움', '대부분의 서비스가 제공', '캐싱이 간단'],
    cons: ['필요 없는 데이터도 함께 옴 (Over-fetching)', '여러 리소스 조합 시 요청 여러 번'],
    example: 'GET /api/users/123',
    color: 'border-blue-200 dark:border-blue-800',
    tagColor: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300',
  },
  {
    name: 'GraphQL',
    subtitle: '필요한 것만 골라 요청',
    desc: '하나의 엔드포인트에서 원하는 데이터만 정확히 요청합니다. Facebook이 만들었습니다.',
    pros: ['필요한 필드만 선택 가능', '한 번의 요청으로 여러 리소스 조합', '타입 시스템 내장'],
    cons: ['학습 곡선이 있음', '캐싱이 복잡', '서버 구현 부담'],
    example: 'query { user(id: 123) { name, email } }',
    color: 'border-pink-200 dark:border-pink-800',
    tagColor: 'bg-pink-100 dark:bg-pink-900/60 text-pink-700 dark:text-pink-300',
  },
];

const realExamples = [
  {
    emoji: '🌤️',
    title: '날씨 조회',
    desc: '기상청 API에 "서울 날씨 알려줘"라고 요청하면 기온, 습도, 강수 확률을 JSON으로 받습니다.',
    request: 'GET /weather?city=seoul',
    response: '{ "temp": 22, "humidity": 60 }',
  },
  {
    emoji: '🔐',
    title: '로그인',
    desc: '이메일과 비밀번호를 서버에 보내면, 서버가 확인 후 인증 토큰을 발급합니다.',
    request: 'POST /auth/login',
    response: '{ "token": "eyJhbG..." }',
  },
  {
    emoji: '💳',
    title: '결제',
    desc: 'Stripe 같은 결제 API에 결제 정보를 보내면, 결제 결과를 돌려줍니다.',
    request: 'POST /payments',
    response: '{ "status": "success" }',
  },
];

export function WhatIsApiSection() {
  return (
    <section id="what-is-api" className="scroll-mt-24 py-12 md:py-16">
      {/* API란 무엇인가? */}
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">API란 무엇인가?</h2>
        <p className="text-muted-foreground mb-4 max-w-2xl leading-relaxed">
          <strong className="text-foreground">API(Application Programming Interface)</strong>는
          프로그램끼리 대화하는 약속된 방법입니다.
          내 앱이 다른 서비스의 기능이나 데이터를 사용하고 싶을 때, API를 통해 요청하고 응답을 받습니다.
        </p>
      </ScrollReveal>

      {/* 레스토랑 비유 */}
      <ScrollReveal delay={0.1}>
        <div className="max-w-2xl mb-10">
          <div className="rounded-lg border bg-card shadow-sm p-4 mb-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              🍽️ <strong className="text-foreground">레스토랑 비유:</strong> API는 레스토랑의 웨이터와 같습니다.
              손님(클라이언트)이 직접 주방(서버)에 들어가지 않고, 웨이터(API)를 통해 주문(요청)하고 음식(응답)을 받습니다.
            </p>
          </div>

          <div className="flex items-center justify-center gap-0 mb-6 overflow-x-auto pb-2">
            {restaurantAnalogy.map((item, i) => (
              <div key={item.role} className="flex items-center">
                <div className={`rounded-xl border bg-card shadow-sm p-4 w-40 text-center ${item.color}`}>
                  <div className="text-2xl mb-1">{item.emoji}</div>
                  <div className="text-xs font-bold">{item.role}</div>
                  <div className="text-[10px] text-muted-foreground">{item.realRole}</div>
                </div>
                {i < restaurantAnalogy.length - 1 && (
                  <div className="px-1 shrink-0">
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

      {/* REST vs GraphQL */}
      <ScrollReveal delay={0.15}>
        <h3 className="text-lg font-semibold mb-4">REST vs GraphQL</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 max-w-3xl">
          {restVsGraphql.map((api) => (
            <div key={api.name} className={`rounded-xl border p-5 bg-card shadow-sm ${api.color}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-sm">{api.name}</span>
                <Badge variant="secondary" className={`text-[9px] ${api.tagColor}`}>
                  {api.name === 'REST API' ? '주류' : '모던'}
                </Badge>
              </div>
              <p className="text-[10px] text-muted-foreground mb-3">{api.subtitle}</p>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{api.desc}</p>

              <div className="mb-3">
                <code className="text-[10px] font-mono bg-muted px-2 py-1 rounded block">
                  {api.example}
                </code>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[10px] font-semibold text-green-600 dark:text-green-400 mb-1">장점</div>
                  <div className="space-y-1">
                    {api.pros.map((pro) => (
                      <div key={pro} className="text-[10px] text-muted-foreground flex items-start gap-1">
                        <span className="text-green-500 shrink-0">+</span>
                        <span>{pro}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-red-500 mb-1">단점</div>
                  <div className="space-y-1">
                    {api.cons.map((con) => (
                      <div key={con} className="text-[10px] text-muted-foreground flex items-start gap-1">
                        <span className="text-red-400 shrink-0">-</span>
                        <span>{con}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 rounded-lg bg-muted/50 border max-w-2xl mb-10">
          <p className="text-xs text-muted-foreground">
            💡 <strong className="text-foreground">초보자 팁:</strong> 처음 시작한다면 <strong className="text-foreground">REST API</strong>부터
            배우세요. 대부분의 서비스(GitHub, Stripe, OpenAI 등)가 REST API를 제공하고, 이해하기 훨씬 쉽습니다.
          </p>
        </div>
      </ScrollReveal>

      {/* API 활용 예시 */}
      <ScrollReveal delay={0.2}>
        <h3 className="text-lg font-semibold mb-4">API 활용 실제 예시</h3>
        <div className="space-y-3 max-w-2xl">
          {realExamples.map((ex) => (
            <div key={ex.title} className="rounded-lg border bg-card shadow-sm p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{ex.emoji}</span>
                <span className="text-sm font-bold">{ex.title}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{ex.desc}</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[10px] font-semibold text-muted-foreground mb-1">요청</div>
                  <code className="text-[10px] font-mono bg-muted px-2 py-1 rounded block">{ex.request}</code>
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-muted-foreground mb-1">응답</div>
                  <code className="text-[10px] font-mono bg-muted px-2 py-1 rounded block">{ex.response}</code>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
