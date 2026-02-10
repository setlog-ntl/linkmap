'use client';

import { useReactFlow } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Layers,
  ArrowDownUp,
  ArrowLeftRight,
  Download,
  Maximize2,
  Search,
  Filter,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type GroupMode = 'category' | 'domain';
export type LayoutDirection = 'TB' | 'LR';
export type StatusFilter = 'all' | 'connected' | 'in_progress' | 'not_started' | 'error';

interface MapToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  groupMode: GroupMode;
  onGroupModeChange: (mode: GroupMode) => void;
  layoutDirection: LayoutDirection;
  onLayoutDirectionChange: (dir: LayoutDirection) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (filter: StatusFilter) => void;
  onExportPng: () => void;
}

const statusLabels: Record<StatusFilter, string> = {
  all: '전체',
  connected: '연결됨',
  in_progress: '진행 중',
  not_started: '시작 전',
  error: '오류',
};

export function MapToolbar({
  searchQuery,
  onSearchChange,
  groupMode,
  onGroupModeChange,
  layoutDirection,
  onLayoutDirectionChange,
  statusFilter,
  onStatusFilterChange,
  onExportPng,
}: MapToolbarProps) {
  const { fitView } = useReactFlow();

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          placeholder="서비스 검색..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8 h-8 w-[180px] text-sm"
        />
      </div>

      {/* Group toggle */}
      <Button
        variant={groupMode === 'category' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onGroupModeChange('category')}
        className="h-8"
      >
        <Layers className="mr-1.5 h-3.5 w-3.5" />
        카테고리
      </Button>
      <Button
        variant={groupMode === 'domain' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onGroupModeChange('domain')}
        className="h-8"
      >
        <Layers className="mr-1.5 h-3.5 w-3.5" />
        도메인
      </Button>

      {/* Layout direction */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onLayoutDirectionChange(layoutDirection === 'TB' ? 'LR' : 'TB')}
        className="h-8"
        title={layoutDirection === 'TB' ? '가로 레이아웃으로 전환' : '세로 레이아웃으로 전환'}
      >
        {layoutDirection === 'TB' ? (
          <ArrowDownUp className="mr-1.5 h-3.5 w-3.5" />
        ) : (
          <ArrowLeftRight className="mr-1.5 h-3.5 w-3.5" />
        )}
        {layoutDirection === 'TB' ? '세로' : '가로'}
      </Button>

      {/* Status filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8">
            <Filter className="mr-1.5 h-3.5 w-3.5" />
            {statusLabels[statusFilter]}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuRadioGroup
            value={statusFilter}
            onValueChange={(v) => onStatusFilterChange(v as StatusFilter)}
          >
            {Object.entries(statusLabels).map(([key, label]) => (
              <DropdownMenuRadioItem key={key} value={key}>
                {label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* fitView */}
      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => fitView({ padding: 0.3 })} title="맵 전체 보기">
        <Maximize2 className="h-3.5 w-3.5" />
      </Button>

      {/* Export */}
      <Button variant="outline" size="sm" className="h-8" onClick={onExportPng}>
        <Download className="mr-1.5 h-3.5 w-3.5" />
        PNG
      </Button>
    </div>
  );
}
