# 원클릭 배포 + 사이트 편집기 점검 보고서

> 작성일: 2026-02-20
> 목적: 템플릿별 파일 구조 vs 편집기 노출 파일 비교, 미리보기 반영 여부 점검

---

## 1. 핵심 발견 — 구조적 불일치

### 문제 요약

| 항목 | 현재 상태 | 문제 |
|------|----------|------|
| 템플릿 구조 | Next.js 프로젝트 (src/app/, src/components/) | 20~25개 파일, 대부분 서브디렉토리 |
| 파일 목록 API | GitHub Contents API **루트만** 조회 | `listRepoContents(token, owner, repo)` — path 없음 |
| 편집기 노출 | 루트 레벨 편집 가능 파일만 표시 | package.json, tsconfig.json 등 **설정 파일만** |
| 실제 콘텐츠 | `src/app/page.tsx`, `src/components/*.tsx` | **편집기에 전혀 노출되지 않음** |
| 미리보기 | HTML/CSS 인라인 렌더링 | Next.js TSX는 미리보기 불가, 배포 URL만 가능 |

### 근본 원인

```
GitHub Repo 구조:
├── .github/workflows/deploy.yml  ← 숨김(forbidden)
├── package.json                  ← 루트, 편집 가능 (하지만 설정 파일)
├── tsconfig.json                 ← 루트, 편집 가능 (하지만 설정 파일)
├── postcss.config.mjs            ← 루트, 편집 가능
├── next.config.ts                ← 루트, 편집 가능
└── src/                          ← 디렉토리 → GitHub API가 type:'dir' 반환 → 필터링됨!
    ├── app/
    │   ├── page.tsx              ← 실제 페이지 콘텐츠 ← 편집기에서 접근 불가
    │   ├── layout.tsx            ← 레이아웃 ← 편집기에서 접근 불가
    │   ├── globals.css           ← 스타일 ← 편집기에서 접근 불가
    │   └── api/og/route.tsx      ← OG 이미지 ← 편집기에서 접근 불가
    ├── components/               ← 컴포넌트 ← 편집기에서 접근 불가
    └── lib/                      ← 유틸리티 ← 편집기에서 접근 불가
```

**파일 목록 API (route.ts:88)**:
```typescript
const contents = await listRepoContents(token, owner, repo);
// ↑ 루트 디렉토리만 조회 — src/는 type:'dir'이므로 필터링됨
const files = contents
  .filter((item) => item.type === 'file' && isEditableFile(item.name))
// ↑ type === 'file'만 통과 → src/ 디렉토리 제외
```

**미리보기 로직 (site-editor-client.tsx:176)**:
```typescript
// HTML 파일 찾기 → 없음 (Next.js 템플릿에는 루트 .html 없음)
const htmlPath = isHtmlFile(selectedPath)
  ? selectedPath
  : files?.find((f) => isHtmlFile(f.path))?.path || null;
// ↑ 항상 null → previewHtml = '' → 미리보기 빈 화면
```

---

## 2. 템플릿별 파일 구조 점검

### 2-1. 나만의 홈페이지 (personal-brand) — 22개 파일

| 경로 | 편집기 노출 | 미리보기 반영 | 비고 |
|------|:---------:|:----------:|------|
| `.github/workflows/deploy.yml` | X (forbidden) | - | 보안상 차단 정상 |
| `package.json` | O | X | 설정 파일, 사용자 편집 불필요 |
| `tsconfig.json` | O | X | 설정 파일 |
| `postcss.config.mjs` | O | X | 설정 파일 |
| `next.config.ts` | O | X | 설정 파일 |
| `src/app/page.tsx` | **X** | **X** | **핵심 페이지 콘텐츠** |
| `src/app/layout.tsx` | **X** | **X** | 메타데이터, 폰트, 테마 |
| `src/app/globals.css` | **X** | **X** | 전역 스타일, 애니메이션 |
| `src/app/api/og/route.tsx` | **X** | X | OG 이미지 생성 |
| `src/components/hero-section.tsx` | **X** | **X** | 히어로 영역 |
| `src/components/about-section.tsx` | **X** | **X** | 소개 섹션 |
| `src/components/values-section.tsx` | **X** | **X** | 가치관 섹션 |
| `src/components/highlights-section.tsx` | **X** | **X** | 하이라이트 |
| `src/components/gallery-section.tsx` | **X** | **X** | 갤러리 |
| `src/components/contact-section.tsx` | **X** | **X** | 연락처 |
| `src/components/footer.tsx` | **X** | **X** | 푸터 |
| `src/components/nav-header.tsx` | **X** | **X** | 네비게이션 |
| `src/components/theme-toggle.tsx` | **X** | X | 다크모드 토글 |
| `src/components/language-toggle.tsx` | **X** | X | 언어 전환 |
| `src/lib/config.ts` | **X** | **X** | **사이트 설정 (환경변수 매핑)** |
| `src/lib/i18n.tsx` | **X** | X | 다국어 유틸 |

