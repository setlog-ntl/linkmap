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
  {
    id: 'warm-earth',
    name: '웜 어스',
    nameEn: 'Warm Earth',
    description: '따뜻한 어스톤 + 세리프 폰트 — 감성 포트폴리오',
    descriptionEn: 'Warm earth tones + serif font — emotional portfolio',
    state: {
      enabled: ['hero', 'services', 'portfolio', 'testimonials', 'contact'],
      order: ['hero', 'services', 'portfolio', 'testimonials', 'contact'],
      values: {
        hero: { designPreset: 'warm-earth' },
      },
    },
  },
  {
    id: 'midnight',
    name: '미드나잇',
    nameEn: 'Midnight',
    description: '진한 다크 + 인디고 악센트 — 모던 크리에이터 무드',
    descriptionEn: 'Deep dark + indigo accent — modern creator mood',
    state: {
      enabled: ['hero', 'services', 'portfolio', 'testimonials', 'process', 'contact'],
      order: ['hero', 'services', 'portfolio', 'testimonials', 'process', 'contact'],
      values: {
        hero: { designPreset: 'midnight' },
      },
    },
  },
  {
    id: 'agency',
    name: '에이전시',
    nameEn: 'Agency',
    description: '테이블 서비스 + 대형 인용문 — 전문 에이전시 스타일',
    descriptionEn: 'Table services + pull quotes — professional agency style',
    state: {
      enabled: ['hero', 'services', 'portfolio', 'testimonials', 'process', 'contact'],
      order: ['hero', 'services', 'portfolio', 'testimonials', 'process', 'contact'],
      values: {
        hero: { designPreset: 'agency' },
      },
    },
  },
  {
    id: 'creative-minimal',
    name: '크리에이티브 미니멀',
    nameEn: 'Creative Minimal',
    description: '히어로 + 포트폴리오 + 연락처만 — 작업물 중심',
    descriptionEn: 'Hero + Portfolio + Contact only — work-focused',
    state: {
      enabled: ['hero', 'portfolio', 'contact'],
      order: ['hero', 'portfolio', 'contact'],
      values: {
        hero: { designPreset: 'creative-minimal' },
      },
    },
  },
];
