import type { ModulePreset } from './personal-brand';

export const linkCardPresets: ModulePreset[] = [
  {
    // 기본 테마 — 따뜻하고 밝은 피치 라이트
    // 2025-2026 트렌드: 코랄/피치가 인디고보다 훨씬 접근성 높고 크리에이터 친화적
    id: 'default',
    name: '피치 라이트',
    nameEn: 'Peach Light',
    description: '따뜻한 피치 포인트 + 밝은 배경 — 누구에게나 어울리는 기본',
    descriptionEn: 'Warm peach accent + bright background — universally appealing default',
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
    // 오로라 — 실제 오로라 색상 스와치로 교정 (퍼플-민트 그라데이션)
    id: 'aurora',
    name: '오로라',
    nameEn: 'Aurora',
    description: '보라-민트 오로라 배경 + 유리 카드 — 2025 트렌드',
    descriptionEn: 'Purple-mint aurora background + glass cards — 2025 trend',
    colors: ['#c084fc', '#67e8f9'],
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
    // 모카 라떼 — Pantone COTY 2025 Mocha Mousse(#9B7968) 직접 반영
    // solid bgStyle + 브라운 크림 배경으로 따뜻하고 차분한 감성
    id: 'mocha-latte',
    name: '모카 라떼',
    nameEn: 'Mocha Latte',
    description: '2025 판톤 올해의 색 모카무스 — 따뜻하고 차분한 감성',
    descriptionEn: 'Pantone 2025 Color of the Year Mocha Mousse — warm and serene',
    colors: ['#9b7968', '#c4a882'],
    state: {
      values: {
        theme: {
          bgStyle: 'solid',
          cardStyle: 'rounded',
          primaryColor: '#9b7968',
        },
      },
    },
  },
  {
    // 선셋 메시 — mesh bgStyle + 피치-코랄-오렌지
    // SNS 크리에이터, 뷰티, 라이프스타일에 최적
    id: 'sunset-mesh',
    name: '선셋 메시',
    nameEn: 'Sunset Mesh',
    description: '코랄-오렌지 메시 배경 — 에너지 넘치는 SNS 크리에이터 스타일',
    descriptionEn: 'Coral-orange mesh background — energetic creator style',
    colors: ['#f97316', '#fb923c'],
    state: {
      values: {
        theme: {
          bgStyle: 'mesh',
          cardStyle: 'glass',
          primaryColor: '#f97316',
        },
      },
    },
  },
  {
    // 세이지 그린 — 2025-2026 자연 영감 트렌드 (sage/moss green)
    // light bgStyle + 세이지 그린 포인트
    id: 'sage',
    name: '세이지 그린',
    nameEn: 'Sage Green',
    description: '자연에서 온 세이지 그린 — 차분하고 신뢰감 있는 감성',
    descriptionEn: 'Nature-inspired sage green — calm and trustworthy',
    colors: ['#84a98c', '#b7c4b1'],
    state: {
      values: {
        theme: {
          bgStyle: 'light',
          cardStyle: 'rounded',
          primaryColor: '#84a98c',
        },
      },
    },
  },
  {
    // 코튼 캔디 — 라벤더+피치 파스텔 그래디언트
    // 2025-2026 "소프트 파스텔" 트렌드 대표
    id: 'cotton-candy',
    name: '코튼 캔디',
    nameEn: 'Cotton Candy',
    description: '라벤더+피치 파스텔 그래디언트 — 부드럽고 몽환적인 감성',
    descriptionEn: 'Lavender + peach pastel gradient — soft and dreamy',
    colors: ['#c4b5fd', '#fda4af'],
    state: {
      values: {
        theme: {
          bgStyle: 'gradient',
          cardStyle: 'pill',
          primaryColor: '#a78bfa',
        },
      },
    },
  },
  {
    // 미드나잇 바이올렛 — 다크 1번
    // 딥 다크 + 바이올렛 포인트 — 고급스러운 나이트 모드
    id: 'midnight',
    name: '미드나잇',
    nameEn: 'Midnight',
    description: '딥 다크 배경 + 바이올렛 포인트 — 고급스러운 나이트 무드',
    descriptionEn: 'Deep dark background + violet accent — premium night mood',
    colors: ['#1e1b4b', '#7c3aed'],
    state: {
      values: {
        theme: {
          bgStyle: 'dark',
          cardStyle: 'glass',
          primaryColor: '#7c3aed',
        },
      },
    },
  },
  {
    // 네온 다크 — 다크 2번
    // 기존 neon 유지, 스와치 색상 미세 조정
    id: 'neon',
    name: '네온 다크',
    nameEn: 'Neon Dark',
    description: '다크 배경 + 사이언 네온 — 인디 크리에이터·개발자 스타일',
    descriptionEn: 'Dark background + cyan neon — indie creator and developer style',
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
  {
    // 인크 블랙 — 브루탈리스트/모노크롬
    // 검정 배경 + 화이트 아웃라인 — 대담한 미니멀
    id: 'ink',
    name: '잉크 블랙',
    nameEn: 'Ink Black',
    description: '검정 + 화이트 아웃라인 — 대담하고 강렬한 미니멀리즘',
    descriptionEn: 'Black + white outline — bold and intense minimalism',
    colors: ['#09090b', '#e4e4e7'],
    state: {
      values: {
        theme: {
          bgStyle: 'dark',
          cardStyle: 'outline',
          primaryColor: '#e4e4e7',
        },
      },
    },
  },
];
