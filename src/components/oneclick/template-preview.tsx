'use client';

import { useMemo } from 'react';
import type { ModuleConfigState } from '@/lib/module-schema';
import { getModuleSchema } from '@/data/oneclick/module-schemas';

interface TemplatePreviewProps {
  templateSlug: string;
  configState: ModuleConfigState;
  designPreset: string | null;
}

/** 디자인 프리셋별 색상/스타일 매핑 */
const PRESET_STYLES: Record<string, { bg: string; text: string; accent: string; card: string; muted: string }> = {
  // Personal Brand
  minimal:    { bg: '#fafafa', text: '#111', accent: '#6366f1', card: '#fff', muted: '#888' },
  creator:    { bg: '#f8f7ff', text: '#1a1a2e', accent: '#ee5b2b', card: '#fff', muted: '#666' },
  midnight:   { bg: '#0f172a', text: '#e2e8f0', accent: '#818cf8', card: '#1e293b', muted: '#94a3b8' },
  'warm-earth': { bg: '#faf5f0', text: '#3d2c1e', accent: '#d97706', card: '#fff', muted: '#8b7355' },
  // Dev Showcase
  'github-dark': { bg: '#0d1117', text: '#c9d1d9', accent: '#58a6ff', card: '#161b22', muted: '#8b949e' },
  terminal:   { bg: '#1a1a1a', text: '#33ff33', accent: '#33ff33', card: '#222', muted: '#888' },
  // Freelancer
  default:    { bg: '#fff', text: '#111', accent: '#5b13ec', card: '#f9fafb', muted: '#6b7280' },
  'creative-minimal': { bg: '#fafafa', text: '#111', accent: '#8b5cf6', card: '#fff', muted: '#888' },
  // Small Biz
  'modern-minimal': { bg: '#fff', text: '#18181b', accent: '#18181b', card: '#fafafa', muted: '#71717a' },
  'warm-serif': { bg: '#faf8f5', text: '#292524', accent: '#c8a97e', card: '#fff', muted: '#78716c' },
  // Link Card
  light:      { bg: '#fff', text: '#111', accent: '#6366f1', card: '#f9fafb', muted: '#888' },
  gradient:   { bg: 'linear-gradient(135deg, #e0e7ff, #f3e8ff)', text: '#111', accent: '#6366f1', card: '#fff', muted: '#888' },
  dark:       { bg: '#111', text: '#eee', accent: '#22d3ee', card: '#1f1f1f', muted: '#888' },
  aurora:     { bg: 'linear-gradient(135deg, #c4b5fd, #a78bfa, #818cf8)', text: '#fff', accent: '#818cf8', card: 'rgba(255,255,255,0.15)', muted: 'rgba(255,255,255,0.7)' },
};

function getStyles(preset: string | null) {
  return PRESET_STYLES[preset ?? 'default'] ?? PRESET_STYLES.default;
}

