import type { ModulePreset } from './personal-brand';

export const smallBizPresets: ModulePreset[] = [
  {
    id: 'default',
    name: '기본 골드',
    nameEn: 'Default Gold',
    description: '따뜻한 골드 톤 — 요리주점/레스토랑 기본 스타일',
    descriptionEn: 'Warm gold tone — default izakaya/restaurant style',
    colors: ['#c8a97e', '#d4a853'],
    state: {
      values: {
        hero: { designPreset: 'default' },
      },
    },
  },
  {
    id: 'dark-gold',
    name: '다크 골드',
    nameEn: 'Dark Gold',
    description: '다크 배경 + 골드 악센트 — 프리미엄 무드',
    descriptionEn: 'Dark background + gold accent — premium mood',
    colors: ['#c8a97e', '#1a1a1a'],
    state: {
      values: {
        hero: { primaryColor: '#c8a97e', fontFamily: 'Nanum Myeongjo', designPreset: 'default' },
      },
    },
  },
  {
    id: 'warm-serif',
    name: '따뜻한 세리프',
    nameEn: 'Warm Serif',
    description: '세리프 폰트 + 따뜻한 톤 — 고급 레스토랑 감성',
    descriptionEn: 'Serif font + warm tones — premium dining aesthetic',
    colors: ['#92400e', '#b45309'],
    state: {
      values: {
        hero: { fontFamily: 'Nanum Myeongjo', designPreset: 'warm-serif' },
      },
    },
  },
  {
    id: 'warm-earth',
    name: '내추럴 어스',
    nameEn: 'Natural Earth',
    description: '따뜻한 어스톤 배경 — 자연스러운 감성',
    descriptionEn: 'Warm earth tone background — natural feel',
    colors: ['#92400e', '#fef3c7'],
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
    description: '다크 + 인디고 악센트 — 세련된 바/레스토랑 무드',
    descriptionEn: 'Dark + indigo accent — sophisticated bar/restaurant mood',
    colors: ['#818cf8', '#c084fc'],
    state: {
      values: {
        hero: { designPreset: 'midnight' },
      },
    },
  },
];
