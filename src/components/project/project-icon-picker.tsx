'use client';

import { useState, useMemo, useRef } from 'react';
import { Pencil, X, Search, Upload, Loader2, Smile, Boxes, ImageIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ServiceIcon } from '@/components/ui/service-icon';
import { SERVICE_BRANDS, getServiceIconUrl } from '@/lib/constants/service-brands';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';

type IconType = 'brand' | 'emoji' | 'custom' | null;

interface ProjectIconPickerProps {
  projectId: string;
  projectName: string;
  currentIconType: IconType;
  currentIconValue: string | null;
  onSelect: (iconType: IconType, iconValue: string | null) => void;
  disabled?: boolean;
}

// 아이콘 URL이 있는 브랜드만 필터 (이모지만 있는 별칭 제외)
const ICON_ENTRIES = Object.entries(SERVICE_BRANDS)
  .filter(([, brand]) => brand.slug || brand.localPath)
  .sort(([a], [b]) => a.localeCompare(b));

const EMOJI_CATEGORIES: { label: string; labelEn: string; emojis: string[] }[] = [
  { label: '스마일', labelEn: 'Smileys', emojis: ['😀','😎','🤩','🥳','😍','🤔','🔥','💯','✨','⭐','💡','🎯','🎉','🎊','👍','👏','💪','🙌','🤝','❤️'] },
  { label: '동물', labelEn: 'Animals', emojis: ['🐶','🐱','🦊','🐻','🐼','🐨','🦁','🐯','🐸','🐙','🦄','🐝','🦋','🐳','🐬'] },
  { label: '음식', labelEn: 'Food', emojis: ['🍎','🍕','🍔','☕','🍩','🧁','🍰','🍿','🌮','🍣'] },
  { label: '활동', labelEn: 'Activities', emojis: ['⚽','🎮','🎲','🎸','🎨','🏆','🥇','🎯','🎪','🎭'] },
  { label: '여행', labelEn: 'Travel', emojis: ['🚀','✈️','🏠','🏢','🌍','🗺️','⛰️','🌊','🏝️','🌈'] },
  { label: '사물', labelEn: 'Objects', emojis: ['💻','📱','⌨️','🖥️','📡','🔧','⚙️','🛡️','📦','📊','📈','💾','🗄️','🔑','🔒'] },
  { label: '기호', labelEn: 'Symbols', emojis: ['⚡','💎','🔔','📌','🏷️','✅','❌','⚠️','♻️','🔄'] },
];

