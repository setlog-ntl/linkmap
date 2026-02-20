'use client';

import { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import type { AiFeatureSlug } from '@/types';

interface TemplateItem {
  id: string;
  name: string;
  name_ko: string | null;
  prompt_text: string;
  icon: string;
}

interface QuickActionButtonsProps {
  featureSlug: AiFeatureSlug;
  onAction: (promptText: string) => void;
}

export function QuickActionButtons({ featureSlug, onAction }: QuickActionButtonsProps) {
  const { locale } = useLocaleStore();
  const [templates, setTemplates] = useState<TemplateItem[]>([]);

  useEffect(() => {
    fetch(`/api/ai/feature-config?feature_slug=${featureSlug}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.templates?.length) {
          setTemplates(data.templates);
        }
      })
      .catch(() => {});
  }, [featureSlug]);

  if (!templates.length) return null;

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground flex items-center gap-1">
        <Zap className="h-3 w-3" />
        {t(locale, 'ai.chat.quickActions')}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {templates.map((tmpl) => (
          <Button
            key={tmpl.id}
            variant="outline"
            size="sm"
            className="text-xs h-7"
            onClick={() => onAction(tmpl.prompt_text)}
          >
            {locale === 'ko' ? (tmpl.name_ko || tmpl.name) : tmpl.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
