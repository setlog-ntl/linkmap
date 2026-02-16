'use client';

import dynamic from 'next/dynamic';
import { ConnectionDashboard } from './connection-dashboard';
import { ScrollReveal } from './scroll-reveal';
import { Badge } from '@/components/ui/badge';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';

function FlowComparisonLoader() {
  const { locale } = useLocaleStore();
  return (
    <div className="rounded-xl border bg-card h-[380px] animate-pulse flex items-center justify-center">
      <span className="text-sm text-muted-foreground">{t(locale, 'landing.demoLoading')}</span>
    </div>
  );
}

const FlowComparison = dynamic(
  () => import('./flow-comparison').then((mod) => ({ default: mod.FlowComparison })),
  {
    ssr: false,
    loading: () => <FlowComparisonLoader />,
  }
);

export function InteractiveDemo() {
  const { locale } = useLocaleStore();

  return (
    <section id="interactive-demo" className="container py-14">
      <ScrollReveal>
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-3">{t(locale, 'landing.demoBadge')}</Badge>
          <h2 className="text-3xl font-bold mb-4">
            {t(locale, 'landing.demoSectionTitle')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t(locale, 'landing.demoSectionDesc')}
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* Flow Comparison (Tabs) */}
        <ScrollReveal delay={0.1}>
          <FlowComparison />
        </ScrollReveal>

        {/* Connection Dashboard */}
        <ScrollReveal delay={0.2}>
          <ConnectionDashboard />
        </ScrollReveal>
      </div>
    </section>
  );
}
