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
    { value: 20, suffix: '+', label: t(locale, 'landing.statServices'), icon: Globe },
    { value: 116, suffix: '+', label: t(locale, 'landing.statChecklist'), icon: CheckCircle2 },
    { value: 5, suffix: '', label: t(locale, 'landing.statTemplates'), icon: Layers },
    { value: 256, suffix: '-bit', label: t(locale, 'landing.statEncryption'), icon: Shield },
  ];

  return (
    <section className="py-16 bg-card border-y border-border" id="social-proof">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Stats */}
        <ScrollReveal>
          <p className="text-center text-sm text-muted-foreground pb-2 font-medium">
            {t(locale, 'landing.socialProofTagline')}
          </p>
          <div className="grid grid-cols-2 gap-6 py-6 md:grid-cols-4 md:gap-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className="group flex items-center justify-center gap-4 md:justify-start rounded-xl px-4 py-3 transition-colors hover:bg-muted"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-blue-light text-brand-blue transition-transform group-hover:scale-110">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-mono bg-gradient-to-r from-brand-blue to-brand-green bg-clip-text text-transparent">
                      <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                    </p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Testimonials */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((item, i) => (
            <ScrollReveal key={item.nameKey} delay={i * 0.1}>
              <div className="rounded-2xl border border-border bg-muted p-6 h-full flex flex-col transition-all hover:shadow-md hover:-translate-y-0.5">
                <Quote className="w-8 h-8 text-brand-blue/20 mb-4" />
                <p className="text-sm text-foreground/80 leading-relaxed flex-1 mb-6">
                  &ldquo;{t(locale, item.quoteKey)}&rdquo;
                </p>
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: item.stars }).map((_, si) => (
                    <Star key={si} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{t(locale, item.nameKey)}</p>
                  <p className="text-xs text-muted-foreground">{t(locale, item.roleKey)}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
