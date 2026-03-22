'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Save, X, Undo2, Redo2, Keyboard } from 'lucide-react';
import { useServiceMapStore } from '@/stores/service-map-store';

interface EditSaveBarProps {
  onSave: () => void;
  saving?: boolean;
}

export function EditSaveBar({ onSave, saving }: EditSaveBarProps) {
  const {
    editMode, setEditMode, clearPendingChanges, pendingChangeCount,
    canUndo, canRedo, undo, redo,
    pendingOverrides, pendingNodePositions, zoneConnections,
  } = useServiceMapStore();
  const count = pendingChangeCount();

  if (!editMode) return null;

  const zoneChanges = Object.keys(pendingOverrides).length;
  const posChanges = Object.keys(pendingNodePositions).length;

  return (
    <div className="absolute top-16 right-4 z-40 flex flex-col gap-2">
      {/* Main toolbar */}
      <div className="flex items-center gap-2 rounded-2xl border bg-background/95 backdrop-blur-sm px-3 py-1.5 shadow-lg">
        <div className="flex items-center gap-1.5 text-xs text-primary">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="font-medium">편집 모드</span>
        </div>

        {count > 0 && (
          <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
            {count}건 변경
          </Badge>
        )}

        <div className="w-px h-4 bg-border" />

        {/* Undo/Redo */}
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => canUndo() && undo()}
            disabled={!canUndo()}
            title="실행 취소 (Ctrl+Z)"
          >
            <Undo2 className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => canRedo() && redo()}
            disabled={!canRedo()}
            title="다시 실행 (Ctrl+Y)"
          >
            <Redo2 className="h-3 w-3" />
          </Button>
        </div>

        <div className="w-px h-4 bg-border" />

        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={() => {
            clearPendingChanges();
            setEditMode(false);
          }}
        >
          <X className="mr-1 h-3 w-3" />
          취소
        </Button>

        <Button
          size="sm"
          className="h-7 text-xs"
          onClick={onSave}
          disabled={count === 0 || saving}
        >
          <Save className="mr-1 h-3 w-3" />
          {saving ? '저장 중...' : '저장'}
        </Button>
      </div>

      {/* Change summary (shown when there are changes) */}
      {count > 0 && (
        <div className="flex items-center gap-1.5 rounded-xl border bg-background/90 backdrop-blur-sm px-3 py-1.5 shadow text-[10px] text-muted-foreground">
          {zoneChanges > 0 && <span>Zone 이동 {zoneChanges}</span>}
          {zoneChanges > 0 && posChanges > 0 && <span>&middot;</span>}
          {posChanges > 0 && <span>위치 변경 {posChanges}</span>}
          {(zoneChanges > 0 || posChanges > 0) && zoneConnections.length > 0 && <span>&middot;</span>}
          {zoneConnections.length > 0 && <span>연결 {zoneConnections.length}</span>}
        </div>
      )}

      {/* Keyboard shortcuts hint */}
      <div className="flex items-center gap-1 rounded-xl border bg-background/80 backdrop-blur-sm px-2.5 py-1 shadow-sm text-[9px] text-muted-foreground/70">
        <Keyboard className="h-2.5 w-2.5" />
        <span>Ctrl+Z 취소</span>
        <span>&middot;</span>
        <span>ESC 연결 취소</span>
        <span>&middot;</span>
        <span>노드 클릭: 편집</span>
      </div>
    </div>
  );
}
