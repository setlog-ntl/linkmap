# Linkmap IA 재설계 완료 보고서

## 실행 일자: 2026-02-22

## 빌드 검증
- `npx tsc --noEmit` — 통과
- `npm run build` — 통과

---

## Phase 0: i18n 메뉴명 변경

### 변경 파일
- `src/lib/i18n/locales/ko.json`
- `src/lib/i18n/locales/en.json`

### 변경 내용
| 키 | AS-IS (ko) | TO-BE (ko) | AS-IS (en) | TO-BE (en) |
|----|-----------|-----------|-----------|-----------|
| common.dashboard | 대시보드 | 내 프로젝트 | Dashboard | My Projects |
| nav.serviceCatalog | 서비스 카탈로그 | 서비스 탐색 | Service Catalog | Explore Services |
| project.overview | 개요 | 한눈에 보기 | Overview | At a Glance |
| project.serviceMap | 서비스 맵 | 연결 지도 | Service Map | Connection Map |
| project.integrations | 통합 관리 | 내 서비스 | Integrations | My Services |
| project.envVars | 환경변수 | 비밀 키 | Env Variables | Secrets |
| project.monitoring | 모니터링 | 상태 확인 | Monitoring | Monitoring |

### 추가 키
- `nav.sites` (사이트 배포 / Deploy Sites)
- `project.changeHistory` (변경 기록 / Change History)
- `account.myAccount` (내 계정 / My Account)
- `account.developer` (개발자 도구 / Developer Tools)
- `account.developerDesc`

---

## Phase 1: OneClick + My Sites → "사이트 배포" 통합

### 변경 파일
- `src/app/(dashboard)/sites/page.tsx` — **신규** (통합 페이지, 탭 구조)
- `src/app/(dashboard)/sites/[deployId]/edit/page.tsx` — **신규** (에디터 페이지)
- `src/app/oneclick/page.tsx` → redirect `/sites`
- `src/app/my-sites/page.tsx` → redirect `/sites?tab=manage`
- `src/app/my-sites/[deployId]/edit/page.tsx` → redirect `/sites/${deployId}/edit`
- `src/components/layout/app-sidebar.tsx` — mainNav 4개→3개, projectNav 6개→5개
- `src/components/layout/breadcrumbs.tsx` — routeLabels 업데이트
- `src/components/command-palette.tsx` — oneclick/my-sites 명령 제거, sites 명령 추가

### 라우트 매핑
| AS-IS | TO-BE |
|-------|-------|
| `/oneclick` | `/sites` (redirect) |
| `/my-sites` | `/sites?tab=manage` (redirect) |
| `/my-sites/[id]/edit` | `/sites/[id]/edit` (redirect) |

---

## Phase 2: 프로젝트 탭 재구성 + Monitoring 해체

### 변경 파일
- `src/components/project/project-tabs.tsx` — tabGroups 3그룹(6탭) → 2그룹(5탭)
- `src/app/project/[id]/monitoring/page.tsx` → redirect `/project/${id}`
- `src/app/project/[id]/page.tsx` — Health 위젯 추가
- `src/app/project/[id]/settings/page.tsx` — Audit(변경 기록) 섹션 추가

### 탭 구조
```
AS-IS: [개요, 서비스맵, 통합관리] | [환경변수, 모니터링] | [설정]
TO-BE: [한눈에 보기, 내 서비스, 비밀 키] | [연결 지도, 설정]
```

### Monitoring 해체
- Health Check → Overview 페이지 하단 위젯
- Audit Log → Settings 페이지 내 "변경 기록" 섹션

---

## Phase 3: Settings 정리 (5→3개)

### 변경 파일
- `src/app/settings/account/page.tsx` — **재작성** (Profile + Danger Zone 통합)
- `src/app/settings/developer/page.tsx` — **신규** (API Tokens + 커스텀 서비스)
- `src/components/settings/settings-nav.tsx` — 5개→3개 링크
- `src/app/settings/page.tsx` → redirect `/settings/account`
- `src/app/settings/profile/page.tsx` → redirect `/settings/account`
- `src/app/settings/tokens/page.tsx` → redirect `/settings/developer`
- `src/app/settings/services/page.tsx` → redirect `/settings/developer`
- `src/app/settings/danger/page.tsx` → redirect `/settings/account`

### Settings 구조
```
AS-IS: [프로필, GitHub 연결, 서비스, API 토큰, 위험 영역]
TO-BE: [내 계정, 연결된 계정, 개발자 도구]
```

---

## Phase 4: Service Map 축소 + 유령 라우트 정리

### 변경 파일
- `src/components/service-map/view-level-switcher.tsx` — 'status' 레벨 제거
- `src/stores/service-map-store.ts` — 기본값 'status' → 'map'
- `src/components/service-map/service-map-client.tsx` — StatusView 렌더링 제거

### 유령 라우트 리다이렉트 수정
- `/project/[id]/health` → `/project/${id}` (Overview)
- `/project/[id]/audit` → `/project/${id}/settings`
- `/project/[id]/connections` → `/project/${id}/integrations`
- `/project/[id]/services` → `/project/${id}/integrations`

---

## Phase 5: Dashboard 크로스프로젝트 통계

### 변경 파일
- `src/app/(dashboard)/dashboard/page.tsx` — StatCard 위젯 추가

### 통계 항목
| 항목 | 데이터 소스 |
|------|-----------|
| 프로젝트 수 | `projects.length` |
| 연결된 서비스 | `project_services.length` 합계 |
| GitHub 레포 | `project_github_repos.length` 합계 |

### 버그 수정
- `src/stores/ui-store.ts` — 누락된 `commandOpen`/`setCommandOpen` 복원 (기존 버그)

---

## 최종 IA 구조

### 사이드바 (글로벌)
```
1. 내 프로젝트      (/dashboard)
2. 서비스 탐색      (/services)
3. 사이트 배포      (/sites)          ← OneClick+My Sites 통합
4. 도움말           접이식
── 구분선 ──
5. 설정             (/settings) 하단
6. 사용자 프로필    드롭다운
```

### 프로젝트 내부 탭
```
[그룹1] 한눈에 보기 | 내 서비스 | 비밀 키
[그룹2] 연결 지도 | 설정
```

### 사용자 설정
```
1. 내 계정        (/settings/account)
2. 연결된 계정    (/settings/accounts)
3. 개발자 도구    (/settings/developer)
```
