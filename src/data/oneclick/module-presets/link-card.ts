import type { ModulePreset } from './personal-brand';

export const linkCardPresets: ModulePreset[] = [
  {
    id: 'default',
    name: '클래식 라이트',
    nameEn: 'Classic Light',
    description: '밝은 배경 + 인디고 악센트 — 깔끔한 기본 스타일',
    descriptionEn: 'Light background + indigo accent — clean default style',
    colors: ['#6366f1', '#818cf8'],
    state: {
      values: {
        theme: {
          bgStyle: 'light',
          cardStyle: 'rounded',
          primaryColor: '#6366f1',
        },
      },
    },
  },
  {
    id: 'aurora',
    name: '오로라',
    nameEn: 'Aurora',
    description: '오로라 빛 배경 + 유리 카드 — 2025 트렌드',
    descriptionEn: 'Aurora glow background + glass cards — 2025 trend',
    colors: ['#818cf8', '#c084fc'],
    state: {
      values: {
        theme: {
          bgStyle: 'aurora',
          cardStyle: 'glass',
          primaryColor: '#818cf8',
        },
      },
    },
  },
  {
    id: 'neon',
    name: '네온 다크',
    nameEn: 'Neon Dark',
    description: '다크 배경 + 네온 카드 — 인디 크리에이터 스타일',
    descriptionEn: 'Dark background + neon cards — indie creator style',
    colors: ['#22d3ee', '#06b6d4'],
    state: {
      values: {
        theme: {
          bgStyle: 'dark',
          cardStyle: 'neon',
          primaryColor: '#22d3ee',
        },
      },
    },
  },
  {
    id: 'pastel',
    name: '파스텔 드림',
    nameEn: 'Pastel Dream',
    description: '연한 파스텔 배경 + 알약형 카드 — 부드러운 감성',
    descriptionEn: 'Soft pastel background + pill cards — gentle aesthetic',
    colors: ['#f9a8d4', '#fbcfe8'],
    state: {
      values: {
        theme: {
          bgStyle: 'gradient',
          cardStyle: 'pill',
          primaryColor: '#f9a8d4',
        },
      },
    },
  },
  {
    id: 'brutalist',
    name: '브루탈리스트',
    nameEn: 'Brutalist',
    description: '검정 배경 + 두꺼운 테두리 — 대담한 모노톤',
    descriptionEn: 'Black background + thick borders — bold monochrome',
    colors: ['#ffffff', '#a1a1aa'],
    state: {
      values: {
        theme: {
          bgStyle: 'dark',
          cardStyle: 'outline',
          primaryColor: '#ffffff',
        },
      },
    },
  },
];
