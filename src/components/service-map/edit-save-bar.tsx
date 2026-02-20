'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Save, X, Pencil } from 'lucide-react';
import { useServiceMapStore } from '@/stores/service-map-store';

interface EditSaveBarProps {
  onSave: () => void;
  saving?: boolean;
}

export function EditSaveBar({ onSave, saving }: EditSaveBarProps) {
  const { editMode, setEditMode, clearPendingChanges, pendingChangeCount } = useServiceMapStore();
  const count = pendingChangeCount();

  if (!editMode) return null;

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 rounded-full border bg-background/95 backdrop-blur-sm px-4 py-2 shadow-lg">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Pencil className="h-3.5 w-3.5" />
        <span>편집 모드</span>
      </div>

      {count > 0 && (
        <Badge variant="secondary" className="text-xs">
          변경 {count}건
        </Badge>
      )}

      <div className="w-px h-4 bg-border" />

      <Button
        variant="ghost"
        size="sm"
        className="h-7"
        onClick={() => {
          clearPendingChanges();
          setEditMode(false);
        }}
      >
        <X className="mr-1 h-3.5 w-3.5" />
        취소
      </Button>

      <Button
        size="sm"
        className="h-7"
        onClick={onSave}
        disabled={count === 0 || saving}
      >
        <Save className="mr-1 h-3.5 w-3.5" />
        {saving ? '저장 중...' : '저장'}
      </Button>
    </div>
  );
}
