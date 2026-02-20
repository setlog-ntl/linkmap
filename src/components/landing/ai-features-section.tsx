'use client';

import { Brain, Stethoscope, MessageSquare, GitCompare, Terminal } from 'lucide-react';
import { ScrollReveal } from './scroll-reveal';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';

const features = [
  { icon: Brain, titleKey: 'landing.aiFeature1Title', descKey: 'landing.aiFeature1Desc' },
  { icon: Stethoscope, titleKey: 'landing.aiFeature2Title', descKey: 'landing.aiFeature2Desc' },
  { icon: MessageSquare, titleKey: 'landing.aiFeature3Title', descKey: 'landing.aiFeature3Desc' },
  { icon: GitCompare, titleKey: 'landing.aiFeature4Title', descKey: 'landing.aiFeature4Desc' },
  { icon: Terminal, titleKey: 'landing.aiFeature5Title', descKey: 'landing.aiFeature5Desc' },
];

export function AiFeaturesSection() {
  const { locale } = useLocaleStore();

  return (
    <section className="relative py-24 bg-[#f4f5f8] overflow-hidden" id="ai-features">
      {/* Blue gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(37,74,135,0.04)_0%,transparent_70%)] -z-0" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[hsl(220,60%,35%)]/20 bg-[hsl(220,60%,92%)] px-4 py-1.5 text-xs font-medium text-[hsl(220,60%,35%)]">
              <Brain className="w-3.5 h-3.5" />
              AI-Powered
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-[#1a2740]">
              {t(locale, 'landing.aiSectionTitle')}
            </h2>
            <p className="mt-4 text-lg text-[#63738a] max-w-2xl mx-auto">
              {t(locale, 'landing.aiSectionDesc')}
            </p>
          </div>
        </ScrollReveal>

        {/* Top row: 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-6">
          {features.slice(0, 3).map((feature, i) => {
            const Icon = feature.icon;
            return (
              <ScrollReveal key={feature.titleKey} delay={i * 0.1}>
                <div className="group rounded-2xl border border-[#dde0e7] bg-white p-6 h-full transition-all hover:shadow-md hover:-translate-y-0.5 hover:border-[hsl(220,60%,35%)]/30">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[hsl(220,60%,92%)] text-[hsl(220,60%,35%)] mb-4 transition-transform group-hover:scale-110">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-[#1a2740]">
                    {t(locale, feature.titleKey)}
                  </h3>
                  <p className="text-sm text-[#63738a] leading-relaxed">
                    {t(locale, feature.descKey)}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Bottom row: 2 cards centered */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[680px] mx-auto">
          {features.slice(3).map((feature, i) => {
            const Icon = feature.icon;
            return (
              <ScrollReveal key={feature.titleKey} delay={(i + 3) * 0.1}>
                <div className="group rounded-2xl border border-[#dde0e7] bg-white p-6 h-full transition-all hover:shadow-md hover:-translate-y-0.5 hover:border-[hsl(220,60%,35%)]/30">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[hsl(220,60%,92%)] text-[hsl(220,60%,35%)] mb-4 transition-transform group-hover:scale-110">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-[#1a2740]">
                    {t(locale, feature.titleKey)}
                  </h3>
                  <p className="text-sm text-[#63738a] leading-relaxed">
                    {t(locale, feature.descKey)}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
