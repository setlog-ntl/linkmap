# Freelancer Page 템플릿

> **Slug**: `freelancer-page`
> **대상**: 프리랜서 디자이너, 개발자, 크리에이티브 전문가
> **설명**: 서비스, 포트폴리오, 고객 후기, 작업 프로세스가 포함된 전문 포트폴리오

---

## 1. 모듈 구성 (6개)

| # | 모듈 ID | 이름 | 아이콘 | 필수 | 기본 활성 | 설명 |
|---|---------|------|--------|------|-----------|------|
| 1 | `hero` | 히어로 | Sparkles | O | O | 이름, 직함, 한줄 소개 + 그래디언트 배경 |
| 2 | `services` | 서비스 | Briefcase | X | O | 제공 서비스와 가격 |
| 3 | `portfolio` | 포트폴리오 | Image | X | O | 작업물 갤러리 (카테고리 필터) |
| 4 | `testimonials` | 고객 후기 | MessageSquare | X | O | 고객 후기 + 평점 |
| 5 | `process` | 진행 방식 | ListOrdered | X | O | 작업 진행 단계 |
| 6 | `contact` | 연락처 | Mail | X | O | 이메일 + 소셜 미디어 |

**기본 순서**: hero → services → portfolio → testimonials → process → contact

**특징**: 6개 모듈 중 **5개가 기본 활성** — 가장 많은 기본 콘텐츠를 제공하는 템플릿

---

## 2. 모듈별 필드 상세

### 2.1 Hero (히어로) — 필수

| 필드 | 타입 | 기본값 | 유효성 검사 | 비고 |
|------|------|--------|-------------|------|
| `name` | text | `정하은` | required, maxLength: 50 | |
| `nameEn` | text | `Haeun Jung` | — | |
| `title` | text | `그래픽 디자이너` | required, maxLength: 50 | 직함/직업 |
| `titleEn` | text | `Graphic Designer` | — | |
| `tagline` | text | `브랜드의 이야기를 시각으로 풀어내는 그래픽 디자이너` | required, maxLength: 100 | |
| `taglineEn` | text | (영문 태그라인) | — | |
| `avatarUrl` | url | `""` | — | 프로필 이미지 |
| `gradientFrom` | color | `#5b13ec` | — | 퍼플 시작 |
| `gradientTo` | color | `#06b6d4` | — | 시안 끝 |
| `fontFamily` | select | `Pretendard` | — | 8개 폰트 |

**폰트 옵션**: Personal Brand와 동일 (Pretendard, Noto Sans KR, IBM Plex Sans KR, 나눔고딕, 나눔명조, Gmarket Sans, Inter, Poppins)

**영향 파일**: `config.ts`, `hero-section.tsx`, `globals.css`, `layout.tsx`

**차이점**: Personal Brand의 Hero와 구조 유사하나, `title`(직함) 필드 추가 + `parallaxEnabled` 없음

### 2.2 Services (서비스)

| 필드 | 타입 | 기본값 | 비고 |
|------|------|--------|------|
| `items` | array | 3개 기본 항목 | **최대 8개** |

**배열 아이템 스키마**:
| 서브필드 | 타입 | 유효성 검사 | 비고 |
|----------|------|-------------|------|
| `title` | text | required | 서비스명 |
| `titleEn` | text | — | |
| `desc` | textarea | required | 설명 |
| `descEn` | textarea | — | |
| `price` | text | — | 가격 (자유 형식) |
| `priceEn` | text | — | |
| `icon` | select | `palette` | 6개 아이콘 선택 |

**아이콘 옵션**: palette, package, image, layout, pen-tool, monitor

**기본 아이템**: 브랜드 아이덴티티(₩350만~), 패키지 디자인(₩180만~), 소셜 미디어 키트(₩80만~)

**영향 파일**: `config.ts`

### 2.3 Portfolio (포트폴리오)

| 필드 | 타입 | 기본값 | 비고 |
|------|------|--------|------|
| `items` | array | 3개 기본 항목 | **최대 12개** |
| `columns` | select | `3` | 2열, 3열, 4열 선택 |

**배열 아이템 스키마**:
| 서브필드 | 타입 | 유효성 검사 | 비고 |
|----------|------|-------------|------|
| `title` | text | required | 프로젝트명 |
| `titleEn` | text | — | |
| `category` | text | required | 카테고리 (필터 기준) |
| `categoryEn` | text | — | |
| `desc` | textarea | — | 설명 |
| `descEn` | textarea | — | |
| `imageUrl` | url | required | 대표 이미지 |
| `tags` | text | — | 태그 (콤마 구분) |

**기본 아이템**: 하루마 커피 리브랜딩, NILE 스킨케어 패키지, 그린웨이 NGO 소셜 키트

**영향 파일**: `config.ts`, `portfolio-section.tsx`

### 2.4 Testimonials (고객 후기)

| 필드 | 타입 | 기본값 | 비고 |
|------|------|--------|------|
| `items` | array | 2개 기본 항목 | **최대 6개** |

