import type { ModulePreset } from './personal-brand';

export const linkInBioProPresets: ModulePreset[] = [
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
    description: '오로라 배경 + 유리 카드 — 2025 트렌디 스타일',
    descriptionEn: 'Aurora background + glass cards — trendy 2025 style',
    state: {
      enabled: ['profile', 'links', 'socials', 'theme'],
      order: ['profile', 'links', 'socials', 'theme'],
      values: {
        theme: {
          bgStyle: 'aurora',
          cardStyle: 'glass',
          primaryColor: '#a78bfa',
          fontFamily: 'system',
        },
      },
    },
  },
  {
    id: 'neon-dark',
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
];
