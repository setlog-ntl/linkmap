'use client';

import { Quote, Star } from 'lucide-react';
import { ScrollReveal } from './scroll-reveal';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';

const testimonials = [
  { nameKey: 'landing.testimonial1Name', roleKey: 'landing.testimonial1Role', quoteKey: 'landing.testimonial1Quote', stars: 5 },
  { nameKey: 'landing.testimonial2Name', roleKey: 'landing.testimonial2Role', quoteKey: 'landing.testimonial2Quote', stars: 5 },
  { nameKey: 'landing.testimonial3Name', roleKey: 'landing.testimonial3Role', quoteKey: 'landing.testimonial3Quote', stars: 5 },
];

export function TestimonialsSection() {
  const { locale } = useLocaleStore();

  return (
    <section className="py-24 bg-white dark:bg-[#0a0a0a]" id="testimonials">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t(locale, 'landing.testimonialTitle')}
            </h2>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              {t(locale, 'landing.testimonialDesc')}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((item, i) => (
            <ScrollReveal key={item.nameKey} delay={i * 0.1}>
              <div className="rounded-2xl border border-[#e7efe9] dark:border-zinc-800 bg-white dark:bg-zinc-900/60 backdrop-blur-sm p-6 h-full flex flex-col transition-all hover:border-gray-300 dark:hover:border-zinc-700">
                <Quote className="w-8 h-8 text-[#2bee79]/30 mb-4" />

                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed flex-1 mb-6">
                  &ldquo;{t(locale, item.quoteKey)}&rdquo;
                </p>

                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: item.stars }).map((_, si) => (
                    <Star key={si} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>

                <div>
                  <p className="text-sm font-bold">{t(locale, item.nameKey)}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t(locale, item.roleKey)}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
