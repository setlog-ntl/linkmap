import type { ModulePreset } from './personal-brand';

/**
 * Digital Namecard 완성형 룩 프리셋
 *
 * 각 프리셋은 theme 모듈의 designPreset + accentColor + fontFamily를 묶음으로 변경한다.
 * - designPreset: 배포 번들 globals.css의 [data-preset] 규칙 + 제너레이터
 *   generateNamecardPresetCss()의 페이지/카드 토큰 결정
 * - ID는 하위호환을 위해 기존 5종 유지 (default-blue / warm-earth / midnight / corporate / creative)
 * - midnight(minimal-dark)의 accent는 다크 배경 가독성을 위해 연한 인디고 사용
 */
export const digitalNamecardPresets: ModulePreset[] = [
  {
    id: 'default-blue',
    name: '클래식 블루',
    nameEn: 'Classic Blue',
    description: '밝은 배경 + 파란색 포인트 — 깔끔하고 신뢰감 있는 기본 명함',
    descriptionEn: 'Light background with blue accent — clean and trustworthy default card',
    colors: ['#3b82f6', '#60a5fa'],
    state: {
      values: {
        theme: {
          designPreset: 'pro',
          accentColor: '#3b82f6',
          fontFamily: 'Pretendard Variable',
        },
      },
    },
  },
  {
    id: 'corporate',
    name: '비즈니스 네이비',
    nameEn: 'Business Navy',
    description: '차분한 그레이 배경 + 네이비 — 비즈니스 미팅에 최적화된 포멀 룩',
    descriptionEn: 'Muted gray background with navy — formal look for business meetings',
    colors: ['#1e3a5f', '#2d5a8e'],
    state: {
      values: {
        theme: {
          designPreset: 'corporate',
          accentColor: '#1e3a5f',
          fontFamily: 'Pretendard Variable',
        },
      },
    },
  },
  {
    id: 'warm-earth',
    name: '내추럴 어스',
    nameEn: 'Natural Earth',
    description: '따뜻한 어스톤 + 세리프 폰트 — 자연스럽고 친근한 인상',
    descriptionEn: 'Warm earth tone with serif font — natural and friendly impression',
    colors: ['#d97706', '#f59e0b'],
    state: {
      values: {
        theme: {
          designPreset: 'pro',
          accentColor: '#d97706',
          fontFamily: 'Noto Serif KR',
        },
      },
    },
  },
  {
    id: 'creative',
    name: '크리에이티브 퍼플',
    nameEn: 'Creative Purple',
    description: '연보라 배경 + 퍼플 포인트 — 디자이너/아티스트를 위한 개성 룩',
    descriptionEn: 'Soft purple background with purple accent — for designers and artists',
    colors: ['#8b5cf6', '#a78bfa'],
    state: {
      values: {
        theme: {
          designPreset: 'creative',
          accentColor: '#8b5cf6',
          fontFamily: 'IBM Plex Sans KR',
        },
      },
    },
  },
  {
    id: 'midnight',
    name: '미드나잇 인디고',
    nameEn: 'Midnight Indigo',
    description: '다크 카드 + 연한 인디고 포인트 — 세련된 나이트 무드',
    descriptionEn: 'Dark card with light indigo accent — sophisticated night mood',
    colors: ['#818cf8', '#312e81'],
    state: {
      values: {
        theme: {
          designPreset: 'minimal-dark',
          accentColor: '#818cf8',
          fontFamily: 'Pretendard Variable',
        },
      },
    },
  },
];
