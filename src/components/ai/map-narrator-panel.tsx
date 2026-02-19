'use client';

import { Brain, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStreaming } from '@/lib/hooks/use-streaming';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import ReactMarkdown from 'react-markdown';

interface MapNarratorPanelProps {
  projectId: string;
  nodes: Array<{ slug?: string; name?: string; category?: string }>;
  edges: Array<{ source?: string; target?: string; type?: string }>;
  health: Array<{ service_name?: string; status?: string }>;
}

export function MapNarratorPanel({ projectId, nodes, edges, health }: MapNarratorPanelProps) {
  const { locale } = useLocaleStore();
  const { text, isStreaming, error, start, stop, reset } = useStreaming();

  const handleAnalyze = () => {
    reset();
    start('/api/ai/map-narrate', {
      project_id: projectId,
      nodes: nodes.map((n) => ({ name: n.name, category: n.category })),
      edges: edges.map((e) => ({ source: e.source, target: e.target, type: e.type })),
      health: health.map((h) => ({ service: h.service_name, status: h.status })),
    });
  };

  const hasContent = text.length > 0 || isStreaming || error;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={isStreaming ? stop : handleAnalyze}
          className={`gap-1.5 ${isStreaming
            ? 'bg-red-50 border-red-200 text-red-700 dark:bg-red-950/20 dark:border-red-800 dark:text-red-300'
            : 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-blue-500/20 hover:border-blue-500/40 text-blue-700 dark:text-blue-300'
          }`}
        >
          {isStreaming ? (
            <><X className="h-3.5 w-3.5" />{t(locale, 'ai.mapNarrator.stop')}</>
          ) : (
            <><Brain className="h-3.5 w-3.5" />{t(locale, 'ai.mapNarrator.analyze')}</>
          )}
        </Button>
        {isStreaming && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
      </div>

      {hasContent && (
        <Card className="border-blue-200/50 dark:border-blue-800/30">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <Brain className="h-4 w-4 text-blue-500" />
              {t(locale, 'ai.mapNarrator.title')}
              {isStreaming && (
                <span className="inline-block w-2 h-4 bg-blue-500 animate-pulse rounded-sm" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {error ? (
              <p className="text-sm text-red-500">{error}</p>
            ) : (
              <div className="prose prose-sm dark:prose-invert max-w-none [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:mt-3 [&_h2]:mb-1 [&_li]:text-xs [&_p]:text-xs [&_p]:my-1">
                <ReactMarkdown>{text}</ReactMarkdown>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
