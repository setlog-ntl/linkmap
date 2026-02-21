'use client';

import { ArrowRight } from 'lucide-react';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';

export function PitchBanner() {
  const { locale } = useLocaleStore();

  return (
    <a
      href="https://habitree.github.io/linkmap_pr/linkmap-pitch.html"
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full bg-gradient-to-r from-[hsl(220,60%,35%)] to-[hsl(220,60%,25%)] text-white text-center py-2.5 px-4 text-sm font-medium hover:from-[hsl(220,60%,30%)] hover:to-[hsl(220,60%,20%)] transition-all"
    >
      <span className="inline-flex items-center gap-2">
        {t(locale, 'landing.pitchBanner')}
        <ArrowRight className="h-3.5 w-3.5" />
      </span>
    </a>
  );
}
