'use client';

import { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import type { AiFeatureSlug } from '@/types';

interface QnaItem {
  id: string;
  question: string;
  question_ko: string | null;
  answer_guide: string;
  sort_order: number;
}

interface QuickActionButtonsProps {
  featureSlug: AiFeatureSlug;
  onAction: (promptText: string) => void;
}

export function QuickActionButtons({ featureSlug, onAction }: QuickActionButtonsProps) {
  const { locale } = useLocaleStore();
  const [qnaList, setQnaList] = useState<QnaItem[]>([]);

  useEffect(() => {
    fetch(`/api/ai/feature-config?feature_slug=${featureSlug}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.qna?.length) {
          setQnaList(data.qna);
        }
      })
      .catch(() => {});
  }, [featureSlug]);

  if (!qnaList.length) return null;

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground flex items-center gap-1">
        <Zap className="h-3 w-3" />
        {t(locale, 'ai.chat.quickActions')}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {qnaList.map((qna) => (
          <Button
            key={qna.id}
            variant="outline"
            size="sm"
            className="text-xs h-7"
            onClick={() => onAction(locale === 'ko' ? (qna.question_ko || qna.question) : qna.question)}
          >
            {locale === 'ko' ? (qna.question_ko || qna.question) : qna.question}
          </Button>
        ))}
      </div>
    </div>
  );
}
