'use client';

import { Map, Key, CheckCircle2, Layers, ArrowRight, Brain, Sparkles } from 'lucide-react';
import { ScrollReveal } from './scroll-reveal';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';

function ServiceMapVisual() {
  return (
    <div className="h-48 w-full rounded-xl border border-border/50 bg-background/50 backdrop-blur-md p-4 relative overflow-hidden group-hover:border-brand-blue/30 transition-colors">
      <div className="absolute inset-0 flex items-center justify-center opacity-80">
        <svg viewBox="0 0 400 200" width="100%" height="100%">
          <defs>
            <filter id="neon-glow-blue" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Central node */}
          <rect x="155" y="78" width="90" height="44" rx="8" fill="var(--landing-card-bg)" stroke="var(--brand-blue)" strokeWidth="2" filter="url(#neon-glow-blue)" />
          <text x="200" y="104" textAnchor="middle" fill="var(--foreground)" fontSize="10" fontFamily="monospace" fontWeight="bold">Next.js</text>

          {/* Source node */}
          <circle cx="60" cy="100" r="18" fill="var(--landing-card-bg)" stroke="var(--brand-blue)" strokeWidth="2" />
          <text x="60" y="104" textAnchor="middle" fill="var(--foreground)" fontSize="10" fontFamily="monospace" fontWeight="bold">SRC</text>

          {/* Connection lines */}
          <line x1="78" y1="100" x2="155" y2="100" stroke="var(--brand-blue)" strokeWidth="2" opacity="0.6" className="animate-pulse" />
          <line x1="245" y1="90" x2="310" y2="60" stroke="var(--brand-green)" strokeWidth="1.5" strokeDasharray="4 3" className="animate-dash-flow" />
          <line x1="245" y1="100" x2="310" y2="100" stroke="var(--brand-green)" strokeWidth="1.5" strokeDasharray="4 3" className="animate-dash-flow" />
          <line x1="245" y1="110" x2="310" y2="140" stroke="#eab308" strokeWidth="1.5" strokeDasharray="4 3" />

          {/* Target nodes */}
          <rect x="310" y="45" width="70" height="30" rx="6" fill="var(--landing-card-bg)" stroke="var(--brand-green)" strokeWidth="1" />
          <text x="345" y="64" textAnchor="middle" fill="var(--foreground)" fontSize="9" fontFamily="monospace">Supabase</text>
          <rect x="310" y="85" width="70" height="30" rx="6" fill="var(--landing-card-bg)" stroke="var(--brand-green)" strokeWidth="1" />
          <text x="345" y="104" textAnchor="middle" fill="var(--foreground)" fontSize="9" fontFamily="monospace">Naver API</text>
          <rect x="310" y="125" width="70" height="30" rx="6" fill="var(--landing-card-bg)" stroke="#eab308" strokeWidth="1" />
          <text x="345" y="144" textAnchor="middle" fill="var(--foreground)" fontSize="9" fontFamily="monospace">OpenAI</text>

          {/* Status dots */}
          <circle cx="314" cy="49" r="4" fill="#10B981" filter="url(#neon-glow-blue)" />
          <circle cx="314" cy="89" r="4" fill="#10B981" filter="url(#neon-glow-blue)" />
          <circle cx="314" cy="129" r="4" fill="#eab308" />
        </svg>
      </div>
    </div>
  );
}

function EnvVarVisual() {
  return (
    <div className="flex-1 rounded-xl bg-background/60 backdrop-blur-md border border-border/50 p-5 font-mono text-xs text-foreground/80 shadow-inner group-hover:border-brand-green/30 transition-colors">
      <div className="flex gap-1.5 mb-4 border-b border-border/30 pb-3">
        <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
        <div className="ml-3 text-[10px] text-muted-foreground opacity-70">.env.local mapping</div>
      </div>
      <div className="space-y-1.5 line-height-relaxed">
        <p><span className="text-pink-500 dark:text-pink-400 font-bold">export</span> <span className="text-purple-500">const</span> <span className="text-blue-500 dark:text-blue-400 font-bold">config</span> = {'{'}</p>
        <p className="pl-4">apiKey: <span className="text-brand-green drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]">process.env.NAVER_CLIENT_ID</span>,</p>
        <p className="pl-4">dbHost: <span className="text-brand-green drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]">process.env.SUPABASE_URL</span>,</p>
        <p className="pl-4">aiKey: <span className="text-brand-green drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]">process.env.OPENAI_API_KEY</span></p>
        <p>{'}'}</p>
        <p className="text-muted-foreground/60 mt-3 italic">{'// Variables injected securely at runtime'}</p>
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
        <div key={i} className={`flex items-center gap-3 rounded-lg bg-background/50 backdrop-blur-sm p-3 border border-border/50 transition-colors ${item.done ? 'group-hover:border-brand-green/30 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]' : 'opacity-60'}`}>
          <CheckCircle2 className={`w-4 h-4 shrink-0 ${item.done ? 'text-brand-green drop-shadow-[0_0_6px_rgba(16,185,129,0.6)]' : 'text-muted-foreground/50'}`} />
          <span className={`text-xs font-mono tracking-tight ${item.done ? 'text-foreground/90 font-medium' : 'text-muted-foreground/60'}`}>{item.text}</span>
        </div>
      ))}
    </div>
  );
}

