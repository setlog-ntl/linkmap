'use client';

import { useState, useMemo } from 'react';
import { Pencil, X, Search } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ServiceIcon } from '@/components/landing/service-icon';
import { SERVICE_BRANDS, getServiceIconUrl } from '@/lib/constants/service-brands';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';

interface ProjectIconPickerProps {
  projectName: string;
  currentIconSlug: string | null;
  onSelect: (slug: string | null) => void;
  disabled?: boolean;
}

// 아이콘 URL이 있는 브랜드만 필터 (이모지만 있는 별칭 제외)
const ICON_ENTRIES = Object.entries(SERVICE_BRANDS)
  .filter(([, brand]) => brand.slug || brand.localPath)
  .sort(([a], [b]) => a.localeCompare(b));

export function ProjectIconPicker({
  projectName,
  currentIconSlug,
  onSelect,
  disabled,
}: ProjectIconPickerProps) {
  const { locale } = useLocaleStore();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const initial = projectName.charAt(0).toUpperCase();

  const filtered = useMemo(() => {
    if (!search) return ICON_ENTRIES;
    const q = search.toLowerCase();
    return ICON_ENTRIES.filter(([id]) => id.includes(q));
  }, [search]);

  const handleSelect = (slug: string | null) => {
    onSelect(slug);
    setOpen(false);
    setSearch('');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className="group relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 text-2xl font-bold text-primary transition-all hover:border-primary/40 hover:shadow-md disabled:pointer-events-none"
        >
          {currentIconSlug && getServiceIconUrl(currentIconSlug) ? (
            <ServiceIcon serviceId={currentIconSlug} size={32} />
          ) : (
            initial
          )}
          <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
            <Pencil className="h-3 w-3" />
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-3" align="start">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {t(locale, 'project.selectIcon')}
            </span>
            {currentIconSlug && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-muted-foreground"
                onClick={() => handleSelect(null)}
              >
                <X className="mr-1 h-3 w-3" />
                {t(locale, 'project.resetIcon')}
              </Button>
            )}
          </div>

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
                onClick={() => handleSelect(id)}
                className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all hover:bg-accent hover:border-primary/30 ${
                  currentIconSlug === id
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
        </div>
      </PopoverContent>
    </Popover>
  );
}
