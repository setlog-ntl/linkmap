'use client';

import { useReactFlow } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, Maximize2, Search, Plus, Brain, Pencil, HelpCircle } from 'lucide-react';
import { useServiceMapStore } from '@/stores/service-map-store';

interface MapToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onExportPng: () => void;
  onAiAnalyze?: () => void;
  onToggleLegend?: () => void;
}

export function MapToolbar({
  searchQuery,
  onSearchChange,
  onExportPng,
  onAiAnalyze,
  onToggleLegend,
}: MapToolbarProps) {
  const { fitView } = useReactFlow();
  const { toggleCatalogSidebar, catalogSidebarOpen, editMode, setEditMode } = useServiceMapStore();

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Button
        variant={catalogSidebarOpen ? 'default' : 'outline'}
        size="sm"
        onClick={toggleCatalogSidebar}
        className="h-8"
      >
        <Plus className="mr-1.5 h-3.5 w-3.5" />
        서비스 추가
      </Button>

      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          placeholder="서비스 검색..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8 h-8 w-[180px] text-sm"
        />
      </div>

      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => fitView({ padding: 0.3 })} title="전체 보기">
        <Maximize2 className="h-3.5 w-3.5" />
      </Button>

      {onAiAnalyze && (
        <Button
          variant="outline"
          size="sm"
          onClick={onAiAnalyze}
          className="h-8 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-blue-500/20 hover:border-blue-500/40 text-blue-700 dark:text-blue-300"
        >
          <Brain className="mr-1.5 h-3.5 w-3.5" />
          AI 분석
        </Button>
      )}

      <Button variant="outline" size="sm" className="h-8" onClick={onExportPng}>
        <Download className="mr-1.5 h-3.5 w-3.5" />
        PNG
      </Button>

      <Button
        variant={editMode ? 'default' : 'outline'}
        size="sm"
        className="h-8"
        onClick={() => setEditMode(!editMode)}
      >
        <Pencil className="mr-1.5 h-3.5 w-3.5" />
        {editMode ? '편집 중' : '편집'}
      </Button>

      {onToggleLegend && (
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={onToggleLegend} title="범례">
          <HelpCircle className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}
