import type { ModulePreset } from './personal-brand';
import { personalBrandPresets } from './personal-brand';

const PRESET_MAP: Record<string, ModulePreset[]> = {
  'personal-brand': personalBrandPresets,
};

export function getModulePresets(templateSlug: string): ModulePreset[] {
  return PRESET_MAP[templateSlug] || [];
}

export type { ModulePreset };
