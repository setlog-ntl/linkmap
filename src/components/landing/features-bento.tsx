'use client';

import { Map, Key, CheckCircle2, Layers } from 'lucide-react';
import { FeatureCard } from './feature-card';
import { ScrollReveal } from './scroll-reveal';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';

function ServiceMapVisual() {
  return (
    <div className="flex items-center justify-center gap-3">
      {/* Animated connection lines */}
      <div className="relative w-32 h-24">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-primary/40 animate-pulse" />
        </div>
        {[
          'top-0 left-0',
          'top-0 right-0',
          'bottom-0 left-0',
          'bottom-0 right-0',
        ].map((pos, i) => (
          <div
            key={i}
            className={`absolute ${pos} w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800 animate-float`}
            style={{ animationDelay: `${i * 0.5}s` }}
          />
        ))}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 128 96">
          <line x1="16" y1="16" x2="54" y2="42" className="stroke-border" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="112" y1="16" x2="74" y2="42" className="stroke-border" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="16" y1="80" x2="54" y2="54" className="stroke-border" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="112" y1="80" x2="74" y2="54" className="stroke-border" strokeWidth="1.5" strokeDasharray="4 4" />
        </svg>
      </div>
    </div>
  );
}

function EnvVarVisual() {
  return (
    <div className="font-mono text-[10px] text-left px-6 space-y-1 text-muted-foreground">
      <div><span className="text-green-600 dark:text-green-400">SUPABASE_URL</span>=https://...</div>
      <div><span className="text-yellow-600 dark:text-yellow-400">STRIPE_KEY</span>=<span className="text-muted-foreground/50">••••••••••</span></div>
      <div><span className="text-blue-600 dark:text-blue-400">OPENAI_KEY</span>=<span className="text-muted-foreground/50">••••••••••</span></div>
      <div className="flex items-center gap-1 mt-2 text-primary">
        <Key className="w-3 h-3" />
        <span className="text-[9px]">AES-256-GCM</span>
      </div>
    </div>
  );
}

function ChecklistVisual({ locale }: { locale: 'ko' | 'en' }) {
  const items = [
    t(locale, 'landing.checklistItem1'),
    t(locale, 'landing.checklistItem2'),
    t(locale, 'landing.checklistItem3'),
  ];

  return (
    <div className="px-6 space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <CheckCircle2 className={`w-4 h-4 ${i < 2 ? 'text-green-500' : 'text-muted-foreground/30'}`} />
          <span className={i < 2 ? 'text-muted-foreground line-through' : ''}>{item}</span>
        </div>
      ))}
      <div className="h-1.5 rounded-full bg-muted mt-2">
        <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-green-500 to-green-400" />
      </div>
    </div>
  );
}

function TemplateVisual({ locale }: { locale: 'ko' | 'en' }) {
  const names = [
    t(locale, 'landing.templateName1'),
    t(locale, 'landing.templateName2'),
    t(locale, 'landing.templateName3'),
  ];

  return (
    <div className="flex justify-center -space-x-4 group-hover:space-x-1 transition-all duration-500">
      {names.map((name, i) => (
        <div
          key={i}
          className="w-20 h-24 rounded-lg border bg-card shadow-sm flex items-center justify-center text-xs font-medium transition-transform duration-300"
          style={{ transform: `rotate(${(i - 1) * 6}deg)`, zIndex: 3 - i }}
        >
          {name}
        </div>
      ))}
    </div>
  );
}

export function FeaturesBento() {
  const { locale } = useLocaleStore();

  return (
    <section className="container py-14">
      <ScrollReveal>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">{t(locale, 'landing.featuresTitle')}</h2>
          <p className="text-muted-foreground text-lg">
            {t(locale, 'landing.featuresDesc')}
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
        {/* Service Map - 2x2 */}
        <ScrollReveal className="md:col-span-2 md:row-span-2" delay={0.1}>
          <FeatureCard
            icon={<Map className="w-4 h-4 text-primary" />}
            title={t(locale, 'landing.featureMapTitle')}
            description={t(locale, 'landing.featureMapDesc')}
            visual={<ServiceMapVisual />}
            className="h-full"
          />
        </ScrollReveal>

        {/* Checklist */}
        <ScrollReveal delay={0.2}>
          <FeatureCard
            icon={<CheckCircle2 className="w-4 h-4 text-primary" />}
            title={t(locale, 'landing.featureChecklistTitle')}
            description={t(locale, 'landing.featureChecklistDesc')}
            visual={<ChecklistVisual locale={locale} />}
          />
        </ScrollReveal>

        {/* Templates */}
        <ScrollReveal delay={0.3}>
          <FeatureCard
            icon={<Layers className="w-4 h-4 text-primary" />}
            title={t(locale, 'landing.featureTemplateTitle')}
            description={t(locale, 'landing.featureTemplateDesc')}
            visual={<TemplateVisual locale={locale} />}
          />
        </ScrollReveal>

        {/* Env Vars - full width */}
        <ScrollReveal className="md:col-span-3" delay={0.4}>
          <FeatureCard
            icon={<Key className="w-4 h-4 text-primary" />}
            title={t(locale, 'landing.featureEnvTitle')}
            description={t(locale, 'landing.featureEnvDesc')}
            visual={<EnvVarVisual />}
            badge="AES-256"
            className="md:flex-row"
          />
        </ScrollReveal>
      </div>
    </section>
  );
}
