export const content = `> **KEY:** 코딩 없이 5분 만에 내 사이트를 인터넷에 공개할 수 있습니다. Linkmap 원클릭 배포는 GitHub 저장소 생성부터 Vercel 배포까지 전 과정을 자동화합니다.

## 원클릭 배포가 뭔가요?

일반적으로 웹사이트를 만들려면 이런 과정을 거칩니다:

1. 개발 환경 설정 (Node.js, npm 설치)
2. 프로젝트 생성 (next.js, 의존성 설치)
3. 코드 작성 (페이지, 스타일, 기능)
4. GitHub에 업로드
5. 배포 플랫폼 연결 (Vercel, Cloudflare 등)
6. 도메인 설정

바이브코딩 초보자가 이 과정을 완주하기까지 보통 **수일~수주**가 걸립니다. 원클릭 배포는 1~5번을 **버튼 한 번**으로 건너뜁니다.

## 6개 템플릿 상세 비교

| 템플릿 | 용도 | 페이지 수 | 주요 기능 | 추천 대상 |
|--------|------|----------|----------|---------|
| **디지털 명함** | 연락처 + SNS | 1 | QR 코드, 소셜 링크 | 직장인, 취준생 |
| **링크카드** | SNS 링크 모음 | 1 | 링크 목록, 프로필 | 인스타/유튜브 크리에이터 |
| **내 홈페이지** | 개인 브랜딩 | 1 | 자기소개, 포트폴리오, 연락처 | 블로거, 프리랜서 |
| **개발자 홈** | 기술 포트폴리오 | 1 | 기술 스택, 프로젝트 목록, GitHub | 개발자, CS 전공 취준생 |
| **프리랜서 홍보** | 서비스 소개 | 1 | 서비스 목록, 가격표, 문의 폼 | 디자이너, 번역가, 강사 |
| **우리가게 홍보** | 매장 정보 | 1 | 메뉴/상품, 영업시간, 지도, 연락처 | 카페, 식당, 소매점 |

### 어떤 템플릿을 고를까?

**"나를 알리고 싶다"** → 디지털 명함, 내 홈페이지
**"내 콘텐츠를 모으고 싶다"** → 링크카드
**"내 서비스/상품을 알리고 싶다"** → 프리랜서 홍보, 우리가게 홍보
**"개발 실력을 보여주고 싶다"** → 개발자 홈

## 배포 과정 — 실제로 이렇게 진행됩니다

### 사전 준비

- [Linkmap 가입](https://www.linkmap.biz/signup) (무료)
- [GitHub 계정](https://github.com) (없으면 새로 생성)

### Step 1: 템플릿 선택

Linkmap 대시보드 → **원클릭 배포** 메뉴 → 6개 템플릿 중 선택

각 템플릿에는 미리보기가 제공됩니다. 디자인은 배포 후 수정할 수 있으니, **용도에 맞는 것**을 고르세요.

### Step 2: GitHub 연결

Linkmap이 GitHub에 자동으로 저장소를 생성합니다:
- 저장소 이름: \`my-portfolio\`, \`my-cafe\` 등 템플릿에 따라 자동 지정
- 공개/비공개 선택 가능
- 모든 코드가 내 GitHub 계정에 저장됨 → **코드 소유권은 100% 본인**

### Step 3: 자동 배포

GitHub 저장소 생성과 동시에 Vercel이 자동으로 배포를 시작합니다:
- 빌드: 약 1-2분
- 완료 후 \`your-project.vercel.app\` 형태의 URL 제공
- 이 URL로 전 세계 어디서든 접속 가능

### Step 4: 확인 및 공유

배포 완료 후:
- 제공된 URL로 접속하여 사이트 확인
- 모바일에서도 접속해보기
- SNS, 메신저로 링크 공유

## 배포 후 수정하기

### 방법 1: Cursor AI로 수정 (추천)

\`\`\`bash
git clone https://github.com/내아이디/my-portfolio
\`\`\`

[Cursor](https://cursor.sh)에서 폴더를 열고 AI에게 수정 요청:
\`\`\`
이름을 "홍길동"으로 바꾸고,
직함을 "UX 디자이너"로 변경해줘.
프로필 이미지는 /public/profile.jpg를 사용해.
\`\`\`

수정 후 배포 반영:
\`\`\`bash
git add .
git commit -m "프로필 정보 업데이트"
git push
\`\`\`

Vercel이 자동으로 재배포합니다 (1-2분).

상세한 Cursor 사용법은 [Cursor AI 시작 가이드](/blog/cursor-ai-beginner-guide)를 참고하세요.

### 방법 2: GitHub에서 직접 수정

간단한 텍스트 변경은 GitHub 웹에서도 가능합니다:
1. GitHub 저장소 접속
2. 수정할 파일 클릭 (예: \`lib/config.ts\` 또는 \`data/\` 폴더)
3. 연필 아이콘 (Edit) 클릭
4. 내용 수정 → "Commit changes" 클릭
5. 자동 재배포

## 커스텀 도메인 연결

\`your-project.vercel.app\` 대신 \`myname.com\`을 사용하려면:

1. 도메인 구매 ([Cloudflare Registrar](https://dash.cloudflare.com), [가비아](https://gabia.com) 등)
2. Vercel Dashboard → Settings → Domains
3. 구매한 도메인 입력
4. DNS 설정 안내를 따라 A 레코드 또는 CNAME 설정

> **TIP:** Cloudflare에서 도메인을 구매하면 DNS 설정이 가장 간단합니다. 무료 SSL, CDN, DDoS 방어도 자동으로 제공됩니다.

## 자주 묻는 질문

**Q: 비용이 드나요?**
Linkmap 원클릭 배포, GitHub, Vercel 모두 무료 플랜으로 사용 가능합니다. 커스텀 도메인만 연간 1-2만원 수준의 비용이 발생합니다.

**Q: 나중에 Vercel 말고 다른 곳에 배포할 수 있나요?**
코드가 GitHub에 있으므로 언제든 Cloudflare Workers, Netlify 등 다른 플랫폼으로 이전할 수 있습니다. [배포 플랫폼 비교](/blog/vibe-coding-deploy-guide)를 참고하세요.

**Q: 템플릿 디자인이 마음에 안 들면?**
배포 후 Cursor로 자유롭게 수정할 수 있습니다. 색상, 레이아웃, 폰트 등 모든 요소를 변경 가능합니다.

**Q: 코딩을 전혀 몰라도 되나요?**
배포까지는 코딩 지식이 전혀 필요 없습니다. 수정 시에도 Cursor AI가 코드를 대신 작성하므로, 원하는 결과를 설명하는 능력만 있으면 됩니다.

## 다음 단계

배포를 완료했다면:
1. [Cursor AI로 수정하기](/blog/cursor-ai-beginner-guide) — 내용 커스터마이징
2. [Supabase 연동](/blog/supabase-for-vibe-coders) — 방명록, 로그인 등 동적 기능 추가
3. [학습 로드맵](/blog/vibe-coding-learning-roadmap) — 체계적인 성장 경로

> **TRY:** [Linkmap 원클릭 배포](https://www.linkmap.biz/signup)로 지금 바로 시작하세요. 5분 후에 공유할 수 있는 내 사이트 URL이 생깁니다.

---

*배포 후 문제가 생기면 [배포 체크리스트](/blog/vibe-coding-launch-checklist)를, 환경변수 설정이 필요하면 [환경변수 가이드](/guides/env)를 참고하세요.*`;
