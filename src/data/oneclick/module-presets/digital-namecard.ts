import type { ModulePreset } from './personal-brand';

export const digitalNamecardPresets: ModulePreset[] = [
  {
    id: 'default-blue',
    name: '클래식 블루',
    nameEn: 'Classic Blue',
    description: '기본 파란색 — 깔끔하고 신뢰감 있는 명함',
    descriptionEn: 'Default blue — clean and trustworthy card',
    colors: ['#3b82f6', '#60a5fa'],
    state: {
      values: {
        theme: { accentColor: '#3b82f6' },
      },
    },
  },
  {
    id: 'warm-earth',
    name: '내추럴 어스',
    nameEn: 'Natural Earth',
    description: '따뜻한 어스톤 — 자연스럽고 친근한 인상',
    descriptionEn: 'Warm earth tone — natural and friendly impression',
    colors: ['#d97706', '#f59e0b'],
    state: {
      values: {
        theme: { accentColor: '#d97706' },
      },
    },
  },
  {
    id: 'midnight',
    name: '미드나잇 인디고',
    nameEn: 'Midnight Indigo',
    description: '진한 인디고 — 세련된 나이트 무드',
    descriptionEn: 'Deep indigo — sophisticated night mood',
    colors: ['#1e1b4b', '#312e81'],
    state: {
      values: {
        theme: { accentColor: '#1e1b4b' },
      },
    },
  },
  {
    id: 'corporate',
    name: '비즈니스 네이비',
    nameEn: 'Business Navy',
    description: '네이비 블루 — 비즈니스 미팅에 최적화',
    descriptionEn: 'Navy blue — optimized for business meetings',
    colors: ['#1e3a5f', '#2563eb'],
    state: {
      values: {
        theme: { accentColor: '#1e3a5f' },
      },
    },
  },
  {
    id: 'creative',
    name: '크리에이티브 퍼플',
    nameEn: 'Creative Purple',
    description: '보라색 그래디언트 — 디자이너/아티스트용',
    descriptionEn: 'Purple gradient — for designers and artists',
    colors: ['#8b5cf6', '#a78bfa'],
    state: {
      values: {
        theme: { accentColor: '#8b5cf6' },
      },
    },
  },
];
