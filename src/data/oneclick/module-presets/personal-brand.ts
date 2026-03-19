import type { ModuleConfigState } from '@/lib/module-schema';

export interface ModulePreset {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  state: Partial<ModuleConfigState>;
  /** 대표 색상 (UI 색상 스와치 표시용) */
  colors?: [string, string];
}

export const personalBrandPresets: ModulePreset[] = [
  {
    id: 'creator',
    name: '선셋 오렌지',
    nameEn: 'Sunset Orange',
    description: '따뜻한 주황+노랑 그래디언트 — 에너지 넘치는 스타일',
    descriptionEn: 'Warm orange-yellow gradient — energetic style',
    colors: ['#ee5b2b', '#f59e0b'],
    state: {
      values: {
        hero: { designPreset: 'creator' },
      },
    },
  },
  {
    id: 'magazine',
    name: '볼드 레드',
    nameEn: 'Bold Red',
    description: '강렬한 레드+오렌지 — 매거진 감성',
    descriptionEn: 'Bold red-orange — magazine aesthetic',
    colors: ['#d4163c', '#ff6b35'],
    state: {
      values: {
        hero: { designPreset: 'magazine' },
      },
    },
  },
  {
    id: 'warm-earth',
    name: '내추럴 어스',
    nameEn: 'Natural Earth',
    description: '따뜻한 브라운 톤 + 크림 배경 — 자연스러운 감성',
    descriptionEn: 'Warm brown tones + cream background — natural feel',
    colors: ['#92400e', '#b45309'],
    state: {
      values: {
        hero: { designPreset: 'warm-earth' },
      },
    },
  },
  {
    id: 'midnight',
    name: '미드나잇',
    nameEn: 'Midnight',
    description: '다크 배경 + 인디고 악센트 — 모던 나이트 모드',
    descriptionEn: 'Dark background + indigo accent — modern night mode',
    colors: ['#818cf8', '#c084fc'],
    state: {
      values: {
        hero: { designPreset: 'midnight' },
      },
    },
  },
  {
    id: 'editorial',
    name: '모노 클래식',
    nameEn: 'Mono Classic',
    description: '모노톤 블랙 — 전문적이고 클래식한 스타일',
    descriptionEn: 'Monochrome black — professional classic style',
    colors: ['#1c1c1e', '#3a3a3c'],
    state: {
      values: {
        hero: { designPreset: 'editorial' },
      },
    },
  },
];
