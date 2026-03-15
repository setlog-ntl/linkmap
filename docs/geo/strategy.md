# GEO 외부 노출 마스터 전략

> Linkmap을 AI LLM 검색 결과에 노출시키기 위한 종합 외부 신호 구축 전략

## 1. 현황 분석

### 기술적 GEO (완료)
- [x] JSON-LD 구조화 데이터
- [x] llms.txt (AI 크롤러 전용 콘텐츠)
- [x] robots.ts (AI 봇 허용)
- [x] sitemap.xml
- [x] FAQ 스키마 (19개 질문)
- [x] 용어집 (66개 기술 용어)
- [x] 비교 매트릭스 (13개 카테고리)
- [x] **자체 블로그 (`/blog`)** — BlogPosting JSON-LD, sitemap 통합, Phase 1 글 6편 초안 완료

### 외부 신호 (미비)
| 신호 | 현재 | 문제 |
|------|------|------|
| Google 백링크 | ~0 | 검색엔진 권위도 없음 |
| AI LLM 인용 | 0 | Gemini/ChatGPT/Perplexity에서 미노출 |
| 커뮤니티 멘션 | 0 | Velog/Reddit/HN 활동 없음 |
| 디렉토리 등록 | 0 | G2/Product Hunt/Awesome lists 미등록 |
| 소셜 미디어 | 0 | Twitter/X, LinkedIn 활동 없음 |

### 핵심 문제
AI LLM은 **웹 전체의 외부 신호**(백링크, 인용, 소셜 멘션, 디렉토리 등록)를 기반으로 답변을 생성한다. Linkmap은 기술적으로 완벽하지만 외부 신호가 거의 0이므로, "환경변수 관리 도구"를 검색하면 Doppler/Infisical/Vault만 추천됨.

---

## 2. 목표 KPI

| KPI | 현재 | 3개월 (6월) | 6개월 (9월) | 12개월 (내년 3월) |
|-----|------|-------------|-------------|-------------------|
| AI LLM 인용 수 | 0 | 1 | 3 | 5+ |
| Google 백링크 | ~0 | 20 | 50 | 150 |
| Velog 팔로워 | 0 | 50 | 150 | 500 |
| Twitter/X 팔로워 | 0 | 100 | 300 | 1,000 |
| Product Hunt 업보트 | - | 100+ | - | - |
| Google 검색 Tier 1 키워드 1페이지 | 0/2 | 1/2 | 2/2 | 2/2 |
| Google 검색 Tier 2 키워드 1페이지 | 0/3 | 1/3 | 2/3 | 3/3 |
| 월 방문자 (오가닉) | ~0 | 500 | 2,000 | 10,000 |

### 측정 방법
- AI 인용: 주 1회 Gemini/ChatGPT/Perplexity에서 타깃 키워드 검색 → 스크린샷 기록
- 백링크: Google Search Console + Ahrefs (무료 티어)
- 소셜: 각 플랫폼 대시보드
- 오가닉 트래픽: Vercel Analytics / Cloudflare Analytics

---

## 3. 타깃 키워드 3티어

### Tier 1 — 소유 (Vibe Coding 카테고리 선점)
| 키워드 | 검색량 (추정) | 경쟁도 | 전략 |
|--------|-------------|--------|------|
| 바이브 코딩 플랫폼 | 낮음 (신규) | **최저** | 정의 글 발행 → 카테고리 소유 |
| 바이브 코딩이란 | 중간 (성장) | 낮음 | 개념 설명 + Linkmap 연결 |
| vibe coding platform | 낮음 (신규) | 낮음 | 영문 정의 글 |

**왜 Tier 1인가:** "바이브 코딩"은 아직 카테고리가 형성 중인 신규 키워드. 정의 글을 먼저 발행하면 AI LLM이 해당 카테고리에서 Linkmap을 첫 번째로 인용할 가능성이 높음.

### Tier 2 — 진입 (한국어 틈새 공략)
| 키워드 | 검색량 (추정) | 경쟁도 | 전략 |
|--------|-------------|--------|------|
| 환경변수 관리 도구 | 중간 | 중간 | 비교 글 + 디렉토리 등록 |
| API 키 관리 | 중간 | 중간 | 보안 가이드 + FAQ |
| 시크릿 관리 오픈소스 | 낮음 | 낮음 | Infisical 비교 글 |
| .env 파일 관리 | 중간 | 낮음 | 실용 가이드 |
| GitHub Secrets 자동화 | 낮음 | 낮음 | 튜토리얼 |

