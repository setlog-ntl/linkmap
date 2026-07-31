'use client';

import { useCallback, useMemo, useState } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ImageCropDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 크롭 대상 이미지 (data URL 또는 CORS 허용 URL) */
  imageSrc: string;
  /** 배포 슬롯 비율 힌트 (예: '3/4') — 기본 선택 프리셋 */
  slotAspect?: string;
  /** 크롭 적용 — 크롭된 이미지 data URL 전달 */
  onApply: (croppedDataUrl: string) => void | Promise<void>;
  /** 자르지 않고 원본 그대로 사용 */
  onUseOriginal: () => void | Promise<void>;
}

/** '3/4' | '3:4' → 0.75 (유효하지 않으면 undefined) */
function parseAspect(aspect?: string): number | undefined {
  if (!aspect) return undefined;
  const m = aspect.match(/^\s*(\d+(?:\.\d+)?)\s*[/:]\s*(\d+(?:\.\d+)?)\s*$/);
  if (!m) return undefined;
  const w = Number(m[1]);
  const h = Number(m[2]);
  if (!w || !h) return undefined;
  return w / h;
}

/** 크롭 영역을 canvas로 잘라 WebP data URL 반환 */
async function cropToDataUrl(imageSrc: string, area: Area): Promise<string> {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new window.Image();
    el.crossOrigin = 'anonymous';
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error('이미지를 불러올 수 없습니다'));
    el.src = imageSrc;
  });
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(area.width);
  canvas.height = Math.round(area.height);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');
  ctx.drawImage(
    img,
    area.x,
    area.y,
    area.width,
    area.height,
    0,
    0,
    canvas.width,
    canvas.height
  );
  return canvas.toDataURL('image/webp', 0.92);
}

const RATIO_PRESETS: Array<{ label: string; value: number | 'original' }> = [
  { label: '원본 비율', value: 'original' },
  { label: '1:1', value: 1 },
  { label: '4:3', value: 4 / 3 },
  { label: '3:4', value: 3 / 4 },
  { label: '16:9', value: 16 / 9 },
];

export function ImageCropDialog({
  open,
  onOpenChange,
  imageSrc,
  slotAspect,
  onApply,
  onUseOriginal,
}: ImageCropDialogProps) {
  const slotRatio = useMemo(() => parseAspect(slotAspect), [slotAspect]);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [naturalRatio, setNaturalRatio] = useState<number | undefined>(undefined);
  const [selectedRatio, setSelectedRatio] = useState<number | 'original' | 'slot'>(
    slotRatio ? 'slot' : 'original'
  );
  const [areaPixels, setAreaPixels] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);

  const aspect =
    selectedRatio === 'slot'
      ? slotRatio ?? 1
      : selectedRatio === 'original'
        ? naturalRatio ?? 1
        : selectedRatio;

  const handleCropComplete = useCallback((_area: Area, pixels: Area) => {
    setAreaPixels(pixels);
  }, []);

  const handleMediaLoaded = useCallback(
    (mediaSize: { naturalWidth: number; naturalHeight: number }) => {
      if (mediaSize.naturalHeight > 0) {
        setNaturalRatio(mediaSize.naturalWidth / mediaSize.naturalHeight);
      }
    },
    []
  );

  const resetView = useCallback(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  }, []);

  const handleApply = useCallback(async () => {
    if (!areaPixels) return;
    try {
      setProcessing(true);
      const dataUrl = await cropToDataUrl(imageSrc, areaPixels);
      await onApply(dataUrl);
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '이미지 자르기에 실패했습니다');
    } finally {
      setProcessing(false);
    }
  }, [areaPixels, imageSrc, onApply, onOpenChange]);

  const handleOriginal = useCallback(async () => {
    try {
      setProcessing(true);
      await onUseOriginal();
      onOpenChange(false);
    } finally {
      setProcessing(false);
    }
  }, [onUseOriginal, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={(o) => !processing && onOpenChange(o)}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base">이미지 자르기</DialogTitle>
        </DialogHeader>

        {/* 크롭 영역 */}
        <div className="relative w-full h-64 sm:h-80 bg-muted rounded-md overflow-hidden">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
            onMediaLoaded={handleMediaLoaded}
          />
        </div>

        {/* 비율 프리셋 */}
        <div className="flex flex-wrap gap-1.5">
          {slotRatio && (
            <Button
              variant={selectedRatio === 'slot' ? 'default' : 'outline'}
              size="sm"
              className="h-7 px-2.5 text-xs"
              onClick={() => {
                setSelectedRatio('slot');
                resetView();
              }}
            >
              사이트 비율 ({slotAspect?.replace('/', ':')})
            </Button>
          )}
          {RATIO_PRESETS.map((preset) => (
            <Button
              key={preset.label}
              variant={selectedRatio === preset.value ? 'default' : 'outline'}
              size="sm"
              className="h-7 px-2.5 text-xs"
              onClick={() => {
                setSelectedRatio(preset.value);
                resetView();
              }}
            >
              {preset.label}
            </Button>
          ))}
        </div>

        {/* 줌 슬라이더 */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground shrink-0">확대</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-primary"
            aria-label="이미지 확대/축소"
          />
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleOriginal}
            disabled={processing}
          >
            자르지 않고 원본 사용
          </Button>
          <Button size="sm" onClick={handleApply} disabled={processing || !areaPixels}>
            {processing && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />}
            잘라서 적용
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
