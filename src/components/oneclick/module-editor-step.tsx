'use client';

import { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Rocket,
  Loader2,
  ChevronDown,
  ChevronUp,
  Sun,
  Moon,
  Paintbrush,
  Layers,
  Eye,
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { getModuleSchema } from '@/data/oneclick/module-schemas';
import { getModulePresets } from '@/data/oneclick/module-presets';
import type { ModuleConfigState, ModuleDef, ModuleFieldDef } from '@/lib/module-schema';
import type { ModulePreset } from '@/data/oneclick/module-presets/personal-brand';
import type { HomepageTemplate } from '@/lib/queries/oneclick';
import { useLocaleStore } from '@/stores/locale-store';
import { TemplatePreview } from './template-preview';

// ── Design Preset Visual Config ──

interface DesignPresetVisual {
  value: string;
  label: string;
  bgClass: string;
  textClass: string;
  icon: 'sun' | 'moon' | 'paintbrush' | 'layers';
}

/** 디자인 프리셋 4단계를 시각적으로 표현 */
function getDesignPresetVisuals(templateSlug: string): DesignPresetVisual[] {
  const schema = getModuleSchema(templateSlug);
  if (!schema) return [];

  // designPreset 필드가 있는 모듈 찾기
  for (const mod of schema.modules) {
    const dpField = mod.fields.find((f) => f.key === 'designPreset' || f.key === 'bgStyle');
    if (dpField?.options && dpField.options.length === 4) {
      return dpField.options.map((opt, i) => ({
        value: opt.value,
        label: opt.label,
        bgClass: ['bg-white border', 'bg-gradient-to-br from-blue-50 to-indigo-50 border', 'bg-gray-900 border-gray-700', 'bg-gradient-to-br from-amber-50 to-orange-50 border'][i],
        textClass: ['text-gray-900', 'text-indigo-900', 'text-white', 'text-amber-900'][i],
        icon: (['sun', 'layers', 'moon', 'paintbrush'] as const)[i],
      }));
    }
  }
  return [];
}

/** 디자인 프리셋을 적용할 모듈과 필드키를 찾는다 */
function findDesignPresetTarget(templateSlug: string): { moduleId: string; fieldKey: string } | null {
  const schema = getModuleSchema(templateSlug);
  if (!schema) return null;
  for (const mod of schema.modules) {
    const dpField = mod.fields.find((f) => f.key === 'designPreset' || f.key === 'bgStyle');
    if (dpField?.options && dpField.options.length === 4) {
      return { moduleId: mod.id, fieldKey: dpField.key };
    }
  }
  return null;
}

// ── Module Editor Step ──

interface ModuleEditorStepProps {
  template: HomepageTemplate;
  isDeploying?: boolean;
  onDeploy: (configState: ModuleConfigState) => void;
  onBack: () => void;
}

export function ModuleEditorStep({
  template,
  isDeploying = false,
  onDeploy,
  onBack,
}: ModuleEditorStepProps) {
  const { locale } = useLocaleStore();
  const schema = getModuleSchema(template.slug);
  const presets = getModulePresets(template.slug);
  const designVisuals = getDesignPresetVisuals(template.slug);
  const dpTarget = findDesignPresetTarget(template.slug);

  // Initialize state from first preset (기본)
  const defaultPreset = presets[0];
  const [selectedPresetId, setSelectedPresetId] = useState(defaultPreset?.id ?? 'basic');
  const [configState, setConfigState] = useState<ModuleConfigState>(() =>
    buildInitialConfig(schema, defaultPreset)
  );
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  // Current design preset value
  const currentDesignPreset = useMemo(() => {
    if (!dpTarget) return null;
    const vals = configState.values[dpTarget.moduleId];
    return (vals?.[dpTarget.fieldKey] as string) ?? null;
  }, [configState.values, dpTarget]);

  // Apply a module preset
  const applyPreset = useCallback(
    (preset: ModulePreset) => {
      setSelectedPresetId(preset.id);
      setConfigState((prev) => {
        const next = buildInitialConfig(schema, preset);
        // Preserve current design preset if already set
        if (dpTarget && prev.values[dpTarget.moduleId]?.[dpTarget.fieldKey]) {
          next.values[dpTarget.moduleId] = {
            ...next.values[dpTarget.moduleId],
            [dpTarget.fieldKey]: prev.values[dpTarget.moduleId][dpTarget.fieldKey],
          };
        }
        return next;
      });
    },
    [schema, dpTarget]
  );

  // Set design preset
  const setDesignPreset = useCallback(
    (value: string) => {
      if (!dpTarget) return;
      setConfigState((prev) => ({
        ...prev,
        values: {
          ...prev.values,
          [dpTarget.moduleId]: {
            ...prev.values[dpTarget.moduleId],
            [dpTarget.fieldKey]: value,
          },
        },
      }));
    },
    [dpTarget]
  );

  // Toggle a module on/off
  const toggleModule = useCallback(
    (moduleId: string) => {
      setConfigState((prev) => {
        const isEnabled = prev.enabled.includes(moduleId);
        const enabled = isEnabled
          ? prev.enabled.filter((id) => id !== moduleId)
          : [...prev.enabled, moduleId];
        const order = isEnabled
          ? prev.order.filter((id) => id !== moduleId)
          : [...prev.order, moduleId];
        return { ...prev, enabled, order };
      });
    },
    []
  );

  // Update a field value
  const updateField = useCallback(
    (moduleId: string, fieldKey: string, value: unknown) => {
      setConfigState((prev) => ({
        ...prev,
        values: {
          ...prev.values,
          [moduleId]: {
            ...prev.values[moduleId],
            [fieldKey]: value,
          },
        },
      }));
    },
    []
  );

  // Toggle module expansion
  const toggleExpand = useCallback((moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  }, []);

  if (!schema) return null;

  const modules = schema.modules;
  const IconMap = { sun: Sun, moon: Moon, paintbrush: Paintbrush, layers: Layers };

  return (
    <div className="space-y-5">
      {/* ── 상단: 프리셋 선택 (기본/확장) ── */}
      <div className="grid grid-cols-2 gap-3">
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => applyPreset(preset)}
            className={`p-3 rounded-xl border-2 text-left transition-all ${
              selectedPresetId === preset.id
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/40'
            }`}
          >
            <p className="font-semibold text-sm">{preset.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {preset.description}
            </p>
          </button>
        ))}
      </div>

      {/* ── 디자인 프리셋 (4단계) ── */}
      {designVisuals.length === 4 && (
        <div className="space-y-2">
          <Label className="text-sm font-semibold flex items-center gap-1.5">
            <Paintbrush className="h-3.5 w-3.5" />
            디자인 스타일
          </Label>
          <div className="grid grid-cols-4 gap-2">
            {designVisuals.map((dv) => {
              const Icon = IconMap[dv.icon];
              const isActive = currentDesignPreset === dv.value;
              return (
                <button
                  key={dv.value}
                  onClick={() => setDesignPreset(dv.value)}
                  className={`flex flex-col items-center gap-1.5 p-2.5 rounded-lg transition-all ${dv.bgClass} ${
                    isActive ? 'ring-2 ring-primary ring-offset-1 scale-[1.02]' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${dv.textClass}`} />
                  <span className={`text-[10px] font-medium ${dv.textClass}`}>
                    {dv.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 실시간 프리뷰 ── */}
      <Card className="overflow-hidden">
        <div className="flex items-center gap-1.5 px-3 py-2 bg-muted/50 border-b">
          <Eye className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">미리보기</span>
        </div>
        <CardContent className="p-0">
          <TemplatePreview
            templateSlug={template.slug}
            configState={configState}
            designPreset={currentDesignPreset}
          />
        </CardContent>
      </Card>

      {/* ── 모듈 토글 & 간단 편집 ── */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold flex items-center gap-1.5">
          <Layers className="h-3.5 w-3.5" />
          모듈 구성
        </Label>
        <div className="space-y-1.5">
          {modules.map((mod) => {
            const isEnabled = configState.enabled.includes(mod.id);
            const isExpanded = expandedModules.has(mod.id);
            const editableFields = mod.fields.filter(
              (f) => f.key !== 'designPreset' && f.key !== 'bgStyle' && f.type !== 'array'
            );

            return (
              <div
                key={mod.id}
                className={`rounded-lg border transition-colors ${
                  isEnabled ? 'bg-card' : 'bg-muted/30 opacity-60'
                }`}
              >
                <div className="flex items-center gap-2 px-3 py-2">
                  <Switch
                    checked={isEnabled}
                    onCheckedChange={() => toggleModule(mod.id)}
                    disabled={mod.required}
                    className="scale-75"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium">{mod.name}</span>
                    {mod.required && (
                      <Badge variant="secondary" className="ml-1.5 text-[9px] px-1 py-0 h-3.5">
                        필수
                      </Badge>
                    )}
                  </div>
                  {isEnabled && editableFields.length > 0 && (
                    <button
                      onClick={() => toggleExpand(mod.id)}
                      className="p-1 rounded hover:bg-muted transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </button>
                  )}
                </div>

                {/* Inline field editor */}
                {isEnabled && isExpanded && editableFields.length > 0 && (
                  <div className="px-3 pb-3 space-y-2 border-t pt-2">
                    {editableFields.slice(0, 4).map((field) => (
                      <SimpleFieldEditor
                        key={field.key}
                        field={field}
                        value={configState.values[mod.id]?.[field.key]}
                        onChange={(v) => updateField(mod.id, field.key, v)}
                      />
                    ))}
                    {editableFields.length > 4 && (
                      <p className="text-[10px] text-muted-foreground">
                        +{editableFields.length - 4}개 필드 (배포 후 편집 가능)
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 하단 버튼 ── */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          이전
        </Button>
        <Button
          onClick={() => onDeploy(configState)}
          disabled={isDeploying}
          className="flex-1 gap-2"
        >
          {isDeploying ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              배포 중...
            </>
          ) : (
            <>
              <Rocket className="h-4 w-4" />
              배포하기
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// ── Simple Field Editor ──

function SimpleFieldEditor({
  field,
  value,
  onChange,
}: {
  field: ModuleFieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const displayValue = value ?? field.defaultValue;

  switch (field.type) {
    case 'text':
      return (
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">{field.label}</Label>
          <Input
            value={String(displayValue ?? '')}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className="h-8 text-sm"
          />
        </div>
      );
    case 'textarea':
      return (
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">{field.label}</Label>
          <Textarea
            value={String(displayValue ?? '')}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className="min-h-[60px] text-sm resize-none"
          />
        </div>
      );
    case 'color':
      return (
        <div className="flex items-center gap-2">
          <Label className="text-xs text-muted-foreground flex-1">{field.label}</Label>
          <input
            type="color"
            value={String(displayValue ?? '#000000')}
            onChange={(e) => onChange(e.target.value)}
            className="h-7 w-10 rounded border cursor-pointer"
          />
        </div>
      );
    case 'url':
      return (
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">{field.label}</Label>
          <Input
            value={String(displayValue ?? '')}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder ?? 'https://...'}
            className="h-8 text-sm"
          />
        </div>
      );
    case 'boolean':
      return (
        <div className="flex items-center gap-2">
          <Label className="text-xs text-muted-foreground flex-1">{field.label}</Label>
          <Switch
            checked={!!displayValue}
            onCheckedChange={(v) => onChange(v)}
            className="scale-75"
          />
        </div>
      );
    case 'select':
      return (
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">{field.label}</Label>
          <div className="flex flex-wrap gap-1">
            {field.options?.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onChange(opt.value)}
                className={`text-[11px] px-2 py-0.5 rounded-full border transition-colors ${
                  String(displayValue) === opt.value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted/50 text-muted-foreground border-border hover:border-primary/40'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      );
    default:
      return null;
  }
}

// ── Helpers ──

function buildInitialConfig(
  schema: ReturnType<typeof getModuleSchema>,
  preset: ModulePreset | undefined
): ModuleConfigState {
  if (!schema) {
    return { values: {}, enabled: [], order: [] };
  }

  const enabled = preset?.state.enabled ?? schema.modules.filter((m) => m.defaultEnabled).map((m) => m.id);
  const order = preset?.state.order ?? schema.defaultOrder;

  // Build default values from schema
  const values: Record<string, Record<string, unknown>> = {};
  for (const mod of schema.modules) {
    values[mod.id] = {};
    for (const field of mod.fields) {
      values[mod.id][field.key] = field.defaultValue;
    }
  }

  // Overlay preset values
  if (preset?.state.values) {
    for (const [modId, modVals] of Object.entries(preset.state.values)) {
      values[modId] = { ...values[modId], ...modVals };
    }
  }

  return { values, enabled, order };
}
