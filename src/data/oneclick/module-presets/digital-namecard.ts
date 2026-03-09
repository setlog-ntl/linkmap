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
        theme: { accentColor: '#d97706' },
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
        theme: { accentColor: '#1e1b4b' },
      },
    },
  },
  {
    id: 'corporate',
    name: '기업용',
    nameEn: 'Corporate',
    description: '네이비 블루 + 골드 악센트 — 비즈니스 미팅용',
    descriptionEn: 'Navy blue + gold accent — for business meetings',
    state: {
      enabled: ['profile', 'contact', 'socials', 'theme'],
      order: ['profile', 'contact', 'socials', 'theme'],
      values: {
        theme: { accentColor: '#1e3a5f' },
      },
    },
  },
  {
    id: 'creative',
    name: '크리에이티브',
    nameEn: 'Creative',
    description: '그래디언트 + 둥근 모서리 — 디자이너/아티스트용',
    descriptionEn: 'Gradient + rounded — for designers and artists',
    state: {
      enabled: ['profile', 'contact', 'socials', 'theme'],
      order: ['profile', 'contact', 'socials', 'theme'],
      values: {
        theme: { accentColor: '#8b5cf6' },
      },
    },
  },
  {
    id: 'minimal-dark',
    name: '미니멀 다크',
    nameEn: 'Minimal Dark',
    description: '다크 배경 + 흰 텍스트 — 모던 미니멀',
    descriptionEn: 'Dark background + white text — modern minimal',
    state: {
      enabled: ['profile', 'contact', 'theme'],
      order: ['profile', 'contact', 'theme'],
      values: {
        theme: { accentColor: '#e5e7eb' },
      },
    },
  },
];
