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
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-background/80 backdrop-blur-md rounded-full border shadow-sm p-1">
      <Button
        variant={catalogSidebarOpen ? 'default' : 'ghost'}
        size="sm"
        onClick={toggleCatalogSidebar}
        className="h-8 rounded-full"
      >
        <Plus className="mr-1.5 h-3.5 w-3.5" />
        서비스 추가
      </Button>

      <div className="w-px h-5 bg-border/50" />

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="서비스 검색..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-9 w-[180px] text-sm border-0 bg-transparent focus-visible:ring-0 shadow-none"
        />
      </div>

      <div className="w-px h-5 bg-border/50" />

      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full" onClick={() => fitView({ padding: 0.3 })} title="전체 보기">
        <Maximize2 className="h-4 w-4" />
      </Button>

      {onAiAnalyze && (
        <Button
          variant="outline"
          size="sm"
          onClick={onAiAnalyze}
          className="h-8 ml-1 rounded-full bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border-blue-500/20 hover:border-blue-500/40 text-blue-700 dark:text-blue-300"
        >
          <Brain className="mr-1.5 h-3.5 w-3.5" />
          AI 분석
        </Button>
      )}

      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full" onClick={onExportPng} title="PNG 다운로드">
        <Download className="h-4 w-4" />
      </Button>

      <div className="w-px h-5 bg-border/50" />

      <Button
        variant={editMode ? 'default' : 'ghost'}
        size="sm"
        className="h-8 rounded-full"
        onClick={() => setEditMode(!editMode)}
      >
        <Pencil className="mr-1.5 h-3.5 w-3.5" />
        {editMode ? '편집 중' : '편집'}
      </Button>

      {onToggleLegend && (
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full" onClick={onToggleLegend} title="범례">
          <HelpCircle className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
