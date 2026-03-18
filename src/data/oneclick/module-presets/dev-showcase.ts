import type { ModulePreset } from './personal-brand';

export const devShowcasePresets: ModulePreset[] = [
  {
    id: 'simple',
    name: '심플',
    nameEn: 'Simple',
    description: '프로필 + 연락처 — 개발자 명함',
    descriptionEn: 'Profile + Contact — dev card',
    state: {
      enabled: ['hero', 'contact'],
      order: ['hero', 'contact'],
    },
  },
  {
    id: 'standard',
    name: '기본',
    nameEn: 'Standard',
    description: '소개 + 프로젝트 + 경력 — 추천 구성',
    descriptionEn: 'About + Projects + Experience — recommended',
    state: {
      enabled: ['hero', 'about', 'projects', 'experience', 'contact'],
      order: ['hero', 'about', 'projects', 'experience', 'contact'],
    },
  },
  {
    id: 'full',
    name: '전체',
    nameEn: 'Full',
    description: '블로그 포함 전체 — 완전한 쇼케이스',
    descriptionEn: 'All with blog — complete showcase',
    state: {
      enabled: ['hero', 'about', 'projects', 'experience', 'blog', 'contact'],
      order: ['hero', 'about', 'projects', 'experience', 'blog', 'contact'],
    },
  },
  {
    id: 'dark',
    name: '다크',
    nameEn: 'Dark',
    description: '전체 + 다크 톤 — 터미널 감성',
    descriptionEn: 'All + dark tone — terminal aesthetic',
    state: {
      enabled: ['hero', 'about', 'projects', 'experience', 'blog', 'contact'],
      order: ['hero', 'about', 'projects', 'experience', 'blog', 'contact'],
      values: {
        hero: { designPreset: 'midnight' },
      },
    },
  },
];