### Tier 3 — 장기 (글로벌 영문)
| 키워드 | 검색량 (추정) | 경쟁도 | 전략 |
|--------|-------------|--------|------|
| Doppler alternative | 중간 | 높음 | 영문 비교 글 |
| env management tool | 중간 | 높음 | 영문 콘텐츠 + HN |
| secret management for indie developers | 낮음 | 중간 | 틈새 공략 |
| infrastructure visualization | 낮음 | 중간 | 차별화 강조 |

---

## 4. 전략 4축

### 축 1: 콘텐츠 소유 (Content Ownership)
**목표:** 타깃 키워드에 대한 최고 품질의 콘텐츠를 직접 생산

| 채널 | 콘텐츠 유형 | 빈도 | 담당 |
|------|------------|------|------|
| Velog | 기술 블로그 (한글) | 주 1회 | 대표/개발자 |
| dev.to | 기술 블로그 (영문) | 격주 1회 | 대표 |
| linkmap.sh/blog | 공식 블로그 | 주 1회 | 대표 |
| YouTube | 데모/튜토리얼 영상 | 격주 1회 | 대표 |

**핵심 콘텐츠 시리즈:**
1. **"바이브 코딩 가이드"** — 5편 시리즈 (Tier 1 소유)
2. **"Linkmap vs X"** — 5편 비교 글 (Tier 2 진입)
3. **"환경변수 관리 완전 가이드"** — 3편 (Tier 2 진입)
4. **"인프라 시각화 왜 중요한가"** — 3편 (차별화)

### 축 2: 커뮤니티 참여 (Community Engagement)
**목표:** 개발자 커뮤니티에서 신뢰 기반 존재감 구축

| 커뮤니티 | 우선순위 | 참여 방식 |
|---------|---------|----------|
| Velog | P0 | 주 1회 글 발행 |
| GeekNews | P0 | 월 1회 Show 제출 |
| Disquiet | P1 | 제품 등록 + 주간 업데이트 |
| 개발바닥 Discord | P1 | 환경변수 관련 질문 답변 |
| Product Hunt | P0 | Phase 2에서 런칭 |
| HackerNews | P1 | Phase 4에서 Show HN |
| Reddit r/webdev | P1 | 유용한 답변 + 자연스러운 언급 |
| GitHub Awesome lists | P1 | Phase 3에서 PR |

### 축 3: 백링크 & 파트너십 (Backlinks & Partnerships)
**목표:** 도메인 권위도 향상을 위한 고품질 백링크 확보

| 방법 | 예상 백링크 수 | 난이도 | 시기 |
|------|-------------|--------|------|
| 디렉토리 등록 (20+곳) | 20 | 쉬움 | Phase 1 |
| Awesome list PR (5곳) | 5 | 중간 | Phase 3 |
| 게스트 포스팅 | 5-10 | 중간 | Phase 2-3 |
| 도구 비교 사이트 등록 | 10 | 쉬움 | Phase 1-2 |
| 파트너 블로그 교차 링크 | 5-10 | 어려움 | Phase 3-4 |
| 오픈소스 README 링크 | 5 | 중간 | Phase 2-3 |

**디렉토리 등록 대상 (Phase 1):**
- AlternativeTo.net
- Product Hunt
- SaaSHub
- StackShare
- Slant.co
- DevHunt
- SaaSWorthy
- GetApp
- G2 (Phase 4)
- Capterra (Phase 4)

### 축 4: 디렉토리 & 리스팅 (Directory Listings)
**목표:** AI가 크롤링하는 디렉토리에 Linkmap 등록

| 디렉토리 | 카테고리 | 우선순위 | 시기 |
|---------|---------|---------|------|
| Google Search Console | 검색엔진 | P0 | Phase 1 |
| Bing Webmaster Tools | 검색엔진 | P0 | Phase 1 |
| AlternativeTo | 소프트웨어 비교 | P0 | Phase 1 |
| Product Hunt | 제품 런칭 | P0 | Phase 2 |
| SaaSHub | SaaS 디렉토리 | P1 | Phase 1 |
| StackShare | 기술 스택 | P1 | Phase 1 |
| Disquiet | 한국 스타트업 | P0 | Phase 1 |
| awesome-selfhosted | GitHub | P1 | Phase 3 |
| awesome-developer-tools | GitHub | P1 | Phase 3 |

