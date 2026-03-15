'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Shield, Puzzle, ArrowRight } from 'lucide-react';

const layers = [
  {
    icon: Shield,
    color: 'blue',
    label: 'Layer 1',
    title: '앱 로그인',
    description: 'Linkmap에 들어오기 위한 인증. Google, GitHub, 카카오 중 하나로 로그인합니다.',
    examples: ['Google 계정으로 로그인', 'GitHub 계정으로 로그인', '카카오톡으로 로그인'],
  },
  {
    icon: Puzzle,
    color: 'emerald',
    label: 'Layer 2',
    title: '서비스 연동',
    description: '프로젝트에서 외부 서비스와 연결하는 인증. OAuth나 API Key를 사용합니다.',
    examples: ['GitHub 레포 연동', 'Vercel 배포 연결', 'OpenAI API 키 등록'],
  },
];

export function AuthBasicsSection() {
  return (
    <section className="py-12 md:py-16">
      <ScrollReveal>
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary mb-2 tracking-wide uppercase">
            <div className="w-2 h-2 rounded-full bg-primary" />
            핵심 개념
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            두 가지 인증 레이어
          </h2>
          <p className="text-muted-foreground max-w-2xl">
            Linkmap에는 두 가지 종류의 인증이 있습니다.
            이 차이를 이해하면 설정이 훨씬 쉬워집니다.
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {layers.map((layer) => {
            const Icon = layer.icon;
            const isBlue = layer.color === 'blue';
            return (
              <Card
                key={layer.title}
                className={`${
                  isBlue
                    ? 'border-blue-200/50 dark:border-blue-800/30'
                    : 'border-emerald-200/50 dark:border-emerald-800/30'
                }`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isBlue
                          ? 'bg-blue-100 dark:bg-blue-900/40'
                          : 'bg-emerald-100 dark:bg-emerald-900/40'
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          isBlue
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      />
                    </div>
                    <div>
                      <p
                        className={`text-xs font-medium ${
                          isBlue
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {layer.label}
                      </p>
                      <h3 className="font-semibold">{layer.title}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {layer.description}
                  </p>
                  <ul className="space-y-1.5">
                    {layer.examples.map((ex) => (
                      <li
                        key={ex}
                        className="text-sm text-muted-foreground flex items-center gap-2"
                      >
                        <ArrowRight className="w-3 h-3 shrink-0" />
                        {ex}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollReveal>
    </section>
  );
}
