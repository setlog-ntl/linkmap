'use client';

import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Eye, EyeOff, Pencil, Trash2, Copy, MoreHorizontal,
  UserCheck, ExternalLink, ChevronDown, ChevronRight,
  Clock, AlertTriangle, Shield, Plus, Download,
} from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { toast } from 'sonner';
import type { ServiceCredential, CredentialPurpose } from '@/types';

const AUTO_HIDE_SECONDS = 30;
const CLIPBOARD_CLEAR_SECONDS = 30;

const purposeLabels: Record<CredentialPurpose, string> = {
  admin: '관리자',
  demo: '데모',
  deploy: '배포',
  monitoring: '모니터링',
  api: 'API',
  other: '기타',
};

const purposeColors: Record<CredentialPurpose, string> = {
  admin: 'bg-red-500/10 text-red-700 border-red-300 dark:text-red-400',
  demo: 'bg-blue-500/10 text-blue-700 border-blue-300 dark:text-blue-400',
  deploy: 'bg-green-500/10 text-green-700 border-green-300 dark:text-green-400',
  monitoring: 'bg-yellow-500/10 text-yellow-700 border-yellow-300 dark:text-yellow-400',
  api: 'bg-purple-500/10 text-purple-700 border-purple-300 dark:text-purple-400',
  other: 'bg-gray-500/10 text-gray-700 border-gray-300 dark:text-gray-400',
};

const envLabels: Record<string, string> = {
  development: 'DEV',
  staging: 'STG',
  production: 'PROD',
  all: '전체',
};

function getDaysSince(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
}

function getAgeWarning(days: number): { level: 'ok' | 'warn' | 'danger'; label: string } {
  if (days >= 180) return { level: 'danger', label: `${days}일 경과 — 교체 권장` };
  if (days >= 90) return { level: 'warn', label: `${days}일 경과` };
  return { level: 'ok', label: `${days}일 전` };
}

interface ServiceGroup {
  serviceId: string | null;
  serviceName: string;
  credentials: ServiceCredential[];
}

interface CredentialsTableProps {
  credentials: ServiceCredential[];
  serviceNameMap: Map<string, string>;
  decryptedData: Record<string, { username?: string; password?: string }>;
  showValues: Record<string, boolean>;
  isDecrypting: boolean;
  onToggleShow: (id: string) => void;
  onEdit: (cred: ServiceCredential) => void;
  onDelete: (id: string) => void;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
  onToggleSelectAll?: () => void;
  groupByService?: boolean;
  onSelectServiceGroup?: (serviceId: string | null) => void;
  onAutoHide?: (id: string) => void;
  onAddForService?: (serviceId: string | null) => void;
  onBulkEditGroup?: (serviceId: string | null) => void;
  onExportGroup?: (serviceId: string | null) => void;
}

