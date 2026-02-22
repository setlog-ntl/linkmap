# Dev Showcase 템플릿

> **Slug**: `dev-showcase`
> **대상**: 소프트웨어 개발자, 엔지니어
> **설명**: GitHub 프로젝트, 경력, 기술 스택이 포함된 개발자 포트폴리오

---

## 1. 모듈 구성 (6개)

| # | 모듈 ID | 이름 | 아이콘 | 필수 | 기본 활성 | 설명 |
|---|---------|------|--------|------|-----------|------|
| 1 | `hero` | 히어로 | Sparkles | O | O | 타이핑 애니메이션 인트로 + 한줄 소개 |
| 2 | `about` | 소개 | User | X | O | 자기소개 + 기술 스택 프로그레스 바 |
| 3 | `projects` | 프로젝트 | Heart | X | O | GitHub 리포 기반 프로젝트 쇼케이스 |
| 4 | `experience` | 경력 | TrendingUp | X | O | 경력/학력 타임라인 |
| 5 | `blog` | 블로그 | Mail | X | **X** | 블로그/아티클 링크 목록 |
| 6 | `contact` | 연락처 | Mail | X | O | 이메일 + GitHub + LinkedIn |

**기본 순서**: hero → about → projects → experience → blog → contact

---

## 2. 모듈별 필드 상세

### 2.1 Hero (히어로) — 필수

| 필드 | 타입 | 기본값 | 유효성 검사 | 비고 |
|------|------|--------|-------------|------|
| `name` | text | `김민수` | required, maxLength: 50 | |
| `nameEn` | text | `Minsu Kim` | — | |
| `tagline` | text | `풀스택 개발자 \| 오픈소스 기여자` | required, maxLength: 100 | |
| `taglineEn` | text | `Full-stack Developer \| Open Source Contributor` | — | |
| `typingWords` | textarea | `Full-stack Developer\nOpen Source Contributor\nTypeScript Enthusiast` | — | 줄바꿈으로 구분, 순서대로 타이핑 |

**영향 파일**: `config.ts`

**핵심 차별점**: 타이핑 애니메이션 — `typingWords`의 각 줄이 터미널 스타일로 타이핑되는 인트로

### 2.2 About (소개)

| 필드 | 타입 | 기본값 | 유효성 검사 | 비고 |
|------|------|--------|-------------|------|
| `story` | textarea | (한국어 자기소개 샘플) | required, maxLength: 2000 | |
| `storyEn` | textarea | (영문 자기소개 샘플) | — | |
| `skills` | array | TypeScript 90%, React 85%, Node.js 80% | 최대 8개 | 프로그레스 바 시각화 |

**배열 아이템 스키마 (skills)**:
| 서브필드 | 타입 | 유효성 검사 | 비고 |
|----------|------|-------------|------|
| `name` | text | required | 기술명 |
| `level` | text | — | 숙련도 (%) — 프로그레스 바 너비 |

**영향 파일**: `config.ts`

### 2.3 Projects (프로젝트)

| 필드 | 타입 | 기본값 | 비고 |
|------|------|--------|------|
| `githubUsername` | text | `""` | GitHub API로 리포 자동 가져오기 |
| `maxRepos` | select | `6` | 3개, 6개, 9개 선택 |

**영향 파일**: `config.ts`

**핵심 차별점**: GitHub 사용자명만 입력하면 Public 리포를 자동으로 카드 형태로 표시

### 2.4 Experience (경력)

| 필드 | 타입 | 기본값 | 비고 |
|------|------|--------|------|
| `items` | array | 1개 기본 항목 | 최대 8개 |

**배열 아이템 스키마**:
| 서브필드 | 타입 | 유효성 검사 |
|----------|------|-------------|
| `title` | text | required |
| `titleEn` | text | — |
| `company` | text | required |
| `companyEn` | text | — |
| `period` | text | required |
| `periodEn` | text | — |

