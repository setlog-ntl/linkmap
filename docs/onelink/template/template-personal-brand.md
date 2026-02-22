# Personal Brand 템플릿

> **Slug**: `personal-brand`
> **대상**: 콘텐츠 크리에이터, 인플루언서, 개인 브랜드
> **설명**: 바이오, 성과, 갤러리, 소셜 링크가 포함된 풀 프로필 페이지

---

## 1. 모듈 구성 (6개)

| # | 모듈 ID | 이름 | 아이콘 | 필수 | 기본 활성 | 설명 |
|---|---------|------|--------|------|-----------|------|
| 1 | `hero` | 히어로 | Sparkles | O | O | 메인 배경과 이름, 한줄 소개 |
| 2 | `about` | 소개 | User | X | O | 자기소개 글 |
| 3 | `values` | 가치관 | Heart | X | O | 핵심 가치관을 이모지+카드로 표시 |
| 4 | `highlights` | 하이라이트 | TrendingUp | X | O | 숫자 기반 핵심 성과/통계 |
| 5 | `gallery` | 갤러리 | Image | X | **X** | 이미지 갤러리 (그리드) |
| 6 | `contact` | 연락처 | Mail | X | O | 이메일 + 소셜 미디어 링크 |

**기본 순서**: hero → about → values → highlights → gallery → contact

---

## 2. 모듈별 필드 상세

### 2.1 Hero (히어로) — 필수

| 필드 | 타입 | 기본값 | 유효성 검사 | 비고 |
|------|------|--------|-------------|------|
| `name` | text | `이지원` | required, maxLength: 50 | |
| `nameEn` | text | `Jiwon Lee` | — | 영문 이름 |
| `tagline` | text | `콘텐츠로 세상을 연결하는 크리에이터` | required, maxLength: 100 | |
| `taglineEn` | text | `Creator who connects the world through content` | — | |
| `heroImageUrl` | url | `""` | — | 배경 이미지 URL |
| `gradientFrom` | color | `#ee5b2b` | — | 그래디언트 시작색 |
| `gradientTo` | color | `#f59e0b` | — | 그래디언트 끝색 |
| `parallaxEnabled` | boolean | `true` | — | 패럴렉스 효과 토글 |
| `fontFamily` | select | `Pretendard` | — | 8개 폰트 선택 |

**폰트 옵션**: Pretendard(기본), Noto Sans KR, IBM Plex Sans KR, 나눔고딕, 나눔명조, Gmarket Sans, Inter, Poppins

**영향 파일**: `config.ts`, `hero-section.tsx`, `globals.css`, `layout.tsx`

### 2.2 About (소개)

| 필드 | 타입 | 기본값 | 유효성 검사 |
|------|------|--------|-------------|
| `story` | textarea | (한국어 자기소개 샘플) | required, maxLength: 2000 |
| `storyEn` | textarea | (영문 자기소개 샘플) | — |

**영향 파일**: `config.ts`

### 2.3 Values (가치관)

| 필드 | 타입 | 기본값 | 비고 |
|------|------|--------|------|
| `items` | array | 3개 기본 항목 | 최대 6개 |

**배열 아이템 스키마**:
| 서브필드 | 타입 | 유효성 검사 |
|----------|------|-------------|
| `emoji` | text | maxLength: 4 |
| `title` | text | required |
| `titleEn` | text | — |
| `desc` | text | required |
| `descEn` | text | — |

**기본 아이템**: 진정성(Authenticity), 일관성(Consistency), 호기심(Curiosity)

**영향 파일**: `config.ts`

### 2.4 Highlights (하이라이트)

| 필드 | 타입 | 기본값 | 비고 |
|------|------|--------|------|
| `items` | array | 3개 기본 항목 | 최대 4개 |

**배열 아이템 스키마**:
| 서브필드 | 타입 | 유효성 검사 |
|----------|------|-------------|
| `value` | text | required |
| `valueEn` | text | — |
| `label` | text | required |
| `labelEn` | text | — |

**기본 아이템**: 84,000+ 구독자, 120+ 협업 브랜드, 312주 뉴스레터 연속

**영향 파일**: `config.ts`

### 2.5 Gallery (갤러리) — 기본 비활성

| 필드 | 타입 | 기본값 | 비고 |
|------|------|--------|------|
| `images` | array | `[]` | 최대 12개 이미지 URL |
| `columns` | select | `3` | 2열, 3열, 4열 선택 |

**배열 아이템 스키마**:
| 서브필드 | 타입 | 유효성 검사 |
|----------|------|-------------|
| `url` | url | required |

**영향 파일**: `config.ts`, `gallery-section.tsx`

### 2.6 Contact (연락처)

| 필드 | 타입 | 기본값 | 유효성 검사 |
|------|------|--------|-------------|
| `email` | text | `hello@jiwonlee.kr` | required |
| `socials` | array | YouTube, Instagram | 최대 8개 |

**소셜 플랫폼 옵션**: YouTube, Instagram, X(Twitter), GitHub, LinkedIn, TikTok

**영향 파일**: `config.ts`

---

## 3. 프리셋 (3개)

| 프리셋 | 활성 모듈 | 설명 |
|--------|-----------|------|
| **미니멀** | hero, contact | 깔끔한 명함 스타일 |
| **크리에이터** | hero, about, highlights, gallery, contact | 소개+성과+갤러리 포트폴리오 |
| **풀 프로필** | hero, about, values, highlights, gallery, contact | 모든 모듈 활성화 |

---

## 4. 현재 기능 요약

### 구현 완료
- [x] 그래디언트 배경 커스터마이징 (2색)
- [x] 패럴렉스 효과 토글
- [x] 8종 폰트 선택 (Google Fonts CDN 동적 로딩)
- [x] 이미지 갤러리 그리드 (2~4열)
- [x] 소셜 미디어 6개 플랫폼 지원
- [x] 한국어/영문 이중 언어 전 필드 지원
- [x] 3가지 프리셋으로 빠른 시작
- [x] 모듈 on/off + 드래그 순서 변경

### 특수 기능
- Hero 모듈이 4개 파일에 영향 (config + hero-section + globals.css + layout.tsx)
- Gallery는 기본 비활성 → 크리에이터/풀 프로필 프리셋에서 활성화

---

## 5. 고도화 포인트 (기획 참고)

### P1 — 단기 개선
- [ ] **배경 이미지 업로드**: heroImageUrl이 URL 직접 입력 방식 → 이미지 업로드 + 크롭 기능
- [ ] **갤러리 라이트박스**: 이미지 클릭 시 확대 모달
- [ ] **Values 아이콘**: 이모지 대신 아이콘 피커 (lucide-react 연동)
- [ ] **프로필 아바타**: Hero에 프로필 이미지 필드 추가 (현재 없음)
- [ ] **SEO 메타태그**: OG 이미지, description 자동 생성

### P2 — 중기 기능
- [ ] **애니메이션 옵션**: 스크롤 기반 fade-in, slide-up 효과 선택
- [ ] **다크모드 지원**: 라이트/다크 테마 토글
- [ ] **커스텀 도메인**: 사용자 도메인 연결
- [ ] **Analytics 연동**: 방문자 통계 내장
- [ ] **Highlights 차트**: 숫자 카운트업 애니메이션

### P3 — 장기 확장
- [ ] **블로그 연동**: RSS 피드 자동 가져오기
- [ ] **뉴스레터 구독폼**: 이메일 수집 CTA
- [ ] **A/B 테스트**: 히어로 변형 비교
- [ ] **다국어 자동 번역**: AI 기반 영문 필드 자동 채우기
