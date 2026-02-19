'use client';

import { Map, Key, CheckCircle2, Layers, ArrowRight } from 'lucide-react';
import { ScrollReveal } from './scroll-reveal';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';

function ServiceMapVisual() {
  return (
    <div className="h-48 w-full rounded border border-dashed border-gray-700 bg-[#0a0a0a]/50 p-4 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center opacity-60">
        <svg viewBox="0 0 400 200" width="100%" height="100%">
          <circle cx="60" cy="100" r="18" fill="#222" stroke="#2bee79" strokeWidth="2" />
          <text x="60" y="104" textAnchor="middle" fill="#2bee79" fontSize="10" fontFamily="monospace">SRC</text>
          <line x1="78" y1="100" x2="155" y2="100" stroke="#444" strokeWidth="2" />
          <rect x="155" y="78" width="90" height="44" rx="6" fill="#111" stroke="#2bee79" strokeWidth="2" />
          <text x="200" y="104" textAnchor="middle" fill="#2bee79" fontSize="10" fontFamily="monospace">Next.js</text>
          <line x1="245" y1="100" x2="310" y2="60" stroke="#444" strokeWidth="1.5" />
          <line x1="245" y1="100" x2="310" y2="100" stroke="#444" strokeWidth="1.5" />
          <line x1="245" y1="100" x2="310" y2="140" stroke="#444" strokeWidth="1.5" />
          <rect x="310" y="45" width="70" height="30" rx="4" fill="#111" stroke="#555" strokeWidth="1" />
          <text x="345" y="64" textAnchor="middle" fill="#999" fontSize="9" fontFamily="monospace">Supabase</text>
          <rect x="310" y="85" width="70" height="30" rx="4" fill="#111" stroke="#555" strokeWidth="1" />
          <text x="345" y="104" textAnchor="middle" fill="#999" fontSize="9" fontFamily="monospace">Naver API</text>
          <rect x="310" y="125" width="70" height="30" rx="4" fill="#111" stroke="#555" strokeWidth="1" />
          <text x="345" y="144" textAnchor="middle" fill="#999" fontSize="9" fontFamily="monospace">OpenAI</text>
        </svg>
      </div>
    </div>
  );
}

function EnvVarVisual() {
  return (
    <div className="flex-1 rounded bg-[#0d0d0d] border border-gray-800 p-4 font-mono text-xs text-gray-300 shadow-inner">
      <div className="flex gap-1.5 mb-3">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
      </div>
      <div className="space-y-1">
        <p><span className="text-purple-400">export</span> const <span className="text-blue-400">config</span> = {'{'}</p>
        <p className="pl-4">apiKey: <span className="text-green-400">process.env.NAVER_CLIENT_ID</span>,</p>
        <p className="pl-4">dbHost: <span className="text-green-400">process.env.SUPABASE_URL</span>,</p>
        <p className="pl-4">aiKey: <span className="text-green-400">process.env.OPENAI_API_KEY</span></p>
        <p>{'}'}</p>
        <p className="text-gray-600 mt-2">{'// Variables injected securely at runtime'}</p>
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
        <div key={i} className={`flex items-center gap-3 rounded bg-[#0a0a0a] p-2 border border-zinc-800 ${!item.done ? 'opacity-50' : ''}`}>
          <CheckCircle2 className={`w-4 h-4 shrink-0 ${item.done ? 'text-[#2bee79]' : 'text-gray-500'}`} />
          <span className={`text-xs font-mono ${item.done ? 'text-gray-300' : 'text-gray-500'}`}>{item.text}</span>
        </div>
      ))}
    </div>
  );
}

function TemplateVisual({ locale }: { locale: 'ko' | 'en' }) {
  const templates = [
    { name: t(locale, 'landing.templateName1'), icon: '📦' },
    { name: t(locale, 'landing.templateName2'), icon: '🤖' },
  ];

  return (
    <div className="mt-6 grid grid-cols-2 gap-2">
      {templates.map((tmpl, i) => (
        <div key={i} className="flex flex-col items-center justify-center rounded border border-gray-800 bg-[#0a0a0a] p-3">
          <span className="text-lg mb-1">{tmpl.icon}</span>
          <span className="text-[10px] text-gray-400">{tmpl.name}</span>
        </div>
      ))}
    </div>
  );
}

export function FeaturesBento() {
  const { locale } = useLocaleStore();

  return (
    <section className="py-24 bg-[#0a0a0a]" id="features">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal>
          <div className="mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{t(locale, 'landing.featuresTitle')}</h2>
            <p className="mt-4 text-lg text-gray-400">{t(locale, 'landing.featuresDesc')}</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Map Visualization (2 cols) */}
          <ScrollReveal className="col-span-1 md:col-span-2" delay={0.1}>
            <div className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-[#111] p-8 hover:border-gray-600 transition-colors h-full">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded bg-[#0a0a0a] text-[#2bee79]">
                    <Map className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{t(locale, 'landing.featureMapTitle')}</h3>
                  <p className="mt-2 text-sm text-gray-400">{t(locale, 'landing.featureMapDesc')}</p>
                </div>
                <div className="mt-8">
                  <ServiceMapVisual />
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 2: Checklist */}
          <ScrollReveal delay={0.2}>
            <div className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-[#111] p-8 hover:border-gray-600 transition-colors h-full">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded bg-[#0a0a0a] text-[#2bee79]">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white">{t(locale, 'landing.featureChecklistTitle')}</h3>
              <p className="mt-2 text-sm text-gray-400">{t(locale, 'landing.featureChecklistDesc')}</p>
              <ChecklistVisual locale={locale} />
            </div>
          </ScrollReveal>

          {/* Card 3: Templates */}
          <ScrollReveal delay={0.3}>
            <div className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-[#111] p-8 hover:border-gray-600 transition-colors h-full">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded bg-[#0a0a0a] text-[#2bee79]">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white">{t(locale, 'landing.featureTemplateTitle')}</h3>
              <p className="mt-2 text-sm text-gray-400">{t(locale, 'landing.featureTemplateDesc')}</p>
              <TemplateVisual locale={locale} />
            </div>
          </ScrollReveal>

          {/* Card 4: Env Vars (2 cols, horizontal layout) */}
          <ScrollReveal className="col-span-1 md:col-span-2" delay={0.4}>
            <div className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-[#111] p-8 hover:border-gray-600 transition-colors">
              <div className="flex flex-col md:flex-row h-full gap-8">
                <div className="flex-1">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded bg-[#0a0a0a] text-[#2bee79]">
                    <Key className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{t(locale, 'landing.featureEnvTitle')}</h3>
                  <p className="mt-2 text-sm text-gray-400">{t(locale, 'landing.featureEnvDesc')}</p>
                  <a className="mt-6 inline-flex items-center text-sm font-bold text-[#2bee79] hover:underline" href="#">
                    AES-256-GCM <ArrowRight className="w-3.5 h-3.5 ml-1" />
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