export function CredentialsTable({
  credentials,
  serviceNameMap,
  decryptedData,
  showValues,
  isDecrypting,
  onToggleShow,
  onEdit,
  onDelete,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  groupByService = false,
  onSelectServiceGroup,
  onAutoHide,
  onAddForService,
  onBulkEditGroup,
  onExportGroup,
}: CredentialsTableProps) {
  const selectable = !!selectedIds && !!onToggleSelect && !!onToggleSelectAll;

  // Auto-hide timers
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const [autoHideCountdowns, setAutoHideCountdowns] = useState<Record<string, number>>({});
  const countdownIntervalsRef = useRef<Map<string, ReturnType<typeof setInterval>>>(new Map());

  const startAutoHide = useCallback((id: string) => {
    // Clear existing
    const existingTimer = timersRef.current.get(id);
    if (existingTimer) clearTimeout(existingTimer);
    const existingInterval = countdownIntervalsRef.current.get(id);
    if (existingInterval) clearInterval(existingInterval);

    setAutoHideCountdowns((prev) => ({ ...prev, [id]: AUTO_HIDE_SECONDS }));

    const interval = setInterval(() => {
      setAutoHideCountdowns((prev) => {
        const current = prev[id];
        if (current === undefined || current <= 1) return prev;
        return { ...prev, [id]: current - 1 };
      });
    }, 1000);
    countdownIntervalsRef.current.set(id, interval);

    const timer = setTimeout(() => {
      onAutoHide?.(id);
      onToggleShow(id);
      clearInterval(interval);
      countdownIntervalsRef.current.delete(id);
      setAutoHideCountdowns((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }, AUTO_HIDE_SECONDS * 1000);
    timersRef.current.set(id, timer);
  }, [onAutoHide, onToggleShow]);

  const clearAutoHide = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) { clearTimeout(timer); timersRef.current.delete(id); }
    const interval = countdownIntervalsRef.current.get(id);
    if (interval) { clearInterval(interval); countdownIntervalsRef.current.delete(id); }
    setAutoHideCountdowns((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  // Start/stop auto-hide when showValues changes
  useEffect(() => {
    for (const id of Object.keys(showValues)) {
      if (showValues[id]) {
        startAutoHide(id);
      } else {
        clearAutoHide(id);
      }
    }
    const currentTimers = timersRef.current;
    const currentIntervals = countdownIntervalsRef.current;
    return () => {
      currentTimers.forEach((t) => clearTimeout(t));
      currentIntervals.forEach((i) => clearInterval(i));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showValues]);

  const handleSecureCopy = useCallback((text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} 복사됨`, {
      description: `${CLIPBOARD_CLEAR_SECONDS}초 후 클립보드가 자동 삭제됩니다`,
    });
    setTimeout(() => {
      navigator.clipboard.writeText('').catch(() => {/* noop */});
    }, CLIPBOARD_CLEAR_SECONDS * 1000);
  }, []);

  const handleCopyUsername = useCallback((id: string) => {
    const data = decryptedData[id];
    if (data?.username) {
      handleSecureCopy(data.username, '아이디');
    } else {
      toast.error('먼저 값을 표시한 후 복사하세요');
    }
  }, [decryptedData, handleSecureCopy]);

  const handleCopyPassword = useCallback((id: string) => {
    const data = decryptedData[id];
    if (data?.password) {
      handleSecureCopy(data.password, '비밀번호');
    } else {
      toast.error('비밀번호가 없거나 먼저 값을 표시하세요');
    }
  }, [decryptedData, handleSecureCopy]);

  // Service grouping
  const serviceGroups = useMemo((): ServiceGroup[] => {
    if (!groupByService) return [];
    const groupMap = new Map<string, ServiceCredential[]>();
    for (const cred of credentials) {
      const key = cred.service_id || '__none__';
      const list = groupMap.get(key) || [];
      list.push(cred);
      groupMap.set(key, list);
    }
    return Array.from(groupMap.entries())
      .map(([key, creds]) => ({
        serviceId: key === '__none__' ? null : key,
        serviceName: key === '__none__' ? '미연결' : (serviceNameMap.get(key) || key),
        credentials: creds,
      }))
      .sort((a, b) => {
        if (a.serviceId === null) return 1;
        if (b.serviceId === null) return -1;
        return a.serviceName.localeCompare(b.serviceName);
      });
  }, [credentials, groupByService, serviceNameMap]);

  if (credentials.length === 0) {
    return (
      <Card>
        <CardContent>
          <EmptyState
            icon={UserCheck}
            title="등록된 계정 정보가 없습니다"
            description="서비스에서 사용하는 관리자, 데모 계정 등의 아이디/비밀번호를 안전하게 관리하세요."
          />
        </CardContent>
      </Card>
    );
  }

  const renderRow = (cred: ServiceCredential, showServiceColumn: boolean) => {
    const isShowing = showValues[cred.id];
    const data = decryptedData[cred.id];
    const isSelected = selectable && selectedIds!.has(cred.id);
    const days = getDaysSince(cred.updated_at);
    const ageWarning = getAgeWarning(days);
    const countdown = autoHideCountdowns[cred.id];
    const noPassword = !cred.encrypted_password;

    const gridCols = showServiceColumn
      ? (selectable ? 'sm:grid-cols-[36px_1fr_160px_100px_100px_80px_60px]' : 'sm:grid-cols-[1fr_160px_100px_100px_80px_60px]')
      : (selectable ? 'sm:grid-cols-[36px_1fr_160px_100px_80px_60px]' : 'sm:grid-cols-[1fr_160px_100px_80px_60px]');

    return (
      <div
        key={cred.id}
        className={`flex flex-col sm:grid gap-2 sm:gap-4 p-3 sm:p-4 sm:items-center hover:bg-muted/30 transition-colors ${isSelected ? 'bg-brand-blue/5 dark:bg-brand-blue/10' : ''} ${gridCols}`}
      >
        {selectable && (
          <div className="flex items-center">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onToggleSelect!(cred.id)}
              aria-label={`${cred.label} 선택`}
            />
          </div>
        )}

        {/* Label + Username */}
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium truncate">{cred.label}</span>
            {cred.website_url && (
              <a href={cred.website_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
            {noPassword && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <AlertTriangle className="h-3 w-3 text-amber-500" />
                  </TooltipTrigger>
                  <TooltipContent><p>비밀번호 미설정</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {ageWarning.level !== 'ok' && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Clock className={`h-3 w-3 ${ageWarning.level === 'danger' ? 'text-red-500' : 'text-amber-500'}`} />
                  </TooltipTrigger>
                  <TooltipContent><p>{ageWarning.label}</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <div className="flex items-center gap-1">
            <code className="text-xs text-muted-foreground font-mono truncate">
              {isShowing && data?.username ? data.username : '\u2022'.repeat(12)}
            </code>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0"
              onClick={() => onToggleShow(cred.id)}
              disabled={isDecrypting}
              title={isShowing ? '숨기기' : '표시'}
            >
              {isShowing ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </Button>
            {isShowing && countdown !== undefined && (
              <span className="text-[10px] text-muted-foreground tabular-nums">{countdown}s</span>
            )}
          </div>
        </div>

        {/* Password */}
        <div className="flex items-center gap-1 min-w-0">
          {cred.encrypted_password ? (
            <code className="text-xs text-muted-foreground font-mono truncate">
              {isShowing && data?.password ? data.password : '\u2022'.repeat(12)}
            </code>
          ) : (
            <span className="text-xs text-muted-foreground">-</span>
          )}
        </div>

        {/* Purpose */}
        <div>
          <Badge variant="outline" className={`text-[10px] ${purposeColors[cred.purpose]}`}>
            {purposeLabels[cred.purpose]}
          </Badge>
        </div>

        {/* Service (only in flat view) */}
        {showServiceColumn && (
          <div className="min-w-0">
            {cred.service_id && serviceNameMap.has(cred.service_id) ? (
              <Badge variant="outline" className="text-[10px] truncate max-w-full">
                {serviceNameMap.get(cred.service_id)}
              </Badge>
            ) : (
              <span className="text-xs text-muted-foreground">-</span>
            )}
          </div>
        )}

        {/* Environment */}
        <div>
          <Badge variant="secondary" className="text-[10px]">
            {envLabels[cred.environment] || cred.environment}
          </Badge>
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
              <DropdownMenuItem onClick={() => onEdit(cred)}>
                <Pencil className="mr-2 h-4 w-4" />
                수정
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleCopyUsername(cred.id)}>
                <Copy className="mr-2 h-4 w-4" />
                아이디 복사
              </DropdownMenuItem>
              {cred.encrypted_password && (
                <DropdownMenuItem onClick={() => handleCopyPassword(cred.id)}>
                  <Copy className="mr-2 h-4 w-4" />
                  비밀번호 복사
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete(cred.id)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  };

  const renderHeader = (showServiceColumn: boolean) => {
    const allSelected = selectable && credentials.length > 0 && credentials.every((c) => selectedIds!.has(c.id));
    const someSelected = selectable && credentials.some((c) => selectedIds!.has(c.id)) && !allSelected;

    const gridCols = showServiceColumn
      ? (selectable ? 'sm:grid-cols-[36px_1fr_160px_100px_100px_80px_60px]' : 'sm:grid-cols-[1fr_160px_100px_100px_80px_60px]')
      : (selectable ? 'sm:grid-cols-[36px_1fr_160px_100px_80px_60px]' : 'sm:grid-cols-[1fr_160px_100px_80px_60px]');

    return (
      <div className={`hidden sm:grid gap-4 px-4 py-2 border-b bg-muted/50 text-xs font-medium text-muted-foreground ${gridCols}`}>
        {selectable && (
          <div className="flex items-center">
            <Checkbox
              checked={allSelected ? true : someSelected ? 'indeterminate' : false}
              onCheckedChange={() => onToggleSelectAll!()}
              aria-label="전체 선택"
            />
          </div>
        )}
        <div>라벨 / 아이디</div>
        <div>비밀번호</div>
        <div>용도</div>
        {showServiceColumn && <div>서비스</div>}
        <div>환경</div>
        <div></div>
      </div>
    );
  };

  // Grouped view
  if (groupByService && serviceGroups.length > 0) {
    return (
      <div className="space-y-3">
        {serviceGroups.map((group) => (
          <ServiceGroupCard
            key={group.serviceId || '__none__'}
            group={group}
            selectable={selectable}
            selectedIds={selectedIds}
            onToggleSelect={onToggleSelect}
            onSelectServiceGroup={onSelectServiceGroup}
            renderRow={renderRow}
            onAddForService={onAddForService}
            onBulkEditGroup={onBulkEditGroup}
            onExportGroup={onExportGroup}
          />
        ))}
      </div>
    );
  }

  // Flat view
  return (
    <Card>
      <CardContent className="p-0">
        {renderHeader(true)}
        <div className="divide-y">
          {credentials.map((cred) => renderRow(cred, true))}
        </div>
      </CardContent>
    </Card>
  );
}

function ServiceGroupCard({
  group,
  selectable,
  selectedIds,
  onToggleSelect,
  onSelectServiceGroup,
  renderRow,
  onAddForService,
  onBulkEditGroup,
  onExportGroup,
}: {
  group: ServiceGroup;
  selectable: boolean;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
  onSelectServiceGroup?: (serviceId: string | null) => void;
  renderRow: (cred: ServiceCredential, showServiceColumn: boolean) => React.ReactNode;
  onAddForService?: (serviceId: string | null) => void;
  onBulkEditGroup?: (serviceId: string | null) => void;
  onExportGroup?: (serviceId: string | null) => void;
}) {
  const [open, setOpen] = useState(true);
  const groupIds = group.credentials.map((c) => c.id);
  const selectedInGroup = selectable ? groupIds.filter((id) => selectedIds!.has(id)).length : 0;
  const allInGroupSelected = selectable && groupIds.length > 0 && selectedInGroup === groupIds.length;
  const someInGroupSelected = selectable && selectedInGroup > 0 && !allInGroupSelected;

  const handleGroupSelect = () => {
    if (!selectable || !onToggleSelect) return;
    if (allInGroupSelected) {
      groupIds.forEach((id) => onToggleSelect(id));
    } else {
      groupIds.filter((id) => !selectedIds!.has(id)).forEach((id) => onToggleSelect(id));
    }
  };

  return (
    <Card>
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="flex items-center gap-3 px-4 py-3 border-b bg-muted/30">
          {selectable && (
            <Checkbox
              checked={allInGroupSelected ? true : someInGroupSelected ? 'indeterminate' : false}
              onCheckedChange={handleGroupSelect}
              aria-label={`${group.serviceName} 전체 선택`}
            />
          )}
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 p-0 h-auto hover:bg-transparent">
              {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-sm">{group.serviceName}</span>
            </Button>
          </CollapsibleTrigger>
          <Badge variant="secondary" className="text-[10px]">{group.credentials.length}</Badge>
          <div className="flex-1" />
          <div className="flex items-center gap-1">
            {onAddForService && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => { e.stopPropagation(); onAddForService(group.serviceId); }}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>계정 추가</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {onBulkEditGroup && group.credentials.length > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => { e.stopPropagation(); onBulkEditGroup(group.serviceId); }}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>일괄 수정</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {onExportGroup && group.credentials.length > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => { e.stopPropagation(); onExportGroup(group.serviceId); }}
                    >
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>.env 내보내기</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {selectable && onSelectServiceGroup && selectedInGroup === 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-7"
                onClick={() => {
                  groupIds.filter((id) => !selectedIds!.has(id)).forEach((id) => onToggleSelect!(id));
                }}
              >
                전체 선택
              </Button>
            )}
          </div>
        </div>
        <CollapsibleContent>
          <CardContent className="p-0">
            <div className="divide-y">
              {group.credentials.map((cred) => renderRow(cred, false))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
