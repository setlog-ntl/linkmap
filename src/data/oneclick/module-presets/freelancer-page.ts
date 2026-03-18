import type { ModulePreset } from './personal-brand';

export const freelancerPagePresets: ModulePreset[] = [
  {
    id: 'simple',
    name: '심플',
    nameEn: 'Simple',
    description: '프로필 + 연락처 — 심플 명함',
    descriptionEn: 'Profile + Contact — simple card',
    state: {
      enabled: ['hero', 'contact'],
      order: ['hero', 'contact'],
    },
  },
  {
    id: 'standard',
    name: '기본',
    nameEn: 'Standard',
    description: '서비스 + 포트폴리오 — 추천 구성',
    descriptionEn: 'Services + Portfolio — recommended',
    state: {
      enabled: ['hero', 'services', 'portfolio', 'contact'],
      order: ['hero', 'services', 'portfolio', 'contact'],
    },
  },
  {
    id: 'full',
    name: '전체',
    nameEn: 'Full',
    description: '후기 + 프로세스 포함 — 완전한 페이지',
    descriptionEn: 'With testimonials + process — complete page',
    state: {
      enabled: ['hero', 'services', 'portfolio', 'testimonials', 'process', 'contact'],
      order: ['hero', 'services', 'portfolio', 'testimonials', 'process', 'contact'],
    },
  },
  {
    id: 'dark',
    name: '다크',
    nameEn: 'Dark',
    description: '전체 + 다크 톤 — 모던 크리에이터 무드',
    descriptionEn: 'All + dark tone — modern creator mood',
    state: {
      enabled: ['hero', 'services', 'portfolio', 'testimonials', 'process', 'contact'],
      order: ['hero', 'services', 'portfolio', 'testimonials', 'process', 'contact'],
      values: {
        hero: { designPreset: 'midnight' },
      },
    },
  },
];