**기본 아이템**: 시니어 개발자 / 테크 주식회사 / 2022 - 현재

**영향 파일**: `config.ts`

### 2.5 Blog (블로그) — 기본 비활성

| 필드 | 타입 | 기본값 | 비고 |
|------|------|--------|------|
| `items` | array | `[]` | 최대 6개 |

**배열 아이템 스키마**:
| 서브필드 | 타입 | 유효성 검사 |
|----------|------|-------------|
| `title` | text | required |
| `url` | url | required |
| `date` | text | — |

**영향 파일**: `config.ts`

### 2.6 Contact (연락처)

| 필드 | 타입 | 기본값 | 유효성 검사 |
|------|------|--------|-------------|
| `email` | text | `dev@example.com` | required |
| `github` | url | `""` | GitHub 프로필 URL |
| `linkedin` | url | `""` | LinkedIn 프로필 URL |

**영향 파일**: `config.ts`

**차이점**: 다른 템플릿과 달리 소셜 배열이 아닌 고정 필드 (email, github, linkedin)

---

## 3. 프리셋 (3개)

| 프리셋 | 활성 모듈 | 설명 |
|--------|-----------|------|
| **미니멀** | hero, contact | 깔끔한 개발자 명함 |
| **포트폴리오** | hero, about, projects, experience, contact | 핵심 개발자 포트폴리오 |
| **풀 프로필** | hero, about, projects, experience, blog, contact | 블로그 포함 완전한 쇼케이스 |

---

## 4. 현재 기능 요약

### 구현 완료
- [x] 타이핑 애니메이션 인트로 (typingWords)
- [x] 기술 스택 프로그레스 바 시각화
- [x] GitHub 리포 자동 연동 (사용자명 기반)
- [x] 경력 타임라인 (최대 8개)
- [x] 블로그/아티클 링크 모듈
- [x] 한국어/영문 이중 언어 전 필드 지원
- [x] 3가지 프리셋으로 빠른 시작
- [x] 모듈 on/off + 드래그 순서 변경

### 특수 기능
- 타이핑 애니메이션: textarea 입력 → 줄바꿈 기준 분리 → 순차 타이핑
- GitHub 연동: 사용자명만으로 리포 카드 자동 생성
- 모든 모듈이 `config.ts`만 영향 (Hero에 그래디언트/폰트 커스텀 없음)

---

## 5. 고도화 포인트 (기획 참고)

### P1 — 단기 개선
- [ ] **Hero 그래디언트/폰트**: Personal Brand처럼 배경색, 폰트 선택 추가
- [ ] **GitHub 리포 필터링**: starred/pinned 리포 우선 표시 옵션
- [ ] **Skills 카테고리**: Frontend/Backend/DevOps 등 그룹핑
- [ ] **Experience 설명**: 각 경력에 `description` 필드 추가 (역할 상세)
- [ ] **Blog RSS 연동**: RSS URL 입력 시 자동 파싱하여 최신글 표시

### P2 — 중기 기능
- [ ] **GitHub 기여 그래프**: contribution heatmap 위젯
- [ ] **프로젝트 수동 입력**: GitHub 외 프로젝트도 수동 추가 가능
- [ ] **기술 스택 아이콘**: 텍스트 대신 기술 로고 아이콘 표시
- [ ] **다크모드**: 터미널 테마 느낌의 다크모드 기본 제공
- [ ] **이력서 PDF 다운로드**: 경력+스킬 기반 원페이지 이력서 생성

### P3 — 장기 확장
- [ ] **코딩 통계 연동**: WakaTime, CodeTime 위젯
- [ ] **오픈소스 기여 하이라이트**: PR/Issue 통계 자동 표시
- [ ] **인터랙티브 터미널**: 방문자가 명령어 입력하는 Easter Egg
- [ ] **프로젝트 상세 페이지**: 클릭 시 프로젝트별 상세 뷰
