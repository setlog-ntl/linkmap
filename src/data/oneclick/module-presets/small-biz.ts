import type { ModulePreset } from './personal-brand';

export const smallBizPresets: ModulePreset[] = [
  {
    id: 'basic',
    name: '기본',
    nameEn: 'Basic',
    description: '가게 정보 + 메뉴 + 위치 — 간단한 소개 페이지',
    descriptionEn: 'Store info + Menu + Location — simple intro page',
    state: {
      enabled: ['hero', 'menu', 'location'],
      order: ['hero', 'menu', 'location'],
      values: {
        hero: { designPreset: 'default' },
      },
    },
  },
  {
    id: 'extended',
    name: '확장',
    nameEn: 'Extended',
    description: '모든 모듈 활성화 — 영업시간, 갤러리, SNS 포함',
    descriptionEn: 'All modules enabled — hours, gallery, SNS included',
    state: {
      enabled: ['hero', 'menu', 'hours', 'location', 'gallery', 'sns'],
      order: ['hero', 'menu', 'hours', 'location', 'gallery', 'sns'],
      values: {
        hero: { designPreset: 'default' },
      },
    },
  },
];
