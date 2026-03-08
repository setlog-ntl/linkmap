import type { ModulePreset } from './personal-brand';

export const smallBizCafePresets: ModulePreset[] = [
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
    id: 'cafe-full',
    name: '카페 풀 구성',
    nameEn: 'Cafe Full',
    description: '모든 모듈 활성화 — 완전한 카페 홍보 페이지',
    descriptionEn: 'All modules enabled — complete cafe page',
    state: {
      enabled: ['hero', 'menu', 'hours', 'location', 'gallery', 'sns'],
      order: ['hero', 'menu', 'hours', 'location', 'gallery', 'sns'],
    },
  },
  {
    id: 'modern-cafe',
    name: '모던 카페',
    nameEn: 'Modern Cafe',
    description: '라이트톤 + Pretendard — 깔끔한 카페 느낌',
    descriptionEn: 'Light tone + Pretendard — clean cafe style',
    state: {
      enabled: ['hero', 'menu', 'hours', 'location', 'sns'],
      order: ['hero', 'menu', 'hours', 'location', 'sns'],
      values: {
        hero: { primaryColor: '#18181b', fontFamily: 'Pretendard', designPreset: 'modern-minimal' },
      },
    },
  },
  {
    id: 'vintage-cafe',
    name: '빈티지 카페',
    nameEn: 'Vintage Cafe',
    description: '세리프 폰트 + 따뜻한 톤 — 감성 카페 무드',
    descriptionEn: 'Serif font + warm tones — vintage cafe mood',
    state: {
      enabled: ['hero', 'menu', 'hours', 'location', 'gallery', 'sns'],
      order: ['hero', 'menu', 'hours', 'location', 'gallery', 'sns'],
      values: {
        hero: { fontFamily: 'Nanum Myeongjo', designPreset: 'warm-serif' },
      },
    },
  },
  {
    id: 'warm-earth',
    name: '웜 어스',
    nameEn: 'Warm Earth',
    description: '따뜻한 어스톤 — 로스터리 카페에 딱 맞는 감성',
    descriptionEn: 'Warm earth tones — perfect for roastery cafes',
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
    description: '다크 + 인디고 악센트 — 야간 무드 카페',
    descriptionEn: 'Dark + indigo accent — night mood cafe',
    state: {
      enabled: ['hero', 'menu', 'hours', 'location', 'gallery', 'sns'],
      order: ['hero', 'menu', 'hours', 'location', 'gallery', 'sns'],
      values: {
        hero: { designPreset: 'midnight' },
      },
    },
  },
];
