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
import { Eye, EyeOff, Pencil, Trash2, Copy, MoreHorizontal, Key as KeyIcon, ChevronDown } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { ServiceIcon } from '@/components/ui/service-icon';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import type { EnvironmentVariable } from '@/types';

export interface EnvServiceGroup {
  serviceId: string | null;
  serviceName: string;
  serviceSlug?: string;
  envVars: EnvironmentVariable[];
}

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
  onCopyValue?: (envVar: EnvironmentVariable) => void;
  serviceGroups?: EnvServiceGroup[];
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
  onCopyValue,
  serviceGroups,
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

  const renderEnvRow = (envVar: EnvironmentVariable, showServiceColumn: boolean) => (
    <div
      key={envVar.id}
      className={cn(
        'flex flex-col gap-2 p-3 sm:p-4 sm:items-center hover:bg-muted/30 transition-colors',
        showServiceColumn
          ? 'sm:grid sm:grid-cols-[1fr_200px_140px_100px_80px] sm:gap-4'
          : 'sm:grid sm:grid-cols-[1fr_200px_100px_80px] sm:gap-4'
      )}
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

      {/* Service (only in flat mode) */}
      {showServiceColumn && (
        <div className="min-w-0">
          {envVar.service_id && serviceNameMap.has(envVar.service_id) ? (
            <Badge variant="outline" className="text-[10px] truncate max-w-full">
              {serviceNameMap.get(envVar.service_id)}
            </Badge>
          ) : (
            <span className="text-xs text-muted-foreground">-</span>
          )}
        </div>
      )}

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
            {onCopyValue && (
              <DropdownMenuItem onClick={() => onCopyValue(envVar)}>
                <Copy className="mr-2 h-4 w-4" />
                값 복사
              </DropdownMenuItem>
            )}
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
  );

  // ── 서비스별 그룹 뷰 ──
  if (serviceGroups) {
    return (
      <div className="space-y-4">
        {serviceGroups.map((group) => (
          <ServiceGroupCard
            key={group.serviceId ?? '__unlinked__'}
            group={group}
            renderEnvRow={renderEnvRow}
          />
        ))}
      </div>
    );
  }

  // ── 전체 플랫 뷰 ──
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
          {envVars.map((envVar) => renderEnvRow(envVar, true))}
        </div>
      </CardContent>
    </Card>
  );
}

// ── 서비스 그룹 카드 (접기/펼치기) ──
import { useState } from 'react';

function ServiceGroupCard({
  group,
  renderEnvRow,
}: {
  group: EnvServiceGroup;
  renderEnvRow: (envVar: EnvironmentVariable, showServiceColumn: boolean) => React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Card>
      <CardContent className="p-0">
        {/* Service group header */}
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-3 w-full px-4 py-3 bg-muted/50 hover:bg-muted/70 transition-colors text-left border-b"
        >
          <ChevronDown
            className={cn(
              'h-4 w-4 text-muted-foreground transition-transform shrink-0',
              isCollapsed && '-rotate-90'
            )}
          />
          {group.serviceSlug ? (
            <ServiceIcon serviceId={group.serviceSlug} size={18} />
          ) : (
            <KeyIcon className="h-4.5 w-4.5 text-muted-foreground" />
          )}
          <span className="text-sm font-medium">{group.serviceName}</span>
          <Badge variant="secondary" className="text-[10px] ml-auto">
            {group.envVars.length}개
          </Badge>
        </button>

        {/* Env var rows */}
        {!isCollapsed && (
          <>
            {/* Header row for grouped mode (no service column) */}
            <div className="hidden sm:grid sm:grid-cols-[1fr_200px_100px_80px] gap-4 px-4 py-2 border-b bg-muted/30 text-xs font-medium text-muted-foreground">
              <div>키 이름</div>
              <div>값</div>
              <div>수정일</div>
              <div></div>
            </div>
            <div className="divide-y">
              {group.envVars.map((envVar) => renderEnvRow(envVar, false))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
