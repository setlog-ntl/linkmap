'use client';

import { useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import type { ModuleFieldDef } from '@/lib/module-schema';

interface ModuleFormProps {
  fields: ModuleFieldDef[];
  values: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  locale: string;
}

export function ModuleForm({ fields, values, onChange, locale }: ModuleFormProps) {
  return (
    <div className="space-y-4">
      {fields.map((field) => (
        <FieldRenderer
          key={field.key}
          field={field}
          value={values[field.key]}
          onChange={(val) => onChange(field.key, val)}
          locale={locale}
        />
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────
// 개별 필드 렌더러
// ──────────────────────────────────────────────

interface FieldRendererProps {
  field: ModuleFieldDef;
  value: unknown;
  onChange: (value: unknown) => void;
  locale: string;
}

function FieldRenderer({ field, value, onChange, locale }: FieldRendererProps) {
  const label = locale === 'en' && field.labelEn ? field.labelEn : field.label;

  switch (field.type) {
    case 'text':
    case 'url':
      return (
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">{label}</Label>
          <Input
            type={field.type === 'url' ? 'url' : 'text'}
            value={(value as string) ?? ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className="h-8 text-sm"
          />
        </div>
      );

    case 'textarea':
      return (
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">{label}</Label>
          <Textarea
            value={(value as string) ?? ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className="text-sm min-h-[80px] resize-y"
            maxLength={field.validation?.maxLength}
          />
        </div>
      );

    case 'color':
      return (
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">{label}</Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={(value as string) ?? '#000000'}
              onChange={(e) => onChange(e.target.value)}
              className="h-8 w-10 rounded border cursor-pointer"
            />
            <Input
              value={(value as string) ?? ''}
              onChange={(e) => onChange(e.target.value)}
              className="h-8 text-sm font-mono flex-1"
              placeholder="#000000"
            />
          </div>
        </div>
      );

    case 'number':
      return (
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">{label}</Label>
          <Input
            type="number"
            value={(value as number) ?? 0}
            onChange={(e) => onChange(Number(e.target.value))}
            min={field.validation?.min}
            max={field.validation?.max}
            className="h-8 text-sm"
          />
        </div>
      );

    case 'boolean':
      return (
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">{label}</Label>
          <Switch
            checked={!!value}
            onCheckedChange={(checked) => onChange(checked)}
          />
        </div>
      );

    case 'select':
      return (
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">{label}</Label>
          <Select
            value={(value as string) ?? ''}
            onValueChange={(v) => onChange(v)}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );

    case 'array':
      return (
        <ArrayFieldRenderer
          field={field}
          value={value}
          onChange={onChange}
          locale={locale}
        />
      );

    default:
      return null;
  }
}

// ──────────────────────────────────────────────
// 배열 필드 렌더러
// ──────────────────────────────────────────────

interface ArrayFieldRendererProps {
  field: ModuleFieldDef;
  value: unknown;
  onChange: (value: unknown) => void;
  locale: string;
}

function ArrayFieldRenderer({
  field,
  value,
  onChange,
  locale,
}: ArrayFieldRendererProps) {
  const items = Array.isArray(value) ? value : [];
  const label = locale === 'en' && field.labelEn ? field.labelEn : field.label;
  const canAdd = !field.maxItems || items.length < field.maxItems;

  const handleItemChange = useCallback(
    (index: number, key: string, newVal: unknown) => {
      const next = items.map((item, i) =>
        i === index ? { ...item, [key]: newVal } : item
      );
      onChange(next);
    },
    [items, onChange]
  );

  const handleAdd = useCallback(() => {
    if (!canAdd || !field.itemSchema) return;
    const newItem: Record<string, unknown> = {};
    for (const subField of field.itemSchema) {
      newItem[subField.key] = subField.defaultValue;
    }
    onChange([...items, newItem]);
  }, [canAdd, field.itemSchema, items, onChange]);

  const handleRemove = useCallback(
    (index: number) => {
      onChange(items.filter((_, i) => i !== index));
    },
    [items, onChange]
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium">{label}</Label>
        <span className="text-[10px] text-muted-foreground">
          {items.length}{field.maxItems ? `/${field.maxItems}` : ''}
        </span>
      </div>

      {items.map((item, index) => (
        <div
          key={index}
          className="border rounded-lg p-3 space-y-2 bg-muted/20 relative group"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-medium text-muted-foreground">
              #{index + 1}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
              onClick={() => handleRemove(index)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
          {field.itemSchema?.map((subField) => (
            <FieldRenderer
              key={subField.key}
              field={subField}
              value={(item as Record<string, unknown>)[subField.key]}
              onChange={(val) => handleItemChange(index, subField.key, val)}
              locale={locale}
            />
          ))}
        </div>
      ))}

      {canAdd && (
        <Button
          variant="outline"
          size="sm"
          className="w-full h-8 text-xs gap-1"
          onClick={handleAdd}
        >
          <Plus className="h-3 w-3" />
          {locale === 'ko' ? '추가' : 'Add'}
        </Button>
      )}
    </div>
  );
}
