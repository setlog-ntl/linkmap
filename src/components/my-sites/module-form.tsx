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
  onImagePreview?: (path: string, dataUrl: string) => void;
}

export function ModuleForm({ fields, values, onChange, locale, deployId, onImagePreview }: ModuleFormProps) {
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
          onImagePreview={onImagePreview}
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
  onImagePreview?: (path: string, dataUrl: string) => void;
}

function FieldRenderer({ field, value, onChange, locale, deployId, onImagePreview }: FieldRendererProps) {
  const label = locale === 'en' && field.labelEn ? field.labelEn : field.label;
  const isRequired = field.validation?.required;
  const helpText = locale === 'en' && field.helpTextEn ? field.helpTextEn : field.helpText;

  const labelNode = (
    <Label className="text-xs font-medium">
      {label}
      {isRequired && <span className="text-destructive ml-0.5">*</span>}
    </Label>
  );

  switch (field.type) {
    case 'text': {
      const textVal = (value as string) ?? '';
      const maxLen = field.validation?.maxLength;
      const showEmpty = isRequired && !textVal.trim();
      const pattern = field.validation?.pattern;
      const showPatternError = !showEmpty && pattern && textVal.trim() && !new RegExp(pattern).test(textVal);
      const inputType = field.validation?.inputType ?? 'text';
      return (
        <div className="space-y-1.5">
          {labelNode}
          <Input
            type={inputType}
            value={textVal}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className={`h-8 text-sm ${showEmpty || showPatternError ? 'border-destructive' : ''}`}
            maxLength={maxLen}
          />
          {showEmpty && (
            <p className="text-[11px] text-destructive">필수 입력 항목입니다</p>
          )}
          {showPatternError && (
            <p className="text-[11px] text-destructive">
              {field.validation?.patternMessage ?? '입력 형식을 확인하세요'}
            </p>
          )}
          {helpText && !showEmpty && !showPatternError && (
            <p className="text-[11px] text-muted-foreground">{helpText}</p>
          )}
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
          onImagePreview={onImagePreview}
          required={isRequired}
          helpText={helpText}
        />
      );

    case 'textarea': {
      const textareaVal = (value as string) ?? '';
      const showError = isRequired && !textareaVal.trim();
      return (
        <div className="space-y-1.5">
          {labelNode}
          <Textarea
            value={textareaVal}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className={`text-sm min-h-[80px] resize-y ${showError ? 'border-destructive' : ''}`}
            maxLength={field.validation?.maxLength}
          />
          {showError && (
            <p className="text-[11px] text-destructive">필수 입력 항목입니다</p>
          )}
        </div>
      );
    }

    case 'color': {
      const colorVal = (value as string) ?? '#000000';
      const isValidHex = /^#[0-9a-fA-F]{6}$/.test(colorVal);
      const showColorError = colorVal.length > 0 && !isValidHex;
      return (
        <div className="space-y-1.5">
          {labelNode}
          <div className="flex items-center gap-2">
            <div className="relative h-9 w-12 rounded-lg border overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow"
              style={{ backgroundColor: isValidHex ? colorVal : '#000000' }}
            >
              <input
                type="color"
                value={isValidHex ? colorVal : '#000000'}
                onChange={(e) => onChange(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
            </div>
            <Input
              value={colorVal}
              onChange={(e) => onChange(e.target.value)}
              className={`h-8 text-sm font-mono flex-1 ${showColorError ? 'border-destructive' : ''}`}
              placeholder="#000000"
            />
          </div>
          {showColorError && (
            <p className="text-[11px] text-destructive">올바른 HEX 색상을 입력하세요 (예: #FF5733)</p>
          )}
        </div>
      );
    }

    case 'number':
      return (
        <div className="space-y-1.5">
          {labelNode}
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
          {labelNode}
          <Switch
            checked={!!value}
            onCheckedChange={(checked) => onChange(checked)}
          />
        </div>
      );

    case 'select': {
      const isFontField = field.key === 'fontFamily' || field.key.toLowerCase().includes('font');
      const selectedValue = (value as string) ?? '';
      return (
        <div className="space-y-1.5">
          {labelNode}
          <Select
            value={selectedValue}
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
          {isFontField && selectedValue && (
            <div
              className="mt-1 px-3 py-2 rounded-md border bg-muted/30 text-sm transition-all"
              style={{ fontFamily: selectedValue }}
            >
              <p className="text-foreground">가나다라마바사 ABCDEF 012345</p>
              <p className="text-xs text-muted-foreground mt-0.5">{selectedValue}</p>
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
    const newItem: Record<string, unknown> = { _id: crypto.randomUUID() };
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
          key={((item as Record<string, unknown>)?._id as string) || `item-${index}`}
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
          {field.itemSchema?.map((subField) => {
            // 소셜 링크: 선택된 플랫폼에 따라 URL placeholder 동적 변경
            const itemRecord = item as Record<string, unknown>;
            let dynamicField = subField;
            if (subField.key === 'url' && subField.type === 'url' && itemRecord.platform) {
              const platformPlaceholders: Record<string, string> = {
                linkedin: 'https://linkedin.com/in/username',
                twitter: 'https://x.com/username',
                instagram: 'https://instagram.com/username',
                github: 'https://github.com/username',
                facebook: 'https://facebook.com/username',
                youtube: 'https://youtube.com/@channel',
                tiktok: 'https://tiktok.com/@username',
                threads: 'https://threads.net/@username',
              };
              const ph = platformPlaceholders[itemRecord.platform as string];
              if (ph) dynamicField = { ...subField, placeholder: ph };
            }
            return (
              <FieldRenderer
                key={subField.key}
                field={dynamicField}
                value={itemRecord[subField.key]}
                onChange={(val) => handleItemChange(index, subField.key, val)}
                locale={locale}
                deployId={deployId}
              />
            );
          })}
        </div>
      ))}

      {items.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-3">
          항목이 없습니다. 추가 버튼을 눌러주세요
        </p>
      )}

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
  onImagePreview?: (path: string, dataUrl: string) => void;
  required?: boolean;
  helpText?: string;
}

/** /public/images/... → /images/... 경로 보정 */
function fixPublicPath(path: string): string {
  if (path.startsWith('/public/')) {
    return path.slice('/public'.length);
  }
  return path;
}

function ImageUrlField({ label, value, onChange, placeholder, deployId, locale, onImagePreview, required, helpText }: ImageUrlFieldProps) {
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
      const previewDataUrl = `data:image/webp;base64,${base64}`;

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
      const fixedPath = fixPublicPath(path);
      onChange(fixedPath);
      onImagePreview?.(fixedPath, previewDataUrl);
      toast.success(t(locale as Locale, 'moduleForm.imageUploaded'));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }, [deployId, locale, onChange, onImagePreview]);

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

  const handleUrlBlur = useCallback(() => {
    if (!value) return;
    // 위험 프로토콜 차단
    if (/^(javascript|data|vbscript):/i.test(value.trim())) {
      onChange('');
      toast.error('허용되지 않는 URL 형식입니다');
      return;
    }
    // https:// 자동 추가 (로컬 경로 제외)
    if (value.trim() && !value.startsWith('http') && !value.startsWith('/')) {
      onChange(`https://${value.trim()}`);
    }
  }, [value, onChange]);

  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      <div className="flex items-center gap-1.5">
        <Input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={handleUrlBlur}
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
      {helpText && (
        <p className="text-[11px] text-muted-foreground">{helpText}</p>
      )}
    </div>
  );
}