**배열 아이템 스키마**:
| 서브필드 | 타입 | 유효성 검사 | 비고 |
|----------|------|-------------|------|
| `author` | text | required | 고객 이름 |
| `authorEn` | text | — | |
| `role` | text | — | 직함 |
| `roleEn` | text | — | |
| `company` | text | — | 회사/단체 |
| `companyEn` | text | — | |
| `content` | textarea | required | 후기 내용 |
| `contentEn` | textarea | — | |
| `rating` | select | `5` | 1~5 별점 |

**기본 아이템**: 하루마 커피 대표 (5점), NILE 스킨케어 마케팅 매니저 (5점)

**영향 파일**: `config.ts`

### 2.5 Process (진행 방식)

| 필드 | 타입 | 기본값 | 비고 |
|------|------|--------|------|
| `items` | array | 4개 기본 항목 | **최대 8개** |

**배열 아이템 스키마**:
| 서브필드 | 타입 | 유효성 검사 | 비고 |
|----------|------|-------------|------|
| `number` | text | required, maxLength: 4 | 단계 번호 (01, 02 등) |
| `title` | text | required | 단계명 |
| `titleEn` | text | — | |
| `desc` | textarea | required | 설명 |
| `descEn` | textarea | — | |

**기본 아이템**: 01 킥오프 미팅 → 02 콘셉트 제안 → 03 시안 확정 → 04 최종 납품

**영향 파일**: `config.ts`

### 2.6 Contact (연락처)

| 필드 | 타입 | 기본값 | 유효성 검사 |
|------|------|--------|-------------|
| `email` | text | `haeun@jung-design.kr` | required |
| `socials` | array | Instagram, LinkedIn | 최대 8개 |

**소셜 플랫폼 옵션 (7개)**: Instagram, LinkedIn, X(Twitter), YouTube, GitHub, **Behance**, **Dribbble**

**차이점**: 크리에이티브 특화 플랫폼 (Behance, Dribbble) 포함. Facebook/TikTok 대신.

**영향 파일**: `config.ts`

---

## 3. 프리셋 (3개)

| 프리셋 | 활성 모듈 | 설명 |
|--------|-----------|------|
| **미니멀** | hero, contact | 심플 명함 스타일 |
| **포트폴리오** | hero, services, portfolio, contact | 핵심 포트폴리오 |
| **전체** | hero, services, portfolio, testimonials, process, contact | 완전한 프리랜서 페이지 |

---

## 4. 현재 기능 요약

### 구현 완료
- [x] 그래디언트 히어로 (퍼플→시안 기본)
- [x] 8종 폰트 선택
- [x] 서비스 카드 (이름 + 설명 + 가격 + 아이콘)
- [x] 포트폴리오 그리드 (카테고리 필터 + 태그)
- [x] 고객 후기 (5점 별점 시스템)
- [x] 4단계 작업 프로세스 타임라인
- [x] 크리에이티브 특화 소셜 (Behance, Dribbble)
- [x] 한국어/영문 이중 언어 전 필드 지원
- [x] 3가지 프리셋

### 특수 기능
- **풍부한 기본 데이터**: 그래픽 디자이너 페르소나로 완성된 샘플 콘텐츠
- **서비스 가격 표시**: 가격 필드가 있는 유일한 템플릿
- **포트폴리오 카테고리 필터**: category 기반 클라이언트 사이드 필터링
- **별점 시스템**: 1~5점 평점 선택
- **작업 프로세스**: 번호 매기기 방식의 스텝 타임라인

---

## 5. 고도화 포인트 (기획 참고)

### P1 — 단기 개선
- [ ] **포트폴리오 라이트박스**: 이미지 클릭 시 확대 + 좌우 내비게이션
- [ ] **서비스 아이콘 확장**: 6개 → 20개+ (lucide-react 전체 연동)
- [ ] **포트폴리오 이미지 업로드**: URL → 파일 업로드 + 자동 리사이즈
- [ ] **가격 형식**: 자유 텍스트 → 통화 선택 + 숫자 입력 (KRW/USD)
- [ ] **후기 자동 요청**: 이메일로 후기 작성 링크 발송

### P2 — 중기 기능
- [ ] **프로젝트 상세 페이지**: 각 포트폴리오 항목 클릭 → 전용 페이지 (Before/After, 프로세스)
- [ ] **견적 요청 폼**: CTA 버튼 → 견적 요청 모달 (서비스 선택 + 예산 + 일정)
- [ ] **가용성 캘린더**: "현재 새 프로젝트 받을 수 있음" 상태 표시
- [ ] **후기 위젯**: 외부 사이트에 후기 카드 임베드 코드
- [ ] **결제 연동**: Stripe/PayPal 선결제 or 보증금

### P3 — 장기 확장
- [ ] **클라이언트 포털**: 진행 중 프로젝트 상태 공유 대시보드
- [ ] **계약서 서명**: 전자 서명 → 프로젝트 시작 자동화
- [ ] **인보이스 생성**: 서비스 기반 청구서 자동 생성
- [ ] **AI 포트폴리오 작성**: 이미지 업로드 → 설명, 카테고리, 태그 자동 생성
- [ ] **SEO 최적화**: 포트폴리오 항목별 구조화 데이터 (Schema.org)
