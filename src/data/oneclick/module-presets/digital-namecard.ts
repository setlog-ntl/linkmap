import type { ModulePreset } from './personal-brand';

export const digitalNamecardPresets: ModulePreset[] = [
  {
    id: 'minimal',
    name: '미니멀',
    nameEn: 'Minimal',
    description: '프로필 + 연락처만 — 깔끔한 명함',
    descriptionEn: 'Profile + Contact only — clean card',
    state: {
      enabled: ['profile', 'contact', 'theme'],
      order: ['profile', 'contact', 'theme'],
    },
  },
  {
    id: 'pro',
    name: '프로',
    nameEn: 'Pro',
    description: '소셜 링크 + 테마 커스텀 포함 — 풀 명함',
    descriptionEn: 'With social links + custom theme — full card',
    state: {
      enabled: ['profile', 'contact', 'socials', 'theme'],
      order: ['profile', 'contact', 'socials', 'theme'],
    },
  },
];
