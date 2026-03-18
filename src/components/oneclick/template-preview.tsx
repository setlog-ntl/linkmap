'use client';

import { useMemo } from 'react';
import type { ModuleConfigState } from '@/lib/module-schema';
import { getModuleSchema } from '@/data/oneclick/module-schemas';

interface TemplatePreviewProps {
  templateSlug: string;
  configState: ModuleConfigState;
  designPreset: string | null;
}

// ── 디자인 프리셋별 기본 색상/스타일 매핑 ──

interface PresetStyle {
  bg: string;
  text: string;
  accent: string;
  card: string;
  muted: string;
}

const PRESET_STYLES: Record<string, PresetStyle> = {
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

/** 프리셋 스타일에 사용자 커스텀 색상(gradientFrom/To, primaryColor, accentColor)을 오버레이 */
function resolveStyles(preset: string | null, configValues: Record<string, Record<string, unknown>>): PresetStyle {
  const base = PRESET_STYLES[preset ?? 'default'] ?? PRESET_STYLES.default;
  const heroVals = configValues.hero ?? configValues.profile ?? {};
  const themeVals = configValues.theme ?? {};

  // 사용자가 설정한 커스텀 색상을 accent에 반영
  const customAccent =
    (themeVals.primaryColor as string) ||
    (themeVals.accentColor as string) ||
    (heroVals.primaryColor as string) ||
    null;

  // 사용자가 설정한 gradientFrom/To가 있으면 bg에 반영
  const gFrom = heroVals.gradientFrom as string | undefined;
  const gTo = heroVals.gradientTo as string | undefined;
  const customBg = (gFrom && gTo) ? `linear-gradient(135deg, ${gFrom}, ${gTo})` : null;

  return {
    ...base,
    ...(customAccent ? { accent: customAccent } : {}),
    ...(customBg ? { bg: customBg } : {}),
  };
}

// ── 유틸리티 ──

function str(v: unknown, fallback = ''): string {
  if (typeof v === 'string' && v.trim()) return v;
  return fallback;
}

function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, max) + '...' : s;
}

function isValidImageUrl(v: unknown): v is string {
  if (typeof v !== 'string' || !v.trim()) return false;
  return v.startsWith('http://') || v.startsWith('https://') || v.startsWith('/');
}

function arrItems(v: unknown): Array<Record<string, unknown>> {
  return Array.isArray(v) ? v : [];
}

// ── Main Preview ──

