import type { ModulePreset } from './personal-brand';

export const smallBizPresets: ModulePreset[] = [
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
      enabled: ['hero', 'menu', 'hours', 'location', 'sns'],
      order: ['hero', 'menu', 'hours', 'location', 'sns'],
    },
  },
  {
    id: 'full',
    name: '전체',
    nameEn: 'Full',
    description: '갤러리 포함 전체 — 완전한 홍보 페이지',
    descriptionEn: 'All with gallery — complete promotion page',
    state: {
      enabled: ['hero', 'menu', 'hours', 'location', 'gallery', 'sns'],
      order: ['hero', 'menu', 'hours', 'location', 'gallery', 'sns'],
    },
  },
  {
    id: 'dark',
    name: '다크',
    nameEn: 'Dark',
    description: '전체 + 다크 골드 — 프리미엄 무드',
    descriptionEn: 'All + dark gold — premium mood',
    state: {
      enabled: ['hero', 'menu', 'hours', 'location', 'gallery', 'sns'],
      order: ['hero', 'menu', 'hours', 'location', 'gallery', 'sns'],
      values: {
        hero: { primaryColor: '#c8a97e', fontFamily: 'Nanum Myeongjo', designPreset: 'default' },
      },
    },
  },
];
