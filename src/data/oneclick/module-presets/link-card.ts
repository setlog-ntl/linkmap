import type { ModulePreset } from './personal-brand';

export const linkCardPresets: ModulePreset[] = [
  {
    id: 'simple',
    name: '심플',
    nameEn: 'Simple',
    description: '프로필 + 링크만 — 깔끔한 링크 페이지',
    descriptionEn: 'Profile + Links only — clean link page',
    state: {
      enabled: ['profile', 'links', 'theme'],
      order: ['profile', 'links', 'theme'],
    },
  },
  {
    id: 'standard',
    name: '기본',
    nameEn: 'Standard',
    description: '소셜 바 포함 — 추천 구성',
    descriptionEn: 'With social bar — recommended',
    state: {
      enabled: ['profile', 'links', 'socials', 'theme'],
      order: ['profile', 'links', 'socials', 'theme'],
    },
  },
  {
    id: 'full',
    name: '전체',
    nameEn: 'Full',
    description: '모든 항목 활성화 — SNS 통합 허브',
    descriptionEn: 'All items enabled — SNS integrated hub',
    state: {
      enabled: ['profile', 'links', 'socials', 'theme'],
      order: ['profile', 'links', 'socials', 'theme'],
    },
  },
  {
    id: 'dark',
    name: '다크',
    nameEn: 'Dark',
    description: '전체 + 네온 다크 — 인디 크리에이터 스타일',
    descriptionEn: 'All + neon dark — indie creator style',
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
