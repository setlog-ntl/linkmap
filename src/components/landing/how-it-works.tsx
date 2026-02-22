'use client';

import { ScrollReveal } from './scroll-reveal';
import { FolderPlus, Puzzle, Rocket } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';

export function HowItWorks() {
  const { locale } = useLocaleStore();

  const steps = [
    {
      number: '1',
      icon: FolderPlus,
      title: t(locale, 'landing.step1Title'),
      description: t(locale, 'landing.step1Desc'),
    },
    {
      number: '2',
      icon: Puzzle,
      title: t(locale, 'landing.step2Title'),
      description: t(locale, 'landing.step2Desc'),
    },
    {
      number: '3',
      icon: Rocket,
      title: locale === 'ko' ? '배포 & 관리' : 'Deploy & Manage',
      description: locale === 'ko'
        ? '원클릭 배포로 3분 만에 사이트를 라이브하거나, 환경변수를 안전하게 저장하고 .env를 다운로드하세요.'
        : 'Go live in 3 minutes with one-click deploy, or securely store env vars and download .env files.',
    },
  ];

  return (
    <section className="py-24 bg-[#f4f5f8] border-y border-[#dde0e7] dark:bg-[#0b1120] dark:border-white/10" id="how-it-works">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(220,60%,35%)] mb-3 flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[hsl(220,60%,35%)]" />
              HOW IT WORKS
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-[#1a2740] dark:text-[#e2e8f0]">
              {locale === 'ko' ? '3단계로 시작하세요' : 'Get Started in 3 Steps'}
            </h2>
          </div>
        </ScrollReveal>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl mx-auto">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-px z-0">
            <div className="h-full bg-gradient-to-r from-[#dde0e7] via-[hsl(220,60%,35%)]/40 to-[#dde0e7] dark:from-[#475569] dark:via-[hsl(220,60%,50%)]/40 dark:to-[#475569]" />
          </div>

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <ScrollReveal key={i} delay={i * 0.15}>
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white border border-[#dde0e7] shadow-md dark:bg-[#111827] dark:border-white/10 mb-6 transition-transform hover:scale-105">
                    <span className="text-2xl font-bold text-[hsl(220,60%,35%)]">{step.number}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Icon className="w-5 h-5 text-[hsl(220,60%,35%)]" />
                    <h3 className="text-xl font-bold text-[#1a2740] dark:text-[#e2e8f0]">{step.title}</h3>
                  </div>
                  <p className="text-sm text-[#63738a] dark:text-[#94a3b8] max-w-xs leading-relaxed">{step.description}</p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Button
            className="bg-[hsl(220,60%,35%)] text-white hover:bg-[hsl(220,60%,30%)] px-6 py-2.5 h-auto rounded-lg font-bold"
            asChild
          >
            <Link href="/oneclick">
              {t(locale, 'landing.ctaOneclick')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
