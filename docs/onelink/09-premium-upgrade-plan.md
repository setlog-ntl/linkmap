# 원클릭 배포 템플릿 6종 프리미엄 고도화 기획

## 개요

6개 원클릭 배포 템플릿을 2026년 웹 디자인 트렌드에 맞게 프리미엄 고도화.

| 트렌드 | 적용 |
|--------|------|
| Bento Grid 2.0 | personal-brand 갤러리, dev-showcase 프로젝트 |
| Kinetic Typography | freelancer-page 로테이팅 텍스트, dev-showcase 타이핑 |
| Human Craft | small-biz serif 타이포, freelancer-page 인용문 |
| Warm Minimalism | 전체 CSS 변수 개선, 부드러운 인터랙션 |

## 템플릿별 변경 요약

### 1. personal-brand (내 홈페이지)
- **히어로**: 에디토리얼 2열 레이아웃 (텍스트 좌 / 이미지 우)
- **하이라이트**: CountUp 애니메이션 (숫자가 올라가는 효과)
- **갤러리**: CSS Masonry 레이아웃
- **프리셋 추가**: editorial
- **새 컴포넌트**: `count-up.tsx`

### 2. link-card (링크카드)
- **CSS**: 프리셋별 시각 차별화 강화 (aurora 글로우, neon 보더, brutalist 두꺼운 선)
- **호버**: 카드 화살표 이동, hover-glow 효과
- **프로필**: 아바타 링 + 스케일 효과
- **스키마**: cardStyle에 outline 옵션 추가

### 3. digital-namecard (디지털 명함)
- **3D 플립**: 클릭으로 앞뒤 전환 (앞: 프로필 / 뒤: 연락처)
- **상단 바**: shimmer 효과
- **프리셋 추가**: corporate, creative, minimal-dark

### 4. small-biz (우리가게 홍보)
- **메뉴**: 카테고리별 테이블 레이아웃 + 뱃지
- **영업 상태**: 실시간 open/closed 인디케이터
- **타이포**: Serif 폰트 옵션
- **프리셋 추가**: warm-serif, modern-minimal

### 5. freelancer-page (프리랜서 홍보)
- **히어로**: RotatingText 키워드 순환
- **서비스**: 테이블 레이아웃 (번호 + 이름 + 가격)
- **후기**: 대형 pull-quote 인용문
- **프리셋 추가**: agency, creative-minimal

### 6. dev-showcase (개발자 홈)
- **히어로**: 터미널 창 스타일 (빨노초 점, 프롬프트)
- **프로젝트**: GitHub 리포 카드 (언어 dot, 스타)
- **스킬 바**: IntersectionObserver 애니메이션
- **프리셋 추가**: terminal, portfolio-focus

## 공유 인프라 변경

### shared-template-files.ts 추가 컴포넌트
| 컴포넌트 | 용도 |
|----------|------|
| `sharedCountUp` | 숫자 카운트업 애니메이션 |
| `sharedRotatingText` | 텍스트 순환 효과 |
| `sharedCardFlip3D` | 3D 카드 플립 |
| `sharedPremiumAnimations` | 공유 CSS 애니메이션 |

## 수정 파일 목록

| 파일 | 변경 |
|------|------|
| `src/data/oneclick/shared-template-files.ts` | 4개 공유 컴포넌트 추가 |
| `src/data/oneclick/personal-brand-template.ts` | Hero, Highlights, Gallery, CSS |
| `src/data/oneclick/homepage-template-content.ts` | link-card CSS/컴포넌트, digital-namecard 3D 플립 |
| `src/data/oneclick/small-biz-template.ts` | Menu 테이블, 영업상태, CSS |
| `src/data/oneclick/freelancer-page-template.ts` | RotatingText, Service 테이블, Pull-quote |
| `src/data/oneclick/dev-showcase-template.ts` | Terminal Hero, GitHub 카드, 스킬바 |
| `src/data/oneclick/module-schemas/personal-brand.ts` | editorial 프리셋 옵션 |
| `src/data/oneclick/module-schemas/link-card.ts` | outline 카드스타일 |
| `src/data/oneclick/module-presets/*.ts` (6개) | 새 프리셋 추가 |

## 검증 체크리스트

- [ ] `npm run typecheck` 통과
- [ ] `npm run test` 기존 102개 테스트 통과
- [ ] 각 템플릿 코드 생성 → 파싱 왕복 검증
- [ ] 라이트/다크 모드 시각 확인
- [ ] 모바일/데스크탑 반응형 확인
- [ ] `prefers-reduced-motion` 존중 확인
