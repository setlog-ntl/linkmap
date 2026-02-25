'use client';

import { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
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
  GripVertical,
  Plus,
  Zap,
} from 'lucide-react';
import type {
  TemplateModuleSchema,
  ModuleConfigState,
  ModuleDef,
} from '@/lib/module-schema';
import { ModuleForm } from './module-form';
import { SplitButton } from './split-button';
import type { Locale } from '@/lib/i18n';
import type { ModulePreset } from '@/data/oneclick/module-presets';
import { getModulePresets } from '@/data/oneclick/module-presets';
import type { QuickEditQuestion } from '@/data/oneclick/module-quick-edits';
import { getQuickEdits } from '@/data/oneclick/module-quick-edits';

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
    opacity: isDragging ? 0.3 : undefined,
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
      }`}
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

// ── DragGhostCard ─────────────────────────────
function DragGhostCard({ mod, locale }: { mod: ModuleDef; locale: Locale }) {
  const Icon = ICON_MAP[mod.icon] ?? Sparkles;
  return (
    <div className="rounded-md border bg-background shadow-lg px-3 py-2 flex items-center gap-2 cursor-grabbing">
      <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      <span className="text-sm font-medium">
        {locale === 'en' && mod.nameEn ? mod.nameEn : mod.name}
      </span>
    </div>
  );
}

// ── DisabledModulesSection ────────────────────
interface DisabledModulesSectionProps {
  moduleIds: string[];
  schema: TemplateModuleSchema;
  onEnable: (id: string) => void;
  locale: Locale;
}

function DisabledModulesSection({
  moduleIds,
  schema,
  onEnable,
  locale,
}: DisabledModulesSectionProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="px-4 pb-2">
      <button
        className="text-[11px] font-medium text-muted-foreground mb-1.5 flex items-center gap-1"
        onClick={() => setOpen(!open)}
      >
        <Plus className="h-3 w-3" />
        섹션 추가 ({moduleIds.length})
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="space-y-1">
          {moduleIds.map((id) => {
            const mod = schema.modules.find((m) => m.id === id);
            if (!mod) return null;
            const Icon = ICON_MAP[mod.icon] ?? Sparkles;
            return (
              <div
                key={id}
                className="flex items-center gap-2 px-2 py-1.5 rounded-md border border-dashed hover:bg-muted/50"
              >
                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs flex-1 text-muted-foreground">
                  {locale === 'en' && mod.nameEn ? mod.nameEn : mod.name}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={() => onEnable(id)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Module Panel ──────────────────────────────
interface ModulePanelProps {
  schema: TemplateModuleSchema;
  state: ModuleConfigState;
  onStateChange: (state: ModuleConfigState) => void;
  onSaveOnly: () => void;
  onSaveAndDeploy: () => void;
  isApplying: boolean;
  isDeploying: boolean;
  locale: Locale;
  deployId?: string;
}

export function ModulePanel({
  schema,
  state,
  onStateChange,
  onSaveOnly,
  onSaveAndDeploy,
  isApplying,
  isDeploying,
  locale,
  deployId,
}: ModulePanelProps) {
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(
    schema.modules[0]?.id ?? null
  );
  const [loadingQuickEditId, setLoadingQuickEditId] = useState<string | null>(null);
  const [aiPolishingField, setAiPolishingField] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const selectedModule = useMemo(
    () => schema.modules.find((m) => m.id === selectedModuleId) ?? null,
    [schema.modules, selectedModuleId]
  );

  const presets: ModulePreset[] = useMemo(
    () => getModulePresets(schema.templateSlug),
    [schema.templateSlug]
  );

  const quickEdits: QuickEditQuestion[] = useMemo(
    () => getQuickEdits(schema.templateSlug),
    [schema.templateSlug]
  );

  // enabled 모듈만 (순서 유지)
  const enabledModules = useMemo(
    () => state.order.filter((id) => state.enabled.includes(id)),
    [state.order, state.enabled]
  );

  // disabled 모듈 (schema 순서 기준)
  const disabledModules = useMemo(
    () =>
      schema.modules
        .filter((m) => !state.enabled.includes(m.id))
        .map((m) => m.id),
    [schema.modules, state.enabled]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveId(null);
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIdx = enabledModules.indexOf(active.id as string);
      const newIdx = enabledModules.indexOf(over.id as string);
      if (oldIdx < 0 || newIdx < 0) return;

      const next = [...enabledModules];
      const [moved] = next.splice(oldIdx, 1);
      next.splice(newIdx, 0, moved);
      // disabled는 order 맨 뒤에 유지
      onStateChange({ ...state, order: [...next, ...disabledModules] });
    },
    [state, onStateChange, enabledModules, disabledModules]
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

      if (enabled) {
        // 활성화: enabled에 추가, order 맨 뒤(enabled 영역)에 추가
        const newEnabled = [...state.enabled, moduleId];
        const newOrder = [...enabledModules, moduleId, ...disabledModules.filter((id) => id !== moduleId)];
        onStateChange({ ...state, enabled: newEnabled, order: newOrder });
      } else {
        // 비활성화: enabled에서 제거, order는 enabled 먼저 + disabled 뒤
        const newEnabled = state.enabled.filter((id) => id !== moduleId);
        const newEnabledOrder = enabledModules.filter((id) => id !== moduleId);
        const newDisabledOrder = [...disabledModules, moduleId];
        onStateChange({ ...state, enabled: newEnabled, order: [...newEnabledOrder, ...newDisabledOrder] });
      }
    },
    [state, onStateChange, schema.modules, enabledModules, disabledModules]
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
      const idx = enabledModules.indexOf(moduleId);
      if (idx <= 0) return;
      const next = [...enabledModules];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      onStateChange({ ...state, order: [...next, ...disabledModules] });
    },
    [state, onStateChange, enabledModules, disabledModules]
  );

  const handleMoveDown = useCallback(
    (moduleId: string) => {
      const idx = enabledModules.indexOf(moduleId);
      if (idx < 0 || idx >= enabledModules.length - 1) return;
      const next = [...enabledModules];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      onStateChange({ ...state, order: [...next, ...disabledModules] });
    },
    [state, onStateChange, enabledModules, disabledModules]
  );

  const handleQuickEdit = useCallback(
    async (question: QuickEditQuestion) => {
      const isModuleEnabled = state.enabled.includes(question.targetModuleId);
      if (!isModuleEnabled) {
        toast.error('모듈을 먼저 활성화하세요');
        return;
      }

      setLoadingQuickEditId(question.id);
      try {
        const currentModuleValues = state.values[question.targetModuleId] || {};
        const targetMod = schema.modules.find((m) => m.id === question.targetModuleId);

        const fieldHints = targetMod
          ? question.targetFields
              .map((fieldKey) => {
                const field = targetMod.fields.find((f) => f.key === fieldKey);
                if (!field) return null;
                return {
                  key: field.key,
                  type: field.type,
                  options: field.options,
                };
              })
              .filter((h): h is NonNullable<typeof h> => h !== null)
          : undefined;

        const res = await fetch('/api/ai/module-quick-edit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            questionId: question.id,
            templateSlug: schema.templateSlug,
            targetModuleId: question.targetModuleId,
            targetFields: question.targetFields,
            currentValues: currentModuleValues,
            fieldHints,
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || 'AI 퀵 편집 실패');
        }

        const { values, reasoning } = await res.json();

        // 값 머지
        const next = {
          ...state,
          values: {
            ...state.values,
            [question.targetModuleId]: {
              ...state.values[question.targetModuleId],
              ...values,
            },
          },
        };
        onStateChange(next);

        // 대상 모듈 자동 선택
        setSelectedModuleId(question.targetModuleId);

        if (reasoning) toast.success(reasoning);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'AI 퀵 편집 실패');
      } finally {
        setLoadingQuickEditId(null);
      }
    },
    [state, schema, onStateChange]
  );

  const handleAiPolish = useCallback(async (fieldKey: string, currentValue: string) => {
    if (!selectedModuleId) return;
    setAiPolishingField(fieldKey);
    try {
      const targetMod = schema.modules.find((m) => m.id === selectedModuleId);
      const fieldDef = targetMod?.fields.find((f) => f.key === fieldKey);
      const fieldHints = fieldDef
        ? [{ key: fieldDef.key, type: fieldDef.type, options: fieldDef.options }]
        : undefined;

      const res = await fetch('/api/ai/module-quick-edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: `inline-polish-${fieldKey}`,
          templateSlug: schema.templateSlug,
          targetModuleId: selectedModuleId,
          targetFields: [fieldKey],
          currentValues: { [fieldKey]: currentValue },
          fieldHints,
          inlinePolish: true,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'AI 다듬기 실패');
      }

      const { values, reasoning } = await res.json();

      const next = {
        ...state,
        values: {
          ...state.values,
          [selectedModuleId]: {
            ...state.values[selectedModuleId],
            ...values,
          },
        },
      };
      onStateChange(next);

      if (reasoning) toast.success(reasoning);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'AI 다듬기 실패');
    } finally {
      setAiPolishingField(null);
    }
  }, [selectedModuleId, schema, state, onStateChange]);

  const activeModule = useMemo(
    () => (activeId ? schema.modules.find((m) => m.id === activeId) : null),
    [activeId, schema.modules]
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* 패널 헤더 */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b flex-shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-semibold">모듈 편집</span>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
            {state.enabled.length}/{schema.modules.length}
          </Badge>
        </div>
      </div>

      {/* 스크롤 가능 영역 */}
      <div className="flex-1 overflow-y-auto">
        {/* AI 퀵 편집 */}
        {quickEdits.length > 0 && (
          <div className="px-4 pt-3 pb-2">
            <div className="flex items-center gap-1.5 mb-2">
              <Zap className="h-3 w-3 text-amber-500" />
              <span className="text-[11px] font-medium text-muted-foreground">AI 퀵 편집</span>
            </div>
            <div className="flex gap-1 flex-wrap">
              {quickEdits.map((q) => {
                const isTargetEnabled = state.enabled.includes(q.targetModuleId);
                const isLoading = loadingQuickEditId === q.id;
                const isAnyLoading = loadingQuickEditId !== null;
                return (
                  <button
                    key={q.id}
                    className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors inline-flex items-center gap-1 ${
                      isTargetEnabled
                        ? 'hover:bg-amber-500/10 hover:border-amber-500'
                        : 'opacity-40 cursor-not-allowed'
                    }`}
                    onClick={() => handleQuickEdit(q)}
                    disabled={isAnyLoading}
                    title={
                      !isTargetEnabled
                        ? `${q.targetModuleId} 모듈을 먼저 활성화하세요`
                        : q.label
                    }
                  >
                    {isLoading ? (
                      <Loader2 className="h-2.5 w-2.5 animate-spin" />
                    ) : (
                      <span>{q.emoji}</span>
                    )}
                    {q.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 프리셋 */}
        {presets.length > 0 && (
          <div className="px-4 pb-2">
            <span className="text-[11px] font-medium text-muted-foreground mb-1.5 block">프리셋</span>
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

        {/* 모듈 리스트 */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {/* 활성 모듈 — DnD 가능 */}
          <div className="px-4 pb-1">
            <span className="text-[11px] font-medium text-muted-foreground mb-1.5 block">
              활성 섹션
            </span>
            <SortableContext
              items={enabledModules}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-1">
                {enabledModules.map((moduleId, index) => {
                  const mod = schema.modules.find((m) => m.id === moduleId);
                  if (!mod) return null;
                  return (
                    <SortableModuleCard
                      key={moduleId}
                      moduleId={moduleId}
                      mod={mod}
                      index={index}
                      totalCount={enabledModules.length}
                      isEnabled={true}
                      isSelected={selectedModuleId === moduleId}
                      locale={locale}
                      onSelect={setSelectedModuleId}
                      onToggle={handleToggleModule}
                      onMoveUp={handleMoveUp}
                      onMoveDown={handleMoveDown}
                    />
                  );
                })}
                {enabledModules.length === 0 && (
                  <div className="text-[11px] text-muted-foreground py-2 text-center border border-dashed rounded-md">
                    활성화된 섹션이 없습니다
                  </div>
                )}
              </div>
            </SortableContext>
          </div>

          {/* 비활성 모듈 — "섹션 추가" 영역 */}
          {disabledModules.length > 0 && (
            <DisabledModulesSection
              moduleIds={disabledModules}
              schema={schema}
              onEnable={(id) => handleToggleModule(id, true)}
              locale={locale}
            />
          )}

          {/* DragOverlay — ghost card */}
          <DragOverlay dropAnimation={null}>
            {activeModule ? (
              <DragGhostCard mod={activeModule} locale={locale} />
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* 구분선 + 선택된 모듈 편집 폼 */}
        {selectedModule && state.enabled.includes(selectedModule.id) ? (
          <div className="px-4 pb-4 border-t pt-3">
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
              deployId={deployId}
              onAiPolish={handleAiPolish}
              aiPolishingField={aiPolishingField}
            />
          </div>
        ) : selectedModule ? (
          <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
            이 모듈은 비활성화 상태입니다
          </div>
        ) : (
          <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
            모듈을 선택하세요
          </div>
        )}
      </div>

      {/* 하단 CTA (sticky) */}
      <div className="flex-shrink-0 border-t p-3 bg-background">
        <SplitButton
          onSaveAndDeploy={onSaveAndDeploy}
          onSaveOnly={onSaveOnly}
          isApplying={isApplying}
          isDeploying={isDeploying}
        />
      </div>
    </div>
  );
}
