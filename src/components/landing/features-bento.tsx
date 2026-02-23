'use client';

import { Map, Key, CheckCircle2, Layers, ArrowRight, Brain, Sparkles } from 'lucide-react';
import { ScrollReveal } from './scroll-reveal';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';

function ServiceMapVisual() {
  return (
    <div className="h-48 w-full rounded-lg border border-border bg-muted p-4 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center opacity-70">
        <svg viewBox="0 0 400 200" width="100%" height="100%">
          {/* Central node */}
          <rect x="155" y="78" width="90" height="44" rx="8" fill="var(--landing-card-bg)" stroke="var(--brand-blue)" strokeWidth="2" />
          <text x="200" y="104" textAnchor="middle" fill="var(--brand-blue)" fontSize="10" fontFamily="monospace">Next.js</text>

          {/* Source node */}
          <circle cx="60" cy="100" r="18" fill="var(--landing-card-bg)" stroke="var(--brand-blue)" strokeWidth="2" />
          <text x="60" y="104" textAnchor="middle" fill="var(--brand-blue)" fontSize="10" fontFamily="monospace">SRC</text>

          {/* Connection lines */}
          <line x1="78" y1="100" x2="155" y2="100" stroke="var(--brand-blue)" strokeWidth="1.5" opacity="0.4" />
          <line x1="245" y1="90" x2="310" y2="60" stroke="var(--flow-edge-color)" strokeWidth="1.5" strokeDasharray="4 3" />
          <line x1="245" y1="100" x2="310" y2="100" stroke="var(--flow-edge-color)" strokeWidth="1.5" strokeDasharray="4 3" />
          <line x1="245" y1="110" x2="310" y2="140" stroke="var(--flow-edge-color)" strokeWidth="1.5" strokeDasharray="4 3" />

          {/* Target nodes */}
          <rect x="310" y="45" width="70" height="30" rx="6" fill="var(--landing-card-bg)" stroke="var(--flow-edge-color)" strokeWidth="1" />
          <text x="345" y="64" textAnchor="middle" fill="var(--landing-muted)" fontSize="9" fontFamily="monospace">Supabase</text>
          <rect x="310" y="85" width="70" height="30" rx="6" fill="var(--landing-card-bg)" stroke="var(--flow-edge-color)" strokeWidth="1" />
          <text x="345" y="104" textAnchor="middle" fill="var(--landing-muted)" fontSize="9" fontFamily="monospace">Naver API</text>
          <rect x="310" y="125" width="70" height="30" rx="6" fill="var(--landing-card-bg)" stroke="var(--flow-edge-color)" strokeWidth="1" />
          <text x="345" y="144" textAnchor="middle" fill="var(--landing-muted)" fontSize="9" fontFamily="monospace">OpenAI</text>

          {/* Status dots */}
          <circle cx="314" cy="49" r="3" fill="#22c55e" />
          <circle cx="314" cy="89" r="3" fill="#22c55e" />
          <circle cx="314" cy="129" r="3" fill="#eab308" />
        </svg>
      </div>
    </div>
  );
}

function EnvVarVisual() {
  return (
    <div className="flex-1 rounded-lg bg-muted border border-border p-4 font-mono text-xs text-foreground/70 shadow-inner">
      <div className="flex gap-1.5 mb-3">
        <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
      </div>
      <div className="space-y-1">
        <p><span className="text-purple-600 dark:text-purple-400">export</span> const <span className="text-blue-600 dark:text-blue-400">config</span> = {'{'}</p>
        <p className="pl-4">apiKey: <span className="text-green-600 dark:text-green-400">process.env.NAVER_CLIENT_ID</span>,</p>
        <p className="pl-4">dbHost: <span className="text-green-600 dark:text-green-400">process.env.SUPABASE_URL</span>,</p>
        <p className="pl-4">aiKey: <span className="text-green-600 dark:text-green-400">process.env.OPENAI_API_KEY</span></p>
        <p>{'}'}</p>
        <p className="text-muted-foreground mt-2">{'// Variables injected securely at runtime'}</p>
      </div>
    </div>
  );
}

function ChecklistVisual({ locale }: { locale: 'ko' | 'en' }) {
  const items = [
    { text: t(locale, 'landing.checklistItem1'), done: true },
    { text: t(locale, 'landing.checklistItem2'), done: true },
    { text: t(locale, 'landing.checklistItem3'), done: false },
  ];

  return (
    <div className="mt-6 flex flex-col gap-3">
      {items.map((item, i) => (
        <div key={i} className={`flex items-center gap-3 rounded-lg bg-muted p-3 border border-border transition-colors ${item.done ? 'hover:border-brand-blue/30' : 'opacity-50'}`}>
          <CheckCircle2 className={`w-4 h-4 shrink-0 ${item.done ? 'text-brand-green' : 'text-muted-foreground/50'}`} />
          <span className={`text-xs font-mono ${item.done ? 'text-foreground/70' : 'text-muted-foreground/50'}`}>{item.text}</span>
        </div>
      ))}
    </div>
  );
}

function TemplateVisual({ locale }: { locale: 'ko' | 'en' }) {
  const templates = [
    { name: t(locale, 'landing.templateName1'), color: 'from-blue-500/20 to-cyan-500/20' },
    { name: t(locale, 'landing.templateName2'), color: 'from-purple-500/20 to-pink-500/20' },
  ];

  return (
    <div className="mt-6 grid grid-cols-2 gap-3">
      {templates.map((tmpl, i) => (
        <div key={i} className={`flex flex-col items-center justify-center rounded-lg border border-border bg-gradient-to-br ${tmpl.color} p-4 transition-colors hover:border-brand-blue/30`}>
          <div className="h-8 w-8 rounded-lg bg-border mb-2" />
          <span className="text-[10px] text-muted-foreground font-medium">{tmpl.name}</span>
        </div>
      ))}
    </div>
  );
}

