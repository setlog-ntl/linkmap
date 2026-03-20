export const content = `> **KEY:** 바이브코딩으로 만든 앱은 배포해야 비로소 완성됩니다. Vercel·Cloudflare Pages·Netlify는 각각 강점이 다르며, 프레임워크와 트래픽 규모에 따라 최적의 선택이 달라집니다.

## 배포란 무엇인가 — 로컬에서 인터넷으로

바이브코딩으로 멋진 앱을 만들었는데, 정작 친구에게 링크를 보내줄 수가 없습니다. \`localhost:3000\`은 여러분의 컴퓨터에서만 열립니다. **배포(Deploy)**는 이 앱을 전 세계 누구나 접근할 수 있는 서버에 올리는 과정입니다.

예전에는 서버를 직접 구매하고 Nginx를 설치하는 복잡한 작업이 필요했습니다. 지금은 Vercel, Cloudflare Pages, Netlify 같은 플랫폼이 GitHub 저장소를 연결하는 것만으로 배포를 자동화합니다. 코드를 push하면 수십 초 안에 새 버전이 인터넷에 공개됩니다.

> **INFO:** 세 플랫폼 모두 무료 플랜이 있습니다. 사이드 프로젝트나 포트폴리오 수준에서는 비용 없이 운영할 수 있습니다.

## Vercel — Next.js의 공식 홈

[Vercel](https://vercel.com)은 Next.js를 만든 팀이 운영하는 배포 플랫폼입니다. Next.js 프로젝트라면 사실상 기본 선택지입니다.

| 항목 | 무료 한도 |
|------|----------|
| 대역폭 | 월 100GB |
| Serverless 실행 | 월 100시간 |
| 빌드 시간 | 월 6,000분 |
| 커스텀 도메인 | 무제한 |

GitHub 연동 자동 배포가 가장 강력한 기능입니다. \`main\` 브랜치에 push할 때마다 프로덕션 배포가 실행되고, PR을 열면 미리보기 URL이 자동 생성됩니다.

> **TIP:** 바이브코딩으로 만든 Next.js 프로젝트라면 Vercel을 먼저 시도해보세요. [Vercel 배포 가이드](/guides/vercel)에서 단계별로 안내합니다.

## Cloudflare Pages — 무제한 대역폭의 엣지 플랫폼

[Cloudflare Pages](https://pages.cloudflare.com)는 대역폭 제한이 없는 무료 플랜이 특징입니다. 전 세계 330개 이상의 엣지 데이터센터에서 서빙합니다.

| 항목 | 무료 한도 |
|------|----------|
| 대역폭 | **무제한** |
| Workers 요청 | 월 10만 회 |
| 빌드 횟수 | 월 500회 |

Cloudflare는 자사 서비스에 바이브코딩을 도입하여 Next.js API 라우트의 94%를 1주일 만에 구현한 사례를 공유했습니다. [Cloudflare 연결 가이드](/guides/cloudflare)에서 설정 방법을 확인하세요.

> **WARNING:** Cloudflare Workers 런타임은 Node.js와 다릅니다. \`fs\`, \`path\` 같은 내장 모듈 일부가 제한될 수 있으니 배포 전 호환성을 확인하세요.

---

## Netlify — 정적 사이트와 Bolt.new 연동

[Netlify](https://netlify.com)는 정적 사이트에서 오랜 신뢰를 쌓은 플랫폼입니다. 특히 Bolt.new로 만든 프로젝트와 원클릭 배포 연동이 매끄럽습니다.

| 항목 | 무료 한도 |
|------|----------|
| 대역폭 | 월 100GB |
| 빌드 시간 | 월 300분 |
| Forms | 월 100건 |

## 배포 플랫폼 선택 가이드

| 상황 | 추천 플랫폼 | 이유 |
|------|------------|------|
| Next.js 풀스택 프로젝트 | **Vercel** | App Router·API 라우트 완전 지원 |
| 트래픽이 많은 사이트 | **Cloudflare** | 무제한 대역폭 |
| Bolt.new 프로젝트 | **Netlify** | 원클릭 연동 |
| 처음 배포 시도 | **Vercel** | 가장 직관적인 UI |

배포 후 환경변수(API 키)는 플랫폼 대시보드에서 설정합니다. \`.env\` 파일을 GitHub에 올리면 키가 공개되니 절대 커밋하지 마세요. [Linkmap](https://www.linkmap.biz)은 여러 프로젝트의 환경변수를 AES-256-GCM으로 암호화하여 한 곳에서 관리하고 동기화합니다.

[Linkmap 서비스 카탈로그](https://www.linkmap.biz/services)에서 배포 플랫폼 포함 128개 서비스의 연결 상태를 시각화할 수 있습니다.

> **TRY:** 바이브코딩으로 만든 앱을 배포했다면, 다음 단계는 환경변수를 안전하게 관리하는 것입니다. [Linkmap에 무료로 가입](https://www.linkmap.biz/signup)하고 서비스 연결을 시각화해보세요.

---

*도메인 설정과 배포 심화는 [배포 완전 정복 가이드](/guides/deploy)를, 바이브코딩 입문은 [바이브코딩 시작 가이드](/blog/vibe-coding-getting-started-guide)를 참고하세요.*`;
