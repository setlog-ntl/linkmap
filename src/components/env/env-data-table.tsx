'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Eye, EyeOff, Pencil, Trash2, Copy, MoreHorizontal, Key as KeyIcon } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import type { EnvironmentVariable } from '@/types';

interface EnvDataTableProps {
  envVars: EnvironmentVariable[];
  serviceNameMap: Map<string, string>;
  showValues: Record<string, boolean>;
  decryptedValues: Record<string, string>;
  isDecrypting: boolean;
  onToggleShow: (id: string) => void;
  onEdit: (envVar: EnvironmentVariable) => void;
  onDelete: (id: string) => void;
  onCopy: (envVar: EnvironmentVariable) => void;
}

export function EnvDataTable({
  envVars,
  serviceNameMap,
  showValues,
  decryptedValues,
  isDecrypting,
  onToggleShow,
  onEdit,
  onDelete,
  onCopy,
}: EnvDataTableProps) {
  const maskValue = (value: string) => {
    return '\u2022'.repeat(Math.min(value.length || 20, 30));
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
  };

  const { locale } = useLocaleStore();

  if (envVars.length === 0) {
    return (
      <Card>
        <CardContent>
          <EmptyState
            icon={KeyIcon}
            title={t(locale, 'project.emptyEnvVars')}
            description={t(locale, 'project.emptyEnvVarsDesc')}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        {/* Header row - hidden on mobile */}
        <div className="hidden sm:grid sm:grid-cols-[1fr_200px_140px_100px_80px] gap-4 px-4 py-2 border-b bg-muted/50 text-xs font-medium text-muted-foreground">
          <div>키 이름</div>
          <div>값</div>
          <div>서비스</div>
          <div>수정일</div>
          <div></div>
        </div>

        <div className="divide-y">
          {envVars.map((envVar) => (
            <div
              key={envVar.id}
              className="flex flex-col sm:grid sm:grid-cols-[1fr_200px_140px_100px_80px] gap-2 sm:gap-4 p-3 sm:p-4 sm:items-center hover:bg-muted/30 transition-colors"
            >
              {/* Key name */}
              <div className="flex items-center gap-2 min-w-0">
                <code className="text-sm font-mono font-medium truncate">
                  {envVar.key_name}
                </code>
                <Badge
                  variant={envVar.is_secret ? 'destructive' : 'secondary'}
                  className="text-[10px] shrink-0"
                >
                  {envVar.is_secret ? '비밀' : '공개'}
                </Badge>
              </div>

              {/* Value */}
              <div className="flex items-center gap-1 min-w-0">
                <code className="text-xs text-muted-foreground font-mono truncate">
                  {showValues[envVar.id] && decryptedValues[envVar.id] !== undefined
                    ? decryptedValues[envVar.id]
                    : maskValue(envVar.encrypted_value)}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0"
                  onClick={() => onToggleShow(envVar.id)}
                  disabled={isDecrypting}
                >
                  {showValues[envVar.id] ? (
                    <EyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>

              {/* Service */}
              <div className="min-w-0">
                {envVar.service_id && serviceNameMap.has(envVar.service_id) ? (
                  <Badge variant="outline" className="text-[10px] truncate max-w-full">
                    {serviceNameMap.get(envVar.service_id)}
                  </Badge>
                ) : (
                  <span className="text-xs text-muted-foreground">-</span>
                )}
              </div>

              {/* Updated */}
              <div className="text-xs text-muted-foreground">
                {formatDate(envVar.updated_at)}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(envVar)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      수정
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onCopy(envVar)}>
                      <Copy className="mr-2 h-4 w-4" />
                      키 복사
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(envVar.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      삭제
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
