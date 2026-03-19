import type { ModulePreset } from './personal-brand';

export const freelancerPagePresets: ModulePreset[] = [
  {
    id: 'default',
    name: '선셋 오렌지',
    nameEn: 'Sunset Orange',
    description: '주황+노랑 그래디언트 — 에너지 넘치는 기본 스타일',
    descriptionEn: 'Orange-yellow gradient — energetic default style',
    colors: ['#ee5b2b', '#f59e0b'],
    state: {
      values: {
        hero: { designPreset: 'default' },
      },
    },
  },
  {
    id: 'agency',
    name: '에이전시 블루',
    nameEn: 'Agency Blue',
    description: '전문적인 블루 톤 — 에이전시 스타일',
    descriptionEn: 'Professional blue tone — agency style',
    colors: ['#2563eb', '#3b82f6'],
    state: {
      values: {
        hero: { designPreset: 'agency' },
      },
    },
  },
  {
    id: 'creative-minimal',
    name: '크리에이티브 모노',
    nameEn: 'Creative Mono',
    description: '모노톤 블랙 — 작업물 중심 미니멀 스타일',
    descriptionEn: 'Monochrome black — work-focused minimal style',
    colors: ['#18181b', '#52525b'],
    state: {
      values: {
        hero: { designPreset: 'creative-minimal' },
      },
    },
  },
  {
    id: 'warm-earth',
    name: '내추럴 어스',
    nameEn: 'Natural Earth',
    description: '따뜻한 브라운 톤 — 감성 포트폴리오',
    descriptionEn: 'Warm brown tones — emotional portfolio',
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
    description: '다크 배경 + 인디고 악센트 — 모던 크리에이터 무드',
    descriptionEn: 'Dark background + indigo accent — modern creator mood',
    colors: ['#818cf8', '#c084fc'],
    state: {
      values: {
        hero: { designPreset: 'midnight' },
      },
    },
  },
];