function TemplateVisual({ locale }: { locale: 'ko' | 'en' }) {
  const templates = [
    { name: t(locale, 'landing.templateName1'), glow: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]', border: 'hover:border-blue-500/50' },
    { name: t(locale, 'landing.templateName2'), glow: 'shadow-[0_0_15px_rgba(168,85,247,0.3)]', border: 'hover:border-purple-500/50' },
  ];

  return (
    <div className="mt-6 grid grid-cols-2 gap-3">
      {templates.map((tmpl, i) => (
        <div key={i} className={`flex flex-col items-center justify-center rounded-xl border border-border/50 bg-background/60 backdrop-blur-md p-4 transition-all duration-300 ${tmpl.border} group-hover:${tmpl.glow}`}>
          <div className="h-8 w-8 rounded-lg bg-card border border-border mb-3 shadow-inner flex items-center justify-center">
            <Layers className="w-4 h-4 text-muted-foreground" />
          </div>
          <span className="text-[10px] text-foreground/80 font-bold uppercase tracking-wider">{tmpl.name}</span>
        </div>
      ))}
    </div>
  );
}

const featureColors = [
  { bg: 'bg-brand-blue/10 dark:bg-brand-blue/20', text: 'text-brand-blue drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' },
  { bg: 'bg-brand-green/10 dark:bg-brand-green/20', text: 'text-brand-green drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' },
  { bg: 'bg-purple-500/10 dark:bg-purple-500/20', text: 'text-purple-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]' },
  { bg: 'bg-pink-500/10 dark:bg-pink-500/20', text: 'text-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]' },
  { bg: 'bg-blue-400/10 dark:bg-blue-400/20', text: 'text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]' },
];

