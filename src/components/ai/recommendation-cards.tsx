'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowRight, Check, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { queryKeys } from '@/lib/queries/keys';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import type { ServiceRecommendation } from '@/types';

interface RecommendationCardsProps {
  recommendations: ServiceRecommendation[];
  onCardClick: (rec: ServiceRecommendation) => void;
}

export function RecommendationCards({ recommendations, onCardClick }: RecommendationCardsProps) {
  const params = useParams();
  const projectId = params.id as string;
  const queryClient = useQueryClient();
  const { locale } = useLocaleStore();
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleApplyAll = async () => {
    if (!projectId || applying || applied) return;
    setApplying(true);
    try {
      for (const svc of recommendations) {
        await fetch('/api/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ project_id: projectId, service_slug: svc.slug }),
        });
      }
      await queryClient.invalidateQueries({ queryKey: queryKeys.services.byProject(projectId) });
      await queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all(projectId) });
      setApplied(true);
      toast.success(t(locale, 'ai.chat.applied'));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '적용 실패');
    } finally {
      setApplying(false);
    }
  };

  if (!recommendations.length) return null;

  return (
    <div className="space-y-2 mt-2">
      <div className="grid gap-2">
        {recommendations.map((rec) => (
          <button
            key={rec.slug}
            onClick={() => onCardClick(rec)}
            className="flex items-center gap-3 p-2.5 rounded-lg border bg-card hover:bg-accent/50 transition-colors text-left group"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{rec.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {rec.layer}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{rec.reason}</p>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground shrink-0" />
          </button>
        ))}
      </div>

      <Button
        size="sm"
        variant={applied ? 'outline' : 'default'}
        onClick={handleApplyAll}
        disabled={applying || applied}
        className="w-full gap-1.5"
      >
        {applied ? (
          <><Check className="h-3.5 w-3.5 text-green-500" />{t(locale, 'ai.chat.applied')}</>
        ) : applying ? (
          <><Loader2 className="h-3.5 w-3.5 animate-spin" />{t(locale, 'ai.chat.applying')}</>
        ) : (
          <><Plus className="h-3.5 w-3.5" />{t(locale, 'ai.chat.applyAll')}</>
        )}
      </Button>
    </div>
  );
}