const featureColors = [
  { bg: 'bg-brand-blue-light', text: 'text-brand-blue' },
  { bg: 'bg-[hsl(145,60%,90%)] dark:bg-[hsl(145,60%,18%)]', text: 'text-[hsl(145,60%,30%)] dark:text-[hsl(145,60%,65%)]' },
  { bg: 'bg-[hsl(45,80%,90%)] dark:bg-[hsl(45,80%,18%)]', text: 'text-[hsl(45,80%,30%)] dark:text-[hsl(45,80%,65%)]' },
  { bg: 'bg-[hsl(270,50%,92%)] dark:bg-[hsl(270,50%,20%)]', text: 'text-[hsl(270,50%,35%)] dark:text-[hsl(270,50%,70%)]' },
  { bg: 'bg-[hsl(200,80%,90%)] dark:bg-[hsl(200,80%,18%)]', text: 'text-[hsl(200,80%,30%)] dark:text-[hsl(200,80%,65%)]' },
];

export function FeaturesBento() {
  const { locale } = useLocaleStore();

  return (
    <section className="py-24 bg-card" id="features">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-blue mb-3 flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-brand-blue" />
              CORE FEATURES
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">{t(locale, 'landing.featuresTitle')}</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">{t(locale, 'landing.featuresDesc')}</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Map Visualization (2 cols) */}
          <ScrollReveal className="col-span-1 md:col-span-2" delay={0.1}>
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:shadow-md hover:-translate-y-0.5 h-full">
              <div className="relative flex flex-col h-full justify-between">
                <div>
                  <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl ${featureColors[0].bg} ${featureColors[0].text}`}>
                    <Map className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{t(locale, 'landing.featureMapTitle')}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t(locale, 'landing.featureMapDesc')}</p>
                </div>
                <div className="mt-8">
                  <ServiceMapVisual />
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 2: Checklist */}
          <ScrollReveal delay={0.2}>
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:shadow-md hover:-translate-y-0.5 h-full">
              <div className="relative">
                <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl ${featureColors[1].bg} ${featureColors[1].text}`}>
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{t(locale, 'landing.featureChecklistTitle')}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t(locale, 'landing.featureChecklistDesc')}</p>
                <ChecklistVisual locale={locale} />
              </div>
            </div>
          </ScrollReveal>

          {/* Card 3: Templates */}
          <ScrollReveal delay={0.3}>
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:shadow-md hover:-translate-y-0.5 h-full">
              <div className="relative">
                <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl ${featureColors[2].bg} ${featureColors[2].text}`}>
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{t(locale, 'landing.featureTemplateTitle')}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t(locale, 'landing.featureTemplateDesc')}</p>
                <TemplateVisual locale={locale} />
              </div>
            </div>
          </ScrollReveal>

          {/* Card 4: Env Vars (2 cols, horizontal layout) */}
          <ScrollReveal className="col-span-1 md:col-span-2" delay={0.4}>
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:shadow-md hover:-translate-y-0.5">
              <div className="relative flex flex-col md:flex-row h-full gap-8">
                <div className="flex-1">
                  <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl ${featureColors[3].bg} ${featureColors[3].text}`}>
                    <Key className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{t(locale, 'landing.featureEnvTitle')}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t(locale, 'landing.featureEnvDesc')}</p>
                  <a className="mt-6 inline-flex items-center text-sm font-bold text-brand-blue hover:underline group/link" href="#">
                    AES-256-GCM <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover/link:translate-x-1" />
                  </a>
                </div>
                <EnvVarVisual />
              </div>
            </div>
          </ScrollReveal>

          {/* Card 5: AI-Powered (full width) */}
          <ScrollReveal className="col-span-1 md:col-span-3" delay={0.5}>
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card to-brand-blue-light/50 p-8 transition-all hover:shadow-md hover:-translate-y-0.5">
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${featureColors[4].bg} ${featureColors[4].text}`}>
                    <Brain className="w-5 h-5" />
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-brand-blue/20 bg-brand-blue-light px-3 py-1 text-xs font-medium text-brand-blue">
                    <Sparkles className="w-3 h-3" />
                    AI-Powered
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground">{t(locale, 'landing.aiSectionTitle')}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-2xl">{t(locale, 'landing.aiSectionDesc')}</p>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {[
                    { titleKey: 'landing.aiFeature1Title', descKey: 'landing.aiFeature1Desc' },
                    { titleKey: 'landing.aiFeature2Title', descKey: 'landing.aiFeature2Desc' },
                    { titleKey: 'landing.aiFeature3Title', descKey: 'landing.aiFeature3Desc' },
                    { titleKey: 'landing.aiFeature4Title', descKey: 'landing.aiFeature4Desc' },
                    { titleKey: 'landing.aiFeature5Title', descKey: 'landing.aiFeature5Desc' },
                  ].map((ai) => (
                    <div key={ai.titleKey} className="rounded-xl bg-card/80 border border-border/50 dark:bg-accent p-4 transition-all hover:border-brand-blue/30">
                      <h4 className="text-sm font-bold text-foreground mb-1">{t(locale, ai.titleKey)}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{t(locale, ai.descKey)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
