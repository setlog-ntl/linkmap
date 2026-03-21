'use client';

import { memo, useState, useRef, useEffect, useCallback } from 'react';
import { NodeResizer, type NodeProps } from '@xyflow/react';
import { Monitor, Server, Wrench, Box, Trash2, Shrink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useServiceMapStore } from '@/stores/service-map-store';
import { DEFAULT_ZONES, ZONE_COLOR_PALETTE, computeAutoFitSize } from '@/lib/layout/zone-layout';

const ZONE_ICONS: Record<string, typeof Monitor> = {
  frontend: Monitor,
  backend: Server,
  devtools: Wrench,
};

interface ZoneNodeData {
  domain: string;
  label: string;
  emoji: string;
  count: number;
  color?: string;
  subtitle?: string;
  isCustom?: boolean;
  [key: string]: unknown;
}

function ZoneNode({ id, data, selected }: NodeProps) {
  const d = data as unknown as ZoneNodeData;
  const editMode = useServiceMapStore((s) => s.editMode);
  const updateZone = useServiceMapStore((s) => s.updateZone);
  const removeZone = useServiceMapStore((s) => s.removeZone);
  const setZoneSizeOverride = useServiceMapStore((s) => s.setZoneSizeOverride);

  const Icon = ZONE_ICONS[d.domain] || Box;
  const isCustom = d.isCustom === true;
  const isDefault = DEFAULT_ZONES.some((z) => z.key === d.domain);

  // Inline rename
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(d.label);
  const inputRef = useRef<HTMLInputElement>(null);

  // Color picker
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isRenaming && inputRef.current) inputRef.current.focus();
  }, [isRenaming]);

  useEffect(() => {
    if (!showColorPicker) return;
    function handleClickOutside(e: MouseEvent) {
      if (colorRef.current && !colorRef.current.contains(e.target as HTMLElement)) {
        setShowColorPicker(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showColorPicker]);

  const handleRenameSubmit = useCallback(() => {
    const trimmed = renameValue.trim();
    if (trimmed && trimmed !== d.label) {
      updateZone(d.domain, { label: trimmed });
    }
    setIsRenaming(false);
  }, [renameValue, d.label, d.domain, updateZone]);

  const handleAutoFit = useCallback(() => {
    const optimal = computeAutoFitSize(d.count);
    setZoneSizeOverride(id, optimal);
  }, [id, d.count, setZoneSizeOverride]);

  // Derive colors from zone key or custom color
  const zoneKey = d.domain;
  const borderColors: Record<string, string> = {
    frontend: 'border-blue-200/60 dark:border-blue-500/20',
    backend: 'border-violet-200/60 dark:border-violet-500/20',
    devtools: 'border-yellow-200/60 dark:border-yellow-500/20',
  };
  const chipColors: Record<string, string> = {
    frontend: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
    backend: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/60 dark:text-violet-300 dark:border-violet-800',
    devtools: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/60 dark:text-yellow-300 dark:border-yellow-800',
  };
  const bgColors: Record<string, string> = {
    frontend: 'dark:bg-blue-950/5',
    backend: 'dark:bg-violet-950/5',
    devtools: 'dark:bg-yellow-950/5',
  };

  const borderClass = isCustom ? 'border-border/40' : (borderColors[zoneKey] || 'border-border/40');
  const chipClass = isCustom ? 'bg-muted text-foreground/80 border-border' : (chipColors[zoneKey] || 'bg-muted text-foreground/80 border-border');
  const bgClass = isCustom ? '' : (bgColors[zoneKey] || '');

  return (
    <div
      className={`w-full h-full rounded-[18px] border transition-colors nodrag ${bgClass} ${
        editMode && selected ? 'border-primary ring-2 ring-primary/20' : editMode ? 'border-primary/40 border-dashed' : borderClass
      }`}
    >
      {/* Resize handle — edit mode only */}
      {editMode && (
        <NodeResizer
          minWidth={300}
          minHeight={160}
          isVisible={selected}
          lineClassName="!border-primary/30"
          handleClassName="!w-3 !h-3 !rounded-sm !bg-primary/60 !border-primary"
          handleStyle={{ zIndex: 20 }}
        />
      )}

      {/* Zone label chip — pointer-events auto for interaction */}
      <div className="absolute -top-3 left-4 z-10" style={{ pointerEvents: 'auto' }}>
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-[10px] border text-[10px] font-semibold tracking-wide shadow-sm backdrop-blur-sm ${chipClass}`}>
          <Icon className="h-3.5 w-3.5 opacity-75" />
          {isRenaming ? (
            <input
              ref={inputRef}
              className="bg-transparent outline-none text-[10px] font-semibold w-[80px]"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onBlur={handleRenameSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRenameSubmit();
                if (e.key === 'Escape') { setRenameValue(d.label); setIsRenaming(false); }
              }}
            />
          ) : (
            <span
              className={editMode ? 'cursor-text hover:underline' : ''}
              onDoubleClick={() => { if (editMode) { setRenameValue(d.label); setIsRenaming(true); } }}
            >
              {d.label}
            </span>
          )}
          {d.subtitle && !isRenaming && (
            <span className="text-[8.5px] font-medium opacity-55 tracking-normal">{d.subtitle}</span>
          )}
          <Badge variant="secondary" className="text-[9px] h-4 px-1.5 ml-0.5 rounded-[5px]">
            {d.count}
          </Badge>
        </div>
      </div>

      {/* Edit mode controls — top right, pointer-events auto for interaction */}
      {editMode && (
        <div className="absolute -top-3 right-4 z-10 flex items-center gap-1" style={{ pointerEvents: 'auto' }}>
          {/* Color picker */}
          <div className="relative" ref={colorRef}>
            <button
              className="w-5 h-5 rounded-full border-2 border-background shadow-sm hover:scale-110 transition-transform"
              style={{ backgroundColor: ZONE_COLOR_PALETTE.find((c) => c.color === d.color)?.hex || '#94a3b8' }}
              onClick={() => setShowColorPicker(!showColorPicker)}
              title="색상 변경"
            />
            {showColorPicker && (
              <div className="absolute right-0 top-7 bg-card border rounded-lg shadow-lg p-2 flex gap-1 z-50">
                {ZONE_COLOR_PALETTE.map((c) => (
                  <button
                    key={c.hex}
                    className="w-5 h-5 rounded-full border hover:scale-125 transition-transform"
                    style={{ backgroundColor: c.hex, borderColor: c.color === d.color ? c.hex : 'transparent' }}
                    onClick={() => {
                      updateZone(d.domain, { color: c.color });
                      setShowColorPicker(false);
                    }}
                    title={c.name}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Auto-fit */}
          <button
            className="w-5 h-5 rounded-md bg-card border flex items-center justify-center hover:bg-accent transition-colors"
            onClick={handleAutoFit}
            title="자동 맞춤"
          >
            <Shrink className="h-3 w-3 text-muted-foreground" />
          </button>

          {/* Delete zone (custom only) */}
          {(isCustom || !isDefault) && (
            <button
              className="w-5 h-5 rounded-md bg-card border flex items-center justify-center hover:bg-destructive/10 transition-colors"
              onClick={() => removeZone(d.domain)}
              title="Zone 삭제"
            >
              <Trash2 className="h-3 w-3 text-destructive" />
            </button>
          )}
        </div>
      )}

      {d.count === 0 && (
        <div className="px-4 pt-8 text-xs text-muted-foreground/60">
          + 서비스를 이 Zone으로 이동하세요
        </div>
      )}
    </div>
  );
}

export default memo(ZoneNode);
