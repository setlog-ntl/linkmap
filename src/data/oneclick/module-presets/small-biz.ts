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
    id: 'izakaya',
    name: '요리주점',
    nameEn: 'Izakaya',
    description: '메뉴 + 영업시간 + SNS — 요리주점/바에 최적화',
    descriptionEn: 'Menu + Hours + SNS — optimized for izakaya/bars',
    state: {
      enabled: ['hero', 'menu', 'hours', 'location', 'sns'],
      order: ['hero', 'menu', 'hours', 'location', 'sns'],
    },
  },
  {
    id: 'restaurant',
    name: '레스토랑',
    nameEn: 'Restaurant',
    description: '메뉴 + 영업시간 + 갤러리 + SNS — 레스토랑 홍보 페이지',
    descriptionEn: 'Menu + Hours + Gallery + SNS — restaurant promotion page',
    state: {
      enabled: ['hero', 'menu', 'hours', 'location', 'gallery', 'sns'],
      order: ['hero', 'menu', 'hours', 'location', 'gallery', 'sns'],
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
    id: 'dark-gold',
    name: '다크 골드',
    nameEn: 'Dark Gold',
    description: '다크 배경 + 골드 악센트 — 프리미엄 요리주점 무드',
    descriptionEn: 'Dark background + gold accent — premium izakaya mood',
    state: {
      enabled: ['hero', 'menu', 'hours', 'location', 'gallery', 'sns'],
      order: ['hero', 'menu', 'hours', 'location', 'gallery', 'sns'],
      values: {
        hero: { primaryColor: '#c8a97e', fontFamily: 'Nanum Myeongjo', designPreset: 'default' },
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
  {
    id: 'warm-serif',
    name: '따뜻한 세리프',
    nameEn: 'Warm Serif',
    description: '세리프 폰트 + 따뜻한 톤 — 고급 일식 레스토랑 감성',
    descriptionEn: 'Serif font + warm tones — premium Japanese dining aesthetic',
    state: {
      enabled: ['hero', 'menu', 'hours', 'location', 'gallery', 'sns'],
      order: ['hero', 'menu', 'hours', 'location', 'gallery', 'sns'],
      values: {
        hero: { fontFamily: 'Nanum Myeongjo', designPreset: 'warm-serif' },
      },
    },
  },
];