export function FeaturesBento() {
  const { locale } = useLocaleStore();

  return (
    <section className="py-24 relative overflow-hidden" id="features">
      {/* Background gradients for the section */}
      <div className="absolute inset-0 -z-10 bg-background" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-blue/5 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-green/5 rounded-full blur-[100px] -z-10" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-green mb-4 flex items-center justify-center gap-2 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]">
              <span className="inline-block w-2 h-2 rounded-full bg-brand-green animate-pulse" />
              THE WORKSPACE
            </p>
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-foreground drop-shadow-sm">{t(locale, 'landing.featuresTitle')}</h2>
            <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">{t(locale, 'landing.featuresDesc')}</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Map Visualization (2 cols) */}
          <ScrollReveal className="col-span-1 md:col-span-2" delay={0.1}>
            <div className="group relative h-full overflow-hidden rounded-3xl border border-border/40 bg-card/40 backdrop-blur-xl p-8 transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 hover:border-brand-blue/30 dark:hover:shadow-[0_8px_30px_rgba(59,130,246,0.1)]">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative flex flex-col h-full justify-between z-10">
                <div>
                  <div className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${featureColors[0].bg} ${featureColors[0].text} ring-1 ring-inset ring-brand-blue/20`}>
                    <Map className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground tracking-tight">{t(locale, 'landing.featureMapTitle')}</h3>
                  <p className="mt-3 text-base text-muted-foreground leading-relaxed max-w-md">{t(locale, 'landing.featureMapDesc')}</p>
                </div>
                <div className="mt-8">
                  <ServiceMapVisual />
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 2: Checklist */}
          <ScrollReveal delay={0.2}>
            <div className="group relative h-full overflow-hidden rounded-3xl border border-border/40 bg-card/40 backdrop-blur-xl p-8 transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 hover:border-brand-green/30 dark:hover:shadow-[0_8px_30px_rgba(16,185,129,0.1)]">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${featureColors[1].bg} ${featureColors[1].text} ring-1 ring-inset ring-brand-green/20`}>
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-foreground tracking-tight">{t(locale, 'landing.featureChecklistTitle')}</h3>
                <p className="mt-3 text-base text-muted-foreground leading-relaxed">{t(locale, 'landing.featureChecklistDesc')}</p>
                <ChecklistVisual locale={locale} />
              </div>
            </div>
          </ScrollReveal>

          {/* Card 3: Templates */}
          <ScrollReveal delay={0.3}>
            <div className="group relative h-full overflow-hidden rounded-3xl border border-border/40 bg-card/40 backdrop-blur-xl p-8 transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 hover:border-purple-500/30 dark:hover:shadow-[0_8px_30px_rgba(168,85,247,0.1)]">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${featureColors[2].bg} ${featureColors[2].text} ring-1 ring-inset ring-purple-500/20`}>
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-foreground tracking-tight">{t(locale, 'landing.featureTemplateTitle')}</h3>
                <p className="mt-3 text-base text-muted-foreground leading-relaxed">{t(locale, 'landing.featureTemplateDesc')}</p>
                <TemplateVisual locale={locale} />
              </div>
            </div>
          </ScrollReveal>

          {/* Card 4: Env Vars (2 cols, horizontal layout) */}
          <ScrollReveal className="col-span-1 md:col-span-2" delay={0.4}>
            <div className="group relative overflow-hidden rounded-3xl border border-border/40 bg-card/40 backdrop-blur-xl p-8 transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 hover:border-brand-green/30 dark:hover:shadow-[0_8px_30px_rgba(16,185,129,0.1)]">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative flex flex-col md:flex-row h-full gap-10 z-10">
                <div className="flex-1">
                  <div className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${featureColors[1].bg} ${featureColors[1].text} ring-1 ring-inset ring-brand-green/20`}>
                    <Key className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground tracking-tight">{t(locale, 'landing.featureEnvTitle')}</h3>
                  <p className="mt-3 text-base text-muted-foreground leading-relaxed">{t(locale, 'landing.featureEnvDesc')}</p>
                  <a className="mt-8 inline-flex items-center text-sm font-bold text-brand-green hover:text-brand-green/80 group/link bg-brand-green/10 px-4 py-2 rounded-full border border-brand-green/20" href="#">
                    AES-256-GCM <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/link:translate-x-1" />
                  </a>
                </div>
                <EnvVarVisual />
              </div>
            </div>
          </ScrollReveal>

          {/* Card 5: AI-Powered (full width) */}
          <ScrollReveal className="col-span-1 md:col-span-3" delay={0.5}>
            <div className="group relative overflow-hidden rounded-3xl border border-border/40 bg-card/40 backdrop-blur-xl p-10 transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 hover:border-brand-blue/30 dark:hover:shadow-[0_8px_30px_rgba(59,130,246,0.15)] overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.15)_0%,transparent_60%)] opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${featureColors[0].bg} ${featureColors[0].text} ring-1 ring-inset ring-brand-blue/20`}>
                      <Brain className="w-7 h-7" />
                    </div>
                    <h3 className="text-3xl font-extrabold text-foreground tracking-tight">{t(locale, 'landing.aiSectionTitle')}</h3>
                  </div>
                  <div className="hidden sm:inline-flex items-center gap-2 rounded-full border border-brand-blue/30 bg-brand-blue/10 px-4 py-1.5 text-sm font-bold text-brand-blue shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                    <Sparkles className="w-4 h-4" />
                    AI-Powered MCP
                  </div>
                </div>

                <p className="mb-10 text-lg text-muted-foreground leading-relaxed max-w-3xl">{t(locale, 'landing.aiSectionDesc')}</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-5">
                  {[
                    { titleKey: 'landing.aiFeature1Title', descKey: 'landing.aiFeature1Desc' },
                    { titleKey: 'landing.aiFeature2Title', descKey: 'landing.aiFeature2Desc' },
                    { titleKey: 'landing.aiFeature3Title', descKey: 'landing.aiFeature3Desc' },
                    { titleKey: 'landing.aiFeature4Title', descKey: 'landing.aiFeature4Desc' },
                    { titleKey: 'landing.aiFeature5Title', descKey: 'landing.aiFeature5Desc' },
                  ].map((ai, idx) => (
                    <div key={ai.titleKey} className="rounded-2xl bg-background/60 backdrop-blur-md border border-border/50 p-5 transition-all duration-300 hover:border-brand-blue/40 hover:bg-card/80 hover:-translate-y-1 hover:shadow-lg">
                      <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-bold text-xs mb-4 border border-brand-blue/20">0{idx + 1}</div>
                      <h4 className="text-base font-bold text-foreground mb-2">{t(locale, ai.titleKey)}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{t(locale, ai.descKey)}</p>
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
