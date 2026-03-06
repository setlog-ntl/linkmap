import type { ModulePreset } from './personal-brand';

export const smallBizPresets: ModulePreset[] = [
  {
    id: 'minimal',
    name: '심플',
    nameEn: 'Simple',
    description: '가게 정보 + 위치만 — 간단한 소개 페이지',
    descriptionEn: 'Store info + Location only — simple intro page',
    state: {
      enabled: ['hero', 'location'],
      order: ['hero', 'location'],
    },
  },
  {
    id: 'cafe',
    name: '카페/베이커리',
    nameEn: 'Cafe / Bakery',
    description: '메뉴 + 영업시간 + 갤러리 — 카페/베이커리에 최적화',
    descriptionEn: 'Menu + Hours + Gallery — optimized for cafes',
    state: {
      enabled: ['hero', 'menu', 'hours', 'location', 'gallery', 'sns'],
      order: ['hero', 'menu', 'hours', 'location', 'gallery', 'sns'],
    },
  },
  {
    id: 'restaurant',
    name: '음식점',
    nameEn: 'Restaurant',
    description: '메뉴 + 영업시간 + SNS — 음식점 홍보 페이지',
    descriptionEn: 'Menu + Hours + SNS — restaurant promotion page',
    state: {
      enabled: ['hero', 'menu', 'hours', 'location', 'sns'],
      order: ['hero', 'menu', 'hours', 'location', 'sns'],
    },
  },
  {
    id: 'full',
    name: '풀 구성',
    nameEn: 'Full',
    description: '모든 모듈 활성화 — 완전한 가게 홍보 페이지',
    descriptionEn: 'All modules enabled — complete store promotion page',
    state: {
      enabled: ['hero', 'menu', 'hours', 'location', 'gallery', 'sns'],
      order: ['hero', 'menu', 'hours', 'location', 'gallery', 'sns'],
    },
  },
  {
    id: 'warm-earth',
    name: '웜 어스',
    nameEn: 'Warm Earth',
    description: '따뜻한 어스톤 — 카페/베이커리에 잘 어울리는 감성',
    descriptionEn: 'Warm earth tones — perfect for cafes and bakeries',
    state: {
      enabled: ['hero', 'menu', 'hours', 'location', 'gallery', 'sns'],
      order: ['hero', 'menu', 'hours', 'location', 'gallery', 'sns'],
      values: {
        hero: { designPreset: 'warm-earth' },
      },
    },
  },
  {
    id: 'midnight',
    name: '미드나잇',
    nameEn: 'Midnight',
    description: '진한 다크 + 인디고 악센트 — 세련된 바/레스토랑 무드',
    descriptionEn: 'Deep dark + indigo accent — sophisticated bar/restaurant mood',
    state: {
      enabled: ['hero', 'menu', 'hours', 'location', 'gallery', 'sns'],
      order: ['hero', 'menu', 'hours', 'location', 'gallery', 'sns'],
      values: {
        hero: { designPreset: 'midnight' },
      },
    },
  },
];