export function TemplatePreview({ templateSlug, configState, designPreset }: TemplatePreviewProps) {
  const schema = getModuleSchema(templateSlug);
  const styles = useMemo(() => getStyles(designPreset), [designPreset]);
  const enabledModules = configState.enabled;

  // Get module display info
  const moduleInfo = useMemo(() => {
    if (!schema) return [];
    return schema.modules
      .filter((m) => enabledModules.includes(m.id))
      .sort((a, b) => {
        const ai = configState.order.indexOf(a.id);
        const bi = configState.order.indexOf(b.id);
        return ai - bi;
      });
  }, [schema, enabledModules, configState.order]);

  // Extract user values for preview
  const vals = configState.values;
  const heroVals = vals.hero ?? vals.profile ?? {};
  const displayName = String(heroVals.name ?? heroVals.name ?? '내 사이트');
  const displayTagline = String(heroVals.tagline ?? heroVals.bio ?? heroVals.description ?? '한줄 소개를 입력하세요');

  const bgIsGradient = styles.bg.startsWith('linear-gradient');

  return (
    <div className="flex justify-center py-4 px-3 bg-muted/30">
      {/* Phone Frame */}
      <div className="w-[220px] relative">
        {/* Phone bezel */}
        <div className="rounded-[20px] border-2 border-gray-300 dark:border-gray-600 overflow-hidden shadow-lg">
          {/* Notch */}
          <div className="h-5 bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
            <div className="w-16 h-2.5 rounded-full bg-gray-400 dark:bg-gray-500" />
          </div>

          {/* Screen content */}
          <div
            className="min-h-[320px] overflow-hidden"
            style={{
              background: bgIsGradient ? styles.bg : styles.bg,
              backgroundColor: bgIsGradient ? undefined : styles.bg,
              color: styles.text,
            }}
          >
            {/* Hero section */}
            <div
              className="px-4 py-5 text-center"
              style={{
                borderBottom: `2px solid ${styles.accent}20`,
              }}
            >
              {/* Avatar placeholder */}
              {(templateSlug === 'link-card' || templateSlug === 'digital-namecard' || templateSlug === 'freelancer-page') && (
                <div
                  className="w-12 h-12 rounded-full mx-auto mb-2"
                  style={{ backgroundColor: `${styles.accent}25`, border: `2px solid ${styles.accent}40` }}
                />
              )}
              <p
                className="text-sm font-bold truncate"
                style={{ color: styles.text }}
              >
                {displayName}
              </p>
              <p
                className="text-[9px] mt-0.5 truncate"
                style={{ color: styles.muted }}
              >
                {displayTagline}
              </p>
            </div>

            {/* Module sections */}
            <div className="px-3 py-2 space-y-2">
              {moduleInfo.slice(1).map((mod) => (
                <ModulePreviewBlock
                  key={mod.id}
                  module={mod}
                  values={vals[mod.id] ?? {}}
                  styles={styles}
                  templateSlug={templateSlug}
                />
              ))}
            </div>

            {/* Bottom padding */}
            <div className="h-4" />
          </div>

          {/* Home indicator */}
          <div
            className="h-5 flex items-center justify-center"
            style={{ backgroundColor: bgIsGradient ? '#f5f5f5' : styles.bg }}
          >
            <div className="w-10 h-1 rounded-full bg-gray-400 dark:bg-gray-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Module Preview Blocks ──

function ModulePreviewBlock({
  module: mod,
  values,
  styles,
  templateSlug,
}: {
  module: { id: string; name: string };
  values: Record<string, unknown>;
  styles: { bg: string; text: string; accent: string; card: string; muted: string };
  templateSlug: string;
}) {
  // Simple visual representation of each module type
  const id = mod.id;

  return (
    <div
      className="rounded-md p-2"
      style={{ backgroundColor: styles.card }}
    >
      {/* Module label */}
      <p className="text-[8px] font-semibold mb-1" style={{ color: styles.accent }}>
        {mod.name}
      </p>

      {/* Module-specific content */}
      {(id === 'about' || id === 'story') && (
        <div className="space-y-0.5">
          <div className="h-1.5 rounded-full w-full" style={{ backgroundColor: `${styles.muted}30` }} />
          <div className="h-1.5 rounded-full w-4/5" style={{ backgroundColor: `${styles.muted}30` }} />
          <div className="h-1.5 rounded-full w-3/5" style={{ backgroundColor: `${styles.muted}30` }} />
        </div>
      )}

      {(id === 'values' || id === 'highlights' || id === 'services') && (
        <div className="grid grid-cols-3 gap-1">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-6 rounded"
              style={{ backgroundColor: `${styles.accent}15` }}
            />
          ))}
        </div>
      )}

      {(id === 'gallery' || id === 'portfolio') && (
        <div className="grid grid-cols-3 gap-1">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-8 rounded"
              style={{ backgroundColor: `${styles.muted}20` }}
            />
          ))}
        </div>
      )}

      {(id === 'links') && (
        <div className="space-y-1">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-4 rounded-full"
              style={{ backgroundColor: `${styles.accent}15`, border: `1px solid ${styles.accent}30` }}
            />
          ))}
        </div>
      )}

      {(id === 'contact' || id === 'socials' || id === 'sns') && (
        <div className="flex gap-1 justify-center">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: `${styles.accent}25` }}
            />
          ))}
        </div>
      )}

      {(id === 'projects') && (
        <div className="grid grid-cols-2 gap-1">
          {[1, 2].map((i) => (
            <div key={i} className="rounded" style={{ backgroundColor: `${styles.accent}10`, border: `1px solid ${styles.accent}20` }}>
              <div className="h-5 rounded-t" style={{ backgroundColor: `${styles.muted}15` }} />
              <div className="p-1">
                <div className="h-1 rounded-full w-3/4" style={{ backgroundColor: `${styles.muted}30` }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {(id === 'experience' || id === 'process') && (
        <div className="space-y-1">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: styles.accent }} />
              <div className="h-1.5 rounded-full flex-1" style={{ backgroundColor: `${styles.muted}25` }} />
            </div>
          ))}
        </div>
      )}

      {id === 'blog' && (
        <div className="space-y-1">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-start gap-1">
              <div className="w-6 h-4 rounded" style={{ backgroundColor: `${styles.muted}20` }} />
              <div className="flex-1 space-y-0.5">
                <div className="h-1.5 rounded-full w-full" style={{ backgroundColor: `${styles.muted}25` }} />
                <div className="h-1 rounded-full w-2/3" style={{ backgroundColor: `${styles.muted}15` }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {(id === 'menu') && (
        <div className="space-y-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="h-1.5 rounded-full w-12" style={{ backgroundColor: `${styles.muted}30` }} />
              <div className="h-1.5 rounded-full w-6" style={{ backgroundColor: `${styles.accent}30` }} />
            </div>
          ))}
        </div>
      )}

      {(id === 'hours') && (
        <div className="space-y-0.5">
          {['월', '화', '수'].map((d) => (
            <div key={d} className="flex justify-between items-center">
              <span className="text-[7px]" style={{ color: styles.muted }}>{d}</span>
              <div className="h-1 rounded-full w-10" style={{ backgroundColor: `${styles.muted}25` }} />
            </div>
          ))}
        </div>
      )}

      {(id === 'location') && (
        <div className="h-8 rounded flex items-center justify-center" style={{ backgroundColor: `${styles.muted}15` }}>
          <div className="w-2 h-3 rounded-t-full" style={{ backgroundColor: `${styles.accent}40` }} />
        </div>
      )}

      {(id === 'testimonials') && (
        <div className="space-y-1">
          <div className="h-1 rounded-full w-full" style={{ backgroundColor: `${styles.muted}20` }} />
          <div className="h-1 rounded-full w-4/5" style={{ backgroundColor: `${styles.muted}20` }} />
          <div className="flex gap-0.5 mt-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-1.5 h-1.5" style={{ backgroundColor: `${styles.accent}60` }} />
            ))}
          </div>
        </div>
      )}

      {/* Generic fallback for theme / qr / footer */}
      {['theme', 'qr', 'footer', 'profile'].includes(id) && (
        <div className="h-3 rounded" style={{ backgroundColor: `${styles.muted}15` }} />
      )}
    </div>
  );
}
