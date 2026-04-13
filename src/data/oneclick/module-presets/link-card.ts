import type { ModulePreset } from './personal-brand';

export const linkCardPresets: ModulePreset[] = [
  {
    // 기본 테마 — 따뜻한 코랄 포인트 + 밝은 배경
    id: 'default',
    name: '피치 라이트',
    nameEn: 'Peach Light',
    description: '따뜻한 코랄 포인트 + 밝은 배경 — 누구에게나 어울리는 기본',
    descriptionEn: 'Warm coral accent on bright background — universally appealing',
    colors: ['#ff8c69', '#ffb347'],
    state: {
      values: {
        theme: {
          bgStyle: 'light',
          cardStyle: 'rounded',
          primaryColor: '#ff8c69',
        },
      },
    },
  },
  {
    // 딥 오션 그래디언트 — 알약형 카드로 차별화
    // primaryColor #1d4ed8: 진한 블루 — 흰 텍스트 대비 8.6:1 (WCAG AAA 충족)
    id: 'ocean-breeze',
    name: '오션 브리즈',
    nameEn: 'Ocean Breeze',
    description: '딥 블루 그래디언트 배경 + 알약형 카드 — 시원하고 깊은 감성',
    descriptionEn: 'Deep blue gradient + pill cards — cool and deep aesthetic',
    colors: ['#1d4ed8', '#2563eb'],
    state: {
      values: {
        theme: {
          bgStyle: 'gradient',
          cardStyle: 'pill',
          primaryColor: '#1d4ed8',
        },
      },
    },
  },
  {
    // 판톤 올해의 색 모카무스 — 단색 배경 + 직각 카드로 클래식 감성
    // primaryColor #7d5c4e: 모카무스 다크 — 흰 텍스트 대비 6.1:1 (WCAG AA 충족)
    id: 'mocha-latte',
    name: '모카 라떼',
    nameEn: 'Mocha Latte',
    description: '모카무스 딥 톤 + 직각 카드 — 따뜻하고 차분한 카페 감성',
    descriptionEn: 'Deep mocha mousse + square cards — warm cafe aesthetic',
    colors: ['#7d5c4e', '#b8956e'],
    state: {
      values: {
        theme: {
          bgStyle: 'solid',
          cardStyle: 'square',
          primaryColor: '#7d5c4e',
        },
      },
    },
  },
  {
    // 오로라 — 퍼플-민트 애니메이션 배경 + 유리 카드
    id: 'aurora',
    name: '오로라',
    nameEn: 'Aurora',
    description: '보라-민트 오로라 애니메이션 + 유리 카드 — 몽환적 트렌드 감성',
    descriptionEn: 'Purple-mint aurora animation + glass cards — dreamy and trendy',
    colors: ['#a855f7', '#67e8f9'],
    state: {
      values: {
        theme: {
          bgStyle: 'aurora',
          cardStyle: 'glass',
          primaryColor: '#a855f7',
        },
      },
    },
  },
  {
    // 다크 + 에메랄드 아웃라인 — 자연 영감 미니멀 다크
    id: 'forest',
    name: '포레스트',
    nameEn: 'Forest',
    description: '다크 배경 + 에메랄드 아웃라인 — 자연에서 온 미니멀 다크',
    descriptionEn: 'Dark background + emerald outline — nature-inspired minimal dark',
    colors: ['#0f172a', '#10b981'],
    state: {
      values: {
        theme: {
          bgStyle: 'dark',
          cardStyle: 'outline',
          primaryColor: '#10b981',
        },
      },
    },
  },
  {
    // 네온 사이버 — 다크 + 사이언 네온 글로우
    id: 'neon-cyber',
    name: '네온 사이버',
    nameEn: 'Neon Cyber',
    description: '다크 배경 + 사이언 네온 글로우 — 개발자·인디 크리에이터 스타일',
    descriptionEn: 'Dark background + cyan neon glow — developer and indie creator style',
    colors: ['#0f172a', '#22d3ee'],
    state: {
      values: {
        theme: {
          bgStyle: 'dark',
          cardStyle: 'neon',
          primaryColor: '#22d3ee',
        },
      },
    },
  },
];
