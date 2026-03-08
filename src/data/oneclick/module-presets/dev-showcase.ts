import type { ModulePreset } from './personal-brand';

export const devShowcasePresets: ModulePreset[] = [
  {
    id: 'minimal',
    name: '미니멀',
    nameEn: 'Minimal',
    description: 'Hero + 연락처만 — 깔끔한 개발자 명함',
    descriptionEn: 'Hero + Contact only — clean dev card',
    state: {
      enabled: ['hero', 'contact'],
      order: ['hero', 'contact'],
    },
  },
  {
    id: 'portfolio',
    name: '포트폴리오',
    nameEn: 'Portfolio',
    description: '소개 + 프로젝트 + 경력 — 개발자 포트폴리오',
    descriptionEn: 'About + Projects + Experience — dev portfolio',
    state: {
      enabled: ['hero', 'about', 'projects', 'experience', 'contact'],
      order: ['hero', 'about', 'projects', 'experience', 'contact'],
    },
  },
  {
    id: 'full',
    name: '풀 프로필',
    nameEn: 'Full Profile',
    description: '모든 모듈 활성화 — 블로그 포함 완전한 쇼케이스',
    descriptionEn: 'All modules enabled — complete showcase with blog',
    state: {
      enabled: ['hero', 'about', 'projects', 'experience', 'blog', 'contact'],
      order: ['hero', 'about', 'projects', 'experience', 'blog', 'contact'],
    },
  },
  {
    id: 'warm-earth',
    name: '웜 어스',
    nameEn: 'Warm Earth',
    description: '따뜻한 어스톤 배경 — 차분한 개발자 포트폴리오',
    descriptionEn: 'Warm earth tones — calm developer portfolio',
    state: {
      enabled: ['hero', 'about', 'projects', 'experience', 'contact'],
      order: ['hero', 'about', 'projects', 'experience', 'contact'],
      values: {
        hero: { designPreset: 'warm-earth' },
      },
    },
  },
  {
    id: 'midnight',
    name: '미드나잇',
    nameEn: 'Midnight',
    description: '진한 다크 + 인디고 악센트 — 몰입감 있는 터미널 무드',
    descriptionEn: 'Deep dark + indigo accent — immersive terminal mood',
    state: {
      enabled: ['hero', 'about', 'projects', 'experience', 'blog', 'contact'],
      order: ['hero', 'about', 'projects', 'experience', 'blog', 'contact'],
      values: {
        hero: { designPreset: 'midnight' },
      },
    },
  },
  {
    id: 'terminal',
    name: '터미널',
    nameEn: 'Terminal',
    description: '터미널 히어로 + GitHub 카드 — 해커 감성',
    descriptionEn: 'Terminal hero + GitHub cards — hacker aesthetic',
    state: {
      enabled: ['hero', 'about', 'projects', 'experience', 'contact'],
      order: ['hero', 'about', 'projects', 'experience', 'contact'],
      values: {
        hero: { designPreset: 'github-dark' },
      },
    },
  },
  {
    id: 'portfolio-focus',
    name: '포트폴리오 중심',
    nameEn: 'Portfolio Focus',
    description: '프로젝트 + 블로그 강조 — 기술 블로거',
    descriptionEn: 'Projects + Blog highlighted — tech blogger',
    state: {
      enabled: ['hero', 'projects', 'blog', 'contact'],
      order: ['hero', 'projects', 'blog', 'contact'],
    },
  },
];