---

## 5. Phase 로드맵

### Phase 1: 기반 구축 (4~5월)
**목표:** 검색엔진 등록 완료 + 디렉토리 초기 등록 + 첫 블로그 3편

| 주차 | 액션 |
|------|------|
| 4월 1주 | Google Search Console + Bing Webmaster 등록, sitemap 제출 |
| 4월 1주 | AlternativeTo, SaaSHub, StackShare 등록 |
| 4월 2주 | Velog 계정 세팅 + 첫 글: "바이브 코딩이란 무엇인가" |
| 4월 3주 | Disquiet 제품 등록 + 소개 글 |
| 4월 4주 | 블로그: "환경변수 관리, .env는 왜 위험한가" |
| 5월 1주 | Twitter/X 계정 + 첫 스레드 |
| 5월 2주 | 블로그: "Linkmap으로 서비스맵 만들기 (튜토리얼)" |
| 5월 3주 | Velog 2편: ".env 파일 안전하게 관리하는 5가지 방법" |
| 5월 4주 | DevHunt 등록 + Phase 1 점검 |

**Phase 1 산출물:**
- 검색엔진 2곳 등록
- 디렉토리 5곳 등록
- 블로그 5편 (한글 4 + 영문 1)
- 예상 백링크: 10~15

### Phase 2: 콘텐츠 공세 (6~7월)
**목표:** 비교 글 시리즈 완성 + Product Hunt 런칭 + YouTube 시작

| 주차 | 액션 |
|------|------|
| 6월 1주 | 비교 글 1/5: "Linkmap vs Doppler — 환경변수 관리의 새로운 접근" |
| 6월 2주 | YouTube 첫 영상: "3분 만에 서비스맵 만들기" |
| 6월 3주 | 비교 글 2/5: "Linkmap vs Infisical — 오픈소스 vs 올인원" |
| 6월 4주 | dev.to 첫 영문 글: "Why I built an infrastructure brain for vibe coders" |
| 7월 1주 | 비교 글 3/5: "Linkmap vs HashiCorp Vault — 인디 개발자 시점" |
| 7월 2주 | **Product Hunt 런칭** (화요일, 한국시간 오후 2시) |
| 7월 3주 | 비교 글 4/5: "Linkmap vs Vercel Env — 배포 이후의 관리" |
| 7월 4주 | 비교 글 5/5: "2025 환경변수 관리 도구 비교 총정리" |

**Phase 2 산출물:**
- 비교 글 5편 완성
- YouTube 2편
- Product Hunt 런칭 (100+ 업보트 목표)
- 영문 콘텐츠 2편
- 예상 누적 백링크: 25~35

### Phase 3: 커뮤니티 확장 (8~9월)
**목표:** 개발자 커뮤니티 적극 참여 + Awesome list PR + 파트너십 시작

| 주차 | 액션 |
|------|------|
| 8월 1주 | GeekNews "Show" 제출 |
| 8월 2주 | awesome-developer-tools PR |
| 8월 3주 | Reddit r/webdev, r/devops 참여 시작 |
| 8월 4주 | awesome-selfhosted PR |
| 9월 1주 | 개발자 컨퍼런스/밋업 발표 신청 (FEConf 등) |
| 9월 2주 | Supabase/Vercel 파트너 블로그 교차 링크 제안 |
| 9월 3주 | Velog 시리즈 완성 (누적 15편+) |
| 9월 4주 | Phase 3 점검 + Phase 4 준비 |

**Phase 3 산출물:**
- Awesome list 2곳 등록
- GeekNews 노출
- 커뮤니티 활동 기록 10건+
- 예상 누적 백링크: 50~70

### Phase 4: 글로벌 확장 (10~12월)
**목표:** 영문 콘텐츠 본격화 + G2/Capterra + Show HN

