'use client';

import { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Sparkles,
  User,
  Heart,
  TrendingUp,
  Image,
  Mail,
  ChevronUp,
  ChevronDown,
  Loader2,
  FileCode2,
  GripVertical,
} from 'lucide-react';
import type {
  TemplateModuleSchema,
  ModuleConfigState,
  ModuleDef,
} from '@/lib/module-schema';
import { ModuleForm } from './module-form';
import { t, type Locale } from '@/lib/i18n';
import type { ModulePreset } from '@/data/oneclick/module-presets';
import { getModulePresets } from '@/data/oneclick/module-presets';

// 아이콘 매핑
const ICON_MAP: Record<string, React.ElementType> = {
  Sparkles,
  User,
  Heart,
  TrendingUp,
  Image,
  Mail,
};

// ── Sortable Module Card ──────────────────────
interface SortableModuleCardProps {
  moduleId: string;
  mod: ModuleDef;
  index: number;
  totalCount: number;
  isEnabled: boolean;
  isSelected: boolean;
  locale: Locale;
  onSelect: (id: string) => void;
  onToggle: (id: string, enabled: boolean) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
}

function SortableModuleCard({
  moduleId,
  mod,
  index,
  totalCount,
  isEnabled,
  isSelected,
  locale,
  onSelect,
  onToggle,
  onMoveUp,
  onMoveDown,
}: SortableModuleCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: moduleId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    zIndex: isDragging ? 10 : undefined,
  };

  const Icon = ICON_MAP[mod.icon] ?? Sparkles;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-lg border p-2 cursor-pointer transition-colors ${
        isSelected
          ? 'border-primary bg-primary/5'
          : 'border-transparent hover:bg-muted/50'
      } ${!isEnabled ? 'opacity-50' : ''}`}
      onClick={() => onSelect(moduleId)}
    >
      <div className="flex items-center gap-1.5">
        <button
          className="p-0.5 cursor-grab active:cursor-grabbing touch-none text-muted-foreground hover:text-foreground"
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="h-3 w-3" />
        </button>
        <Switch
          checked={isEnabled}
          onCheckedChange={(checked) => onToggle(moduleId, checked)}
          disabled={mod.required}
          className="scale-75"
          onClick={(e) => e.stopPropagation()}
        />
        <Icon className="h-3.5 w-3.5 flex-shrink-0" />
        <span className="text-xs font-medium truncate flex-1">
          {locale === 'en' && mod.nameEn ? mod.nameEn : mod.name}
        </span>
        <div className="flex flex-col gap-0">
          <button
            className="p-0.5 hover:bg-muted rounded disabled:opacity-30"
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp(moduleId);
            }}
            disabled={index === 0}
          >
            <ChevronUp className="h-2.5 w-2.5" />
          </button>
          <button
            className="p-0.5 hover:bg-muted rounded disabled:opacity-30"
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown(moduleId);
            }}
            disabled={index === totalCount - 1}
          >
            <ChevronDown className="h-2.5 w-2.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Module Panel ──────────────────────────────
interface ModulePanelProps {
  schema: TemplateModuleSchema;
  state: ModuleConfigState;
  onStateChange: (state: ModuleConfigState) => void;
  onApply: () => void;
  isApplying: boolean;
  locale: Locale;
}

export function ModulePanel({
  schema,
  state,
  onStateChange,
  onApply,
  isApplying,
  locale,
}: ModulePanelProps) {
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(
    schema.modules[0]?.id ?? null
  );
  const [isExpanded, setIsExpanded] = useState(true);

  const selectedModule = useMemo(
    () => schema.modules.find((m) => m.id === selectedModuleId) ?? null,
    [schema.modules, selectedModuleId]
  );

  const presets: ModulePreset[] = useMemo(
    () => getModulePresets(schema.templateSlug),
    [schema.templateSlug]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIdx = state.order.indexOf(active.id as string);
      const newIdx = state.order.indexOf(over.id as string);
      if (oldIdx < 0 || newIdx < 0) return;

      const next = [...state.order];
      const [moved] = next.splice(oldIdx, 1);
      next.splice(newIdx, 0, moved);
      onStateChange({ ...state, order: next });
    },
    [state, onStateChange]
  );

  const handleApplyPreset = useCallback(
    (preset: ModulePreset) => {
      const next = { ...state };
      if (preset.state.enabled) next.enabled = preset.state.enabled;
      if (preset.state.order) next.order = preset.state.order;
      if (preset.state.values) {
        next.values = { ...state.values, ...preset.state.values };
      }
      onStateChange(next);
    },
    [state, onStateChange]
  );

  const handleToggleModule = useCallback(
    (moduleId: string, enabled: boolean) => {
      const mod = schema.modules.find((m) => m.id === moduleId);
      if (mod?.required) return;

      const next = { ...state };
      if (enabled) {
        next.enabled = [...state.enabled, moduleId];
        if (!next.order.includes(moduleId)) {
          next.order = [...next.order, moduleId];
        }
      } else {
        next.enabled = state.enabled.filter((id) => id !== moduleId);
      }
      onStateChange(next);
    },
    [state, onStateChange, schema.modules]
  );

  const handleFieldChange = useCallback(
    (moduleId: string, fieldKey: string, value: unknown) => {
      const next = {
        ...state,
        values: {
          ...state.values,
          [moduleId]: {
            ...state.values[moduleId],
            [fieldKey]: value,
          },
        },
      };
      onStateChange(next);
    },
    [state, onStateChange]
  );

  const handleMoveUp = useCallback(
    (moduleId: string) => {
      const idx = state.order.indexOf(moduleId);
      if (idx <= 0) return;
      const next = [...state.order];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      onStateChange({ ...state, order: next });
    },
    [state, onStateChange]
  );

  const handleMoveDown = useCallback(
    (moduleId: string) => {
      const idx = state.order.indexOf(moduleId);
      if (idx < 0 || idx >= state.order.length - 1) return;
      const next = [...state.order];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      onStateChange({ ...state, order: next });
    },
    [state, onStateChange]
  );

  return (
    <div className="border-t bg-background flex flex-col">
      {/* 접기/펴기 헤더 */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between px-4 py-2 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <FileCode2 className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-medium">
            {t(locale, 'modulePanel.title')}
          </span>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
            {state.enabled.length}/{schema.modules.length}
          </Badge>
        </div>
        {isExpanded ? (
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden border-t max-h-[50vh] md:max-h-[40vh]">
          {/* 좌: 프리셋 + 모듈 카드 리스트 */}
          <div className="md:w-48 lg:w-56 border-b md:border-b-0 md:border-r flex-shrink-0 overflow-y-auto">
            {/* 프리셋 선택 */}
            {presets.length > 0 && (
              <div className="px-2 pt-2 pb-1 border-b">
                <div className="flex gap-1 flex-wrap">
                  {presets.map((preset) => (
                    <button
                      key={preset.id}
                      className="text-[10px] px-2 py-0.5 rounded-full border hover:bg-primary/10 hover:border-primary transition-colors"
                      onClick={() => handleApplyPreset(preset)}
                      title={
                        locale === 'en'
                          ? preset.descriptionEn
                          : preset.description
                      }
                    >
                      {locale === 'en' ? preset.nameEn : preset.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={state.order}
                strategy={verticalListSortingStrategy}
              >
                <div className="p-2 space-y-1">
                  {state.order.map((moduleId, index) => {
                    const mod = schema.modules.find(
                      (m) => m.id === moduleId
                    );
                    if (!mod) return null;

                    return (
                      <SortableModuleCard
                        key={moduleId}
                        moduleId={moduleId}
                        mod={mod}
                        index={index}
                        totalCount={state.order.length}
                        isEnabled={state.enabled.includes(moduleId)}
                        isSelected={selectedModuleId === moduleId}
                        locale={locale}
                        onSelect={setSelectedModuleId}
                        onToggle={handleToggleModule}
                        onMoveUp={handleMoveUp}
                        onMoveDown={handleMoveDown}
                      />
                    );
                  })}
                </div>
              </SortableContext>
            </DndContext>
          </div>

          {/* 우: 선택된 모듈 편집 폼 */}
          <div className="flex-1 overflow-y-auto">
            {selectedModule && state.enabled.includes(selectedModule.id) ? (
              <div className="p-4">
                <div className="mb-3">
                  <h3 className="text-sm font-semibold">
                    {locale === 'en' && selectedModule.nameEn
                      ? selectedModule.nameEn
                      : selectedModule.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {locale === 'en' && selectedModule.descriptionEn
                      ? selectedModule.descriptionEn
                      : selectedModule.description}
                  </p>
                </div>
                <ModuleForm
                  fields={selectedModule.fields}
                  values={state.values[selectedModule.id] || {}}
                  onChange={(key, value) =>
                    handleFieldChange(selectedModule.id, key, value)
                  }
                  locale={locale}
                />
                <div className="mt-4 pt-3 border-t">
                  <Button
                    size="sm"
                    className="w-full h-8 gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white"
                    onClick={onApply}
                    disabled={isApplying}
                  >
                    {isApplying ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <FileCode2 className="h-3.5 w-3.5" />
                    )}
                    <span className="text-xs">
                      {t(locale, 'modulePanel.applyToCode')}
                    </span>
                  </Button>
                </div>
              </div>
            ) : selectedModule ? (
              <div className="flex items-center justify-center h-full text-sm text-muted-foreground p-4">
                {t(locale, 'modulePanel.moduleDisabled')}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-muted-foreground p-4">
                {t(locale, 'modulePanel.selectModule')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
