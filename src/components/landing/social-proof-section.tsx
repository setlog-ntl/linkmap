'use client';

import { Shield, CheckCircle2, Layers, Globe, Quote, Star } from 'lucide-react';
import { ScrollReveal } from './scroll-reveal';
import { AnimatedCounter } from './animated-counter';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';

const testimonials = [
  { nameKey: 'landing.testimonial1Name', roleKey: 'landing.testimonial1Role', quoteKey: 'landing.testimonial1Quote', stars: 5 },
  { nameKey: 'landing.testimonial2Name', roleKey: 'landing.testimonial2Role', quoteKey: 'landing.testimonial2Quote', stars: 5 },
  { nameKey: 'landing.testimonial3Name', roleKey: 'landing.testimonial3Role', quoteKey: 'landing.testimonial3Quote', stars: 5 },
];

export function SocialProofSection() {
  const { locale } = useLocaleStore();

  const stats = [
    { value: 20, suffix: '+', label: t(locale, 'landing.statServices'), icon: Globe, color: 'brand-blue' as const },
    { value: 116, suffix: '+', label: t(locale, 'landing.statChecklist'), icon: CheckCircle2, color: 'brand-green' as const },
    { value: 5, suffix: '', label: t(locale, 'landing.statTemplates'), icon: Layers, color: 'purple-500' as const },
    { value: 256, suffix: '-bit', label: t(locale, 'landing.statEncryption'), icon: Shield, color: 'pink-500' as const },
  ];

  const statColorClasses: Record<string, { iconBg: string; iconText: string; valueText: string }> = {
    'brand-blue': {
      iconBg: 'bg-brand-blue/10',
      iconText: 'text-brand-blue',
      valueText: 'text-brand-blue',
    },
    'brand-green': {
      iconBg: 'bg-brand-green/10',
      iconText: 'text-brand-green',
      valueText: 'text-brand-green',
    },
    'purple-500': {
      iconBg: 'bg-purple-500/10',
      iconText: 'text-purple-500',
      valueText: 'text-purple-500',
    },
    'pink-500': {
      iconBg: 'bg-pink-500/10',
      iconText: 'text-pink-500',
      valueText: 'text-pink-500',
    },
  };

  return (
    <section className="py-20 relative overflow-hidden" id="social-proof">
      {/* Section dividers */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        {/* Stats */}
        <ScrollReveal>
          <p className="text-center text-xs text-muted-foreground pb-6 font-semibold tracking-widest uppercase">
            {locale === 'ko' ? '바이브코더를 위한 서비스 연결 허브' : 'The Infrastructure Hub for Vibe Coders'}
          </p>
          <div className="grid grid-cols-2 gap-4 py-6 md:grid-cols-4 md:gap-6 bg-card rounded-2xl border border-border shadow-sm">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              const colors = statColorClasses[stat.color];
              return (
                <div
                  key={i}
                  className="group flex flex-col items-center justify-center gap-3 px-4 py-4 transition-all duration-200"
                >
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${colors.iconBg} ${colors.iconText} transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-center">
                    <p className={`text-3xl font-black font-mono ${colors.valueText} tracking-tighter`}>
                      <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-1 uppercase tracking-wider font-semibold">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Testimonials */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((item, i) => (
            <ScrollReveal key={item.nameKey} delay={i * 0.12}>
              <div className="group relative rounded-2xl border border-border bg-card p-7 h-full flex flex-col transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-brand-blue/25 overflow-hidden">
                <div className="absolute top-0 right-0 p-5 opacity-[0.06] group-hover:opacity-[0.1] transition-opacity duration-300 text-brand-blue pointer-events-none">
                  <Quote className="w-20 h-20 rotate-12" />
                </div>

                <div className="relative z-10 flex-1 flex flex-col">
                  <div className="flex items-center gap-1 mb-5">
                    {Array.from({ length: item.stars }).map((_, si) => (
                      <Star key={si} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed flex-1 mb-6">
                    &ldquo;{t(locale, item.quoteKey)}&rdquo;
                  </p>

                  <div className="flex items-center gap-3 pt-5 border-t border-border">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-blue/15 to-brand-green/15 border border-border flex items-center justify-center text-sm font-bold text-foreground">
                      {t(locale, item.nameKey).charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground tracking-tight">{t(locale, item.nameKey)}</p>
                      <p className="text-xs text-muted-foreground">{t(locale, item.roleKey)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