**결론**: 22개 파일 중 **실제 편집 가능한 콘텐츠 파일 0개** 노출

### 2-2. 링크인바이오 (link-in-bio-pro) — 20개 파일

| 핵심 파일 | 편집기 노출 | 역할 |
|----------|:---------:|------|
| `src/app/page.tsx` | X | 메인 페이지 (프로필, 링크, SNS) |
| `src/components/profile-section.tsx` | X | 프로필 이미지, 닉네임, 바이오 |
| `src/components/link-list.tsx` | X | 링크 목록 렌더링 |
| `src/components/social-bar.tsx` | X | SNS 아이콘 바 |
| `src/components/content-embed.tsx` | X | YouTube 임베드 |
| `src/lib/config.ts` | X | **모든 설정값** (환경변수 → UI) |
| `src/lib/themes.ts` | X | 테마 프리셋 (gradient, glass 등) |

### 2-3. 디지털 명함 (digital-namecard) — 21개 파일

| 핵심 파일 | 편집기 노출 | 역할 |
|----------|:---------:|------|
| `src/app/page.tsx` | X | 명함 메인 레이아웃 |
| `src/components/profile-card.tsx` | X | 프로필 카드 |
| `src/components/contact-info.tsx` | X | 연락처 정보 |
| `src/components/qr-code.tsx` | X | QR 코드 생성 |
| `src/components/save-contact-button.tsx` | X | vCard 저장 |
| `src/lib/config.ts` | X | 이름, 직함, 회사, 연락처 매핑 |
| `src/lib/vcard.ts` | X | vCard 포맷 생성 |

### 2-4. 개발자 포트폴리오 (dev-showcase) — 24개 파일

| 핵심 파일 | 편집기 노출 | 역할 |
|----------|:---------:|------|
| `src/app/page.tsx` | X | 포트폴리오 메인 |
| `src/components/hero-section.tsx` | X | 히어로 + GitHub 연동 |
| `src/components/projects-section.tsx` | X | 프로젝트 카드 |
| `src/components/github-graph.tsx` | X | GitHub 잔디 시각화 |
| `src/components/experience-timeline.tsx` | X | 경력 타임라인 |
| `src/lib/config.ts` | X | GitHub ID, 스킬, 경험 매핑 |
| `src/lib/github.ts` | X | GitHub API 호출 |

### 2-5. 프리랜서 페이지 (freelancer-page) — 22개 파일

| 핵심 파일 | 편집기 노출 | 역할 |
|----------|:---------:|------|
| `src/components/services-section.tsx` | X | 서비스 목록 |
| `src/components/portfolio-section.tsx` | X | 포트폴리오 그리드 |
| `src/components/testimonials-section.tsx` | X | 후기/추천사 |
| `src/components/process-section.tsx` | X | 작업 프로세스 |

### 2-6. 소상공인 (small-biz) — 22개 파일

| 핵심 파일 | 편집기 노출 | 역할 |
|----------|:---------:|------|
| `src/components/menu-section.tsx` | X | 메뉴/가격 |
| `src/components/hours-section.tsx` | X | 영업시간 |
| `src/components/location-section.tsx` | X | 지도/위치 |
| `src/components/gallery-section.tsx` | X | 사진 갤러리 |
| `src/components/quick-actions.tsx` | X | 전화/길찾기 버튼 |

