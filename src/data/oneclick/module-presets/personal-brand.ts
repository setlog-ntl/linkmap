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
    id: 'simple',
    name: '심플',
    nameEn: 'Simple',
    description: '이름 + 연락처 — 깔끔한 명함 스타일',
    descriptionEn: 'Name + Contact — clean card style',
    state: {
      enabled: ['hero', 'contact'],
      order: ['hero', 'contact'],
    },
  },
  {
    id: 'standard',
    name: '기본',
    nameEn: 'Standard',
    description: '소개 + 하이라이트 포함 — 추천 구성',
    descriptionEn: 'With bio and highlights — recommended',
    state: {
      enabled: ['hero', 'about', 'highlights', 'contact'],
      order: ['hero', 'about', 'highlights', 'contact'],
    },
  },
  {
    id: 'full',
    name: '전체',
    nameEn: 'Full',
    description: '모든 섹션 활성화 — 완전한 프로필',
    descriptionEn: 'All sections enabled — complete profile',
    state: {
      enabled: ['hero', 'about', 'values', 'highlights', 'gallery', 'contact'],
      order: ['hero', 'about', 'values', 'highlights', 'gallery', 'contact'],
    },
  },
  {
    id: 'dark',
    name: '다크',
    nameEn: 'Dark',
    description: '모든 섹션 + 다크 톤 — 세련된 나이트 모드',
    descriptionEn: 'All sections + dark tone — sophisticated night mode',
    state: {
      enabled: ['hero', 'about', 'values', 'highlights', 'gallery', 'contact'],
      order: ['hero', 'about', 'values', 'highlights', 'gallery', 'contact'],
      values: {
        hero: { designPreset: 'midnight' },
      },
    },
  },
];
