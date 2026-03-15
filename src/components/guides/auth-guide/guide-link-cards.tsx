'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Chrome, MessageCircle, ArrowRight, Clock } from 'lucide-react';

const guides = [
  {
    href: '/guides/auth/google',
    icon: Chrome,
    title: '구글 로그인 설정',
    description: 'Google Cloud Console에서 OAuth 클라이언트를 만들고 Supabase에 연결하는 전체 과정을 스크린샷과 함께 안내합니다.',
    steps: 7,
    screenshots: 12,
    readingTime: '10분',
    color: 'blue' as const,
    badge: '스크린샷 포함',
  },
  {
    href: '/guides/auth/kakao',
    icon: MessageCircle,
    title: '카카오 로그인 설정',
    description: '카카오 개발자 콘솔에서 앱을 만들고 Supabase OIDC Provider로 연결하는 전체 과정을 안내합니다.',
    steps: 6,
    screenshots: 10,
    readingTime: '8분',
    color: 'yellow' as const,
    badge: '스크린샷 포함',
  },
];

const colorStyles = {
  blue: {
    border: 'border-blue-200/50 dark:border-blue-800/30 hover:border-blue-300 dark:hover:border-blue-700/50',
    iconBg: 'bg-blue-100 dark:bg-blue-900/40',
    iconColor: 'text-blue-600 dark:text-blue-400',
    badgeBg: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  },
  yellow: {
    border: 'border-yellow-200/50 dark:border-yellow-800/30 hover:border-yellow-300 dark:hover:border-yellow-700/50',
    iconBg: 'bg-yellow-100 dark:bg-yellow-900/40',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    badgeBg: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  },
};

export function GuideLinkCards() {
  return (
    <section className="py-12 md:py-16">
      <ScrollReveal>
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            소셜 로그인 설정 가이드
          </h2>
          <p className="text-muted-foreground max-w-2xl">
            각 서비스별 상세 설정 가이드로 이동하세요.
            스크린샷과 함께 단계별로 따라할 수 있습니다.
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guides.map((guide) => {
            const Icon = guide.icon;
            const styles = colorStyles[guide.color];
            return (
              <Link key={guide.href} href={guide.href}>
                <Card
                  className={`h-full transition-all duration-200 ${styles.border} hover:shadow-md group`}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`w-12 h-12 rounded-xl ${styles.iconBg} flex items-center justify-center`}
                      >
                        <Icon className={`w-6 h-6 ${styles.iconColor}`} />
                      </div>
                      <Badge variant="secondary" className={`text-xs ${styles.badgeBg}`}>
                        {guide.badge}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                      {guide.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {guide.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {guide.readingTime}
                      </span>
                      <span>{guide.steps}단계</span>
                      <span>스크린샷 {guide.screenshots}장</span>
                    </div>
                    <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                      가이드 보기
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </ScrollReveal>
    </section>
  );
}
