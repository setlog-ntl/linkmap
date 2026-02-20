'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Plus, Download, Upload } from 'lucide-react';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import type { Environment } from '@/types';

const envOptions: { value: Environment; label: string }[] = [
  { value: 'development', label: '개발' },
  { value: 'staging', label: '스테이징' },
  { value: 'production', label: '프로덕션' },
];

interface EnvFilterBarProps {
  activeEnv: Environment;
  onEnvChange: (env: Environment) => void;
  search: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
  onExportClick?: () => void;
  onImportClick?: () => void;
  envCounts: Record<Environment, number>;
}

export function EnvFilterBar({
  activeEnv,
  onEnvChange,
  search,
  onSearchChange,
  onAddClick,
  onExportClick,
  onImportClick,
  envCounts,
}: EnvFilterBarProps) {
  const { locale } = useLocaleStore();
  const [inputValue, setInputValue] = useState(search);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    debounceRef.current = setTimeout(() => onSearchChange(inputValue), 300);
    return () => clearTimeout(debounceRef.current);
  }, [inputValue, onSearchChange]);

  useEffect(() => {
    setInputValue(search);
  }, [search]);

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Select value={activeEnv} onValueChange={(v) => onEnvChange(v as Environment)}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {envOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label} ({envCounts[opt.value] || 0})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="변수 검색..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex gap-2">
        {onImportClick && (
          <Button variant="outline" size="icon" onClick={onImportClick} title={t(locale, 'envVar.import')}>
            <Upload className="h-4 w-4" />
          </Button>
        )}
        {onExportClick && (
          <Button variant="outline" size="icon" onClick={onExportClick} title={t(locale, 'envVar.download')}>
            <Download className="h-4 w-4" />
          </Button>
        )}
        <Button onClick={onAddClick}>
          <Plus className="mr-2 h-4 w-4" />
          {t(locale, 'envVar.addVar')}
        </Button>
      </div>
    </div>
  );
}
