export interface ThemePreset {
  name: string;
  label: string;
  backgroundFrom: string;
  backgroundTo: string;
  primary: string;
  text: string;
  textMuted: string;
  cardBg: string;
  cardBorder: string;
}

export const themes: Record<string, ThemePreset> = {
  gradient: {
    name: 'gradient',
    label: 'Gradient',
    backgroundFrom: '#8b5cf6',
    backgroundTo: '#f97316',
    primary: '#ec4899',
    text: '#ffffff',
    textMuted: 'rgba(255,255,255,0.8)',
    cardBg: 'rgba(255,255,255,0.15)',
    cardBorder: 'rgba(255,255,255,0.25)',
  },
  neon: {
    name: 'neon',
    label: 'Neon',
    backgroundFrom: '#0f172a',
    backgroundTo: '#1e293b',
    primary: '#22d3ee',
    text: '#f0f9ff',
    textMuted: 'rgba(240,249,255,0.7)',
    cardBg: 'rgba(34,211,238,0.08)',
    cardBorder: 'rgba(34,211,238,0.25)',
  },
  minimal: {
    name: 'minimal',
    label: 'Minimal',
    backgroundFrom: '#ffffff',
    backgroundTo: '#f3f4f6',
    primary: '#1f2937',
    text: '#111827',
    textMuted: '#6b7280',
    cardBg: 'rgba(0,0,0,0.04)',
    cardBorder: 'rgba(0,0,0,0.08)',
  },
  pastel: {
    name: 'pastel',
    label: 'Pastel',
    backgroundFrom: '#fce7f3',
    backgroundTo: '#dbeafe',
    primary: '#f472b6',
    text: '#1f2937',
    textMuted: '#6b7280',
    cardBg: 'rgba(255,255,255,0.6)',
    cardBorder: 'rgba(244,114,182,0.2)',
  },
  dark: {
    name: 'dark',
    label: 'Dark',
    backgroundFrom: '#0f172a',
    backgroundTo: '#1e1b4b',
    primary: '#a78bfa',
    text: '#f5f3ff',
    textMuted: 'rgba(245,243,255,0.7)',
    cardBg: 'rgba(167,139,250,0.08)',
    cardBorder: 'rgba(167,139,250,0.2)',
  },
  ocean: {
    name: 'ocean',
    label: 'Ocean',
    backgroundFrom: '#164e63',
    backgroundTo: '#0c4a6e',
    primary: '#06b6d4',
    text: '#ecfeff',
    textMuted: 'rgba(236,254,255,0.7)',
    cardBg: 'rgba(6,182,212,0.1)',
    cardBorder: 'rgba(6,182,212,0.25)',
  },
  sunset: {
    name: 'sunset',
    label: 'Sunset',
    backgroundFrom: '#7c2d12',
    backgroundTo: '#78350f',
    primary: '#f59e0b',
    text: '#fffbeb',
    textMuted: 'rgba(255,251,235,0.7)',
    cardBg: 'rgba(245,158,11,0.1)',
    cardBorder: 'rgba(245,158,11,0.25)',
  },
  forest: {
    name: 'forest',
    label: 'Forest',
    backgroundFrom: '#14532d',
    backgroundTo: '#1a2e05',
    primary: '#22c55e',
    text: '#f0fdf4',
    textMuted: 'rgba(240,253,244,0.7)',
    cardBg: 'rgba(34,197,94,0.1)',
    cardBorder: 'rgba(34,197,94,0.25)',
  },
  candy: {
    name: 'candy',
    label: 'Candy',
    backgroundFrom: '#fdf2f8',
    backgroundTo: '#fce7f3',
    primary: '#f472b6',
    text: '#831843',
    textMuted: '#9d174d',
    cardBg: 'rgba(244,114,182,0.08)',
    cardBorder: 'rgba(244,114,182,0.2)',
  },
  monochrome: {
    name: 'monochrome',
    label: 'Monochrome',
    backgroundFrom: '#111827',
    backgroundTo: '#1f2937',
    primary: '#6b7280',
    text: '#f9fafb',
    textMuted: 'rgba(249,250,251,0.6)',
    cardBg: 'rgba(107,114,128,0.1)',
    cardBorder: 'rgba(107,114,128,0.2)',
  },
};

export function getTheme(name: string): ThemePreset {
  return themes[name] || themes.gradient;
}
