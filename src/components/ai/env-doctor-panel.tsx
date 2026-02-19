'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Stethoscope, Loader2, AlertTriangle, CheckCircle2, Shield, Tag, AlertCircle, FileWarning } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';

interface DiagnosisIssue {
  severity: 'high' | 'medium' | 'low';
  category: 'missing' | 'orphan' | 'security' | 'naming';
  key_name: string;
  message: string;
  fix: string;
}

interface DiagnosisResult {
  issues: DiagnosisIssue[];
  summary: string;
}

const severityConfig = {
  high: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300', icon: AlertTriangle },
  medium: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300', icon: AlertCircle },
  low: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', icon: FileWarning },
};

const categoryConfig = {
  missing: { icon: AlertTriangle, label: 'missing' },
  orphan: { icon: FileWarning, label: 'orphan' },
  security: { icon: Shield, label: 'security' },
  naming: { icon: Tag, label: 'naming' },
};

export function EnvDoctorPanel({ projectId }: { projectId: string }) {
  const { locale } = useLocaleStore();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  const handleDiagnose = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/ai/env-doctor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: projectId }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const data: DiagnosisResult = await res.json();
      setResult(data);

      if (data.issues.length === 0) {
        toast.success(t(locale, 'ai.envDoctor.noIssues'));
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '진단 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/20 hover:border-emerald-500/40 text-emerald-700 dark:text-emerald-300"
        >
          <Stethoscope className="h-3.5 w-3.5" />
          {t(locale, 'ai.envDoctor.diagnose')}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[420px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-emerald-500" />
            {t(locale, 'ai.envDoctor.title')}
          </SheetTitle>
          <SheetDescription>
            {t(locale, 'ai.envDoctor.description')}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <Button
            onClick={handleDiagnose}
            disabled={loading}
            className="w-full gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" />{t(locale, 'ai.envDoctor.diagnosing')}</>
            ) : (
              <><Stethoscope className="h-4 w-4" />{t(locale, 'ai.envDoctor.diagnose')}</>
            )}
          </Button>

          {result && (
            <div className="space-y-4">
              {/* Summary */}
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <p className="text-sm">{result.summary}</p>
                </CardContent>
              </Card>

              {/* Issues count */}
              <div className="flex items-center gap-2">
                {result.issues.length === 0 ? (
                  <Badge className="gap-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                    <CheckCircle2 className="h-3 w-3" />
                    {t(locale, 'ai.envDoctor.noIssues')}
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="gap-1">
                    {t(locale, 'ai.envDoctor.issues')}: {result.issues.length}
                  </Badge>
                )}
              </div>

              {/* Issue list */}
              <div className="space-y-3">
                {result.issues.map((issue, i) => {
                  const sev = severityConfig[issue.severity] || severityConfig.low;
                  const cat = categoryConfig[issue.category] || categoryConfig.naming;
                  const SevIcon = sev.icon;
                  const CatIcon = cat.icon;

                  return (
                    <Card key={i} className="border-l-4" style={{
                      borderLeftColor: issue.severity === 'high' ? '#ef4444' :
                        issue.severity === 'medium' ? '#eab308' : '#3b82f6'
                    }}>
                      <CardHeader className="p-3 pb-1">
                        <div className="flex items-center gap-2">
                          <Badge className={sev.color} variant="secondary">
                            <SevIcon className="h-3 w-3 mr-1" />
                            {t(locale, `ai.envDoctor.${issue.severity}`)}
                          </Badge>
                          <Badge variant="outline" className="gap-1 text-xs">
                            <CatIcon className="h-3 w-3" />
                            {t(locale, `ai.envDoctor.${cat.label}`)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-3 pt-1 space-y-1">
                        <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">
                          {issue.key_name}
                        </code>
                        <p className="text-sm text-muted-foreground">{issue.message}</p>
                        <div className="flex items-start gap-1.5 mt-1.5 p-2 bg-emerald-50/50 dark:bg-emerald-950/20 rounded text-xs">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                          <span>{issue.fix}</span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
