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
    tip: '상단 바의 프로젝트명을 클릭하면 프로젝트 선택/생성 드롭다운이 열립니다.',
    screenshots: [
      {
        src: `${IMG_BASE}/01-project-dropdown.png`,
        alt: 'GCP 시작하기 페이지 — 프로젝트 정보, 빠른 액세스',
        illustration: googleIllustrations[1],
        annotations: [
          { type: 'click', x: 15, y: 2, number: 1, label: '프로젝트명 클릭 → 선택/생성' },
          { type: 'highlight', x: 14, y: 24, width: 26, height: 4 },
        ],
        masks: [
          // 상단 바 프로젝트명
          { x: 12, y: 0, width: 9, height: 4, label: '프로젝트명' },
          // 프로젝트 번호
          { x: 17, y: 26, width: 12, height: 2.5, label: '번호' },
          // 프로젝트 ID
          { x: 35, y: 26, width: 17, height: 2.5, label: 'ID' },
        ],
        caption: '상단 바 프로젝트명 클릭 → 프로젝트 선택·생성. "작업 중인 프로젝트" 아래에 번호와 ID가 표시됩니다.',
      },
    ],
  },
  {
    step: 2,
    title: 'Google 인증 플랫폼 진입',
    where: 'Google Cloud Console > Google 인증 플랫폼 > 개요',
    what: '좌측 "브랜딩" 메뉴에서 앱 이름·지원 이메일 설정, "데이터 액세스"에서 email, profile, openid 스코프를 추가합니다.',
    why: '사용자가 로그인할 때 보게 되는 동의 화면의 내용을 정합니다.',
    tip: '좌측 메뉴: 개요/브랜딩/대상/클라이언트/데이터 액세스/인증 센터/설정',
    screenshots: [
      {
        src: `${IMG_BASE}/02-consent-menu.png`,
        alt: 'Google 인증 플랫폼 — OAuth 개요 + 좌측 7개 메뉴',
        illustration: googleIllustrations[2],
        annotations: [
          { type: 'click', x: 5, y: 14, number: 1, label: '브랜딩 (동의 화면)' },
          { type: 'click', x: 6, y: 25, number: 2, label: '데이터 액세스 (스코프)' },
        ],
        masks: [
          { x: 12, y: 0, width: 9, height: 4, label: '프로젝트명' },
        ],
        caption: '좌측 메뉴: ① "브랜딩" = 앱 이름·이메일 설정, ② "데이터 액세스" = 스코프 추가',
      },
    ],
  },
  {
    step: 3,
    title: 'OAuth 클라이언트 만들기',
    where: 'Google 인증 플랫폼 > 클라이언트',
    what: '좌측 "클라이언트" → 상단 "+ 클라이언트 만들기" → 웹 애플리케이션 선택',
    why: 'Client ID와 Client Secret을 발급받기 위한 핵심 단계입니다.',
    tip: '기존 클라이언트 이름을 클릭하면 상세 페이지로 이동합니다.',
    screenshots: [
      {
        src: `${IMG_BASE}/03-credentials-menu.png`,
        alt: '클라이언트 목록 — 만들기 버튼 + 기존 클라이언트 테이블',
        illustration: googleIllustrations[3],
        annotations: [
          { type: 'click', x: 5, y: 24, number: 1, label: '클라이언트 메뉴' },
          { type: 'click', x: 34, y: 11, number: 2, label: '+ 클라이언트 만들기' },
        ],
        masks: [
          { x: 12, y: 0, width: 9, height: 4, label: '프로젝트명' },
          { x: 66, y: 26, width: 16, height: 3.5, label: 'Client ID' },
        ],
        caption: '① 좌측 "클라이언트" → ② "+ 클라이언트 만들기" 클릭',
      },
    ],
  },
  {
    step: 4,
    title: '리디렉션 URI + Client ID/Secret 확인',
    where: '클라이언트 상세 페이지',
    what: '왼쪽 하단: "승인된 리디렉션 URI"에 Supabase 콜백 URL 추가. 오른쪽 상단: Client ID, 하단: 보안 비밀번호 확인.',
    why: 'Supabase에 등록할 Client ID와 Secret, 콜백 URL을 모두 이 화면에서 관리합니다.',
    tip: 'URI는 https://<ref>.supabase.co/auth/v1/callback. Secret은 ****로 표시되며 분실 시 "Add secret"으로 재생성.',
    screenshots: [
      {
        src: `${IMG_BASE}/03-redirect-uri.png`,
        alt: '클라이언트 상세 — 왼쪽: 리디렉션 URI / 오른쪽: Client ID·Secret',
        illustration: googleIllustrations[4],
        annotations: [
          { type: 'highlight', x: 19, y: 63, width: 37, height: 30 },
          { type: 'highlight', x: 60, y: 15, width: 39, height: 25 },
          { type: 'highlight', x: 60, y: 55, width: 39, height: 40 },
        ],
        masks: [
          // 브레드크럼의 Client ID (상단)
          { x: 19, y: 6, width: 55, height: 2.5, label: 'Client ID (브레드크럼)' },
          // 오른쪽 Additional info의 Client ID 값
          { x: 76, y: 23, width: 22, height: 6, label: 'Client ID' },
          // 왼쪽 Redirect URI 4개
          { x: 21, y: 74, width: 30, height: 3, label: 'URI ••••' },
          { x: 21, y: 79, width: 30, height: 3, label: 'URI ••••' },
          { x: 21, y: 85, width: 30, height: 3, label: 'URI ••••' },
          { x: 21, y: 90, width: 30, height: 3, label: 'URI ••••' },
          // Secret 값
          { x: 77, y: 82, width: 12, height: 2.5, label: 'Secret' },
        ],
        caption: '왼쪽 노란 영역: "승인된 리디렉션 URI" 입력. 오른쪽 상단: Client ID 확인. 오른쪽 하단: 보안 비밀번호 확인.',
      },
    ],
  },
  {
    step: 5,
    title: 'Supabase Google Provider 활성화',
    where: 'Supabase Dashboard > Authentication > Sign In / Providers',
    what: 'Providers 목록에서 Google 클릭 → 토글 ON → Client ID, Secret 붙여넣기',
    why: 'Supabase가 구글 로그인을 대행할 수 있도록 연결합니다.',
    tip: '좌측 Configuration > "Sign In / Providers" 선택 후 스크롤하여 Google을 찾으세요.',
    screenshots: [
      {
        src: `${SUPABASE_IMG}/providers-list.png`,
        alt: 'Supabase Auth — Sign In / Providers 메뉴 + 설정 영역',
        illustration: googleIllustrations[5],
        annotations: [
          { type: 'click', x: 12, y: 44, number: 1, label: 'Sign In / Providers' },
          { type: 'highlight', x: 23, y: 80, width: 75, height: 12 },
        ],
        caption: '① 좌측 "Sign In / Providers" → 아래 Auth Providers 목록 스크롤 → Google 클릭',
      },
      {
        src: `${SUPABASE_IMG}/google-settings.png`,
        alt: 'Google Provider 설정 다이얼로그',
        annotations: [
          { type: 'highlight', x: 50, y: 12, width: 48, height: 90 },
        ],
        masks: [
          // Client IDs 입력값 (다이얼로그 내부)
          { x: 51, y: 37, width: 46, height: 5, label: 'Client ID ••••' },
        ],
        caption: 'Google 다이얼로그: Enable ON → "Client IDs" + "Client Secret" 입력 → Save',
      },
    ],
  },
  {
    step: 6,
    title: 'URL Configuration 설정',
    where: 'Supabase Dashboard > Authentication > URL Configuration',
    what: 'Site URL에 서비스 도메인 입력 + Redirect URLs에 /auth/callback 경로 추가',
    why: '로그인 성공 후 앱으로 안전하게 돌아오기 위한 주소를 등록합니다.',
    tip: '좌측 "URL Configuration" 메뉴. 로컬 개발 시 localhost 콜백도 추가하세요.',
    screenshots: [
      {
        src: `${SUPABASE_IMG}/url-config.png`,
        alt: 'URL Configuration — Site URL + Redirect URLs 전체',
        illustration: googleIllustrations[6],
        annotations: [
          { type: 'click', x: 12, y: 59, number: 1, label: 'URL Configuration' },
        ],
        masks: [
          // Site URL 값
          { x: 65, y: 34, width: 25, height: 3.5, label: 'Site URL ••••' },
          // Redirect URL 1
          { x: 28, y: 69, width: 45, height: 3.5, label: 'Redirect URL ••••' },
          // Redirect URL 2
          { x: 28, y: 76, width: 35, height: 3.5, label: 'Redirect URL ••••' },
        ],
        caption: '① 좌측 "URL Configuration" → Site URL(서비스 도메인) 입력 + "Add URL"로 Redirect URL 추가',
      },
    ],
  },
  {
    step: 7,
    title: '동작 확인',
    where: '로컬 개발 환경',
    what: 'npm run dev → 로그인 페이지 → Google 로그인 클릭 → 대시보드 도착 확인',
    why: '설정이 올바른지 실제로 테스트합니다.',
    tip: '시크릿 모드에서 테스트하면 캐시 문제를 방지할 수 있습니다.',
    screenshots: [
      {
        alt: '로그인 플로우 전체 확인',
        illustration: googleIllustrations[7],
        caption: '로그인 페이지 → Google 동의 화면 → 대시보드 도착',
      },
    ],
  },
];
