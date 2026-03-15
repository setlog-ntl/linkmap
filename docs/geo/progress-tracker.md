# GEO 외부 노출 — 진행 추적 체크리스트

> 전체 Phase 액션 아이템 + KPI 추적표 + 월간 점검 로그

---

## Phase 0: 블로그 인프라 (3월, 완료)
- [x] `/blog` 라우트 생성 (목록 + `[slug]` 상세)
- [x] `BlogPosting` JSON-LD 스키마 추가
- [x] sitemap에 `/blog` + 개별 글 URL 추가
- [x] robots.ts에 `/blog` 허용 (일반봇 + AI봇)
- [x] llms.txt에 블로그 섹션 추가
- [x] 헤더/푸터에 블로그 링크 추가
- [x] Phase 1 블로그 글 6편 초안 작성
- [x] 교차 게시용 `crossPostUrl` 필드 지원
- [x] 블로그 시각 강화 (콜아웃·TOC·읽기 진행바·CTA·포스트 네비게이션)
- [x] 링크 복사 + 공유 기능 추가
- [x] 블로그 글에 linkmap.biz 서비스 링크 전면 반영 (128개 서비스 카탈로그, 원클릭 배포 등)
- [x] 가이드 10개 맥락별 교차 링크 전면 적용 (env, auth, frontend, backend, deploy, github, cloudflare, openai, supabase, vercel)
- [x] relatedGuides 배열 확장 → 블로그 하단 관련 가이드 섹션 강화

---

## Phase 1: 기반 구축 (4~5월)

### 검색엔진 등록
- [ ] Google Search Console 등록 + sitemap.xml 제출
- [ ] Bing Webmaster Tools 등록 + sitemap.xml 제출
- [ ] Google Search Console에서 인덱싱 상태 확인

### 디렉토리 등록
- [ ] AlternativeTo — Doppler/Infisical 대안으로 등록
- [ ] SaaSHub — Secret Management 카테고리
- [ ] StackShare — 기술 스택 비교 등록
- [ ] Disquiet — 한국 스타트업 제품 등록 + 메이커 로그
- [ ] DevHunt — 개발자 도구 디렉토리

### 콘텐츠 (블로그 5편)
- [ ] Velog 계정 세팅 (프로필, 시리즈 구성)
- [ ] `[BLOG]` 바이브 코딩이란 무엇인가 — AI 시대의 새로운 개발 방식 (T1)
- [ ] `[BLOG]` 환경변수 관리, .env 파일은 왜 위험한가 (T2)
- [ ] `[BLOG]` 바이브 코딩으로 SaaS 만들기 — 진짜 가능할까? (T1)
- [ ] `[BLOG]` Linkmap으로 서비스맵 만들기 — 튜토리얼 (T2)
- [ ] `[BLOG]` .env 파일 안전하게 관리하는 5가지 방법 (T2)
- [ ] `[BLOG]` GitHub Secrets 자동화 — 수동 설정은 이제 그만 (T2)

### 소셜 미디어
- [ ] Twitter/X 계정 생성 + 프로필 설정
- [ ] 고정 트윗 작성 (Linkmap 소개)
- [ ] LinkedIn 프로필에 Linkmap 추가
- [ ] 첫 트윗 스레드: 바이브 코딩 개념 소개

### 영상
- [ ] `[VIDEO]` 3분 만에 서비스맵 만들기 (YouTube)

### Phase 1 점검
- [ ] 5월 4주: 전체 점검 (등록 완료 여부, 콘텐츠 발행 여부, 초기 트래픽 확인)

---

## Phase 2: 콘텐츠 공세 (6~7월)

### 비교 글 시리즈 (5편)
- [ ] `[BLOG]` 비교 1/5: Linkmap vs Doppler — 환경변수 관리의 새로운 접근 (한/영)
- [ ] `[BLOG]` 비교 2/5: Linkmap vs Infisical — 오픈소스 vs 올인원
- [ ] `[BLOG]` 비교 3/5: Linkmap vs HashiCorp Vault — 인디 개발자 시점
- [ ] `[BLOG]` 비교 4/5: Linkmap vs Vercel Env — 배포 이후의 관리
- [ ] `[BLOG]` 비교 5/5: 2025 환경변수 관리 도구 비교 총정리 (한/영)

