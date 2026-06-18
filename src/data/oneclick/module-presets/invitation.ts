import type { ModulePreset } from './personal-brand';

export const invitationPresets: ModulePreset[] = [
  {
    id: 'elegant-gold',
    name: '엘레강트 골드',
    nameEn: 'Elegant Gold',
    description: '우아한 골드 톤 — 격식 있는 초대장에 어울리는 클래식 스타일',
    descriptionEn: 'Elegant gold tone — classic style for formal invitations',
    colors: ['#b8860b', '#d4a853'],
    state: {
      values: {
        hero: {
          designPreset: 'elegant-gold',
          gradientFrom: '#b8860b',
          gradientTo: '#d4a853',
          fontFamily: 'Nanum Myeongjo',
        },
      },
    },
  },
  {
    id: 'romantic-pink',
    name: '로맨틱 핑크',
    nameEn: 'Romantic Pink',
    description: '부드러운 핑크 톤 — 생일, 축하 파티에 어울리는 감성 스타일',
    descriptionEn: 'Soft pink tone — emotional style for birthdays and celebrations',
    colors: ['#e8a0bf', '#f5d0e0'],
    state: {
      values: {
        hero: {
          designPreset: 'romantic-pink',
          gradientFrom: '#e8a0bf',
          gradientTo: '#f5d0e0',
          fontFamily: 'Nanum Myeongjo',
        },
      },
    },
  },
  {
    id: 'modern-minimal',
    name: '모던 미니멀',
    nameEn: 'Modern Minimal',
    description: '깔끔한 모노톤 — 회사 행사, 모임에 어울리는 심플 스타일',
    descriptionEn: 'Clean monochrome — simple style for corporate events and gatherings',
    colors: ['#1a1a1a', '#555555'],
    state: {
      values: {
        hero: {
          designPreset: 'modern-minimal',
          gradientFrom: '#1a1a1a',
          gradientTo: '#555555',
          fontFamily: 'Pretendard',
        },
      },
    },
  },
  {
    id: 'festive',
    name: '축제/파티',
    nameEn: 'Festive',
    description: '화려한 컬러풀 톤 — 생일 파티, 축제에 어울리는 활기찬 스타일',
    descriptionEn: 'Colorful tone — vibrant style for birthday parties and festivals',
    colors: ['#ff6b6b', '#ffd93d'],
    state: {
      values: {
        hero: {
          designPreset: 'festive',
          gradientFrom: '#ff6b6b',
          gradientTo: '#ffd93d',
          fontFamily: 'Gmarket Sans',
        },
      },
    },
  },
  {
    id: 'natural-garden',
    name: '내추럴 가든',
    nameEn: 'Natural Garden',
    description: '자연 감성 그린 — 야외 행사, 가든 파티에 어울리는 보태니컬 스타일',
    descriptionEn: 'Natural green — botanical style for outdoor events and garden parties',
    colors: ['#5c8a4d', '#8fbc8f'],
    state: {
      values: {
        hero: {
          designPreset: 'natural-garden',
          gradientFrom: '#5c8a4d',
          gradientTo: '#8fbc8f',
          fontFamily: 'Nanum Myeongjo',
        },
      },
    },
  },
  {
    id: 'minimal-glass',
    name: '미니멀 글래스',
    nameEn: 'Minimal Glass',
    description: '반투명 유리 카드 + 부드러운 그래디언트 — 트렌디한 글래스모피즘',
    descriptionEn: 'Translucent glass cards on a soft gradient — trendy glassmorphism',
    colors: ['#a78bfa', '#f9a8d4'],
    state: {
      values: {
        hero: {
          designPreset: 'minimal-glass',
          gradientFrom: '#a78bfa',
          gradientTo: '#f9a8d4',
          fontFamily: 'Pretendard',
        },
      },
    },
  },
];
