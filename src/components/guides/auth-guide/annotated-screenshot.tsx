'use client';

import { useState, type ReactNode } from 'react';
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

/** 민감정보 마스킹 영역 (% 기반) */
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

  const overlays = (
    <>
      {/* 민감정보 마스킹 */}
      {masks.map((mask, i) => (
        <div
          key={`mask-${i}`}
          className="absolute bg-gray-800/90 backdrop-blur-sm rounded-sm flex items-center justify-center"
          style={{
            left: `${mask.x}%`,
            top: `${mask.y}%`,
            width: `${mask.width}%`,
            height: `${mask.height}%`,
          }}
        >
          {mask.label && (
            <span className="text-[9px] text-gray-400 font-mono truncate px-1">
              {mask.label}
            </span>
          )}
        </div>
      ))}
      {/* 어노테이션 */}
      {(hasImage || illustration) &&
        annotations.map((anno, i) => {
          if (anno.type === 'click') {
            return (
              <div
                key={`anno-${i}`}
                className="absolute flex items-center justify-center"
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
                key={`anno-${i}`}
                className="absolute border-2 border-blue-500 rounded-md"
                style={{
                  left: `${anno.x}%`,
                  top: `${anno.y}%`,
                  width: `${anno.width ?? 20}%`,
                  height: `${anno.height ?? 5}%`,
                }}
              >
                {anno.label && (
                  <span className="absolute -top-5 left-0 text-xs font-medium text-blue-600 dark:text-blue-400 bg-background/90 px-1.5 py-0.5 rounded">
                    {anno.label}
                  </span>
                )}
              </div>
            );
          }
          return (
            <div
              key={`anno-${i}`}
              className="absolute bg-yellow-400/25 rounded-sm"
              style={{
                left: `${anno.x}%`,
                top: `${anno.y}%`,
                width: `${anno.width ?? 20}%`,
                height: `${anno.height ?? 5}%`,
              }}
            />
          );
        })}
    </>
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
          {overlays}
          {/* Zoom hint */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white text-xs px-3 py-1.5 rounded-full">
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

      {/* Lightbox */}
      {zoomed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8"
          onClick={() => setZoomed(false)}
          role="dialog"
          aria-label="이미지 확대"
        >
          <button
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            onClick={() => setZoomed(false)}
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <div
            className="relative max-w-[95vw] max-h-[90vh] overflow-auto rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
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
            {/* 확대 모드에서도 마스킹 적용 */}
            {masks.map((mask, i) => (
              <div
                key={`zoom-mask-${i}`}
                className="absolute bg-gray-800/90 backdrop-blur-sm rounded-sm flex items-center justify-center"
                style={{
                  left: `${mask.x}%`,
                  top: `${mask.y}%`,
                  width: `${mask.width}%`,
                  height: `${mask.height}%`,
                }}
              >
                {mask.label && (
                  <span className="text-xs text-gray-400 font-mono truncate px-1">
                    {mask.label}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