---

## 3. 미리보기 시스템 분석

### 현재 미리보기 3가지 모드

| 모드 | 조건 | 동작 | Next.js 템플릿 호환 |
|------|------|------|:------------------:|
| **인라인 렌더링** | HTML/CSS 편집 중 | `doc.write(previewHtml)` | X (TSX 불가) |
| **배포 후 라이브** | 배포 완료 후 | `<iframe src={liveUrl}>` | O (빌드된 결과) |
| **폴백 라이브** | 비-HTML 편집 중 | `<iframe src={liveUrl}>` | O (빌드된 결과) |

### 문제점

1. **Next.js 템플릿에는 루트 .html 파일이 없음** → 인라인 렌더링 항상 실패
2. **TSX 파일은 브라우저에서 직접 렌더링 불가** → Babel/SWC 컴파일 필요
3. **편집 → 미리보기 실시간 반영 불가** → GitHub 커밋 + Actions 빌드 + Pages 배포 필요 (2~5분)
4. **유일한 미리보기 = 배포된 라이브 URL** → 편집 중 변경사항 즉시 확인 불가

---

## 4. 개선 방안 (우선순위별)

### P0: 파일 트리 재귀 탐색 (Critical)

**현재**: `listRepoContents(token, owner, repo)` — 루트만
**개선**: 재귀적으로 전체 파일 트리 조회

```typescript
// 방안 A: GitHub Git Trees API (추천 — 단일 API 호출)
// GET /repos/{owner}/{repo}/git/trees/{branch}?recursive=1
async function listRepoTree(token: string, owner: string, repo: string): Promise<TreeItem[]> {
  const ref = await getRef(token, owner, repo, 'heads/main');
  const tree = await githubFetch(`/repos/${owner}/${repo}/git/trees/${ref.object.sha}?recursive=1`, { token });
  return tree.tree.filter(item => item.type === 'blob'); // 파일만
}

// 방안 B: 재귀적 Contents API (N+1 문제)
async function listAllFiles(token, owner, repo, path = '') {
  const items = await listRepoContents(token, owner, repo, path);
  const results = [];
  for (const item of items) {
    if (item.type === 'file') results.push(item);
    if (item.type === 'dir') results.push(...await listAllFiles(token, owner, repo, item.path));
  }
  return results;
}
```

**추천: 방안 A** — Git Trees API는 단일 호출로 전체 트리 반환 (재귀 Contents API 대비 API 호출 1회 vs N회)

### P1: 편집기 파일 트리 UI 개선

현재 플랫 리스트 → 디렉토리 트리 구조로 변경:
```
src/
  ├── app/
  │   ├── page.tsx          ← 편집 가능
  │   ├── layout.tsx
  │   └── globals.css       ← CSS 편집 + 미리보기
  ├── components/
  │   ├── hero-section.tsx   ← 편집 가능
  │   ├── about-section.tsx
  │   └── ...
  └── lib/
      └── config.ts         ← 사이트 설정 (핵심)
```

### P2: TSX 미리보기 전략

| 전략 | 복잡도 | 즉시성 | 비고 |
|------|:------:|:------:|------|
| **A. 배포 URL + 자동 새로고침** | 낮음 | 2~5분 | 현재 방식 개선판 |
| **B. 빠른 배포 (워크플로우 dispatch)** | 중간 | 1~2분 | 저장 시 자동 워크플로우 트리거 |
| **C. WebContainer (StackBlitz)** | 높음 | 즉시 | 브라우저 내 Node.js 실행 |
| **D. Sandpack (CodeSandbox)** | 중간 | 즉시 | React 컴포넌트 즉시 렌더링 |

**추천: 단기 B, 장기 D**

### P3: 편집 가능 확장자 추가

