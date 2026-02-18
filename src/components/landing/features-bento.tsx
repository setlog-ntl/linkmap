'use client';

import { Map, Key, CheckCircle2, Layers } from 'lucide-react';
import { ScrollReveal } from './scroll-reveal';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';

function ServiceMapVisual() {
  return (
    <div className="flex items-center justify-center gap-3">
      <div className="relative w-40 h-28">
        {/* Center pulse */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-emerald-500/60 animate-pulse" />
          </div>
        </div>
        {/* Corner nodes */}
        {[
          { pos: 'top-0 left-2', label: 'DB' },
          { pos: 'top-0 right-2', label: 'API' },
          { pos: 'bottom-0 left-2', label: 'CI' },
          { pos: 'bottom-0 right-2', label: 'CDN' },
        ].map((node, i) => (
          <div
            key={i}
            className={`absolute ${node.pos} w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-[9px] font-mono text-emerald-400/80`}
            style={{ animationDelay: `${i * 0.5}s` }}
          >
            {node.label}
          </div>
        ))}
        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 160 112">
          <line x1="26" y1="20" x2="66" y2="50" className="stroke-emerald-500/20" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="134" y1="20" x2="94" y2="50" className="stroke-emerald-500/20" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="26" y1="92" x2="66" y2="62" className="stroke-emerald-500/20" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="134" y1="92" x2="94" y2="62" className="stroke-emerald-500/20" strokeWidth="1.5" strokeDasharray="4 4" />
        </svg>
      </div>
    </div>
  );
}

function EnvVarVisual() {
  return (
    <div className="font-mono text-[11px] text-left px-6 space-y-1.5 text-muted-foreground">
      <div><span className="text-emerald-400">SUPABASE_URL</span>=<span className="text-muted-foreground/60">https://xxx.supabase.co</span></div>
      <div><span className="text-yellow-400">STRIPE_KEY</span>=<span className="text-muted-foreground/40">sk_live_••••••••</span></div>
      <div><span className="text-blue-400">OPENAI_KEY</span>=<span className="text-muted-foreground/40">sk-••••••••••</span></div>
      <div className="flex items-center gap-1.5 mt-3 text-emerald-400/80">
        <Key className="w-3 h-3" />
        <span className="text-[10px] font-medium">AES-256-GCM Encrypted</span>
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
    <div className="px-6 space-y-2.5">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2.5 text-xs">
          <CheckCircle2 className={`w-4 h-4 shrink-0 ${item.done ? 'text-emerald-500' : 'text-muted-foreground/20'}`} />
          <span className={item.done ? 'text-muted-foreground line-through decoration-muted-foreground/30' : 'text-foreground/80'}>{item.text}</span>
        </div>
      ))}
      <div className="h-1.5 rounded-full bg-white/[0.05] mt-3">
        <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400" />
      </div>
    </div>
  );
}

function TemplateVisual({ locale }: { locale: 'ko' | 'en' }) {
  const templates = [
    { name: t(locale, 'landing.templateName1'), color: 'border-emerald-500/30' },
    { name: t(locale, 'landing.templateName2'), color: 'border-blue-500/30' },
    { name: t(locale, 'landing.templateName3'), color: 'border-violet-500/30' },
  ];

  return (
    <div className="flex justify-center -space-x-3 group-hover:space-x-1 transition-all duration-500">
      {templates.map((tmpl, i) => (
        <div
          key={i}
          className={`w-20 h-24 rounded-xl border ${tmpl.color} bg-white/[0.03] backdrop-blur-sm flex items-center justify-center text-xs font-medium text-foreground/70 transition-transform duration-300`}
          style={{ transform: `rotate(${(i - 1) * 6}deg)`, zIndex: 3 - i }}
        >
          {tmpl.name}
        </div>
      ))}
    </div>
  );
}

interface BentoCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  visual: React.ReactNode;
  badge?: string;
  className?: string;
}

function BentoCard({ icon, title, description, visual, badge, className = '' }: BentoCardProps) {
  return (
    <div className={`group relative rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm overflow-hidden hover:border-emerald-500/20 transition-all duration-300 ${className}`}>
      {/* Visual area */}
      <div className="relative h-40 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/[0.02] to-transparent" />
        {visual}
        {badge && (
          <span className="absolute top-3 right-3 text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
            {badge}
          </span>
        )}
      </div>

      {/* Content area */}
      <div className="p-5 border-t border-white/[0.04]">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
            {icon}
          </div>
          <h3 className="font-semibold text-foreground">{title}</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

export function FeaturesBento() {
  const { locale } = useLocaleStore();

  return (
    <section className="container py-20">
      <ScrollReveal>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t(locale, 'landing.featuresTitle')}</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            {t(locale, 'landing.featuresDesc')}
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
        {/* Service Map - 2x2 */}
        <ScrollReveal className="md:col-span-2 md:row-span-2" delay={0.1}>
          <BentoCard
            icon={<Map className="w-4 h-4 text-emerald-400" />}
            title={t(locale, 'landing.featureMapTitle')}
            description={t(locale, 'landing.featureMapDesc')}
            visual={<ServiceMapVisual />}
            className="h-full"
          />
        </ScrollReveal>

        {/* Checklist */}
        <ScrollReveal delay={0.2}>
          <BentoCard
            icon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            title={t(locale, 'landing.featureChecklistTitle')}
            description={t(locale, 'landing.featureChecklistDesc')}
            visual={<ChecklistVisual locale={locale} />}
          />
        </ScrollReveal>

        {/* Templates */}
        <ScrollReveal delay={0.3}>
          <BentoCard
            icon={<Layers className="w-4 h-4 text-emerald-400" />}
            title={t(locale, 'landing.featureTemplateTitle')}
            description={t(locale, 'landing.featureTemplateDesc')}
            visual={<TemplateVisual locale={locale} />}
          />
        </ScrollReveal>

        {/* Env Vars - full width */}
        <ScrollReveal className="md:col-span-3" delay={0.4}>
          <BentoCard
            icon={<Key className="w-4 h-4 text-emerald-400" />}
            title={t(locale, 'landing.featureEnvTitle')}
            description={t(locale, 'landing.featureEnvDesc')}
            visual={<EnvVarVisual />}
            badge="AES-256"
          />
        </ScrollReveal>
      </div>
    </section>
  );
}
