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
import { t, type Locale } from '@/lib/i18n';
import type { ModuleFieldDef } from '@/lib/module-schema';

interface ModuleFormProps {
  fields: ModuleFieldDef[];
  values: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  locale: string;
  deployId?: string;
}

export function ModuleForm({ fields, values, onChange, locale, deployId }: ModuleFormProps) {
  // 그래디언트 색상 쌍 감지 (gradientFrom + gradientTo)
  const gradientFrom = values['gradientFrom'] as string | undefined;
  const gradientTo = values['gradientTo'] as string | undefined;
  const hasGradient = fields.some(f => f.key === 'gradientFrom') && fields.some(f => f.key === 'gradientTo');

  return (
    <div className="space-y-4">
      {/* 그래디언트 실시간 미리보기 */}
      {hasGradient && gradientFrom && gradientTo && (
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">그래디언트 미리보기</Label>
          <div
            className="h-10 rounded-lg border shadow-inner transition-all duration-300"
            style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}
          />
        </div>
      )}
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
    case 'text': {
      const textVal = (value as string) ?? '';
      return (
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">{label}</Label>
          <Input
            type="text"
            value={textVal}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className="h-8 text-sm"
          />
        </div>
      );
    }

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

    case 'textarea': {
      const textareaVal = (value as string) ?? '';
      return (
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">{label}</Label>
          <Textarea
            value={textareaVal}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className="text-sm min-h-[80px] resize-y"
            maxLength={field.validation?.maxLength}
          />
        </div>
      );
    }

    case 'color': {
      const colorVal = (value as string) ?? '#000000';
      return (
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">{label}</Label>
          <div className="flex items-center gap-2">
            <div className="relative h-9 w-12 rounded-lg border overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow"
              style={{ backgroundColor: colorVal }}
            >
              <input
                type="color"
                value={colorVal}
                onChange={(e) => onChange(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
            </div>
            <Input
              value={colorVal}
              onChange={(e) => onChange(e.target.value)}
              className="h-8 text-sm font-mono flex-1"
              placeholder="#000000"
            />
          </div>
        </div>
      );
    }

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

    case 'select': {
      const isFontField = field.key === 'fontFamily' || field.key.toLowerCase().includes('font');
      const selectedFont = (value as string) ?? '';
      return (
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">{label}</Label>
          <Select
            value={selectedFont}
            onValueChange={(v) => onChange(v)}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {isFontField ? (
                    <span style={{ fontFamily: opt.value }}>{opt.label}</span>
                  ) : (
                    opt.label
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* 폰트 실시간 미리보기 */}
          {isFontField && selectedFont && (
            <div
              className="mt-1 px-3 py-2 rounded-md border bg-muted/30 text-sm transition-all"
              style={{ fontFamily: selectedFont }}
            >
              <p className="text-foreground">가나다라마바사 ABCDEF 012345</p>
              <p className="text-xs text-muted-foreground mt-0.5">{selectedFont}</p>
            </div>
          )}
        </div>
      );
    }

    case 'array':
      return (
        <ArrayFieldRenderer
          field={field}
          value={value}
          onChange={onChange}
          locale={locale}
          deployId={deployId}
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
  deployId?: string;
}

function ArrayFieldRenderer({
  field,
  value,
  onChange,
  locale,
  deployId,
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
              deployId={deployId}
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
          {t(locale as Locale, 'moduleForm.add')}
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

/** /public/images/... → /images/... 경로 보정 */
function fixPublicPath(path: string): string {
  if (path.startsWith('/public/')) {
    return path.slice('/public'.length);
  }
  return path;
}

function ImageUrlField({ label, value, onChange, placeholder, deployId, locale }: ImageUrlFieldProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const processFile = useCallback(async (file: File) => {
    if (!deployId) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error(t(locale as Locale, 'moduleForm.maxSizeError'));
      return;
    }

    try {
      setUploading(true);
      // resizeImage()는 항상 WebP로 변환하므로 mimeType/filename을 WebP로 고정
      const base64 = await resizeImage(file);

      const res = await fetch(`/api/oneclick/deployments/${deployId}/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: base64,
          filename: 'upload.webp',
          mimeType: 'image/webp',
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Upload failed');
      }

      const { path } = await res.json();
      onChange(fixPublicPath(path));
      toast.success(t(locale as Locale, 'moduleForm.imageUploaded'));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }, [deployId, locale, onChange]);

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
  }, [processFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    await processFile(file);
  }, [processFile]);

  // 이미지 URL인지 판별 (미리보기 표시용)
  const isImageUrl = value && (
    value.startsWith('http') ||
    value.startsWith('/images/') ||
    value.startsWith('/public/images/')
  );

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
            title={t(locale as Locale, 'moduleForm.uploadImage')}
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
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleUpload}
        />
      </div>
      {/* 샘플 이미지 안내 */}
      {value && (value.includes('unsplash.com') || value.includes('placeholder')) && (
        <p className="text-[11px] text-muted-foreground">
          현재 샘플 이미지입니다. URL을 변경하거나 이미지를 업로드하여 교체하세요.
        </p>
      )}
      {/* 업로드 중 상태 텍스트 */}
      {uploading && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>업로드 중...</span>
        </div>
      )}
      {/* 드래그&드롭 영역 + 미리보기 */}
      {deployId ? (
        <div
          className={`mt-1.5 rounded-md border-2 border-dashed overflow-hidden transition-colors ${
            isDragOver
              ? 'border-primary bg-primary/5'
              : isImageUrl
                ? 'border-transparent'
                : 'border-muted-foreground/20 bg-muted/30'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isImageUrl ? (
            <div className="relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={fixPublicPath(value)}
                alt="미리보기"
                className="max-h-32 max-w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs">클릭 또는 드래그하여 교체</span>
              </div>
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center py-4 cursor-pointer"
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="h-5 w-5 text-muted-foreground/50 mb-1" />
              <span className="text-[11px] text-muted-foreground">
                이미지를 드래그하거나 클릭하여 업로드
              </span>
            </div>
          )}
        </div>
      ) : (
        isImageUrl && (
          <div className="mt-1.5 rounded-md border overflow-hidden bg-muted/30 w-fit">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={fixPublicPath(value)}
              alt="미리보기"
              className="max-h-32 max-w-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )
      )}
    </div>
  );
}
