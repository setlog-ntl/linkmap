import type { ModulePreset } from './personal-brand';

export const smallBizCafePresets: ModulePreset[] = [
  {
    id: 'default',
    name: '카페 기본',
    nameEn: 'Cafe Default',
    description: '따뜻한 브라운 톤 — 카페 기본 스타일',
    descriptionEn: 'Warm brown tone — default cafe style',
    colors: ['#8b6914', '#d4a853'],
    state: {
      values: {
        hero: { designPreset: 'default' },
      },
    },
  },
  {
    id: 'modern-minimal',
    name: '모던 미니멀',
    nameEn: 'Modern Minimal',
    description: '깔끔한 모노톤 — 세련된 카페 느낌',
    descriptionEn: 'Clean monochrome — sophisticated cafe feel',
    colors: ['#18181b', '#52525b'],
    state: {
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
    description: '따뜻한 어스톤 — 로스터리 카페에 딱 맞는 감성',
    descriptionEn: 'Warm earth tones — perfect for roastery cafes',
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
    description: '다크 + 인디고 악센트 — 야간 무드 카페',
    descriptionEn: 'Dark + indigo accent — night mood cafe',
    colors: ['#818cf8', '#c084fc'],
    state: {
      values: {
        hero: { designPreset: 'midnight' },
      },
    },
  },
];
