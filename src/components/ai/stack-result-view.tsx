'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import { Layers, DollarSign, Gauge, ArrowRight } from 'lucide-react';

interface StackResult {
  services: Array<{ slug: string; name: string; layer: string; reason: string }>;
  connections: Array<{ from: string; to: string; type: string }>;
  monthly_cost: string;
  complexity_score: number;
  summary: string;
}

const layerColors: Record<string, string> = {
  frontend: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  backend: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  database: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  auth: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  payment: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  ai: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  monitoring: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  storage: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
  email: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  deploy: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
};

export function StackResultView({ result }: { result: StackResult }) {
  const { locale } = useLocaleStore();

  // Group services by layer
  const grouped = result.services.reduce<Record<string, typeof result.services>>((acc, svc) => {
    const layer = svc.layer || 'other';
    if (!acc[layer]) acc[layer] = [];
    acc[layer].push(svc);
    return acc;
  }, {});

  const complexityColor = result.complexity_score <= 3 ? 'text-green-600' :
    result.complexity_score <= 6 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="space-y-4">
      {/* Summary */}
      <Card className="bg-gradient-to-r from-violet-50/50 to-purple-50/50 dark:from-violet-950/20 dark:to-purple-950/20 border-violet-200/50 dark:border-violet-800/30">
        <CardContent className="p-4">
          <p className="text-sm">{result.summary}</p>
        </CardContent>
      </Card>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
          <Layers className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">{t(locale, 'ai.stackArchitect.services')}</p>
            <p className="font-semibold">{result.services.length}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">{t(locale, 'ai.stackArchitect.monthlyCost')}</p>
            <p className="font-semibold text-sm">{result.monthly_cost}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
          <Gauge className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">{t(locale, 'ai.stackArchitect.complexity')}</p>
            <p className={`font-semibold ${complexityColor}`}>{result.complexity_score}/10</p>
          </div>
        </div>
      </div>

      {/* Services by layer */}
      <div className="space-y-3">
        {Object.entries(grouped).map(([layer, services]) => (
          <Card key={layer}>
            <CardHeader className="pb-2 pt-3 px-4">
              <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Badge variant="secondary" className={layerColors[layer] || 'bg-gray-100 text-gray-700'}>
                  {layer}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-3 space-y-2">
              {services.map((svc) => (
                <div key={svc.slug} className="flex items-start gap-3 text-sm">
                  <span className="font-medium min-w-[120px]">{svc.name}</span>
                  <span className="text-muted-foreground text-xs">{svc.reason}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Connections */}
      {result.connections.length > 0 && (
        <Card>
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {t(locale, 'ai.stackArchitect.connections')}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3 space-y-1">
            {result.connections.map((conn, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{conn.from}</span>
                <ArrowRight className="h-3 w-3" />
                <span className="font-medium text-foreground">{conn.to}</span>
                <Badge variant="outline" className="text-[10px]">{conn.type}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
