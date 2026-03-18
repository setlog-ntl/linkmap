import type { ModulePreset } from './personal-brand';

export const freelancerPagePresets: ModulePreset[] = [
  {
    id: 'basic',
    name: '기본',
    nameEn: 'Basic',
    description: 'Hero + 서비스 + 연락처 — 심플 프리랜서 페이지',
    descriptionEn: 'Hero + Services + Contact — simple freelancer page',
    state: {
      enabled: ['hero', 'services', 'contact'],
      order: ['hero', 'services', 'contact'],
      values: {
        hero: { designPreset: 'default' },
      },
    },
  },
  {
    id: 'extended',
    name: '확장',
    nameEn: 'Extended',
    description: '모든 모듈 활성화 — 포트폴리오, 후기, 진행방식 포함',
    descriptionEn: 'All modules enabled — portfolio, testimonials, process included',
    state: {
      enabled: ['hero', 'services', 'portfolio', 'testimonials', 'process', 'contact'],
      order: ['hero', 'services', 'portfolio', 'testimonials', 'process', 'contact'],
      values: {
        hero: { designPreset: 'default' },
      },
    },
  },
];
