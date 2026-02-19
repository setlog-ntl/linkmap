'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Brain, Loader2, Sparkles, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { queryKeys } from '@/lib/queries/keys';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import { StackResultView } from './stack-result-view';

interface StackResult {
  services: Array<{ slug: string; name: string; layer: string; reason: string }>;
  connections: Array<{ from: string; to: string; type: string }>;
  monthly_cost: string;
  complexity_score: number;
  summary: string;
}

export function StackArchitectDialog() {
  const params = useParams();
  const projectId = params.id as string;
  const queryClient = useQueryClient();
  const { locale } = useLocaleStore();

  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StackResult | null>(null);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleRecommend = async () => {
    if (!description.trim()) return;
    setLoading(true);
    setResult(null);
    setApplied(false);

    try {
      const res = await fetch('/api/ai/stack-recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, project_id: projectId }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const data: StackResult = await res.json();
      setResult(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '추천 실패');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!result || !projectId) return;
    setApplying(true);

    try {
      // Add each recommended service to the project
      for (const svc of result.services) {
        await fetch('/api/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ project_id: projectId, service_slug: svc.slug }),
        });
      }

      await queryClient.invalidateQueries({ queryKey: queryKeys.services.byProject(projectId) });
      await queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all(projectId) });
      setApplied(true);
      toast.success(t(locale, 'ai.stackArchitect.applied'));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '적용 실패');
    } finally {
      setApplying(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-1.5 bg-gradient-to-r from-violet-500/10 to-purple-500/10 border-violet-500/20 hover:border-violet-500/40 text-violet-700 dark:text-violet-300"
      >
        <Sparkles className="h-3.5 w-3.5" />
        {t(locale, 'ai.stackArchitect.recommend')}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-violet-500" />
              {t(locale, 'ai.stackArchitect.title')}
            </DialogTitle>
            <DialogDescription>
              {t(locale, 'ai.stackArchitect.description')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Textarea
              placeholder={t(locale, 'ai.stackArchitect.placeholder')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="resize-none"
            />

            <div className="flex items-center gap-2">
              <Button
                onClick={handleRecommend}
                disabled={loading || !description.trim()}
                className="gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
              >
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" />{t(locale, 'ai.stackArchitect.analyzing')}</>
                ) : (
                  <><Sparkles className="h-4 w-4" />{t(locale, 'ai.stackArchitect.recommend')}</>
                )}
              </Button>
            </div>

            {result && (
              <div className="space-y-4">
                <StackResultView result={result} />

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="outline">{result.services.length} {t(locale, 'ai.stackArchitect.services')}</Badge>
                    <ArrowRight className="h-3 w-3" />
                    <Badge variant="outline">{result.monthly_cost}</Badge>
                  </div>
                  <Button
                    onClick={handleApply}
                    disabled={applying || applied}
                    className="gap-2"
                    variant={applied ? 'outline' : 'default'}
                  >
                    {applied ? (
                      <><Check className="h-4 w-4 text-green-500" />{t(locale, 'ai.stackArchitect.applied')}</>
                    ) : applying ? (
                      <><Loader2 className="h-4 w-4 animate-spin" />{t(locale, 'ai.stackArchitect.applying')}</>
                    ) : (
                      t(locale, 'ai.stackArchitect.apply')
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
