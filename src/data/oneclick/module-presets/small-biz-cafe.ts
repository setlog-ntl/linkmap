import type { ModulePreset } from './personal-brand';

export const smallBizCafePresets: ModulePreset[] = [
  {
    id: 'simple',
    name: '심플',
    nameEn: 'Simple',
    description: '가게 정보 + 위치 — 간단한 소개',
    descriptionEn: 'Store info + Location — simple intro',
    state: {
      enabled: ['hero', 'location'],
      order: ['hero', 'location'],
    },
  },
  {
    id: 'standard',
    name: '기본',
    nameEn: 'Standard',
    description: '메뉴 + 영업시간 + 위치 — 추천 구성',
    descriptionEn: 'Menu + Hours + Location — recommended',
    state: {
      enabled: ['hero', 'about', 'menu', 'hours', 'location', 'sns'],
      order: ['hero', 'about', 'menu', 'hours', 'location', 'sns'],
    },
  },
  {
    id: 'full',
    name: '전체',
    nameEn: 'Full',
    description: '갤러리 포함 전체 — 완전한 카페 페이지',
    descriptionEn: 'All with gallery — complete cafe page',
    state: {
      enabled: ['hero', 'about', 'menu', 'hours', 'location', 'gallery', 'sns'],
      order: ['hero', 'about', 'menu', 'hours', 'location', 'gallery', 'sns'],
    },
  },
  {
    id: 'dark',
    name: '다크',
    nameEn: 'Dark',
    description: '전체 + 다크 톤 — 야간 무드 카페',
    descriptionEn: 'All + dark tone — night mood cafe',
    state: {
      enabled: ['hero', 'about', 'menu', 'hours', 'location', 'gallery', 'sns'],
      order: ['hero', 'about', 'menu', 'hours', 'location', 'gallery', 'sns'],
      values: {
        hero: { designPreset: 'midnight' },
      },
    },
  },
];
