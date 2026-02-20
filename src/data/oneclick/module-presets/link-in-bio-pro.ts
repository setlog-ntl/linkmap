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
];
