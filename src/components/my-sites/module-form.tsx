'use client';

import { useCallback, useRef, useState } from 'react';
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
import { Plus, Trash2, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { ModuleFieldDef } from '@/lib/module-schema';

interface ModuleFormProps {
  fields: ModuleFieldDef[];
  values: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  locale: string;
  deployId?: string;
}

export function ModuleForm({ fields, values, onChange, locale, deployId }: ModuleFormProps) {
  return (
    <div className="space-y-4">
      {fields.map((field) => (
        <FieldRenderer
          key={field.key}
          field={field}
          value={values[field.key]}
          onChange={(val) => onChange(field.key, val)}
          locale={locale}
          deployId={deployId}
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
  deployId?: string;
}

function FieldRenderer({ field, value, onChange, locale, deployId }: FieldRendererProps) {
  const label = locale === 'en' && field.labelEn ? field.labelEn : field.label;

  switch (field.type) {
    case 'text':
      return (
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">{label}</Label>
          <Input
            type="text"
            value={(value as string) ?? ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className="h-8 text-sm"
          />
        </div>
      );

    case 'url':
      return (
        <ImageUrlField
          label={label}
          value={(value as string) ?? ''}
          onChange={onChange}
          placeholder={field.placeholder}
          deployId={deployId}
          locale={locale}
        />
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

// ──────────────────────────────────────────────
// 이미지 URL 필드 (업로드 지원)
// ──────────────────────────────────────────────

const MAX_IMAGE_DIMENSION = 1200;

function resizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
          const ratio = Math.min(MAX_IMAGE_DIMENSION / width, MAX_IMAGE_DIMENSION / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas not supported'));
        ctx.drawImage(img, 0, 0, width, height);

        // Output as webp for smaller size, fallback to original type
        const dataUrl = canvas.toDataURL('image/webp', 0.85);
        const base64 = dataUrl.split(',')[1];
        resolve(base64);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

interface ImageUrlFieldProps {
  label: string;
  value: string;
  onChange: (value: unknown) => void;
  placeholder?: string;
  deployId?: string;
  locale: string;
}

function ImageUrlField({ label, value, onChange, placeholder, deployId, locale }: ImageUrlFieldProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !deployId) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error(locale === 'ko' ? '5MB 이하의 이미지만 업로드 가능합니다' : 'Max 5MB image allowed');
      return;
    }

    try {
      setUploading(true);
      const base64 = await resizeImage(file);
      const ext = file.name.match(/\.\w+$/)?.[0] || '.webp';
      const filename = `upload${ext === '.webp' ? '.webp' : ext}`;

      const res = await fetch(`/api/oneclick/deployments/${deployId}/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: base64,
          filename,
          mimeType: ext === '.webp' ? 'image/webp' : file.type,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Upload failed');
      }

      const { path } = await res.json();
      onChange(path);
      toast.success(locale === 'ko' ? '이미지 업로드 완료' : 'Image uploaded');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }, [deployId, locale, onChange]);

  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">{label}</Label>
      <div className="flex items-center gap-1.5">
        <Input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-8 text-sm flex-1"
        />
        {deployId && (
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 flex-shrink-0"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            title={locale === 'ko' ? '이미지 업로드' : 'Upload image'}
          >
            {uploading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Upload className="h-3.5 w-3.5" />
            )}
          </Button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
          className="hidden"
          onChange={handleUpload}
        />
      </div>
    </div>
  );
}
