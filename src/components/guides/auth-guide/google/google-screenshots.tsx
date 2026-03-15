'use client';

import type { StepData } from '../step-card-with-screenshot';
import { googleIllustrations } from './google-illustrations';

const IMG_BASE = '/img/guides/auth/google';
const SUPABASE_IMG = '/img/guides/auth/supabase';

export const googleSteps: StepData[] = [
  {
    step: 1,
    title: 'Google Cloud 프로젝트 확인',
    where: 'Google Cloud Console 시작 페이지',
    whereUrl: 'https://console.cloud.google.com',
    what: '콘솔에 접속하여 기존 프로젝트를 확인하거나, 새 프로젝트를 생성합니다.',
    why: 'OAuth 인증 정보가 이 프로젝트 안에 생성됩니다.',
    tip: '상단 바의 프로젝트명(예: readingtree)을 클릭하면 프로젝트 선택/생성 드롭다운이 열립니다. 새 프로젝트가 필요하면 "새 프로젝트"를 클릭하세요.',
    screenshots: [
      {
        src: `${IMG_BASE}/01-project-dropdown.png`,
        alt: 'GCP 시작하기 페이지 — 프로젝트 정보, 빠른 액세스',
        illustration: googleIllustrations[1],
        annotations: [
          { type: 'click', x: 14, y: 2, number: 1, label: '프로젝트명 클릭 → 선택/생성' },
          { type: 'highlight', x: 13, y: 23, width: 30, height: 4 },
        ],
        caption: '상단 바에서 프로젝트명을 클릭하면 프로젝트 선택·생성 가능. 아래에 프로젝트 번호와 ID가 표시됩니다.',
      },
    ],
  },
  {
    step: 2,
    title: 'Google 인증 플랫폼 진입',
    where: 'Google Cloud Console > Google 인증 플랫폼 > 개요',
    what: '좌측 메뉴에서 "브랜딩"으로 이동하여 OAuth 동의 화면(앱 이름, 지원 이메일)을 설정하고, "데이터 액세스"에서 email, profile, openid 스코프를 추가합니다.',
    why: '사용자가 로그인할 때 보게 되는 동의 화면의 내용을 정합니다.',
    tip: '기존 "API 및 서비스 > OAuth 동의 화면" 메뉴가 "Google 인증 플랫폼"으로 통합되었습니다. 좌측 메뉴에서 개요/브랜딩/대상/클라이언트/데이터 액세스/인증 센터/설정 을 확인할 수 있습니다.',
    screenshots: [
      {
        src: `${IMG_BASE}/02-consent-menu.png`,
        alt: 'Google 인증 플랫폼 — OAuth 개요 + 좌측 메뉴',
        illustration: googleIllustrations[2],
        annotations: [
          { type: 'highlight', x: 0, y: 8, width: 13, height: 30 },
          { type: 'click', x: 6, y: 13, number: 1, label: '브랜딩 (동의 화면 설정)' },
          { type: 'click', x: 6, y: 22, number: 2, label: '데이터 액세스 (스코프)' },
        ],
        caption: '좌측 메뉴: ① "브랜딩"에서 앱 이름·지원 이메일 설정, ② "데이터 액세스"에서 email, profile, openid 스코프 추가',
      },
    ],
  },
  {
    step: 3,
    title: 'OAuth 클라이언트 만들기',
    where: 'Google 인증 플랫폼 > 클라이언트',
    what: '좌측 메뉴 "클라이언트" 선택 → 상단 "+ 클라이언트 만들기" 클릭 → 웹 애플리케이션 선택 → 이름 입력',
    why: 'Client ID와 Client Secret을 발급받기 위한 핵심 단계입니다.',
    tip: '클라이언트 목록에서 기존에 만든 클라이언트가 있다면 이름을 클릭하여 상세 페이지로 이동할 수 있습니다.',
    screenshots: [
      {
        src: `${IMG_BASE}/03-credentials-menu.png`,
        alt: '클라이언트 목록 — "+ 클라이언트 만들기" 버튼 위치',
        illustration: googleIllustrations[3],
        annotations: [
          { type: 'click', x: 6, y: 23, number: 1, label: '좌측 메뉴: 클라이언트' },
          { type: 'click', x: 34, y: 11, number: 2, label: '+ 클라이언트 만들기' },
          { type: 'highlight', x: 17, y: 23, width: 80, height: 6 },
        ],
        caption: '좌측 "클라이언트" 메뉴 → 상단 "+ 클라이언트 만들기" 클릭. 이미 생성된 클라이언트는 테이블에 표시됩니다.',
      },
    ],
  },
  {
    step: 4,
    title: '리디렉션 URI 설정 + Client ID/Secret 확인',
    where: '클라이언트 상세 페이지 (클라이언트 이름 클릭)',
    what: '"승인된 리디렉션 URI"에 Supabase 콜백 URL을 추가하고, 오른쪽 "Additional information"에서 Client ID를 확인합니다. "클라이언트 보안 비밀번호" 섹션에서 Secret을 확인합니다.',
    why: 'Supabase에 등록할 Client ID와 Secret을 이 화면에서 확인하고, 콜백 URL도 여기서 등록합니다.',
    tip: '리디렉션 URI는 https://<프로젝트-ref>.supabase.co/auth/v1/callback 형식입니다. 프로토콜(http/https), 후행 슬래시에 주의하세요. Secret은 ****로 가려져 표시되며, 분실 시 "Add secret"으로 새로 생성해야 합니다.',
    screenshots: [
      {
        src: `${IMG_BASE}/03-redirect-uri.png`,
        alt: '클라이언트 상세 — 리디렉션 URI(왼쪽) + Client ID/Secret(오른쪽)',
        illustration: googleIllustrations[4],
        annotations: [
          { type: 'highlight', x: 18, y: 65, width: 35, height: 25 },
          { type: 'highlight', x: 60, y: 17, width: 38, height: 20 },
          { type: 'highlight', x: 60, y: 55, width: 38, height: 30 },
        ],
        caption: '왼쪽: "승인된 리디렉션 URI"에 Supabase 콜백 URL 추가. 오른쪽 상단: Client ID 확인. 오른쪽 하단: "클라이언트 보안 비밀번호" 확인',
      },
    ],
  },
  {
    step: 5,
    title: 'Supabase Google Provider 활성화',
    where: 'Supabase Dashboard > Authentication > Sign In / Providers',
    what: 'Auth Providers 목록에서 Google을 클릭 → 토글 ON → GCP에서 복사한 Client ID, Client Secret을 붙여넣기',
    why: 'Supabase가 구글 로그인을 대행할 수 있도록 연결합니다.',
    tip: '좌측 사이드바에서 Authentication > Configuration > "Sign In / Providers" 메뉴를 선택하세요. 목록을 스크롤하면 Google (Enabled/Disabled) 항목이 보입니다.',
    screenshots: [
      {
        src: `${SUPABASE_IMG}/providers-list.png`,
        alt: 'Supabase Auth — Providers 목록 (좌측 사이드바 + User Signups 설정)',
        illustration: googleIllustrations[5],
        annotations: [
          { type: 'click', x: 12, y: 43, number: 1, label: 'Sign In / Providers 메뉴' },
        ],
        caption: '좌측 Configuration > "Sign In / Providers" 선택. 스크롤하여 Google 항목을 찾아 클릭하면 설정 다이얼로그가 열립니다.',
      },
      {
        src: `${SUPABASE_IMG}/google-settings.png`,
        alt: 'Google Provider 설정 다이얼로그 — Client IDs + Client Secret',
        annotations: [
          { type: 'input', x: 52, y: 32, width: 43, height: 6, label: 'Client IDs' },
          { type: 'input', x: 52, y: 55, width: 43, height: 6, label: 'Client Secret' },
        ],
        caption: 'Google 다이얼로그에서 Enable 토글 ON → "Client IDs"에 GCP Client ID, "Client Secret"에 GCP Secret 붙여넣기 → Save',
      },
    ],
  },
  {
    step: 6,
    title: 'URL Configuration 설정',
    where: 'Supabase Dashboard > Authentication > URL Configuration',
    what: 'Site URL에 서비스 도메인 입력 + Redirect URLs에 /auth/callback 경로 추가',
    why: '로그인 성공 후 앱으로 안전하게 돌아오기 위한 주소를 등록합니다.',
    tip: '좌측 사이드바 Configuration > "URL Configuration" 메뉴입니다. 로컬 개발 시 http://localhost:3000/auth/callback도 추가하세요.',
    screenshots: [
      {
        src: `${SUPABASE_IMG}/url-config.png`,
        alt: 'URL Configuration — Site URL + Redirect URLs',
        illustration: googleIllustrations[6],
        annotations: [
          { type: 'click', x: 12, y: 59, number: 1, label: 'URL Configuration 메뉴' },
          { type: 'highlight', x: 65, y: 30, width: 30, height: 5 },
          { type: 'highlight', x: 23, y: 67, width: 55, height: 12 },
        ],
        caption: '좌측 "URL Configuration" 선택 → Site URL(서비스 도메인) 입력 + Redirect URLs에 콜백 URL 추가. "Add URL" 버튼으로 추가합니다.',
      },
    ],
  },
  {
    step: 7,
    title: '동작 확인',
    where: '로컬 개발 환경',
    what: 'npm run dev → 로그인 페이지 → Google 로그인 클릭 → 대시보드 도착 확인',
    why: '설정이 올바른지 실제로 테스트합니다.',
    tip: '브라우저 시크릿 모드에서 테스트하면 캐시 문제를 피할 수 있습니다. redirect_uri_mismatch 오류가 나면 GCP 클라이언트 상세의 리디렉션 URI를 다시 확인하세요.',
    screenshots: [
      {
        alt: '로그인 플로우 전체 확인',
        illustration: googleIllustrations[7],
        caption: '로그인 페이지 → Google 동의 화면 → 대시보드 도착',
      },
    ],
  },
];
