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
];
