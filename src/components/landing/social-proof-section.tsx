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
    { value: 20, suffix: '+', label: t(locale, 'landing.statServices'), icon: Globe, color: 'brand-blue' },
    { value: 116, suffix: '+', label: t(locale, 'landing.statChecklist'), icon: CheckCircle2, color: 'brand-green' },
    { value: 5, suffix: '', label: t(locale, 'landing.statTemplates'), icon: Layers, color: 'purple-500' },
    { value: 256, suffix: '-bit', label: t(locale, 'landing.statEncryption'), icon: Shield, color: 'pink-500' },
  ];

  return (
    <section className="py-20 relative overflow-hidden bg-card/30" id="social-proof">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        {/* Stats */}
        <ScrollReveal>
          <p className="text-center text-sm text-muted-foreground/80 pb-6 font-medium tracking-wide uppercase">
            {t(locale, 'landing.socialProofTagline')}
          </p>
          <div className="grid grid-cols-2 gap-6 py-8 md:grid-cols-4 md:gap-8 bg-background/40 backdrop-blur-xl rounded-3xl border border-border/40 shadow-2xl relative overflow-hidden">
            {/* Inner shimmer effect for the stats container */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent w-full -translate-x-full animate-[shimmer_8s_infinite] pointer-events-none" />

            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className="group flex flex-col items-center justify-center gap-3 px-4 py-6 transition-all duration-300 hover:bg-white/[0.02]"
                >
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-${stat.color}/10 text-${stat.color} transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(var(--${stat.color}-rgb),0.3)] border border-${stat.color}/20`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className={`text-3xl font-black font-mono text-${stat.color} drop-shadow-[0_0_8px_rgba(var(--${stat.color}-rgb),0.4)] tracking-tighter`}>
                      <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                    </p>
                    <p className="text-xs text-muted-foreground/80 mt-1 uppercase tracking-wider font-semibold">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Testimonials */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((item, i) => (
            <ScrollReveal key={item.nameKey} delay={i * 0.15}>
              <div className="group relative rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl p-8 h-full flex flex-col transition-all duration-500 hover:shadow-[0_10px_40px_rgba(59,130,246,0.1)] hover:-translate-y-2 hover:border-brand-blue/30 overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity duration-300 text-brand-blue">
                  <Quote className="w-24 h-24 rotate-12" />
                </div>

                <div className="relative z-10 flex-1 flex flex-col">
                  <div className="flex items-center gap-1 mb-6">
                    {Array.from({ length: item.stars }).map((_, si) => (
                      <Star key={si} className="w-4 h-4 fill-yellow-500 text-yellow-500 drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]" />
                    ))}
                  </div>
                  <p className="text-base text-foreground/90 leading-relaxed flex-1 mb-8 font-medium">
                    &ldquo;{t(locale, item.quoteKey)}&rdquo;
                  </p>

                  <div className="flex items-center gap-4 pt-6 border-t border-border/30">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-blue/20 to-brand-green/20 border border-white/10 flex items-center justify-center text-sm font-bold text-foreground">
                      {t(locale, item.nameKey).charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground tracking-tight">{t(locale, item.nameKey)}</p>
                      <p className="text-xs text-brand-blue/80 font-medium">{t(locale, item.roleKey)}</p>
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