export function ProjectIconPicker({
  projectId,
  projectName,
  currentIconType,
  currentIconValue,
  onSelect,
  disabled,
}: ProjectIconPickerProps) {
  const { locale } = useLocaleStore();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'brand' | 'emoji' | 'upload'>('brand');
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const previewFileRef = useRef<File | null>(null);
  const initial = projectName.charAt(0).toUpperCase();

  const filtered = useMemo(() => {
    if (!search) return ICON_ENTRIES;
    const q = search.toLowerCase();
    return ICON_ENTRIES.filter(([id]) => id.includes(q));
  }, [search]);

  const handleBrandSelect = (slug: string) => {
    onSelect('brand', slug);
    setOpen(false);
    setSearch('');
  };

  const handleEmojiSelect = (emoji: string) => {
    onSelect('emoji', emoji);
    setOpen(false);
  };

  const handleReset = () => {
    onSelect(null, null);
    setOpen(false);
    setSearch('');
    setPreview(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    previewFileRef.current = file;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    const file = previewFileRef.current;
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`/api/projects/${projectId}/icon`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Upload failed');
      }

      const data = await res.json();
      onSelect('custom', data.icon_value);
      setOpen(false);
      setPreview(null);
      previewFileRef.current = null;
    } catch {
      // Error is visible in UI through failed state
    } finally {
      setUploading(false);
    }
  };

  const renderTriggerIcon = () => {
    if (currentIconType === 'brand' && currentIconValue && getServiceIconUrl(currentIconValue)) {
      return <ServiceIcon serviceId={currentIconValue} size={32} />;
    }
    if (currentIconType === 'emoji' && currentIconValue) {
      return <span className="text-3xl leading-none">{currentIconValue}</span>;
    }
    if (currentIconType === 'custom' && currentIconValue) {
      return <img src={currentIconValue} alt="" className="h-10 w-10 rounded-lg object-cover" />;
    }
    return initial;
  };

  const tabs = [
    { key: 'brand' as const, icon: Boxes, label: t(locale, 'project.iconTabBrand') },
    { key: 'emoji' as const, icon: Smile, label: t(locale, 'project.iconTabEmoji') },
    { key: 'upload' as const, icon: ImageIcon, label: t(locale, 'project.iconTabUpload') },
  ];

  return (
    <Popover open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setSearch(''); setPreview(null); previewFileRef.current = null; } }}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className="group relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 text-2xl font-bold text-primary transition-all hover:border-primary/40 hover:shadow-md disabled:pointer-events-none"
        >
          {renderTriggerIcon()}
          <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
            <Pencil className="h-3 w-3" />
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-3" align="start">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {t(locale, 'project.selectIcon')}
            </span>
            {currentIconType && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-muted-foreground"
                onClick={handleReset}
              >
                <X className="mr-1 h-3 w-3" />
                {t(locale, 'project.resetIcon')}
              </Button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 rounded-lg bg-muted p-0.5">
            {tabs.map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => { setTab(key); setSearch(''); }}
                className={`flex-1 flex items-center justify-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium transition-all ${
                  tab === key
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>

          {/* Brand tab */}
          {tab === 'brand' && (
            <>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder={t(locale, 'project.searchIcon')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-8 pl-8 text-xs"
                />
              </div>
              <div className="grid grid-cols-7 gap-1.5 max-h-[240px] overflow-y-auto">
                {filtered.map(([id]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleBrandSelect(id)}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all hover:bg-accent hover:border-primary/30 ${
                      currentIconType === 'brand' && currentIconValue === id
                        ? 'border-primary bg-primary/10'
                        : 'border-transparent'
                    }`}
                    title={id}
                  >
                    <ServiceIcon serviceId={id} size={20} />
                  </button>
                ))}
                {filtered.length === 0 && (
                  <p className="col-span-7 text-center text-xs text-muted-foreground py-4">
                    {t(locale, 'project.noIconFound')}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Emoji tab */}
          {tab === 'emoji' && (
            <div className="max-h-[280px] overflow-y-auto space-y-2">
              {EMOJI_CATEGORIES.map((cat) => (
                <div key={cat.label}>
                  <p className="text-[11px] font-medium text-muted-foreground mb-1">
                    {locale === 'ko' ? cat.label : cat.labelEn}
                  </p>
                  <div className="grid grid-cols-8 gap-1">
                    {cat.emojis.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => handleEmojiSelect(emoji)}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg border text-lg transition-all hover:bg-accent hover:scale-110 ${
                          currentIconType === 'emoji' && currentIconValue === emoji
                            ? 'border-primary bg-primary/10'
                            : 'border-transparent'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Upload tab */}
          {tab === 'upload' && (
            <div className="space-y-3">
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
              {preview ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="relative h-20 w-20 rounded-xl border-2 border-dashed border-primary/30 overflow-hidden">
                    <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="h-8 text-xs"
                      onClick={handleUpload}
                      disabled={uploading}
                    >
                      {uploading ? (
                        <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Upload className="mr-1 h-3.5 w-3.5" />
                      )}
                      {t(locale, 'project.uploadIcon')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => { setPreview(null); previewFileRef.current = null; }}
                      disabled={uploading}
                    >
                      {t(locale, 'common.cancel')}
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-muted-foreground/20 py-8 text-muted-foreground hover:border-primary/30 hover:text-foreground transition-all"
                >
                  <Upload className="h-8 w-8" />
                  <span className="text-xs">{t(locale, 'project.clickToUpload')}</span>
                  <span className="text-[10px] text-muted-foreground">PNG, JPG, SVG, WebP (max 1MB)</span>
                </button>
              )}

              {currentIconType === 'custom' && currentIconValue && (
                <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-2">
                  <img src={currentIconValue} alt="" className="h-8 w-8 rounded-lg object-cover" />
                  <span className="text-xs text-muted-foreground flex-1">{t(locale, 'project.currentIcon')}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