```typescript
// 현재
const EDITABLE_EXTENSIONS = ['.html', '.css', '.js', '.md', '.json', '.txt', '.yml', '.yaml', '.svg'];

// 개선 — TSX/TS 추가
const EDITABLE_EXTENSIONS = ['.html', '.css', '.js', '.ts', '.tsx', '.jsx', '.md', '.json', '.txt', '.yml', '.yaml', '.svg', '.mjs'];
```

---

## 5. 파일 역할별 편집 우선순위 (템플릿 공통)

### 사용자가 반드시 편집해야 하는 파일

| 우선순위 | 파일 | 역할 | 현재 편집 가능 |
|:--------:|------|------|:-----------:|
| **1** | `src/lib/config.ts` | 사이트 설정 (이름, 연락처, SNS 등) | X |
| **2** | `src/app/page.tsx` | 메인 페이지 레이아웃 | X |
| **3** | `src/app/globals.css` | 전역 스타일, 색상, 애니메이션 | X |
| **4** | `src/components/*.tsx` | 섹션별 UI 컴포넌트 | X |
| **5** | `src/app/layout.tsx` | 메타데이터, OG 태그, 폰트 | X |

### 사용자가 편집할 필요 없는 파일

| 파일 | 이유 |
|------|------|
| `package.json` | 의존성 — 사용자 수정 시 빌드 실패 위험 |
| `tsconfig.json` | 컴파일러 설정 — 수정 불필요 |
| `postcss.config.mjs` | PostCSS 설정 — 수정 불필요 |
| `next.config.ts` | basePath 등 — 수정 시 배포 실패 위험 |
| `.github/workflows/` | 배포 워크플로우 — 보안상 차단 정상 |

---

## 6. 데이터 플로우 전체 다이어그램

```
[템플릿 선택] → [deploy API] → [GitHub 레포 생성]
                                    ↓
                              [pushFilesAtomically]
                              (20~25개 파일 원자적 커밋)
                                    ↓
                              [GitHub Actions 빌드]
                              (Next.js → static export → /out)
                                    ↓
                              [GitHub Pages 배포]
                              (username.github.io/repo-name)
                                    ↓
[사이트 편집기] → [GET /files] → [listRepoContents (루트만!)]
                                    ↓
                              루트 파일만 반환:
                              package.json, tsconfig.json, ...
                              (src/ 디렉토리는 무시됨)
                                    ↓
                              [미리보기]
                              .html 없음 → 인라인 렌더링 실패
                              → 배포 URL fallback만 동작
```

---

## 7. 즉시 적용 가능한 빠른 수정 (Quick Win)

### 7-1. Git Trees API로 전체 파일 노출

**파일**: `src/app/api/oneclick/deployments/[id]/files/route.ts`
- `listRepoContents` → `getGitTree` (recursive) 교체
- 편집 가능 확장자에 `.ts`, `.tsx`, `.jsx`, `.mjs` 추가
- `.github/` 필터 유지

### 7-2. 파일 사이드바 트리 구조

**파일**: `src/components/my-sites/site-editor-client.tsx`
- 플랫 리스트 → 디렉토리별 그룹핑
- 접기/펼치기 (collapsible) UI
- `src/lib/config.ts`를 상단 고정 ("사이트 설정" 라벨)

### 7-3. config.ts 전용 폼 에디터

**파일**: 신규 컴포넌트
- `config.ts`의 환경변수 매핑을 파싱
- 폼 UI로 이름, 연락처, SNS URL 등 직접 편집
- 저장 시 config.ts 코드 자동 생성

---

## 8. 결론

현재 사이트 편집기는 **정적 HTML/CSS 사이트** 편집에 최적화되어 있으나,
실제 템플릿은 모두 **Next.js 프로젝트**입니다. 이로 인해:

1. **편집 가능한 실제 콘텐츠 파일이 0개** 노출됨
2. **실시간 미리보기가 동작하지 않음** (TSX는 컴파일 필요)
3. 사용자가 볼 수 있는 것은 **설정 파일**(package.json 등)뿐

**최소 조치**: Git Trees API로 전체 파일 트리 노출 + TSX 확장자 편집 허용
**이상적 개선**: config.ts 전용 폼 UI + Sandpack/WebContainer 기반 즉시 미리보기