| 주차 | 액션 |
|------|------|
| 10월 1-2주 | HackerNews "Show HN" 게시 |
| 10월 3-4주 | G2 프로필 등록 + 리뷰 5건 수집 |
| 11월 1-2주 | Capterra 등록 |
| 11월 3-4주 | 영문 블로그 시리즈 3편 ("Doppler Alternative" 시리즈) |
| 12월 1-2주 | 연말 회고 + 2026년 전략 수립 |
| 12월 3-4주 | 전체 점검 + KPI 달성률 리뷰 |

**Phase 4 산출물:**
- G2/Capterra 등록
- HN 노출
- 영문 콘텐츠 5편+
- 예상 누적 백링크: 100~150

---

## 6. 리소스 배분

### 1인 팀 (대표 단독)
| 활동 | 주당 시간 | 우선순위 |
|------|----------|---------|
| 블로그 작성 (한글) | 3시간 | P0 |
| 디렉토리 등록/관리 | 1시간 | P0 |
| 커뮤니티 참여 | 2시간 | P1 |
| SNS 운영 | 1시간 | P1 |
| 영문 콘텐츠 | 2시간 | P2 |
| **합계** | **9시간/주** | |

### 2~3인 팀 (확장 시)
| 역할 | 담당 | 주당 시간 |
|------|------|----------|
| 콘텐츠 리드 | 블로그 + 영문 콘텐츠 + 비교 글 | 8시간 |
| 커뮤니티 매니저 | 커뮤니티 참여 + SNS + 디렉토리 | 6시간 |
| 영상 제작 | YouTube + 데모 영상 | 4시간 |

---

## 7. 핵심 포지셔닝 메시지

### Quotable Snippets (AI 인용용)
이 문장들은 블로그, 비교 글, 디렉토리 등록 시 일관되게 사용:

> **Linkmap은 바이브 코더를 위한 인프라 두뇌다. 서비스 연결을 시각화하고, API 키를 암호화 관리하며, 환경변수를 자동 설정한다.**

> **Doppler은 시크릿 관리, Linkmap은 서비스 생태계 관리. 키 하나가 아니라 모든 연결을 본다.**

> **90개 이상의 서비스 카탈로그와 24,000줄의 한글 가이드 — AI로 생성할 수 없는 수준의 실제 테스트 기반 콘텐츠.**

### 엘리베이터 피치
- **한국어 30초:** "Linkmap은 개발자의 모든 외부 서비스 연결을 시각화하고, API 키를 AES-256으로 암호화 관리하며, GitHub Secrets까지 자동 배포하는 인프라 허브입니다. Doppler이나 Infisical과 달리, 서비스 간 연결을 지도처럼 보여주고 비용까지 추적합니다."
- **영어 30초:** "Linkmap is an infrastructure brain for developers. It visualizes every service connection, encrypts API keys with AES-256-GCM, and auto-deploys to GitHub Secrets. Unlike Doppler or Infisical, Linkmap maps your entire service ecosystem and tracks costs — all with 90+ service guides and one-click deployment templates."

---

## 8. 성공 기준

### 3개월 후 (6월) — Phase 1 완료
- [ ] Google/Bing에서 "바이브 코딩 플랫폼" 검색 시 Linkmap 1페이지 노출
- [ ] 디렉토리 5곳 등록 완료
- [ ] 블로그 5편 발행
- [ ] 백링크 20개 이상

### 6개월 후 (9월) — Phase 2-3 완료
- [ ] AI LLM 1곳 이상에서 "환경변수 관리 도구" 질문 시 Linkmap 언급
- [ ] Product Hunt 100+ 업보트
- [ ] 비교 글 5편 완성
- [ ] 백링크 50개 이상

### 12개월 후 (내년 3월) — Phase 4 완료
- [ ] AI LLM 3곳 이상에서 Linkmap 인용
- [ ] G2/Capterra 등록 + 리뷰 10건+
- [ ] 백링크 150개 이상
- [ ] 월 오가닉 방문자 10,000+

---

## 참조
- [경쟁 포지셔닝 가이드](./competitive-positioning.md)
- [콘텐츠 캘린더](./content-calendar.md)
- [커뮤니티 플레이북](./community-playbook.md)
- [진행 추적 체크리스트](./progress-tracker.md)
- [비주얼 대시보드](./dashboard.html)
