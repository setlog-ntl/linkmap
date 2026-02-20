'use client';

import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload, Loader2 } from 'lucide-react';
import { parseEnvContent } from '@/lib/utils/parse-env';
import { useCatalogServices } from '@/lib/queries/services';
import { buildEnvKeyServiceMap, matchEnvKeyToService } from '@/lib/utils/env-service-matcher';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import type { Environment, Service } from '@/types';

export interface ImportVariable {
  key_name: string;
  value: string;
  environment: string;
  is_secret: boolean;
  service_id: string | null;
}

interface EnvImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (vars: ImportVariable[]) => Promise<void>;
  projectServices?: { service_id: string; service: Service | null }[];
}

export function EnvImportDialog({ open, onOpenChange, onImport, projectServices }: EnvImportDialogProps) {
  const [content, setContent] = useState('');
  const [environment, setEnvironment] = useState<Environment>('development');
  const [importing, setImporting] = useState(false);
  const { locale } = useLocaleStore();
  const { data: catalogServices = [] } = useCatalogServices();

  const envKeyServiceMap = useMemo(
    () => buildEnvKeyServiceMap(catalogServices),
    [catalogServices]
  );

  const parsed = useMemo(() => parseEnvContent(content), [content]);

  const parsedWithService = useMemo(() => {
    // Build a set of project service IDs for filtering
    const projectServiceIds = new Set(
      (projectServices ?? []).map((ps) => ps.service_id)
    );

    return parsed.map((v) => {
      const match = matchEnvKeyToService(v.key, envKeyServiceMap);
      // Only assign service_id if the service is connected to the project
      const serviceId = match && projectServiceIds.has(match.serviceId)
        ? match.serviceId
        : null;
      const serviceName = match && projectServiceIds.has(match.serviceId)
        ? match.serviceName
        : null;
      return { ...v, serviceId, serviceName };
    });
  }, [parsed, envKeyServiceMap, projectServices]);

  const serviceMatchCount = useMemo(
    () => parsedWithService.filter((v) => v.serviceId).length,
    [parsedWithService]
  );

  const handleImport = async () => {
    if (parsedWithService.length === 0) return;
    setImporting(true);
    try {
      const vars: ImportVariable[] = parsedWithService.map((v) => ({
        key_name: v.key,
        value: v.value,
        environment,
        is_secret: !v.key.startsWith('NEXT_PUBLIC_'),
        service_id: v.serviceId,
      }));
      await onImport(vars);
      onOpenChange(false);
      setContent('');
    } finally {
      setImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85dvh] flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle>{t(locale, 'envVar.importDialog.title')}</DialogTitle>
          <DialogDescription>{t(locale, 'envVar.importDialog.desc')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto flex-1 min-h-0">
          <div>
            <Select value={environment} onValueChange={(v) => setEnvironment(v as Environment)}>
              <SelectTrigger>
                <SelectValue placeholder={t(locale, 'envVar.importDialog.selectEnv')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="development">{t(locale, 'envVar.development')} (Development)</SelectItem>
                <SelectItem value="staging">{t(locale, 'envVar.staging')} (Staging)</SelectItem>
                <SelectItem value="production">{t(locale, 'envVar.production')} (Production)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Textarea
            placeholder={t(locale, 'envVar.importDialog.placeholder')}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="font-mono text-sm"
          />

          {parsedWithService.length > 0 && (
            <div className="border rounded-lg p-3 max-h-[200px] overflow-y-auto">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground">
                  {t(locale, 'envVar.importDialog.detected').replace('{count}', String(parsedWithService.length))}
                </p>
                {serviceMatchCount > 0 && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">
                    {t(locale, 'envVar.importDialog.serviceMatches').replace('{count}', String(serviceMatchCount))}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                {parsedWithService.map((v, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <code className="font-mono bg-muted px-1 py-0.5 rounded truncate max-w-[180px]">
                      {v.key}
                    </code>
                    <Badge
                      variant={v.key.startsWith('NEXT_PUBLIC_') ? 'secondary' : 'destructive'}
                      className="text-[9px] shrink-0"
                    >
                      {v.key.startsWith('NEXT_PUBLIC_')
                        ? t(locale, 'envVar.importDialog.public')
                        : t(locale, 'envVar.importDialog.secret')}
                    </Badge>
                    {v.serviceName ? (
                      <Badge variant="outline" className="text-[9px] shrink-0">
                        {v.serviceName}
                      </Badge>
                    ) : (
                      <span className="text-[9px] text-muted-foreground shrink-0">
                        {t(locale, 'envVar.importDialog.noService')}
                      </span>
                    )}
                    <span className="text-muted-foreground truncate">
                      {v.key.startsWith('NEXT_PUBLIC_')
                        ? `${v.value.substring(0, 20)}${v.value.length > 20 ? '...' : ''}`
                        : '••••••'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t(locale, 'common.cancel')}
          </Button>
          <Button onClick={handleImport} disabled={importing || parsedWithService.length === 0}>
            {importing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            {t(locale, 'envVar.importDialog.importBtn').replace('{count}', String(parsedWithService.length))}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
