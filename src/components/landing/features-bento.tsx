'use client';

import { Map, Key, CheckCircle2, Layers, ArrowRight } from 'lucide-react';
import { ScrollReveal } from './scroll-reveal';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';

function ServiceMapVisual() {
  return (
    <div className="h-48 w-full rounded-lg border border-[#e7efe9] dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950/80 p-4 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center opacity-70">
        <svg viewBox="0 0 400 200" width="100%" height="100%">
          {/* Central node */}
          <rect x="155" y="78" width="90" height="44" rx="8" className="fill-white dark:fill-[#18181b]" stroke="#2bee79" strokeWidth="2" />
          <text x="200" y="104" textAnchor="middle" fill="#2bee79" fontSize="10" fontFamily="monospace">Next.js</text>

          {/* Source node */}
          <circle cx="60" cy="100" r="18" className="fill-white dark:fill-[#18181b]" stroke="#2bee79" strokeWidth="2" />
          <text x="60" y="104" textAnchor="middle" fill="#2bee79" fontSize="10" fontFamily="monospace">SRC</text>

          {/* Connection lines with glow */}
          <line x1="78" y1="100" x2="155" y2="100" stroke="#2bee79" strokeWidth="1.5" opacity="0.4" />
          <line x1="245" y1="90" x2="310" y2="60" className="stroke-gray-300 dark:stroke-[#3f3f46]" strokeWidth="1.5" strokeDasharray="4 3" />
          <line x1="245" y1="100" x2="310" y2="100" className="stroke-gray-300 dark:stroke-[#3f3f46]" strokeWidth="1.5" strokeDasharray="4 3" />
          <line x1="245" y1="110" x2="310" y2="140" className="stroke-gray-300 dark:stroke-[#3f3f46]" strokeWidth="1.5" strokeDasharray="4 3" />

          {/* Target nodes */}
          <rect x="310" y="45" width="70" height="30" rx="6" className="fill-white dark:fill-[#18181b] stroke-gray-300 dark:stroke-[#3f3f46]" strokeWidth="1" />
          <text x="345" y="64" textAnchor="middle" className="fill-gray-500 dark:fill-[#a1a1aa]" fontSize="9" fontFamily="monospace">Supabase</text>
          <rect x="310" y="85" width="70" height="30" rx="6" className="fill-white dark:fill-[#18181b] stroke-gray-300 dark:stroke-[#3f3f46]" strokeWidth="1" />
          <text x="345" y="104" textAnchor="middle" className="fill-gray-500 dark:fill-[#a1a1aa]" fontSize="9" fontFamily="monospace">Naver API</text>
          <rect x="310" y="125" width="70" height="30" rx="6" className="fill-white dark:fill-[#18181b] stroke-gray-300 dark:stroke-[#3f3f46]" strokeWidth="1" />
          <text x="345" y="144" textAnchor="middle" className="fill-gray-500 dark:fill-[#a1a1aa]" fontSize="9" fontFamily="monospace">OpenAI</text>

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
    <div className="flex-1 rounded-lg bg-gray-50 dark:bg-zinc-950 border border-[#e7efe9] dark:border-zinc-800 p-4 font-mono text-xs text-gray-600 dark:text-gray-300 shadow-inner">
      <div className="flex gap-1.5 mb-3">
        <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
      </div>
      <div className="space-y-1">
        <p><span className="text-purple-500 dark:text-purple-400">export</span> const <span className="text-blue-500 dark:text-blue-400">config</span> = {'{'}</p>
        <p className="pl-4">apiKey: <span className="text-green-600 dark:text-green-400">process.env.NAVER_CLIENT_ID</span>,</p>
        <p className="pl-4">dbHost: <span className="text-green-600 dark:text-green-400">process.env.SUPABASE_URL</span>,</p>
        <p className="pl-4">aiKey: <span className="text-green-600 dark:text-green-400">process.env.OPENAI_API_KEY</span></p>
        <p>{'}'}</p>
        <p className="text-gray-400 dark:text-zinc-600 mt-2">{'// Variables injected securely at runtime'}</p>
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
        <div key={i} className={`flex items-center gap-3 rounded-lg bg-gray-50 dark:bg-zinc-950/80 p-3 border border-[#e7efe9] dark:border-zinc-800 transition-colors ${item.done ? 'hover:border-gray-300 dark:hover:border-zinc-700' : 'opacity-50'}`}>
          <CheckCircle2 className={`w-4 h-4 shrink-0 ${item.done ? 'text-[#2bee79]' : 'text-gray-400 dark:text-zinc-600'}`} />
          <span className={`text-xs font-mono ${item.done ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-zinc-600'}`}>{item.text}</span>
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
        <div key={i} className={`flex flex-col items-center justify-center rounded-lg border border-[#e7efe9] dark:border-zinc-800 bg-gradient-to-br ${tmpl.color} p-4 transition-colors hover:border-gray-300 dark:hover:border-zinc-700`}>
          <div className="h-8 w-8 rounded-lg bg-gray-200 dark:bg-zinc-800 mb-2" />
          <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">{tmpl.name}</span>
        </div>
      ))}
    </div>
  );
}

