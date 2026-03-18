import type { ModulePreset } from './personal-brand';

export const linkCardPresets: ModulePreset[] = [
  {
    id: 'basic',
    name: '기본',
    nameEn: 'Basic',
    description: '프로필 + 링크만 — 깔끔한 링크 페이지',
    descriptionEn: 'Profile + Links only — clean link page',
    state: {
      enabled: ['profile', 'links', 'theme'],
      order: ['profile', 'links', 'theme'],
    },
  },
  {
    id: 'extended',
    name: '확장',
    nameEn: 'Extended',
    description: '소셜 바 포함 — SNS 통합 링크 허브',
    descriptionEn: 'With social bar — SNS integrated link hub',
    state: {
      enabled: ['profile', 'links', 'socials', 'theme'],
      order: ['profile', 'links', 'socials', 'theme'],
    },
  },
];