### 추가 콘텐츠
- [ ] `[BLOG]` 바이브 코딩 필수 도구 TOP 10 (2025) (T1)
- [ ] `[BLOG]` Why I built an infrastructure brain for vibe coders (dev.to 영문)

### Product Hunt 런칭
- [ ] 프로필 완성 (로고, 설명, 스크린샷 5장)
- [ ] 태그라인 확정
- [ ] 데모 영상 (60초) 제작
- [ ] 첫 댓글 작성 (창업 스토리)
- [ ] Hunter 섭외
- [ ] 티저 SNS 게시 (런칭 1주 전)
- [ ] **런칭 실행** (7월 2주 화요일)
- [ ] 런칭 당일 전 채널 홍보
- [ ] 모든 댓글 30분 내 응답
- [ ] 런칭 결과 회고 글

### 영상
- [ ] `[VIDEO]` Linkmap vs Doppler — 3분 비교 데모
- [ ] `[VIDEO]` 원클릭 배포 — 3분 만에 사이트 완성

### Phase 2 점검
- [ ] 7월 4주: 비교 글 5편 완성 여부, PH 결과 리뷰, 백링크 수 확인

---

## Phase 3: 커뮤니티 확장 (8~9월)

### 커뮤니티 활동
- [ ] GeekNews "Show" 제출
- [ ] Reddit r/webdev, r/devops 참여 시작 (karma 구축)
- [ ] 개발바닥 Discord 참여 시작
- [ ] Disquiet 메이커 로그 지속 업데이트

### Awesome Lists PR
- [ ] awesome-developer-tools PR 제출
- [ ] awesome-selfhosted PR 제출
- [ ] awesome-nextjs PR 제출 (선택)
- [ ] awesome-nodejs PR 제출 (선택)

### 콘텐츠
- [ ] `[BLOG]` API 키 유출 사고 대응 가이드 (T2)
- [ ] `[BLOG]` 서비스 아키텍처 시각화가 중요한 이유 (한/영)
- [ ] `[BLOG]` 바이브 코딩 실패 사례와 교훈 (T1)
- [ ] `[BLOG]` Supabase + Vercel + Linkmap — 바이브 코딩 최적 스택 (T1/T2)
- [ ] `[BLOG]` Linkmap 6개월 회고 — 숫자로 보는 성장
- [ ] `[BLOG]` 10 Things I Wish I Knew Before Building a Developer Tool (dev.to 영문)
- [ ] `[BLOG]` 환경변수 네이밍 컨벤션 가이드 (T2)

### 파트너십
- [ ] Supabase 파트너 블로그 교차 링크 제안
- [ ] Vercel 커뮤니티 참여
- [ ] 개발자 컨퍼런스/밋업 발표 신청 (FEConf 등)

### 영상
- [ ] `[VIDEO]` 팀 환경변수 관리 — 혼자서 다 외우지 마세요
- [ ] `[VIDEO]` Linkmap 전체 기능 워크스루 (10분)

### Phase 3 점검
- [ ] 9월 4주: Awesome list 등록 여부, 커뮤니티 활동량, 백링크 50개 달성 여부

---

## Phase 4: 글로벌 확장 (10~12월)

### Hacker News
- [ ] HN 일반 참여 시작 (최소 2개월 전부터)
- [ ] Show HN 게시 (10월 1주)
- [ ] 모든 댓글 응답

### 비즈니스 디렉토리
- [ ] G2 프로필 등록
- [ ] G2 리뷰 5건 수집
- [ ] Capterra 등록
- [ ] Capterra 리뷰 수집

### 글로벌 콘텐츠
- [ ] `[BLOG]` Show HN: Linkmap — Infrastructure brain for vibe coders
- [ ] `[BLOG]` The Rise of Vibe Coding — And Why Your Infra Needs a Map (dev.to)
- [ ] `[BLOG]` Doppler Alternative for Indie Developers (dev.to)
- [ ] `[BLOG]` Secret Management in 2025 — A Developer's Guide (dev.to)
- [ ] `[BLOG]` Infisical vs Doppler vs Linkmap — 2025 Comparison (dev.to)

