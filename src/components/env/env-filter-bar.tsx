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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Search, Plus, List, Layers, Braces, Share2 } from 'lucide-react';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import type { Environment } from '@/types';

export type EnvViewMode = 'all' | 'by-service';

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
  onRawEditorClick?: () => void;
  onCopyEnvClick?: () => void;
  envCounts: Record<Environment, number>;
  viewMode?: EnvViewMode;
  onViewModeChange?: (mode: EnvViewMode) => void;
}

export function EnvFilterBar({
  activeEnv,
  onEnvChange,
  search,
  onSearchChange,
  onAddClick,
  onRawEditorClick,
  onCopyEnvClick,
  envCounts,
  viewMode = 'all',
  onViewModeChange,
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

      {onViewModeChange && (
        <div className="flex rounded-md border bg-muted/50 p-0.5">
          <button
            type="button"
            onClick={() => onViewModeChange('all')}
            className={cn(
              'flex items-center gap-1.5 rounded-sm px-2.5 py-1.5 text-xs font-medium transition-colors',
              viewMode === 'all'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <List className="h-3.5 w-3.5" />
            전체
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('by-service')}
            className={cn(
              'flex items-center gap-1.5 rounded-sm px-2.5 py-1.5 text-xs font-medium transition-colors',
              viewMode === 'by-service'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Layers className="h-3.5 w-3.5" />
            서비스별
          </button>
        </div>
      )}

      <TooltipProvider>
        <div className="flex gap-2">
          {onCopyEnvClick && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={onCopyEnvClick} aria-label="환경 간 복사">
                  <Share2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>환경 간 변수 복사</TooltipContent>
            </Tooltip>
          )}
          {onRawEditorClick && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={onRawEditorClick} className="gap-1.5">
                  <Braces className="h-4 w-4" />
                  <span className="hidden sm:inline">일괄 편집</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>텍스트로 일괄 편집</TooltipContent>
            </Tooltip>
          )}
          <Button onClick={onAddClick}>
            <Plus className="mr-2 h-4 w-4" />
            {t(locale, 'envVar.addVar')}
          </Button>
        </div>
      </TooltipProvider>
    </div>
  );
}
