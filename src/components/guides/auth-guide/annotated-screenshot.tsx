'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';

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

interface AnnotatedScreenshotProps {
  src?: string;
  alt: string;
  annotations?: Annotation[];
  caption?: string;
  illustration?: ReactNode;
  className?: string;
}

export function AnnotatedScreenshot({
  src,
  alt,
  annotations = [],
  caption,
  illustration,
  className = '',
}: AnnotatedScreenshotProps) {
  const hasImage = src && !src.includes('placeholder');

  return (
    <figure className={`relative ${className}`}>
      <div className="relative rounded-lg border overflow-hidden bg-muted/30">
        {hasImage ? (
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
        )}
        {/* Annotation overlays — only on real images */}
        {hasImage &&
          annotations.map((anno, i) => {
            if (anno.type === 'click') {
              return (
                <div
                  key={i}
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
                  key={i}
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
                key={i}
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
      </div>
      {caption && (
        <figcaption className="mt-2 text-xs text-muted-foreground text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
