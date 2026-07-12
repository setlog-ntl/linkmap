import type { ModulePreset } from './personal-brand';

// 프리셋 ID 6종은 저장된 상태 호환을 위해 불변 — 라벨/설명/색상 값만 프리미엄 팔레트로 갱신
// (팔레트는 src/lib/oneclick/generators/invitation.ts의 INVITATION_PRESET_THEME과 3중 동기화됨)
export const invitationPresets: ModulePreset[] = [
  {
    id: 'elegant-gold',
    name: '엘레강트 골드',
    nameEn: 'Elegant Gold',
    description: '앤티크 골드 톤 — 격식 있는 초대장에 어울리는 클래식 스타일',
    descriptionEn: 'Antique gold tone — classic style for formal invitations',
    colors: ['#B8860B', '#8B6B1F'],
    state: {
      values: {
        hero: {
          designPreset: 'elegant-gold',
          gradientFrom: '#B8860B',
          gradientTo: '#8B6B1F',
          fontFamily: 'Nanum Myeongjo',
        },
      },
    },
  },
  {
    id: 'romantic-pink',
    name: '로맨틱 로즈',
    nameEn: 'Romantic Rose',
    description: '더스티 로즈 톤 — 생일, 축하 파티에 어울리는 감성 스타일',
    descriptionEn: 'Dusty rose tone — emotional style for birthdays and celebrations',
    colors: ['#C08497', '#8C4E5F'],
    state: {
      values: {
        hero: {
          designPreset: 'romantic-pink',
          gradientFrom: '#C08497',
          gradientTo: '#8C4E5F',
          fontFamily: 'Nanum Myeongjo',
        },
      },
    },
  },
  {
    id: 'modern-minimal',
    name: '모던 미니멀',
    nameEn: 'Modern Minimal',
    description: '차콜 모노톤 + 번트앰버 포인트 — 회사 행사, 모임에 어울리는 심플 스타일',
    descriptionEn: 'Charcoal monochrome with a burnt-amber accent — simple style for corporate events and gatherings',
    colors: ['#3A3A38', '#16171A'],
    state: {
      values: {
        hero: {
          designPreset: 'modern-minimal',
          gradientFrom: '#3A3A38',
          gradientTo: '#16171A',
          fontFamily: 'Pretendard',
        },
      },
    },
  },
  {
    id: 'festive',
    name: '축제/파티',
    nameEn: 'Festive',
    description: '아프리콧 · 테라코타 웜톤 — 생일 파티, 축제에 어울리는 활기찬 스타일',
    descriptionEn: 'Apricot and terracotta warm tones — vibrant style for birthday parties and festivals',
    colors: ['#C8865C', '#8C3B2E'],
    state: {
      values: {
        hero: {
          designPreset: 'festive',
          gradientFrom: '#C8865C',
          gradientTo: '#8C3B2E',
          fontFamily: 'Pretendard',
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
    colors: ['#5C8A4D', '#2D4A38'],
    state: {
      values: {
        hero: {
          designPreset: 'natural-garden',
          gradientFrom: '#5C8A4D',
          gradientTo: '#2D4A38',
          fontFamily: 'Nanum Myeongjo',
        },
      },
    },
  },
  {
    id: 'minimal-glass',
    name: '미니멀 글래스',
    nameEn: 'Minimal Glass',
    description: '반투명 유리 카드 + 부드러운 그래디언트 — 트렌디한 글래스모피즘 (히어로/D-day 한정)',
    descriptionEn: 'Translucent glass accents on a soft gradient — trendy glassmorphism (hero & D-day only)',
    colors: ['#A78BFA', '#F9A8D4'],
    state: {
      values: {
        hero: {
          designPreset: 'minimal-glass',
          gradientFrom: '#A78BFA',
          gradientTo: '#F9A8D4',
          fontFamily: 'Pretendard',
        },
      },
    },
  },
];
