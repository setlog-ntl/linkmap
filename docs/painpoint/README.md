# docs/painpoint — 공유용 문서

이 폴더는 **초보자도 이해하기 쉬운 개념·실무 문서**와 **HTML 자료**를 담습니다.  
팀원·다른 사용자에게 전달하여 함께 참고할 수 있습니다.

---

## 포함 자료

| 파일 | 설명 |
|------|------|
| **01-credential-concept-guide.md** | 크레덴셜(인증 정보) 개념 가이드 — 마크다운 원본 |
| **01-credential-concept-guide.html** | 위와 동일한 내용의 HTML 버전 (브라우저에서 바로 열어 보기·공유용) |
| **02-credentials-and-env-complete-guide.md** | **크레덴셜 + 환경변수 + 로컬 vs 운영** 완전 정리 (초보자용, 최대한 상세) |
| **developer-painpoint-guide.html** | **개발자 페인포인트 종합 가이드** — 시크릿 유출, .env 한계, 바이브 코딩 보안, 온보딩, 경쟁 분석, Linkmap 솔루션 (9개 섹션, Tailwind 다크 테마 HTML) |

---

## 내용 요약

### 01 가이드
- **크레덴셜이란 무엇인지** (키, 토큰, JSON 파일)
- **Google 서비스 계정 키(JSON)** — 사람 계정 vs 서비스 계정, Vision API용 JSON이란
- **"적용·연결"의 의미** — 경로 설정과 파일 보관 위치
- **로컬 PC 보관 vs 서버** — PC가 꺼지면 서비스가 어떻게 되는지
- **실무 체크리스트** — 키 파일 관리 시 주의사항
- **Google 서비스 계정 키(예: Habitree Vision) 로테이션 절차**
- **다른 크레덴셜 요약** (GitHub PAT, Supabase, Encryption Key)

### 종합 가이드 (developer-painpoint-guide.html)
- **9개 섹션**: 현실 진단, 시크릿 유출, .env 한계, 바이브 코딩, 멀티서비스, 온보딩, 경쟁 분석, Linkmap 솔루션, 시작하기
- 01/02 가이드 핵심 내용을 **시각적 카드·테이블로 통합**
- **데이터 기반**: GitGuardian, Stanford/NYU, Humanitec, Gartner, MarketsandMarkets 등 출처 표기
- **4가지 관점**: 초보자, 바이브 코더, 팀 리드, 엔터프라이즈
- **경쟁 분석**: Vault, Doppler, Infisical, Backstage 비교 + 포지셔닝 매트릭스
- Tailwind CDN 기반 독립형 HTML (다크 테마, 반응형)

### 02 완전 정리 가이드 (상세)
- **환경변수** 개념, 왜 쓰는지
- **로컬 vs 운영** 구분, **핵심 규칙**: 로컬 = `.env.local`, 운영 = 배포 서비스(Cloudflare/Vercel 등) 환경 설정
- **Cloudflare/Vercel** 배포 시: 파일 경로가 아니라 **JSON 내용**을 환경변수로 넣는 이유와 방법
- **API·DB·연결 정보**는 모두 같은 방식(로컬 .env.local / 운영 플랫폼 환경변수)
- **로컬 PC와 서비스 동작** 관계 표로 정리
- **Q&A** — 자주 헷갈리는 점 정리

---

## 공유 방법

- **HTML**: `01-credential-concept-guide.html` 파일을 그대로 전달하거나, 내부 위키/공유 드라이브에 업로드하여 링크 공유.
- **MD**: 마크다운 뷰어·Notion·GitHub 등에 붙여넣기 또는 파일 업로드 후 공유.
