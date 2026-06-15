'use client';

import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import { ScrollReveal } from './scroll-reveal';
import { Badge } from '@/components/ui/badge';
import { useLocaleStore } from '@/stores/locale-store';
import { homepageTemplateSeedData } from '@/data/oneclick/homepage-templates';
import { WireframeSVG } from '@/components/oneclick/template-card';
import {
  RECOMMENDED_SLUGS,
  TEMPLATE_USE_CASES,
} from '@/lib/constants/template-categories';

const activeTemplates = homepageTemplateSeedData
  .filter((tpl) => tpl.is_active)
  .sort((a, b) => a.display_order - b.display_order);

export function TemplateShowcase() {
  const { locale } = useLocaleStore();

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-card/50 dark:bg-card/30" id="templates">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-10 sm:mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-green mb-4 flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-brand-green animate-pulse" />
              TEMPLATES
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
              어떤 홈페이지를 만들까요?
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
              6가지 템플릿 중 골라서 클릭 한 번이면 끝
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {activeTemplates.map((tpl, i) => {
            const isRecommended = RECOMMENDED_SLUGS.has(tpl.slug);
            const useCases = TEMPLATE_USE_CASES[tpl.slug];

            return (
              <ScrollReveal key={tpl.slug} delay={i * 0.08}>
                <Link
                  href={`/sites/new?template=${tpl.slug}`}
                  prefetch={false}
                  className="group flex flex-col rounded-xl border border-border bg-card overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-primary/25"
                >
                  {/* Wireframe preview */}
                  <div className="relative h-28 sm:h-36 bg-muted/50 flex items-center justify-center px-6 overflow-hidden">
                    <WireframeSVG slug={tpl.slug} />

                    {/* Recommended badge */}
                    {isRecommended && (
                      <Badge className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 gap-1 bg-primary text-primary-foreground text-[9px] sm:text-[10px] px-1.5 py-0.5">
                        <Star className="h-3 w-3" />
                        추천
                      </Badge>
                    )}

                    {/* Free badge for non-recommended */}
                    {!isRecommended && (
                      <Badge
                        variant="secondary"
                        className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 text-[9px] sm:text-[10px] px-1.5 py-0.5"
                      >
                        무료
                      </Badge>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-foreground mb-1">
                      {locale === 'ko' ? tpl.name_ko : tpl.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1 leading-relaxed">
                      {locale === 'ko' ? tpl.description_ko : tpl.description}
                    </p>

                    {/* Use case tags */}
                    {useCases && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {(locale === 'ko' ? useCases.ko : useCases.en).map(
                          (tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-[10px] px-1.5 py-0 h-4"
                            >
                              {tag}
                            </Badge>
                          )
                        )}
                      </div>
                    )}

                    <div className="flex items-center text-sm font-semibold text-brand-green group-hover:gap-2 transition-all">
                      바로 시작하기
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
