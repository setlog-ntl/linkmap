'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Scale, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Card, CardContent } from '@/components/ui/card';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import ReactMarkdown from 'react-markdown';

interface ServiceComparisonSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSlugs: string[];
}

export function ServiceComparisonSheet({ open, onOpenChange, selectedSlugs }: ServiceComparisonSheetProps) {
  const { locale } = useLocaleStore();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ comparison: string; services: string[] } | null>(null);

  const handleCompare = async () => {
    if (selectedSlugs.length < 2) {
      toast.error(t(locale, 'ai.compare.selectServices'));
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/ai/compare-services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slugs: selectedSlugs }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '비교 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[540px] sm:w-[640px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-amber-500" />
            {t(locale, 'ai.compare.title')}
          </SheetTitle>
          <SheetDescription>
            {t(locale, 'ai.compare.description')}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <Button
            onClick={handleCompare}
            disabled={loading || selectedSlugs.length < 2}
            className="w-full gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" />{t(locale, 'ai.compare.comparing')}</>
            ) : (
              <><Scale className="h-4 w-4" />{t(locale, 'ai.compare.compare')} ({selectedSlugs.length})</>
            )}
          </Button>

          {result && (
            <Card>
              <CardContent className="p-4">
                <div className="prose prose-sm dark:prose-invert max-w-none [&_table]:w-full [&_th]:text-left [&_th]:p-2 [&_td]:p-2 [&_table]:border-collapse [&_th]:border [&_td]:border [&_th]:border-border [&_td]:border-border [&_th]:bg-muted/50 [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:mt-4 [&_h2]:mb-2">
                  <ReactMarkdown>{result.comparison}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
