import type { ModulePreset } from './personal-brand';

export const digitalNamecardPresets: ModulePreset[] = [
  {
    id: 'simple',
    name: '심플',
    nameEn: 'Simple',
    description: '프로필 + 연락처 — 깔끔한 명함',
    descriptionEn: 'Profile + Contact — clean card',
    state: {
      enabled: ['profile', 'contact', 'theme'],
      order: ['profile', 'contact', 'theme'],
    },
  },
  {
    id: 'standard',
    name: '기본',
    nameEn: 'Standard',
    description: '소셜 링크 포함 — 추천 구성',
    descriptionEn: 'With social links — recommended',
    state: {
      enabled: ['profile', 'contact', 'socials', 'theme'],
      order: ['profile', 'contact', 'socials', 'theme'],
    },
  },
  {
    id: 'full',
    name: '전체',
    nameEn: 'Full',
    description: '모든 항목 활성화 — 풀 명함',
    descriptionEn: 'All items enabled — full card',
    state: {
      enabled: ['profile', 'contact', 'socials', 'theme'],
      order: ['profile', 'contact', 'socials', 'theme'],
    },
  },
  {
    id: 'dark',
    name: '다크',
    nameEn: 'Dark',
    description: '전체 + 다크 톤 — 세련된 나이트 모드',
    descriptionEn: 'All + dark tone — sophisticated night mode',
    state: {
      enabled: ['profile', 'contact', 'socials', 'theme'],
      order: ['profile', 'contact', 'socials', 'theme'],
      values: {
        theme: { accentColor: '#1e1b4b' },
      },
    },
  },
];
