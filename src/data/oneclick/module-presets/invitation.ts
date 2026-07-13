import type { ModulePreset } from './personal-brand';

// 프리셋 ID 6종은 저장된 상태 호환을 위해 불변 — 라벨/설명/색상 값만 프리미엄 팔레트로 갱신
// 2차 개편("라이트 & 에어리 럭셔리"): gradientFrom/To는 더 이상 풀블리드 배경이 아니라
// 히어로 상단의 저투명도 글로우 틴트 전용 값으로 재정의됨(라이트 톤).
// colors[]는 프리셋 피커의 식별용 스와치이므로 여전히 진한 accent/accentSolid 값을 사용해
// 픽커에서 프리셋들이 서로 뚜렷이 구분되도록 유지.
// (팔레트는 src/lib/oneclick/generators/invitation.ts의 INVITATION_PRESET_THEME과 3중 동기화됨)
export const invitationPresets: ModulePreset[] = [
  {
    id: 'elegant-gold',
    name: '엘레강트 골드',
    nameEn: 'Elegant Gold',
    description: '아이보리 캔버스에 앤티크 골드 포인트 — 여백이 많은 격식 있는 초대장',
    descriptionEn: 'Antique gold accents on an ivory canvas — a spacious, formal invitation',
    colors: ['#B8860B', '#8B6B1F'],
    state: {
      values: {
        hero: {
          designPreset: 'elegant-gold',
          gradientFrom: '#F3E8CF',
          gradientTo: '#FBF7F0',
          fontFamily: 'Nanum Myeongjo',
        },
      },
    },
  },
  {
    id: 'romantic-pink',
    name: '로맨틱 로즈',
    nameEn: 'Romantic Rose',
    description: '라이트 블러쉬 캔버스에 더스티 로즈 포인트 — 생일, 축하 파티의 감성 스타일',
    descriptionEn: 'Dusty rose accents on a light blush canvas — an emotional style for birthdays and celebrations',
    colors: ['#C08497', '#7C2036'],
    state: {
      values: {
        hero: {
          designPreset: 'romantic-pink',
          gradientFrom: '#F6E3E4',
          gradientTo: '#FBF4F3',
          fontFamily: 'Nanum Myeongjo',
        },
      },
    },
  },
  {
    id: 'modern-minimal',
    name: '모던 미니멀',
    nameEn: 'Modern Minimal',
    description: '오프화이트 캔버스 + 차콜·번트앰버 포인트 — 회사 행사, 모임에 어울리는 절제된 스타일',
    descriptionEn: 'Off-white canvas with charcoal and burnt-amber accents — a restrained style for corporate events and gatherings',
    colors: ['#3A3A38', '#A8551F'],
    state: {
      values: {
        hero: {
          designPreset: 'modern-minimal',
          gradientFrom: '#ECECEA',
          gradientTo: '#FAFAF9',
          fontFamily: 'Pretendard',
        },
      },
    },
  },
  {
    id: 'festive',
    name: '축제/파티',
    nameEn: 'Festive',
    description: '라이트 크림 캔버스에 아프리콧·테라코타 포인트 — 생일 파티, 축제의 활기찬 스타일',
    descriptionEn: 'Apricot and terracotta accents on a light cream canvas — a lively style for birthday parties and festivals',
    colors: ['#C8865C', '#8C3B2E'],
    state: {
      values: {
        hero: {
          designPreset: 'festive',
          gradientFrom: '#F6E5D5',
          gradientTo: '#FBF6EF',
          fontFamily: 'Pretendard',
        },
      },
    },
  },
  {
    id: 'natural-garden',
    name: '내추럴 가든',
    nameEn: 'Natural Garden',
    description: '연둣빛 캔버스에 자연 그린 포인트 — 야외 행사, 가든 파티의 보태니컬 스타일',
    descriptionEn: 'Natural green accents on a soft pale-green canvas — a botanical style for outdoor events and garden parties',
    colors: ['#5C8A4D', '#2D4A38'],
    state: {
      values: {
        hero: {
          designPreset: 'natural-garden',
          gradientFrom: '#E4F0DC',
          gradientTo: '#F7FBF4',
          fontFamily: 'Nanum Myeongjo',
        },
      },
    },
  },
  {
    id: 'minimal-glass',
    name: '미니멀 글래스',
    nameEn: 'Minimal Glass',
    description: '파스텔 라벤더·핑크 그래디언트 + 반투명 유리 카드 — 트렌디한 글래스모피즘 (히어로/D-day 한정)',
    descriptionEn: 'A pastel lavender-to-pink gradient with translucent glass accents — trendy glassmorphism (hero & D-day only)',
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
