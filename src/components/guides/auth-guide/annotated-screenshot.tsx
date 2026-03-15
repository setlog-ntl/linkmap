'use client';

import { useState, useCallback, useEffect, type ReactNode } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

export type AnnotationType = 'click' | 'input' | 'highlight';

export interface Annotation {
  type: AnnotationType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  label?: string;
  number?: number;
}

export interface MaskRegion {
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
}

interface AnnotatedScreenshotProps {
  src?: string;
  alt: string;
  annotations?: Annotation[];
  masks?: MaskRegion[];
  caption?: string;
  illustration?: ReactNode;
  className?: string;
}

function renderMasks(masks: MaskRegion[], prefix: string) {
  return masks.map((mask, i) => (
    <div
      key={`${prefix}-mask-${i}`}
      className="absolute bg-neutral-900/85 backdrop-blur-[2px] rounded-sm flex items-center justify-center overflow-hidden"
      style={{
        left: `${mask.x}%`,
        top: `${mask.y}%`,
        width: `${mask.width}%`,
        height: `${mask.height}%`,
      }}
    >
      {mask.label && (
        <span className="text-[8px] text-neutral-500 font-mono truncate px-0.5">
          {mask.label}
        </span>
      )}
    </div>
  ));
}

function renderAnnotations(annotations: Annotation[], prefix: string) {
  return annotations.map((anno, i) => {
    if (anno.type === 'click') {
      return (
        <div
          key={`${prefix}-anno-${i}`}
          className="absolute flex items-center justify-center pointer-events-none"
          style={{ left: `${anno.x}%`, top: `${anno.y}%`, transform: 'translate(-50%, -50%)' }}
        >
          <span className="absolute w-8 h-8 rounded-full bg-red-500/30 animate-ping" />
          <span className="relative w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center shadow-lg">
            {anno.number ?? i + 1}
          </span>
        </div>
      );
    }
    if (anno.type === 'input') {
      return (
        <div
          key={`${prefix}-anno-${i}`}
          className="absolute border-2 border-blue-500 rounded-md pointer-events-none"
          style={{
            left: `${anno.x}%`,
            top: `${anno.y}%`,
            width: `${anno.width ?? 20}%`,
            height: `${anno.height ?? 5}%`,
          }}
        >
          {anno.label && (
            <span className="absolute -top-5 left-0 text-xs font-medium text-blue-600 dark:text-blue-400 bg-background/90 px-1.5 py-0.5 rounded whitespace-nowrap">
              {anno.label}
            </span>
          )}
        </div>
      );
    }
    return (
      <div
        key={`${prefix}-anno-${i}`}
        className="absolute bg-yellow-400/20 border border-yellow-500/40 rounded-sm pointer-events-none"
        style={{
          left: `${anno.x}%`,
          top: `${anno.y}%`,
          width: `${anno.width ?? 20}%`,
          height: `${anno.height ?? 5}%`,
        }}
      />
    );
  });
}

export function AnnotatedScreenshot({
  src,
  alt,
  annotations = [],
  masks = [],
  caption,
  illustration,
  className = '',
}: AnnotatedScreenshotProps) {
  const [zoomed, setZoomed] = useState(false);
  const hasImage = src && !src.includes('placeholder');

  const close = useCallback(() => setZoomed(false), []);

  useEffect(() => {
    if (!zoomed) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [zoomed, close]);

  const imageContent = hasImage ? (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={450}
      className="w-full h-auto"
      sizes="(max-width: 768px) 100vw, 800px"
    />
  ) : illustration ? (
    illustration
  ) : (
    <div className="w-full aspect-video bg-muted/50 flex items-center justify-center text-sm text-muted-foreground">
      {alt}
    </div>
  );

  return (
    <>
      <figure className={`relative ${className}`}>
        <div
          className="relative rounded-lg border overflow-hidden bg-muted/30 cursor-zoom-in group"
          onClick={() => setZoomed(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setZoomed(true)}
        >
          {imageContent}
          {renderMasks(masks, 'thumb')}
          {(hasImage || illustration) && renderAnnotations(annotations, 'thumb')}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white text-xs px-3 py-1.5 rounded-full pointer-events-none">
              클릭하여 확대
            </span>
          </div>
        </div>
        {caption && (
          <figcaption className="mt-2 text-xs text-muted-foreground text-center">
            {caption}
          </figcaption>
        )}
      </figure>

      {/* Lightbox — 확대 모드 (어노테이션 + 마스킹 모두 표시) */}
      {zoomed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8"
          onClick={close}
          role="dialog"
          aria-label="이미지 확대"
        >
          <button
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            onClick={close}
          >
            <X className="w-5 h-5 text-white" />
            <span className="sr-only">닫기</span>
          </button>
          <div
            className="relative max-w-[95vw] max-h-[90vh] overflow-auto rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              {hasImage ? (
                <Image
                  src={src}
                  alt={alt}
                  width={1440}
                  height={900}
                  className="w-auto h-auto max-w-none"
                  sizes="95vw"
                  quality={95}
                />
              ) : illustration ? (
                <div className="bg-background rounded-lg p-4 max-w-4xl">{illustration}</div>
              ) : null}
              {renderMasks(masks, 'zoom')}
              {renderAnnotations(annotations, 'zoom')}
            </div>
          </div>
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-xs">
            ESC 또는 바깥 클릭으로 닫기
          </p>
        </div>
      )}
    </>
  );
}
