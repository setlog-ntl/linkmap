export const content = `> **KEY:** 무료 외부 호스팅 의존성 함정이란, 비용 절감을 위해 archive.org·imgur·GitHub raw URL 같은 무료 서비스에 핵심 콘텐츠를 올렸다가 URL이 예고 없이 깨지는 현상입니다. 코드에는 아무 문제가 없는데 사이트가 반쯤 망가져 보입니다.

## 어느 날 갑자기 음악이 멈췄다

독서 기록 앱 ReadingTree는 집중 독서를 돕는 배경 음악 기능을 제공합니다. 처음 기능을 만들 때 70곡의 음악 파일을 archive.org에 올려 두고 URL을 코드에 박아 넣었습니다. 비용은 0원, 설정은 5분. 완벽해 보였습니다.

그런데 몇 달 뒤 배포 후 테스트를 하다 이상한 점을 발견했습니다. 재생 버튼을 눌러도 아무 소리가 나지 않습니다. 개발자 도구를 열어보니 오디오 요청 절반이 404 또는 403으로 끊겨 있었습니다. archive.org에 올려 둔 파일 70곡 중 **36곡의 URL이 접근 불가** 상태가 되어 있었습니다.

원인은 명확하지 않았습니다. archive.org의 정책 변경인지, 파일이 자동 삭제된 것인지, 저작권 신고가 들어온 것인지 알 방법이 없었습니다. 알림은 없었고, 에러 로그에도 아무것도 없었습니다. 그냥 어느 날부터 조용히 작동을 멈춘 것입니다.

결국 남은 34곡만 유지하고 36곡을 제거한 뒤, 모든 음악 파일을 로컬 호스팅으로 전환했습니다. 이 경험에서 얻은 교훈을 정리합니다.

> **WARNING:** archive.org는 디지털 보존을 위한 비영리 도서관입니다. CDN 용도로 설계된 서비스가 아니며, 파일 접근성을 보장하지 않습니다. 약관에도 서비스 연속성에 관한 SLA(Service Level Agreement)가 없습니다.

## 바이브코더가 자주 쓰는 무료 외부 서비스들

바이브코딩으로 사이드 프로젝트를 만들다 보면 이미지·음악·폰트·아이콘을 어딘가에 올려야 합니다. AI가 코드를 만들어 줄 때 습관적으로 무료 외부 서비스를 추천하는 경우도 많습니다.

| 서비스 | 주로 쓰는 용도 | 실제 위험 |
|--------|--------------|----------|
| archive.org | 음악, 영상, 문서 파일 | 예고 없이 파일 삭제·접근 차단 |
| imgur | 이미지 호스팅 | 대역폭 초과 시 핫링킹 차단, 비로그인 업로드 삭제 |
| GitHub raw URL | 이미지, JS, CSS | 캐시 정책 변경, 대용량 파일 제한, 서비스 정책 변경 |
| RawGit | GitHub 파일 CDN | **2018년 서비스 종료** — 수백만 사이트 URL 일괄 무효화 |
| unpkg | npm 패키지 CDN | 패키지 삭제 시 연쇄 장애 |
| cdnjs | 오픈소스 라이브러리 | 비교적 안전하지만 버전 지원 중단 가능 |

RawGit은 특히 상징적인 사례입니다. 2018년 서비스 종료 공지 후 수개월 만에 수백만 개의 외부 링크가 한꺼번에 무효화됐습니다. 해당 URL을 사용하던 사이트들은 JS 파일이 로딩되지 않아 페이지 자체가 깨졌습니다. 퓨 리서치 센터의 [웹 링크 소멸 연구](https://www.pewresearch.org/data-labs/2024/05/17/when-online-content-disappears/)에 따르면 2013년 접속 가능했던 웹페이지 중 38%가 2023년에는 사라졌습니다.

## 핵심 콘텐츠 vs. 인프라 의존 — 무엇을 외부에 맡길 수 있는가

모든 외부 의존이 나쁜 것은 아닙니다. 구분 기준은 **해당 서비스가 내 앱의 핵심 콘텐츠인가**입니다.

### 외부 서비스에 맡겨도 되는 것

- **npm 패키지 CDN** (unpkg, jsDelivr): 오픈소스 라이브러리는 버전 고정이 가능하고 대안이 많습니다.
- **Google Fonts, Bunny Fonts**: 폰트는 느리게 로딩돼도 기능적 장애는 없습니다. 폴백 폰트로 대체됩니다.
- **Lucide, Heroicons CDN**: 아이콘은 렌더링 실패해도 레이아웃이 무너지지 않습니다.
- **오픈소스 프레임워크**: Bootstrap, Tailwind CDN은 오픈소스 보장이 있습니다.

### 직접 호스팅해야 하는 것

- **앱 핵심 콘텐츠** (이미지, 음악, 영상, PDF): 없으면 기능 자체가 중단됩니다.
- **사용자 업로드 파일**: 개인정보 보호 의무가 있고, 제3자 플랫폼에 올리면 약관 위반이 될 수 있습니다.
- **로고, 브랜드 에셋**: 서비스 신뢰도와 직결됩니다.
- **API 응답에 포함되는 미디어**: URL이 깨지면 클라이언트 오류로 이어집니다.

> **INFO:** imgur의 경우 로그인 없이 업로드한 이미지는 6개월 비활성 후 자동 삭제됩니다. 또한 "핫링킹(hotlinking)" — 즉 타 사이트에서 imgur URL을 직접 참조하는 것 — 은 정책상 허용되지 않아 트래픽이 늘면 차단될 수 있습니다.

## 무료의 숨겨진 비용

무료 외부 호스팅을 선택할 때 실제로 치르는 비용은 다음과 같습니다.

**신뢰도 비용**: 사용자 입장에서 이미지가 깨진 사이트, 음악이 재생되지 않는 앱은 버그가 있는 것처럼 보입니다. 직접 만든 코드의 문제가 아닌데도 서비스 품질로 귀결됩니다.

**복구 비용**: URL이 갑자기 깨지면 어떤 파일이 영향을 받는지 파악하고, 대체 파일을 찾아 다시 업로드하고, 코드에 박힌 URL을 일일이 수정해야 합니다. ReadingTree의 경우 36곡 분량의 작업이었습니다.

**디버깅 비용**: "코드는 안 바꿨는데 안 된다"는 상황은 원인 파악 자체가 어렵습니다. 외부 서비스 상태 페이지를 뒤지고, 깨진 URL인지 코드 버그인지 판별하는 데 시간이 걸립니다.

---

## 실전 해결 전략 3가지

### 전략 1 — 직접 호스팅으로 전환

핵심 콘텐츠는 내가 제어할 수 있는 스토리지에 올리는 것이 가장 확실한 방법입니다.

\`\`\`
핵심 콘텐츠 호스팅 선택지:

Supabase Storage  — 무료 티어 1GB, 프로젝트와 함께 관리
Cloudflare R2     — 무료 티어 10GB/월, 이그레스 비용 없음
Vercel Blob       — Next.js 통합, 무료 티어 500MB
AWS S3            — 업계 표준, 저렴하지만 설정 복잡
\`\`\`

ReadingTree는 Supabase Storage로 전환했습니다. 기존에 Supabase를 DB와 Auth로 사용하고 있었기 때문에 추가 서비스 없이 Storage 버킷 하나를 만들고 파일을 업로드했습니다. 이후 URL 구조가 \`https://[project].supabase.co/storage/v1/object/public/music/[filename]\` 형태로 안정화됐습니다. Cloudflare R2에 대해서는 [Cloudflare 공식 문서](https://developers.cloudflare.com/r2/)에서 설정 방법을 확인할 수 있습니다.

> **TIP:** Supabase Storage는 [Supabase 시작하기 가이드](/guides/supabase)에서 버킷 생성과 파일 업로드 방법을 확인할 수 있습니다. RLS(Row Level Security) 정책도 함께 설정하는 것을 권장합니다.

### 전략 2 — CDN 이중화 (Primary + Fallback)

당장 마이그레이션이 어렵다면, 최소한 JavaScript에서 로딩 실패를 감지하고 대체 URL로 전환하는 패턴을 사용하세요.

\`\`\`javascript
// 이미지 fallback 패턴
function loadWithFallback(primaryUrl, fallbackUrl) {
  const img = new Image();
  img.onerror = () => { img.src = fallbackUrl; };
  img.src = primaryUrl;
  return img;
}

// 오디오 fallback 패턴
const audio = new Audio();
audio.src = primaryUrl;
audio.onerror = () => { audio.src = fallbackUrl; };
\`\`\`

이 방식은 완벽하지 않습니다. fallback URL도 같은 위험에 노출될 수 있고, 네트워크 요청이 2배로 늘어납니다. 임시방편으로만 활용하고 직접 호스팅을 목표로 두는 것이 좋습니다.

### 전략 3 — 주기적 URL 헬스 체크

외부 URL을 사용하는 경우, 주기적으로 접근 가능 여부를 확인하는 스크립트를 실행합니다.

\`\`\`bash
#!/bin/bash
# url-health-check.sh — 배열에 체크할 URL 목록 작성
URLS=(
  "https://archive.org/download/example/track01.mp3"
  "https://i.imgur.com/example.jpg"
)

for url in "\${URLS[@]}"; do
  status=\$(curl -o /dev/null -s -w "%{http_code}" "\$url")
  if [ "\$status" != "200" ]; then
    echo "BROKEN [\$status]: \$url"
  fi
done
\`\`\`

이 스크립트를 GitHub Actions에 등록하면 매일 자동으로 확인하고 깨진 URL이 생겼을 때 알림을 받을 수 있습니다. [GitHub 시작하기 가이드](/guides/github)에서 Actions 기본 설정 방법을 참고하세요.

---

## 지금 바로 할 수 있는 체크리스트

- [x] 내 앱에서 외부 URL을 참조하는 파일 목록 파악하기
- [x] 외부 서비스 약관에서 "핫링킹", "상업적 이용", "SLA" 조항 확인하기
- [ ] 핵심 콘텐츠(이미지, 미디어)를 직접 호스팅으로 이전 계획 세우기
- [ ] GitHub Actions 또는 cron으로 URL 헬스 체크 자동화하기
- [ ] 장애 시 사용자에게 보여줄 fallback UI 준비하기

> **TRY:** [Linkmap](https://www.linkmap.biz)의 [서비스맵](https://www.linkmap.biz/services)으로 내 프로젝트가 어떤 외부 서비스에 의존하는지 시각화해보세요. archive.org·imgur처럼 보이지 않는 의존성도 한눈에 파악할 수 있습니다. [무료로 시작하기](https://www.linkmap.biz/signup)

---

*외부 서비스 의존성을 체계적으로 관리하고 싶다면 [Linkmap 서비스맵 튜토리얼](/blog/service-map-tutorial)을, 환경변수·API 키 관리 실수는 [.env 파일이 위험한 이유](/blog/why-dotenv-is-dangerous)를 참고하세요.*
`;
