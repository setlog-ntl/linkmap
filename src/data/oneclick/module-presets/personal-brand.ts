import type { ModuleConfigState } from '@/lib/module-schema';

export interface ModulePreset {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  state: Partial<ModuleConfigState>;
}

export const personalBrandPresets: ModulePreset[] = [
  {
    id: 'basic',
    name: '기본',
    nameEn: 'Basic',
    description: 'Hero + 소개 + 연락처 — 깔끔한 프로필 페이지',
    descriptionEn: 'Hero + About + Contact — clean profile page',
    state: {
      enabled: ['hero', 'about', 'contact'],
      order: ['hero', 'about', 'contact'],
      values: {
        hero: { designPreset: 'creator' },
      },
    },
  },
  {
    id: 'extended',
    name: '확장',
    nameEn: 'Extended',
    description: '모든 모듈 활성화 — 가치관, 하이라이트, 갤러리 포함',
    descriptionEn: 'All modules enabled — values, highlights, gallery included',
    state: {
      enabled: ['hero', 'about', 'values', 'highlights', 'gallery', 'contact'],
      order: ['hero', 'about', 'values', 'highlights', 'gallery', 'contact'],
      values: {
        hero: { designPreset: 'creator' },
      },
    },
  },
];
