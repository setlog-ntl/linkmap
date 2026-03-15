'use client';

import type { ReactNode } from 'react';
import { ExternalLink } from 'lucide-react';
import { AnnotatedScreenshot, type Annotation } from './annotated-screenshot';

export interface StepScreenshot {
  src?: string;
  alt: string;
  annotations?: Annotation[];
  caption?: string;
  illustration?: ReactNode;
}

export interface StepData {
  step: number;
  title: string;
  where: string;
  whereUrl?: string;
  what: string;
  why: string;
  tip?: string;
  screenshots?: StepScreenshot[];
}

interface StepCardWithScreenshotProps {
  data: StepData;
  colorScheme?: 'blue' | 'yellow' | 'emerald';
}

const colorMap = {
  blue: {
    badge: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
    link: 'text-blue-600 dark:text-blue-400',
  },
  yellow: {
    badge: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300',
    link: 'text-yellow-700 dark:text-yellow-400',
  },
  emerald: {
    badge: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
    link: 'text-emerald-600 dark:text-emerald-400',
  },
};

export function StepCardWithScreenshot({
  data,
  colorScheme = 'blue',
}: StepCardWithScreenshotProps) {
  const colors = colorMap[colorScheme];

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="p-5 flex gap-4">
        <div
          className={`w-8 h-8 rounded-full ${colors.badge} flex items-center justify-center shrink-0 text-sm font-bold`}
        >
          {data.step}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold mb-2">{data.title}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground font-medium">어디서? </span>
              {data.whereUrl ? (
                <a
                  href={data.whereUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${colors.link} hover:underline inline-flex items-center gap-1`}
                >
                  {data.where}
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span>{data.where}</span>
              )}
            </div>
            <div>
              <span className="text-muted-foreground font-medium">무엇을? </span>
              <span>{data.what}</span>
            </div>
            <div>
              <span className="text-muted-foreground font-medium">왜? </span>
              <span className="text-muted-foreground">{data.why}</span>
            </div>
          </div>
          {data.tip && (
            <p className="mt-2 text-xs text-muted-foreground bg-muted/50 rounded-md px-3 py-2">
              {data.tip}
            </p>
          )}
        </div>
      </div>
      {data.screenshots && data.screenshots.length > 0 && (
        <div className="border-t bg-muted/20 p-5">
          <div className={`grid gap-4 ${data.screenshots.length > 1 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 max-w-2xl'}`}>
            {data.screenshots.map((ss, i) => (
              <AnnotatedScreenshot
                key={i}
                src={ss.src}
                alt={ss.alt}
                annotations={ss.annotations}
                caption={ss.caption}
                illustration={ss.illustration}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
