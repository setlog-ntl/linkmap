import type { ModulePreset } from './personal-brand';

export const linkCardPresets: ModulePreset[] = [
  {
    id: 'minimal',
    name: '미니멀',
    nameEn: 'Minimal',
    description: '프로필 + 링크만 — 깔끔한 링크 페이지',
    descriptionEn: 'Profile + Links only — clean link page',
    state: {
      enabled: ['profile', 'links', 'theme'],
      order: ['profile', 'links', 'theme'],
    },
  },
  {
    id: 'social',
    name: '소셜',
    nameEn: 'Social',
    description: '소셜 바 포함 — SNS 통합 링크 허브',
    descriptionEn: 'With social bar — SNS integrated link hub',
    state: {
      enabled: ['profile', 'links', 'socials', 'theme'],
      order: ['profile', 'links', 'socials', 'theme'],
    },
  },
  {
    id: 'aurora',
    name: '오로라',
    nameEn: 'Aurora',
    description: '오로라 빛 배경 + 유리 카드 — 2025 감성 스타일',
    descriptionEn: 'Aurora glow background + glass cards — dreamy 2025 aesthetic',
    state: {
      enabled: ['profile', 'links', 'socials', 'theme'],
      order: ['profile', 'links', 'socials', 'theme'],
      values: {
        theme: {
          bgStyle: 'aurora',
          cardStyle: 'glass',
          primaryColor: '#818cf8',
          fontFamily: 'system',
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
    state: {
      enabled: ['profile', 'links', 'socials', 'theme'],
      order: ['profile', 'links', 'socials', 'theme'],
      values: {
        theme: {
          bgStyle: 'dark',
          cardStyle: 'neon',
          primaryColor: '#22d3ee',
          fontFamily: 'mono',
        },
      },
    },
  },
  {
    id: 'pastel',
    name: '파스텔 드림',
    nameEn: 'Pastel Dream',
    description: '연한 파스텔 배경 + pill 카드 + 부드러운 그림자',
    descriptionEn: 'Soft pastel background + pill cards + gentle shadow',
    state: {
      enabled: ['profile', 'links', 'socials', 'theme'],
      order: ['profile', 'links', 'socials', 'theme'],
      values: {
        theme: {
          bgStyle: 'gradient',
          cardStyle: 'pill',
          primaryColor: '#f9a8d4',
          fontFamily: 'system',
        },
      },
    },
  },
  {
    id: 'brutalist',
    name: '브루탈리스트',
    nameEn: 'Brutalist',
    description: '검정 배경 + 흰 텍스트 + 두꺼운 테두리 — 대담한 스타일',
    descriptionEn: 'Black background + white text + thick borders — bold style',
    state: {
      enabled: ['profile', 'links', 'socials', 'theme'],
      order: ['profile', 'links', 'socials', 'theme'],
      values: {
        theme: {
          bgStyle: 'dark',
          cardStyle: 'outline',
          primaryColor: '#ffffff',
          fontFamily: 'mono',
        },
      },
    },
  },
];