### 한국 콘텐츠
- [ ] `[BLOG]` 한국 개발자를 위한 인프라 관리 도구 총정리 (2025)
- [ ] `[BLOG]` Linkmap 2025 연말 회고 — 0에서 시작한 1년 (한/영)
- [ ] `[BLOG]` 2026 바이브 코딩 트렌드 전망 (T1)

### 영상
- [ ] `[VIDEO]` Linkmap in 60 Seconds (영문 숏폼)
- [ ] `[VIDEO]` From .env to Production — Secure Env Management (영문)

### 연말 마무리
- [ ] 2026 로드맵 공개 (linkmap.sh)
- [ ] 연말 감사 SNS 게시
- [ ] 전체 KPI 달성률 리뷰

### Phase 4 점검
- [ ] 12월 4주: 전체 점검 — AI 인용 수, 백링크 150개, 오가닉 트래픽 목표

---

## KPI 추적표

### AI LLM 인용 추적
| 날짜 | 검색어 | 플랫폼 | Linkmap 언급 | 스크린샷 |
|------|--------|--------|-------------|---------|
| 2025-04-__ | "환경변수 관리 도구" | ChatGPT | [ ] 있음 / [ ] 없음 | |
| 2025-04-__ | "환경변수 관리 도구" | Gemini | [ ] 있음 / [ ] 없음 | |
| 2025-04-__ | "환경변수 관리 도구" | Perplexity | [ ] 있음 / [ ] 없음 | |
| 2025-04-__ | "바이브 코딩 플랫폼" | ChatGPT | [ ] 있음 / [ ] 없음 | |
| 2025-04-__ | "바이브 코딩 플랫폼" | Gemini | [ ] 있음 / [ ] 없음 | |
| 2025-04-__ | "Doppler alternative" | ChatGPT | [ ] 있음 / [ ] 없음 | |
| 2025-04-__ | "Doppler alternative" | Perplexity | [ ] 있음 / [ ] 없음 | |

### 백링크 추적
| 월 | 목표 | 실제 | 주요 소스 |
|----|------|------|----------|
| 4월 | 5 | | |
| 5월 | 15 | | |
| 6월 | 25 | | |
| 7월 | 35 (PH 런칭) | | |
| 8월 | 45 | | |
| 9월 | 55 | | |
| 10월 | 75 (HN) | | |
| 11월 | 100 | | |
| 12월 | 150 | | |

### 콘텐츠 성과 추적
| 월 | 블로그 글 수 | 영상 수 | Velog 조회수 | dev.to 조회수 | YouTube 조회수 |
|----|------------|--------|------------|-------------|-------------|
| 4월 | /3 | /0 | | | |
| 5월 | /3 | /1 | | | |
| 6월 | /4 | /1 | | | |
| 7월 | /3 | /1 | | | |
| 8월 | /4 | /1 | | | |
| 9월 | /3 | /1 | | | |
| 10월 | /3 | /1 | | | |
| 11월 | /3 | /1 | | | |
| 12월 | /3 | /0 | | | |

### 소셜 미디어 팔로워
| 월 | Twitter/X | Velog | LinkedIn | 합계 |
|----|-----------|------|----------|------|
| 4월 | | | | |
| 5월 | | | | |
| 6월 | | | | |
| 7월 | | | | |
| 8월 | | | | |
| 9월 | | | | |
| 10월 | | | | |
| 11월 | | | | |
| 12월 | | | | |

---

## 월간 점검 로그 템플릿

```markdown
## YYYY-MM 월간 점검

### 이번 달 완료 항목
- [ ] (완료한 액션 아이템 나열)

### KPI 현황
| KPI | 목표 | 실제 | 달성률 |
|-----|------|------|--------|
| AI LLM 인용 | | | |
| 백링크 | | | |
| Velog 팔로워 | | | |
| 오가닉 트래픽 | | | |

### AI 검색 테스트 결과
- ChatGPT "환경변수 관리 도구":
- Gemini "바이브 코딩 플랫폼":
- Perplexity "Doppler alternative":

### 잘된 점
-

### 개선할 점
-

### 다음 달 우선 과제
1.
2.
3.
```

---

## 참조
- [마스터 전략](./strategy.md)
- [콘텐츠 캘린더](./content-calendar.md)
- [커뮤니티 플레이북](./community-playbook.md)
- [경쟁 포지셔닝 가이드](./competitive-positioning.md)
- [비주얼 대시보드](./dashboard.html)
