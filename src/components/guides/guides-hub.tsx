'use client';

import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { GUIDE_CATEGORIES, GUIDE_LIST, type GuideCategory } from '@/data/ui/guide-meta';
import { Badge } from '@/components/ui/badge';

const categoryOrder: GuideCategory[] = ['concept', 'service'];

export function GuidesHub() {
  return (
    <div className="py-12 md:py-16 space-y-12">
      {/* Hero */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          가이드
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          바이브 코딩에 필요한 개념과 서비스 설정을 쉽게 따라할 수 있도록 정리했습니다
        </p>
      </div>

      {/* Category Sections */}
      {categoryOrder.map((catKey) => {
        const cat = GUIDE_CATEGORIES[catKey];
        const CatIcon = cat.icon;
        const guides = GUIDE_LIST.filter(g => g.category === catKey);

        return (
          <section key={catKey} className="space-y-4">
            {/* Category Header */}
            <div className="flex items-center gap-2">
              <CatIcon className="h-5 w-5 text-brand-blue" />
              <h2 className="text-xl font-semibold">{cat.label}</h2>
            </div>
            <p className="text-sm text-muted-foreground">{cat.description}</p>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {guides.map((guide) => {
                const Icon = guide.icon;
                return (
                  <Link
                    key={guide.slug}
                    href={guide.href}
                    className="group relative flex flex-col gap-3 rounded-lg border bg-card p-5 shadow-sm transition-all hover:border-brand-blue/50 hover:shadow-md"
                  >
                    {/* Icon + Badge row */}
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <Icon className="h-5 w-5 text-brand-blue" />
                      </div>
                      {guide.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {guide.badge}
                        </Badge>
                      )}
                    </div>

                    {/* Title + Description */}
                    <div className="space-y-1.5">
                      <h3 className="font-semibold group-hover:text-brand-blue transition-colors">
                        {guide.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {guide.description}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="mt-auto flex items-center justify-between pt-2">
                      {guide.readingTime && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {guide.readingTime}
                        </span>
                      )}
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-brand-blue group-hover:translate-x-0.5 transition-all ml-auto" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
