import type { ModulePreset } from './personal-brand';

export const freelancerPagePresets: ModulePreset[] = [
  {
    id: 'minimal',
    name: '미니멀',
    nameEn: 'Minimal',
    description: 'Hero + 연락처만 — 심플 명함 스타일',
    descriptionEn: 'Hero + Contact only — simple business card',
    state: {
      enabled: ['hero', 'contact'],
      order: ['hero', 'contact'],
    },
  },
  {
    id: 'portfolio',
    name: '포트폴리오',
    nameEn: 'Portfolio',
    description: 'Hero + 서비스 + 포트폴리오 + 연락처 — 핵심 포트폴리오',
    descriptionEn: 'Hero + Services + Portfolio + Contact — core portfolio',
    state: {
      enabled: ['hero', 'services', 'portfolio', 'contact'],
      order: ['hero', 'services', 'portfolio', 'contact'],
    },
  },
  {
    id: 'full',
    name: '전체',
    nameEn: 'Full',
    description: '모든 모듈 활성화 — 완전한 프리랜서 페이지',
    descriptionEn: 'All modules enabled — complete freelancer page',
    state: {
      enabled: ['hero', 'services', 'portfolio', 'testimonials', 'process', 'contact'],
      order: ['hero', 'services', 'portfolio', 'testimonials', 'process', 'contact'],
    },
  },
];
