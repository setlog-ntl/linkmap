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
  {
    id: 'warm-earth',
    name: '웜 어스',
    nameEn: 'Warm Earth',
    description: '따뜻한 어스톤 명함 — 자연스럽고 친근한 인상',
    descriptionEn: 'Warm earth tone card — natural and friendly impression',
    state: {
      enabled: ['profile', 'contact', 'socials', 'theme'],
      order: ['profile', 'contact', 'socials', 'theme'],
      values: {
        theme: { designPreset: 'warm-earth' },
      },
    },
  },
  {
    id: 'midnight',
    name: '미드나잇',
    nameEn: 'Midnight',
    description: '진한 다크 명함 — 세련된 나이트 모드',
    descriptionEn: 'Deep dark card — sophisticated night mode',
    state: {
      enabled: ['profile', 'contact', 'socials', 'theme'],
      order: ['profile', 'contact', 'socials', 'theme'],
      values: {
        theme: { designPreset: 'midnight' },
      },
    },
  },
];
