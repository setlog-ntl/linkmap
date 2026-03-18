import type { ModulePreset } from './personal-brand';

export const digitalNamecardPresets: ModulePreset[] = [
  {
    id: 'basic',
    name: '기본',
    nameEn: 'Basic',
    description: '프로필 + 연락처 — 깔끔한 디지털 명함',
    descriptionEn: 'Profile + Contact — clean digital namecard',
    state: {
      enabled: ['profile', 'contact', 'theme'],
      order: ['profile', 'contact', 'theme'],
    },
  },
  {
    id: 'extended',
    name: '확장',
    nameEn: 'Extended',
    description: '소셜 링크 + 테마 커스텀 포함 — 풀 명함',
    descriptionEn: 'With social links + custom theme — full card',
    state: {
      enabled: ['profile', 'contact', 'socials', 'theme'],
      order: ['profile', 'contact', 'socials', 'theme'],
    },
  },
];
