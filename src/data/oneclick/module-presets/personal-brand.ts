import type { ModuleConfigState } from '@/lib/module-schema';

export interface ModulePreset {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  state: Partial<ModuleConfigState>;
  /** 대표 색상 (UI 색상 스와치 표시용) */
  colors?: [string, string];
}

/**
 * Personal Brand 템플릿 색상 프리셋
 *
 * 구조:
 * - state.values.hero.designPreset  → base.ts CSS 규칙 매핑 (배경색 등 결정)
 * - state.values.hero.gradientFrom/To → 히어로 그래디언트 오버라이드
 * - colors[]                         → UI 스와치 표시용 (실제 렌더와 일치)
 *
 * 라이트 6개 + 다크 2개 + 중성/전문적 2개 = 총 10개
 * 2025-2026 트렌드: 피치, 모카, 세이지, 소프트퍼플, 코랄, 네이비+골드
 */
export const personalBrandPresets: ModulePreset[] = [
  {
    // ────────────────────────────────────────────────────────────
    // 1. 피치 골든 (기본) — 에너지 + 접근성
    //    creator preset → 밝은 배경 유지
    //    따뜻한 오렌지→골든 그래디언트, 바이브코더·유튜버에 최적
    // ────────────────────────────────────────────────────────────
    id: 'creator-warm',
    name: '피치 골든',
    nameEn: 'Peach Golden',
    description: '따뜻한 피치-골드 그래디언트 — 에너지 넘치는 크리에이터 기본',
    descriptionEn: 'Warm peach-to-gold gradient — energetic creator default',
    colors: ['#f97316', '#fbbf24'],
    state: {
      values: {
        hero: {
          designPreset: 'creator',
          gradientFrom: '#f97316',
          gradientTo: '#fbbf24',
        },
      },
    },
  },
  {
    // ────────────────────────────────────────────────────────────
    // 2. 모카 무스 — Pantone COTY 2025 Mocha Mousse
    //    warm-earth preset → --bg: #fefce8 크림 배경 활성화
    //    1인 창업자, 컨설턴트, 라이프스타일 브랜드에 최적
    // ────────────────────────────────────────────────────────────
    id: 'mocha-mousse',
    name: '모카 무스',
    nameEn: 'Mocha Mousse',
    description: '2025 판톤 올해의 색 — 따뜻한 브라운 크림으로 차분하게',
    descriptionEn: 'Pantone COTY 2025 — warm brown cream for calm authority',
    colors: ['#9b7968', '#c4956a'],
    state: {
      values: {
        hero: {
          designPreset: 'warm-earth',
          gradientFrom: '#9b7968',
          gradientTo: '#c4956a',
        },
      },
    },
  },
  {
    // ────────────────────────────────────────────────────────────
    // 3. 세이지 모닝 — 2025-2026 자연 영감 트렌드
    //    storyteller preset 재활용 (밝은 배경)
    //    색상만 세이지-민트로 오버라이드
    //    웰니스 코치, 작가, 요가 강사에 최적
    // ────────────────────────────────────────────────────────────
    id: 'sage-morning',
    name: '세이지 모닝',
    nameEn: 'Sage Morning',
    description: '자연에서 온 세이지 그린 — 차분하고 신뢰감 있는 감성',
    descriptionEn: 'Nature-inspired sage green — calm and trustworthy presence',
    colors: ['#6b9e7e', '#a8c4a2'],
    state: {
      values: {
        hero: {
          designPreset: 'storyteller',
          gradientFrom: '#6b9e7e',
          gradientTo: '#a8c4a2',
        },
      },
    },
  },
  {
    // ────────────────────────────────────────────────────────────
    // 4. 라벤더 드림 — 소프트 퍼플, 2026 파스텔 트렌드
    //    storyteller preset (인디고-퍼플 계열이라 자연스러운 매핑)
    //    디자이너, 일러스트레이터, 아티스트에 최적
    // ────────────────────────────────────────────────────────────
    id: 'lavender-dream',
    name: '라벤더 드림',
    nameEn: 'Lavender Dream',
    description: '소프트 퍼플-라벤더 그래디언트 — 크리에이티브한 아티스트 감성',
    descriptionEn: 'Soft purple-lavender gradient — dreamy creative energy',
    colors: ['#8b5cf6', '#c084fc'],
    state: {
      values: {
        hero: {
          designPreset: 'storyteller',
          gradientFrom: '#8b5cf6',
          gradientTo: '#c084fc',
        },
      },
    },
  },
  {
    // ────────────────────────────────────────────────────────────
    // 5. 코랄 선셋 — 에너지+열정, 2025 코랄 트렌드
    //    magazine preset → 레드 계열 CSS 규칙 매핑
    //    패션, 뷰티, 강사, 마케터에 최적
    // ────────────────────────────────────────────────────────────
    id: 'coral-sunset',
    name: '코랄 선셋',
    nameEn: 'Coral Sunset',
    description: '코랄-피치 그래디언트 — 열정적이고 생동감 있는 스타일',
    descriptionEn: 'Coral-to-peach gradient — passionate and vibrant energy',
    colors: ['#f43f5e', '#fb923c'],
    state: {
      values: {
        hero: {
          designPreset: 'magazine',
          gradientFrom: '#f43f5e',
          gradientTo: '#fb923c',
        },
      },
    },
  },
  {
    // ────────────────────────────────────────────────────────────
    // 6. 오션 딥 — 신뢰+전문성, 2025 블루 리바이벌
    //    creator preset (밝은 배경 유지) + 딥블루 오버라이드
    //    개발자, 테크 프리랜서, SaaS 창업자에 최적
    // ────────────────────────────────────────────────────────────
    id: 'ocean-deep',
    name: '오션 딥',
    nameEn: 'Ocean Deep',
    description: '딥 블루-스카이 그래디언트 — 신뢰감 있는 테크 전문가 스타일',
    descriptionEn: 'Deep blue-to-sky gradient — trustworthy tech professional',
    colors: ['#0369a1', '#0ea5e9'],
    state: {
      values: {
        hero: {
          designPreset: 'creator',
          gradientFrom: '#0369a1',
          gradientTo: '#0ea5e9',
        },
      },
    },
  },
  {
    // ────────────────────────────────────────────────────────────
    // 7. 네이비 골드 — 고급감+권위, 클래식 프리미엄 조합
    //    editorial preset (모노 CSS 기반) + 네이비→골드 오버라이드
    //    비즈니스 컨설턴트, 금융, 법률, 코치에 최적
    // ────────────────────────────────────────────────────────────
    id: 'navy-gold',
    name: '네이비 골드',
    nameEn: 'Navy Gold',
    description: '네이비-골드 그래디언트 — 고급스럽고 권위 있는 프리미엄 감성',
    descriptionEn: 'Navy-to-gold gradient — luxurious and authoritative premium style',
    colors: ['#1e3a5f', '#d4a853'],
    state: {
      values: {
        hero: {
          designPreset: 'editorial',
          gradientFrom: '#1e3a5f',
          gradientTo: '#d4a853',
        },
      },
    },
  },
  {
    // ────────────────────────────────────────────────────────────
    // 8. 미드나잇 퍼플 — 다크, 고급스러운 나이트 무드
    //    midnight preset → --bg: #0f0f0f 다크 배경 활성화
    //    인디 크리에이터, 뮤지션, 포토그래퍼에 최적
    // ────────────────────────────────────────────────────────────
    id: 'midnight-purple',
    name: '미드나잇',
    nameEn: 'Midnight Purple',
    description: '다크 배경 + 인디고-퍼플 — 고급스러운 나이트 무드',
    descriptionEn: 'Dark background + indigo-purple — premium night mood',
    colors: ['#818cf8', '#c084fc'],
    state: {
      values: {
        hero: {
          designPreset: 'midnight',
          gradientFrom: '#818cf8',
          gradientTo: '#c084fc',
        },
      },
    },
  },
  {
    // ────────────────────────────────────────────────────────────
    // 9. 터미널 그린 — 다크, 개발자 감성
    //    terminal preset → --bg: #0a0a0a 풀 다크 배경 활성화
    //    개발자, CLI 마니아, 오픈소스 기여자에 최적
    // ────────────────────────────────────────────────────────────
    id: 'terminal-green',
    name: '터미널',
    nameEn: 'Terminal Green',
    description: '다크 배경 + 에메랄드 그린 — 개발자 감성의 강렬한 스타일',
    descriptionEn: 'Dark background + emerald green — intense developer aesthetic',
    colors: ['#10b981', '#34d399'],
    state: {
      values: {
        hero: {
          designPreset: 'terminal',
          gradientFrom: '#10b981',
          gradientTo: '#34d399',
        },
      },
    },
  },
  {
    // ────────────────────────────────────────────────────────────
    // 10. 모노 에디토리얼 — 클래식 미니멀리즘
    //     editorial preset → 그레이스케일 CSS 기반
    //     포트폴리오, 작가, 저널리스트, 사진작가에 최적
    // ────────────────────────────────────────────────────────────
    id: 'mono-editorial',
    name: '모노 에디토리얼',
    nameEn: 'Mono Editorial',
    description: '블랙-차콜 모노톤 — 전문적이고 클래식한 에디토리얼 스타일',
    descriptionEn: 'Black-to-charcoal monotone — professional classic editorial',
    colors: ['#1c1c1e', '#3a3a3c'],
    state: {
      values: {
        hero: {
          designPreset: 'editorial',
          gradientFrom: '#1c1c1e',
          gradientTo: '#3a3a3c',
        },
      },
    },
  },
];
