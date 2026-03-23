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
  Clock, AlertTriangle, Plus, Download,
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
        <CardContent className="py-10">
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

    return (
      <div
        key={cred.id}
        className={`group flex items-center gap-3 px-3 py-2.5 hover:bg-muted/40 transition-colors ${isSelected ? 'bg-brand-blue/5 dark:bg-brand-blue/10' : ''}`}
      >
        {selectable && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleSelect!(cred.id)}
            aria-label={`${cred.label} 선택`}
            className="shrink-0"
          />
        )}

        {/* Label + badges */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium truncate">{cred.label}</span>
            <Badge variant="outline" className={`text-[10px] shrink-0 ${purposeColors[cred.purpose]}`}>
              {purposeLabels[cred.purpose]}
            </Badge>
            <Badge variant="secondary" className="text-[10px] shrink-0">
              {envLabels[cred.environment] || cred.environment}
            </Badge>
            {showServiceColumn && cred.service_id && serviceNameMap.has(cred.service_id) && (
              <Badge variant="outline" className="text-[10px] truncate max-w-[100px] shrink-0">
                {serviceNameMap.get(cred.service_id)}
              </Badge>
            )}
            {cred.website_url && (
              <a href={cred.website_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground shrink-0">
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
            {noPassword && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger><AlertTriangle className="h-3 w-3 text-amber-500 shrink-0" /></TooltipTrigger>
                  <TooltipContent><p>비밀번호 미설정</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {ageWarning.level !== 'ok' && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Clock className={`h-3 w-3 shrink-0 ${ageWarning.level === 'danger' ? 'text-red-500' : 'text-amber-500'}`} />
                  </TooltipTrigger>
                  <TooltipContent><p>{ageWarning.label}</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>

        {/* Credentials (ID / PW) */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1 w-[140px]">
            <code className="text-xs text-muted-foreground font-mono truncate">
              {isShowing && data?.username ? data.username : '\u2022'.repeat(10)}
            </code>
          </div>
          <span className="text-muted-foreground/40">/</span>
          <div className="flex items-center gap-1 w-[120px]">
            {cred.encrypted_password ? (
              <code className="text-xs text-muted-foreground font-mono truncate">
                {isShowing && data?.password ? data.password : '\u2022'.repeat(10)}
              </code>
            ) : (
              <span className="text-xs text-muted-foreground">-</span>
            )}
          </div>
        </div>

        {/* Mobile: credentials below label */}
        <div className="flex sm:hidden items-center gap-1 text-xs text-muted-foreground font-mono">
          {isShowing && data?.username ? data.username : '\u2022'.repeat(8)}
        </div>

        {/* Show/Hide + countdown */}
        <div className="flex items-center gap-0.5 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onToggleShow(cred.id)}
            disabled={isDecrypting}
            title={isShowing ? '숨기기' : '표시'}
          >
            {isShowing ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </Button>
          {isShowing && countdown !== undefined && (
            <span className="text-[10px] text-muted-foreground tabular-nums w-5 text-center">{countdown}s</span>
          )}
        </div>

        {/* Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity">
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(cred)}>
              <Pencil className="mr-2 h-3.5 w-3.5" />
              수정
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleCopyUsername(cred.id)}>
              <Copy className="mr-2 h-3.5 w-3.5" />
              아이디 복사
            </DropdownMenuItem>
            {cred.encrypted_password && (
              <DropdownMenuItem onClick={() => handleCopyPassword(cred.id)}>
                <Copy className="mr-2 h-3.5 w-3.5" />
                비밀번호 복사
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onDelete(cred.id)} className="text-destructive">
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              삭제
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  };

  const renderHeader = (showServiceColumn: boolean) => {
    const allSelected = selectable && credentials.length > 0 && credentials.every((c) => selectedIds!.has(c.id));
    const someSelected = selectable && credentials.some((c) => selectedIds!.has(c.id)) && !allSelected;

    return (
      <div className="hidden sm:flex items-center gap-3 px-3 py-2 border-b bg-muted/50 text-xs font-medium text-muted-foreground">
        {selectable && (
          <Checkbox
            checked={allSelected ? true : someSelected ? 'indeterminate' : false}
            onCheckedChange={() => onToggleSelectAll!()}
            aria-label="전체 선택"
            className="shrink-0"
          />
        )}
        <div className="flex-1">라벨</div>
        <div className="w-[140px]">아이디</div>
        <div className="w-3" />
        <div className="w-[120px]">비밀번호</div>
        <div className="w-7" />
        <div className="w-7" />
      </div>
    );
  };

  // Grouped view
  if (groupByService && serviceGroups.length > 0) {
    return (
      <div className="space-y-2">
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
    <Card className="overflow-hidden">
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="flex items-center gap-2 px-3 py-2 border-b bg-muted/30">
          {selectable && (
            <Checkbox
              checked={allInGroupSelected ? true : someInGroupSelected ? 'indeterminate' : false}
              onCheckedChange={handleGroupSelect}
              aria-label={`${group.serviceName} 전체 선택`}
              className="shrink-0"
            />
          )}
          <CollapsibleTrigger asChild>
            <button className="flex items-center gap-1.5 hover:text-foreground transition-colors text-left min-w-0">
              {open ? <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
              <span className="font-medium text-sm truncate">{group.serviceName}</span>
              <span className="text-xs text-muted-foreground shrink-0">{group.credentials.length}</span>
            </button>
          </CollapsibleTrigger>
          <div className="flex-1" />
          <div className="flex items-center">
            {onAddForService && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => { e.stopPropagation(); onAddForService(group.serviceId); }}
                title="계정 추가"
              >
                <Plus className="h-3 w-3" />
              </Button>
            )}
            {onBulkEditGroup && group.credentials.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => { e.stopPropagation(); onBulkEditGroup(group.serviceId); }}
                title="일괄 수정"
              >
                <Pencil className="h-3 w-3" />
              </Button>
            )}
            {onExportGroup && group.credentials.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => { e.stopPropagation(); onExportGroup(group.serviceId); }}
                title=".env 내보내기"
              >
                <Download className="h-3 w-3" />
              </Button>
            )}
            {selectable && onSelectServiceGroup && selectedInGroup === 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-[11px] h-6 px-2"
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
          <div className="divide-y">
            {group.credentials.map((cred) => renderRow(cred, false))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
