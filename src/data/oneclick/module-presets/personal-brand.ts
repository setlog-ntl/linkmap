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
    id: 'minimal',
    name: '미니멀',
    nameEn: 'Minimal',
    description: 'Hero + 연락처만 — 깔끔한 명함 스타일',
    descriptionEn: 'Hero + Contact only — clean card style',
    state: {
      enabled: ['hero', 'contact'],
      order: ['hero', 'contact'],
    },
  },
  {
    id: 'creator',
    name: '크리에이터',
    nameEn: 'Creator',
    description: '소개 + 하이라이트 + 갤러리 포함 포트폴리오',
    descriptionEn: 'Portfolio with bio, highlights, and gallery',
    state: {
      enabled: ['hero', 'about', 'highlights', 'gallery', 'contact'],
      order: ['hero', 'about', 'highlights', 'gallery', 'contact'],
    },
  },
  {
    id: 'full',
    name: '풀 프로필',
    nameEn: 'Full Profile',
    description: '모든 모듈 활성화 — 완전한 프로필 페이지',
    descriptionEn: 'All modules enabled — complete profile',
    state: {
      enabled: ['hero', 'about', 'values', 'highlights', 'gallery', 'contact'],
      order: ['hero', 'about', 'values', 'highlights', 'gallery', 'contact'],
    },
  },
  {
    id: 'magazine',
    name: '매거진',
    nameEn: 'Magazine',
    description: 'serif 폰트 + 2단 레이아웃 — 에디토리얼 감성',
    descriptionEn: 'Serif font + editorial layout — magazine aesthetic',
    state: {
      enabled: ['hero', 'about', 'highlights', 'gallery', 'contact'],
      order: ['hero', 'about', 'highlights', 'gallery', 'contact'],
      values: {
        hero: { designPreset: 'magazine' },
      },
    },
  },
  {
    id: 'warm-earth',
    name: '웜 어스',
    nameEn: 'Warm Earth',
    description: '따뜻한 어스톤 + 세리프 폰트 — 자연스러운 감성',
    descriptionEn: 'Warm earth tones + serif font — natural aesthetic',
    state: {
      enabled: ['hero', 'about', 'values', 'highlights', 'contact'],
      order: ['hero', 'about', 'values', 'highlights', 'contact'],
      values: {
        hero: { designPreset: 'warm-earth' },
      },
    },
  },
  {
    id: 'midnight',
    name: '미드나잇',
    nameEn: 'Midnight',
    description: '진한 다크 + 인디고 악센트 — 모던 나이트 모드',
    descriptionEn: 'Deep dark + indigo accent — modern night mode',
    state: {
      enabled: ['hero', 'about', 'values', 'highlights', 'gallery', 'contact'],
      order: ['hero', 'about', 'values', 'highlights', 'gallery', 'contact'],
      values: {
        hero: { designPreset: 'midnight' },
      },
    },
  },
];