export function FeaturesBento() {
  const { locale } = useLocaleStore();

  return (
    <section className="py-24 bg-white dark:bg-[#0a0a0a]" id="features">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t(locale, 'landing.featuresTitle')}</h2>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">{t(locale, 'landing.featuresDesc')}</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Map Visualization (2 cols) */}
          <ScrollReveal className="col-span-1 md:col-span-2" delay={0.1}>
            <div className="group relative overflow-hidden rounded-2xl border border-[#e7efe9] dark:border-zinc-800 bg-white dark:bg-zinc-900/60 backdrop-blur-sm p-8 transition-all hover:border-gray-300 dark:hover:border-zinc-700 hover:shadow-lg hover:shadow-[#2bee79]/5 h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-[#2bee79]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex flex-col h-full justify-between">
                <div>
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#2bee79]/10 text-[#2bee79]">
                    <Map className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold">{t(locale, 'landing.featureMapTitle')}</h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{t(locale, 'landing.featureMapDesc')}</p>
                </div>
                <div className="mt-8">
                  <ServiceMapVisual />
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 2: Checklist */}
          <ScrollReveal delay={0.2}>
            <div className="group relative overflow-hidden rounded-2xl border border-[#e7efe9] dark:border-zinc-800 bg-white dark:bg-zinc-900/60 backdrop-blur-sm p-8 transition-all hover:border-gray-300 dark:hover:border-zinc-700 hover:shadow-lg hover:shadow-[#2bee79]/5 h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-[#2bee79]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#2bee79]/10 text-[#2bee79]">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold">{t(locale, 'landing.featureChecklistTitle')}</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{t(locale, 'landing.featureChecklistDesc')}</p>
                <ChecklistVisual locale={locale} />
              </div>
            </div>
          </ScrollReveal>

          {/* Card 3: Templates */}
          <ScrollReveal delay={0.3}>
            <div className="group relative overflow-hidden rounded-2xl border border-[#e7efe9] dark:border-zinc-800 bg-white dark:bg-zinc-900/60 backdrop-blur-sm p-8 transition-all hover:border-gray-300 dark:hover:border-zinc-700 hover:shadow-lg hover:shadow-[#2bee79]/5 h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-[#2bee79]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#2bee79]/10 text-[#2bee79]">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold">{t(locale, 'landing.featureTemplateTitle')}</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{t(locale, 'landing.featureTemplateDesc')}</p>
                <TemplateVisual locale={locale} />
              </div>
            </div>
          </ScrollReveal>

          {/* Card 4: Env Vars (2 cols, horizontal layout) */}
          <ScrollReveal className="col-span-1 md:col-span-2" delay={0.4}>
            <div className="group relative overflow-hidden rounded-2xl border border-[#e7efe9] dark:border-zinc-800 bg-white dark:bg-zinc-900/60 backdrop-blur-sm p-8 transition-all hover:border-gray-300 dark:hover:border-zinc-700 hover:shadow-lg hover:shadow-[#2bee79]/5">
              <div className="absolute inset-0 bg-gradient-to-br from-[#2bee79]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex flex-col md:flex-row h-full gap-8">
                <div className="flex-1">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#2bee79]/10 text-[#2bee79]">
                    <Key className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold">{t(locale, 'landing.featureEnvTitle')}</h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{t(locale, 'landing.featureEnvDesc')}</p>
                  <a className="mt-6 inline-flex items-center text-sm font-bold text-[#2bee79] hover:underline group/link" href="#">
                    AES-256-GCM <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover/link:translate-x-1" />
                  </a>
                </div>
                <EnvVarVisual />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