export function TemplatePreview({ templateSlug, configState, designPreset }: TemplatePreviewProps) {
  const schema = getModuleSchema(templateSlug);
  const styles = useMemo(
    () => resolveStyles(designPreset, configState.values),
    [designPreset, configState.values]
  );
  const enabledModules = configState.enabled;

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

  const vals = configState.values;
  const heroVals = vals.hero ?? vals.profile ?? {};
  const displayName = str(heroVals.name, '내 사이트');
  const displayTagline = str(
    heroVals.tagline ?? heroVals.bio ?? heroVals.description,
    '한줄 소개를 입력하세요'
  );
  const heroImageUrl = heroVals.heroImageUrl as string | undefined;
  const avatarUrl = heroVals.avatarUrl as string | undefined;

  const bgIsGradient = styles.bg.startsWith('linear-gradient');

  return (
    <div className="flex justify-center py-4 px-3 bg-muted/30">
      <div className="w-[220px] relative">
        <div className="rounded-[20px] border-2 border-gray-300 dark:border-gray-600 overflow-hidden shadow-lg">
          {/* Notch */}
          <div className="h-5 bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
            <div className="w-16 h-2.5 rounded-full bg-gray-400 dark:bg-gray-500" />
          </div>

          {/* Screen */}
          <div
            className="min-h-[340px] overflow-hidden"
            style={{
              background: styles.bg,
              backgroundColor: bgIsGradient ? undefined : styles.bg,
              color: styles.text,
            }}
          >
            {/* ── Hero ── */}
            <div className="relative">
              {/* Hero background image */}
              {isValidImageUrl(heroImageUrl) && (
                <div className="absolute inset-0 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={heroImageUrl}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                </div>
              )}

              <div className="relative px-4 py-5 text-center" style={{ borderBottom: `2px solid ${styles.accent}20` }}>
                {/* Avatar */}
                {(templateSlug === 'link-card' || templateSlug === 'digital-namecard' || templateSlug === 'freelancer-page') && (
                  isValidImageUrl(avatarUrl) ? (
                    <div className="w-12 h-12 rounded-full mx-auto mb-2 overflow-hidden border-2" style={{ borderColor: `${styles.accent}40` }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={avatarUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  ) : (
                    <div
                      className="w-12 h-12 rounded-full mx-auto mb-2"
                      style={{ backgroundColor: `${styles.accent}25`, border: `2px solid ${styles.accent}40` }}
                    />
                  )
                )}

                <p
                  className="text-sm font-bold truncate"
                  style={{ color: isValidImageUrl(heroImageUrl) ? '#fff' : styles.text }}
                >
                  {truncate(displayName, 20)}
                </p>
                <p
                  className="text-[9px] mt-0.5 truncate"
                  style={{ color: isValidImageUrl(heroImageUrl) ? 'rgba(255,255,255,0.8)' : styles.muted }}
                >
                  {truncate(displayTagline, 40)}
                </p>
              </div>
            </div>

            {/* ── Module sections ── */}
            <div className="px-3 py-2 space-y-2">
              {moduleInfo
                .filter((m) => m.id !== 'hero' && m.id !== 'profile')
                .map((mod) => (
                  <ModulePreviewBlock
                    key={mod.id}
                    module={mod}
                    values={vals[mod.id] ?? {}}
                    styles={styles}
                    templateSlug={templateSlug}
                  />
                ))}
            </div>

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

// ── Module Preview Block (실제 데이터 반영) ──

function ModulePreviewBlock({
  module: mod,
  values,
  styles,
}: {
  module: { id: string; name: string };
  values: Record<string, unknown>;
  styles: PresetStyle;
  templateSlug: string;
}) {
  const id = mod.id;

  return (
    <div className="rounded-md p-2" style={{ backgroundColor: styles.card }}>
      <p className="text-[8px] font-semibold mb-1" style={{ color: styles.accent }}>
        {mod.name}
      </p>

      {/* ── About / Story ── */}
      {(id === 'about') && (
        <div>
          {str(values.story as string) ? (
            <p className="text-[8px] leading-[1.4]" style={{ color: styles.muted }}>
              {truncate(str(values.story as string), 80)}
            </p>
          ) : (
            <TextPlaceholder lines={3} styles={styles} />
          )}
          {/* Skills */}
          {arrItems(values.skills).length > 0 && (
            <div className="mt-1 space-y-0.5">
              {arrItems(values.skills).slice(0, 3).map((s, i) => (
                <div key={i} className="flex items-center gap-1">
                  <span className="text-[6px] w-8 truncate" style={{ color: styles.muted }}>{str(s.name as string)}</span>
                  <div className="flex-1 h-1 rounded-full" style={{ backgroundColor: `${styles.muted}20` }}>
                    <div
                      className="h-full rounded-full"
                      style={{ backgroundColor: styles.accent, width: `${Math.min(Number(s.level) || 50, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Values ── */}
      {id === 'values' && (
        <div className="grid grid-cols-3 gap-1">
          {arrItems(values.items).length > 0
            ? arrItems(values.items).slice(0, 3).map((item, i) => (
                <div key={i} className="text-center p-1 rounded" style={{ backgroundColor: `${styles.accent}10` }}>
                  <p className="text-[8px]">{str(item.emoji as string, '✦')}</p>
                  <p className="text-[6px] font-medium truncate" style={{ color: styles.text }}>
                    {truncate(str(item.title as string, '가치'), 6)}
                  </p>
                </div>
              ))
            : [1, 2, 3].map((i) => (
                <div key={i} className="h-6 rounded" style={{ backgroundColor: `${styles.accent}15` }} />
              ))
          }
        </div>
      )}

      {/* ── Highlights ── */}
      {id === 'highlights' && (
        <div className="grid grid-cols-3 gap-1">
          {arrItems(values.items).length > 0
            ? arrItems(values.items).slice(0, 3).map((item, i) => (
                <div key={i} className="text-center">
                  <p className="text-[9px] font-bold" style={{ color: styles.accent }}>
                    {truncate(str(item.value as string, '0'), 8)}
                  </p>
                  <p className="text-[6px]" style={{ color: styles.muted }}>
                    {truncate(str(item.label as string), 8)}
                  </p>
                </div>
              ))
            : [1, 2, 3].map((i) => (
                <div key={i} className="h-6 rounded" style={{ backgroundColor: `${styles.accent}15` }} />
              ))
          }
        </div>
      )}

      {/* ── Services ── */}
      {id === 'services' && (
        <div className="grid grid-cols-3 gap-1">
          {arrItems(values.items).length > 0
            ? arrItems(values.items).slice(0, 3).map((item, i) => (
                <div key={i} className="p-1 rounded" style={{ backgroundColor: `${styles.accent}10` }}>
                  <p className="text-[6px] font-medium truncate" style={{ color: styles.text }}>
                    {truncate(str(item.title as string, '서비스'), 8)}
                  </p>
                  <p className="text-[5px] truncate" style={{ color: styles.accent }}>
                    {str(item.price as string)}
                  </p>
                </div>
              ))
            : [1, 2, 3].map((i) => (
                <div key={i} className="h-6 rounded" style={{ backgroundColor: `${styles.accent}15` }} />
              ))
          }
        </div>
      )}

      {/* ── Gallery / Portfolio (이미지 반영) ── */}
      {(id === 'gallery' || id === 'portfolio') && (
        <div className="grid grid-cols-3 gap-1">
          {(() => {
            const images = id === 'gallery'
              ? arrItems(values.images).map((img) => str(img.url as string))
              : arrItems(values.items).map((item) => str(item.imageUrl as string));
            const validImages = images.filter(isValidImageUrl).slice(0, 3);

            if (validImages.length > 0) {
              return validImages.map((url, i) => (
                <div key={i} className="h-10 rounded overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="w-full h-full object-cover" loading="lazy" />
                </div>
              ));
            }
            return [1, 2, 3].map((i) => (
              <div key={i} className="h-8 rounded" style={{ backgroundColor: `${styles.muted}20` }} />
            ));
          })()}
        </div>
      )}

      {/* ── Links ── */}
      {id === 'links' && (
        <div className="space-y-1">
          {arrItems(values.items).length > 0
            ? arrItems(values.items).slice(0, 3).map((item, i) => (
                <div
                  key={i}
                  className="h-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${styles.accent}15`, border: `1px solid ${styles.accent}30` }}
                >
                  <span className="text-[6px] font-medium truncate px-1" style={{ color: styles.text }}>
                    {truncate(str(item.title as string, '링크'), 20)}
                  </span>
                </div>
              ))
            : [1, 2, 3].map((i) => (
                <div key={i} className="h-4 rounded-full" style={{ backgroundColor: `${styles.accent}15`, border: `1px solid ${styles.accent}30` }} />
              ))
          }
        </div>
      )}

      {/* ── Contact / Socials / SNS ── */}
      {(id === 'contact' || id === 'socials' || id === 'sns') && (
        <div>
          {str(values.email as string) && (
            <p className="text-[7px] truncate mb-1" style={{ color: styles.muted }}>
              {str(values.email as string)}
            </p>
          )}
          <div className="flex gap-1 justify-center">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-4 h-4 rounded-full" style={{ backgroundColor: `${styles.accent}25` }} />
            ))}
          </div>
        </div>
      )}

      {/* ── Projects ── */}
      {id === 'projects' && (
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

      {/* ── Experience / Process ── */}
      {(id === 'experience' || id === 'process') && (
        <div className="space-y-1">
          {arrItems(values.items).length > 0
            ? arrItems(values.items).slice(0, 2).map((item, i) => (
                <div key={i} className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: styles.accent }} />
                  <span className="text-[6px] truncate" style={{ color: styles.text }}>
                    {truncate(str(item.title as string, '항목'), 20)}
                  </span>
                </div>
              ))
            : [1, 2].map((i) => (
                <div key={i} className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: styles.accent }} />
                  <div className="h-1.5 rounded-full flex-1" style={{ backgroundColor: `${styles.muted}25` }} />
                </div>
              ))
          }
        </div>
      )}

      {/* ── Blog ── */}
      {id === 'blog' && (
        <div className="space-y-1">
          {arrItems(values.items).length > 0
            ? arrItems(values.items).slice(0, 2).map((item, i) => (
                <div key={i} className="flex items-start gap-1">
                  <div className="w-6 h-4 rounded shrink-0" style={{ backgroundColor: `${styles.muted}20` }} />
                  <p className="text-[6px] truncate" style={{ color: styles.text }}>
                    {truncate(str(item.title as string), 20)}
                  </p>
                </div>
              ))
            : [1, 2].map((i) => (
                <div key={i} className="flex items-start gap-1">
                  <div className="w-6 h-4 rounded" style={{ backgroundColor: `${styles.muted}20` }} />
                  <div className="flex-1 space-y-0.5">
                    <div className="h-1.5 rounded-full w-full" style={{ backgroundColor: `${styles.muted}25` }} />
                    <div className="h-1 rounded-full w-2/3" style={{ backgroundColor: `${styles.muted}15` }} />
                  </div>
                </div>
              ))
          }
        </div>
      )}

      {/* ── Menu ── */}
      {id === 'menu' && (
        <div className="space-y-1">
          {arrItems(values.items).length > 0
            ? arrItems(values.items).slice(0, 3).map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-[6px] truncate flex-1" style={{ color: styles.text }}>
                    {str(item.emoji as string)} {truncate(str(item.name as string, '메뉴'), 12)}
                  </span>
                  <span className="text-[6px] shrink-0" style={{ color: styles.accent }}>
                    {str(item.price as string)}
                  </span>
                </div>
              ))
            : [1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="h-1.5 rounded-full w-12" style={{ backgroundColor: `${styles.muted}30` }} />
                  <div className="h-1.5 rounded-full w-6" style={{ backgroundColor: `${styles.accent}30` }} />
                </div>
              ))
          }
        </div>
      )}

      {/* ── Hours ── */}
      {id === 'hours' && (
        <div className="space-y-0.5">
          {arrItems(values.items).length > 0
            ? arrItems(values.items).slice(0, 3).map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-[6px]" style={{ color: styles.muted }}>
                    {str(item.day as string)}
                  </span>
                  <span
                    className="text-[6px]"
                    style={{ color: item.isHoliday ? '#ef4444' : styles.text }}
                  >
                    {str(item.hours as string)}
                  </span>
                </div>
              ))
            : ['월', '화', '수'].map((d) => (
                <div key={d} className="flex justify-between items-center">
                  <span className="text-[7px]" style={{ color: styles.muted }}>{d}</span>
                  <div className="h-1 rounded-full w-10" style={{ backgroundColor: `${styles.muted}25` }} />
                </div>
              ))
          }
        </div>
      )}

      {/* ── Location ── */}
      {id === 'location' && (
        <div>
          {str(values.address as string) ? (
            <p className="text-[7px] truncate" style={{ color: styles.muted }}>
              {truncate(str(values.address as string), 30)}
            </p>
          ) : (
            <div className="h-8 rounded flex items-center justify-center" style={{ backgroundColor: `${styles.muted}15` }}>
              <div className="w-2 h-3 rounded-t-full" style={{ backgroundColor: `${styles.accent}40` }} />
            </div>
          )}
        </div>
      )}

      {/* ── Testimonials ── */}
      {id === 'testimonials' && (
        <div>
          {arrItems(values.items).length > 0 ? (
            <div>
              <p className="text-[7px] italic" style={{ color: styles.muted }}>
                &ldquo;{truncate(str(arrItems(values.items)[0].content as string), 40)}&rdquo;
              </p>
              <p className="text-[6px] mt-0.5" style={{ color: styles.text }}>
                — {str(arrItems(values.items)[0].author as string)}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="h-1 rounded-full w-full" style={{ backgroundColor: `${styles.muted}20` }} />
              <div className="h-1 rounded-full w-4/5" style={{ backgroundColor: `${styles.muted}20` }} />
            </div>
          )}
        </div>
      )}

      {/* ── Theme (color swatch) ── */}
      {id === 'theme' && (
        <div className="flex gap-1">
          <div className="w-5 h-5 rounded-full border" style={{ backgroundColor: styles.accent, borderColor: `${styles.accent}60` }} />
          <div className="w-5 h-5 rounded-full border" style={{ backgroundColor: styles.card, borderColor: `${styles.muted}40` }} />
          <div className="w-5 h-5 rounded-full border" style={{ backgroundColor: styles.text, borderColor: `${styles.muted}40` }} />
        </div>
      )}

      {/* Generic fallback */}
      {['qr', 'footer'].includes(id) && (
        <div className="h-3 rounded" style={{ backgroundColor: `${styles.muted}15` }} />
      )}
    </div>
  );
}

// ── Text Placeholder ──

function TextPlaceholder({ lines, styles }: { lines: number; styles: PresetStyle }) {
  const widths = ['w-full', 'w-4/5', 'w-3/5', 'w-2/3'];
  return (
    <div className="space-y-0.5">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full ${widths[i % widths.length]}`}
          style={{ backgroundColor: `${styles.muted}30` }}
        />
      ))}
    </div>
  );
}
