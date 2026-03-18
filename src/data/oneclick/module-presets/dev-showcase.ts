import type { ModulePreset } from './personal-brand';

export const devShowcasePresets: ModulePreset[] = [
  {
    id: 'basic',
    name: '기본',
    nameEn: 'Basic',
    description: 'Hero + 소개 + 프로젝트 + 연락처 — 핵심 포트폴리오',
    descriptionEn: 'Hero + About + Projects + Contact — core portfolio',
    state: {
      enabled: ['hero', 'about', 'projects', 'contact'],
      order: ['hero', 'about', 'projects', 'contact'],
      values: {
        hero: { designPreset: 'github-dark' },
      },
    },
  },
  {
    id: 'extended',
    name: '확장',
    nameEn: 'Extended',
    description: '모든 모듈 활성화 — 경력, 블로그 포함 완전한 쇼케이스',
    descriptionEn: 'All modules enabled — complete showcase with experience and blog',
    state: {
      enabled: ['hero', 'about', 'projects', 'experience', 'blog', 'contact'],
      order: ['hero', 'about', 'projects', 'experience', 'blog', 'contact'],
      values: {
        hero: { designPreset: 'github-dark' },
      },
    },
  },
];
